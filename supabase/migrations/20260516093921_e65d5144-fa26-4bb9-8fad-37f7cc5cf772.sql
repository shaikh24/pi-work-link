
-- Wallet balances per user (Pi held in app)
CREATE TABLE public.wallet_balances (
  user_id UUID PRIMARY KEY,
  balance NUMERIC(18,4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own balance" ON public.wallet_balances
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all balances" ON public.wallet_balances
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));

-- Pi payment records (server-validated)
CREATE TABLE public.pi_payments (
  payment_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC(18,4) NOT NULL,
  memo TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'created',
  txid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.pi_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own pi payments" ON public.pi_payments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage pi payments" ON public.pi_payments
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
-- No INSERT/UPDATE for users; only edge function (service role) writes.

CREATE TRIGGER trg_wallet_balances_updated_at
  BEFORE UPDATE ON public.wallet_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
