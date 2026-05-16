import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Pi?: {
      init: (opts: { version: string; sandbox?: boolean }) => Promise<void> | void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: unknown) => void
      ) => Promise<{
        accessToken: string;
        user: { uid: string; username: string };
      }>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: unknown) => void;
        }
      ) => void;
    };
  }
}

let sdkReadyPromise: Promise<void> | null = null;

function waitForPiSdk(timeoutMs = 8000): Promise<void> {
  if (sdkReadyPromise) return sdkReadyPromise;
  sdkReadyPromise = new Promise((resolve, reject) => {
    if (window.Pi) return resolve();
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.Pi) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error("Pi SDK not available"));
      }
    }, 100);
  });
  return sdkReadyPromise;
}

let initPromise: Promise<void> | null = null;

export async function initPi(sandbox = true): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await waitForPiSdk();
    // Treat init as a Promise: await fully before authenticate
    await Promise.resolve(window.Pi!.init({ version: "2.0", sandbox }));
  })();
  return initPromise;
}

export async function signInWithPi(): Promise<{
  uid: string;
  username: string;
}> {
  await initPi();

  const onIncompletePaymentFound = (payment: unknown) => {
    const p = payment as { identifier?: string; transaction?: { txid?: string } } | null;
    if (!p?.identifier) return;
    supabase.functions.invoke("pi-payments", {
      body: { action: "incomplete", paymentId: p.identifier, txid: p.transaction?.txid },
    }).catch((e) => console.error("Pi incomplete recovery failed", e));
  };

  const authResult = await window.Pi!.authenticate(
    ["username", "payments"],
    onIncompletePaymentFound
  );

  // Send access token to backend for server-side validation via /v2/me
  const { data, error } = await supabase.functions.invoke("pi-auth", {
    body: { accessToken: authResult.accessToken },
  });
  if (error) throw error;
  if (!data?.token_hash) throw new Error("Pi auth: no session token returned");

  const { error: verifyErr } = await supabase.auth.verifyOtp({
    token_hash: data.token_hash,
    type: "magiclink",
  });
  if (verifyErr) throw verifyErr;

  return authResult.user;
}