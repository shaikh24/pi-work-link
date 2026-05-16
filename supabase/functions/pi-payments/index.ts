import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PI_API = "https://api.minepi.com";
const PI_KEY = Deno.env.get("PI_NETWORK_API_KEY");

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function piFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${PI_API}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Key ${PI_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!PI_KEY) return json({ error: "PI_NETWORK_API_KEY not configured" }, 500);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(supabaseUrl, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const admin = createClient(supabaseUrl, service);
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;
    const paymentId = body.paymentId as string | undefined;

    if (!action) return json({ error: "Missing action" }, 400);

    // ---- APPROVE ----
    if (action === "approve") {
      if (!paymentId) return json({ error: "Missing paymentId" }, 400);

      // Fetch payment from Pi to validate it really belongs to this user & product
      const piPayment = await piFetch(`/v2/payments/${paymentId}`);
      if (!piPayment.ok) return json({ error: "Pi payment fetch failed", details: piPayment.data }, 400);
      const p = piPayment.data;

      // Validate product: must be wallet top-up for this user
      const metaUser = p?.metadata?.userId;
      if (metaUser && metaUser !== userId) return json({ error: "User mismatch" }, 403);
      if (p?.metadata?.product !== "wallet_topup") return json({ error: "Invalid product" }, 400);
      const amount = Number(p?.amount);
      if (!(amount > 0)) return json({ error: "Invalid amount" }, 400);

      await admin.from("pi_payments").upsert({
        payment_id: paymentId,
        user_id: userId,
        amount,
        memo: p?.memo ?? null,
        metadata: p?.metadata ?? {},
        status: "approving",
      });

      const approve = await piFetch(`/v2/payments/${paymentId}/approve`, { method: "POST" });
      if (!approve.ok) {
        await admin.from("pi_payments").update({ status: "approve_failed" }).eq("payment_id", paymentId);
        return json({ error: "Approve failed", details: approve.data }, 400);
      }
      await admin.from("pi_payments").update({ status: "approved", approved_at: new Date().toISOString() }).eq("payment_id", paymentId);
      return json({ ok: true });
    }

    // ---- COMPLETE ----
    if (action === "complete") {
      const txid = body.txid as string | undefined;
      if (!paymentId || !txid) return json({ error: "Missing paymentId or txid" }, 400);

      const { data: row, error: rowErr } = await admin
        .from("pi_payments").select("*").eq("payment_id", paymentId).maybeSingle();
      if (rowErr || !row) return json({ error: "Unknown payment" }, 404);
      if (row.user_id !== userId) return json({ error: "User mismatch" }, 403);
      if (row.status === "completed") return json({ ok: true, alreadyCompleted: true });

      const complete = await piFetch(`/v2/payments/${paymentId}/complete`, {
        method: "POST",
        body: JSON.stringify({ txid }),
      });
      if (!complete.ok) {
        await admin.from("pi_payments").update({ status: "complete_failed", txid }).eq("payment_id", paymentId);
        return json({ error: "Complete failed", details: complete.data }, 400);
      }

      // Credit the user's in-app wallet
      const { data: balRow } = await admin
        .from("wallet_balances").select("balance").eq("user_id", userId).maybeSingle();
      const newBal = Number(balRow?.balance ?? 0) + Number(row.amount);
      await admin.from("wallet_balances").upsert({ user_id: userId, balance: newBal });

      await admin.from("pi_payments").update({
        status: "completed",
        txid,
        completed_at: new Date().toISOString(),
      }).eq("payment_id", paymentId);

      return json({ ok: true, balance: newBal });
    }

    // ---- INCOMPLETE: resume an in-flight payment ----
    if (action === "incomplete") {
      const txid = body.txid as string | undefined;
      if (!paymentId) return json({ error: "Missing paymentId" }, 400);
      const piPayment = await piFetch(`/v2/payments/${paymentId}`);
      if (!piPayment.ok) return json({ error: "Pi payment fetch failed" }, 400);
      const p = piPayment.data;
      if (p?.metadata?.userId && p.metadata.userId !== userId) return json({ error: "User mismatch" }, 403);

      // Try to complete if we have a txid, else approve first
      if (txid) {
        const complete = await piFetch(`/v2/payments/${paymentId}/complete`, {
          method: "POST", body: JSON.stringify({ txid }),
        });
        if (complete.ok) {
          const amount = Number(p?.amount ?? 0);
          if (amount > 0 && p?.metadata?.product === "wallet_topup") {
            const { data: balRow } = await admin
              .from("wallet_balances").select("balance").eq("user_id", userId).maybeSingle();
            const newBal = Number(balRow?.balance ?? 0) + amount;
            await admin.from("wallet_balances").upsert({ user_id: userId, balance: newBal });
          }
          await admin.from("pi_payments").upsert({
            payment_id: paymentId, user_id: userId,
            amount: Number(p?.amount ?? 0), memo: p?.memo, metadata: p?.metadata ?? {},
            status: "completed", txid, completed_at: new Date().toISOString(),
          });
          return json({ ok: true, completed: true });
        }
      }
      const approve = await piFetch(`/v2/payments/${paymentId}/approve`, { method: "POST" });
      return json({ ok: approve.ok, approved: approve.ok });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("pi-payments error", e);
    return json({ error: (e as Error).message }, 500);
  }
});