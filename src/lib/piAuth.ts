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
    console.log("Incomplete Pi payment found", payment);
  };

  const authResult = await window.Pi!.authenticate(
    ["username"],
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