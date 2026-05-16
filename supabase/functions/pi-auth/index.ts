import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();
    if (!accessToken || typeof accessToken !== "string") {
      return new Response(JSON.stringify({ error: "Missing accessToken" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate token against Pi Network
    const meRes = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!meRes.ok) {
      const text = await meRes.text();
      return new Response(
        JSON.stringify({ error: "Pi token validation failed", details: text }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const piUser = await meRes.json();
    const piUid: string = piUser.uid;
    const piUsername: string = piUser.username;
    if (!piUid || !piUsername) {
      return new Response(JSON.stringify({ error: "Invalid Pi profile" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Deterministic synthetic email for Pi-only users
    const email = `pi_${piUid}@pi.workchain.local`;

    // Find or create user
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    let user = list?.users?.find((u) => u.email === email);

    if (!user) {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            display_name: piUsername,
            pi_uid: piUid,
            pi_username: piUsername,
            provider: "pi-network",
          },
        });
      if (createErr) throw createErr;
      user = created.user!;
    }

    // Generate a magiclink and return the hashed token so client can
    // establish a session via verifyOtp({ token_hash, type: 'magiclink' }).
    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
    if (linkErr) throw linkErr;

    return new Response(
      JSON.stringify({
        token_hash: linkData.properties?.hashed_token,
        email,
        pi: { uid: piUid, username: piUsername },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("pi-auth error", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message ?? String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});