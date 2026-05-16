import { supabase } from "@/integrations/supabase/client";
import { initPi } from "@/lib/piAuth";

export interface TopUpResult {
  paymentId: string;
  txid: string;
  balance: number;
}

/**
 * U2A wallet top-up: user pays Pi which is credited to their in-app balance.
 */
export async function topUpWalletWithPi(amount: number): Promise<TopUpResult> {
  if (!(amount > 0)) throw new Error("Amount must be greater than 0");
  await initPi();

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) throw new Error("You must be signed in to top up");

  return await new Promise<TopUpResult>((resolve, reject) => {
    let serverPaymentId = "";
    window.Pi!.createPayment(
      {
        amount,
        memo: `WorkChain Pi wallet top-up: ${amount} π`,
        metadata: { product: "wallet_topup", userId, amount },
      },
      {
        onReadyForServerApproval: async (paymentId) => {
          serverPaymentId = paymentId;
          const { error } = await supabase.functions.invoke("pi-payments", {
            body: { action: "approve", paymentId },
          });
          if (error) reject(new Error(error.message || "Approval failed"));
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          const { data, error } = await supabase.functions.invoke("pi-payments", {
            body: { action: "complete", paymentId, txid },
          });
          if (error) return reject(new Error(error.message || "Completion failed"));
          resolve({ paymentId, txid, balance: (data as { balance?: number })?.balance ?? 0 });
        },
        onCancel: (paymentId) => {
          reject(new Error(`Payment cancelled (${paymentId || serverPaymentId})`));
        },
        onError: (err) => {
          reject(err instanceof Error ? err : new Error(String(err)));
        },
      }
    );
  });
}