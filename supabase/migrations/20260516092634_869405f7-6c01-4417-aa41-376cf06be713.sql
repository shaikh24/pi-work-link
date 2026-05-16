
-- 1) Orders: replace permissive UPDATE policy with strict per-party policies + immutability triggers

DROP POLICY IF EXISTS "Order parties update orders" ON public.orders;

CREATE POLICY "Buyer updates own order status"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = buyer_id)
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Seller updates own order status"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

CREATE OR REPLACE FUNCTION public.enforce_order_update_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean := public.has_role(auth.uid(), 'admin'::app_role);
BEGIN
  IF is_admin THEN
    RETURN NEW;
  END IF;

  -- Immutable identity / financial / link fields
  IF NEW.id <> OLD.id
     OR NEW.buyer_id <> OLD.buyer_id
     OR NEW.seller_id <> OLD.seller_id
     OR NEW.amount <> OLD.amount
     OR COALESCE(NEW.gig_id::text,'') <> COALESCE(OLD.gig_id::text,'')
     OR COALESCE(NEW.job_id::text,'') <> COALESCE(OLD.job_id::text,'')
     OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Order identity, parties, amount, and links are immutable';
  END IF;

  -- Status FSM: buyers can only mark completed (from delivered/in_progress); sellers can move pending->in_progress->delivered; either can cancel from pending
  IF NEW.status <> OLD.status THEN
    IF auth.uid() = OLD.buyer_id AND NOT (
      (OLD.status IN ('delivered','in_progress') AND NEW.status = 'completed')
      OR (OLD.status = 'pending' AND NEW.status = 'cancelled')
    ) THEN
      RAISE EXCEPTION 'Buyer cannot transition order from % to %', OLD.status, NEW.status;
    END IF;

    IF auth.uid() = OLD.seller_id AND NOT (
      (OLD.status = 'pending' AND NEW.status IN ('in_progress','cancelled'))
      OR (OLD.status = 'in_progress' AND NEW.status = 'delivered')
    ) THEN
      RAISE EXCEPTION 'Seller cannot transition order from % to %', OLD.status, NEW.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_order_update_rules ON public.orders;
CREATE TRIGGER trg_enforce_order_update_rules
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_update_rules();

-- 2) Proposals: strict per-role UPDATE policies + column-level immutability

DROP POLICY IF EXISTS "Job owner updates proposal status" ON public.proposals;
DROP POLICY IF EXISTS "Freelancer updates own proposal" ON public.proposals;

CREATE POLICY "Freelancer updates own pending proposal"
ON public.proposals
FOR UPDATE
TO authenticated
USING (auth.uid() = freelancer_id AND status = 'pending')
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Job owner updates proposal status only"
ON public.proposals
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.jobs
  WHERE jobs.id = proposals.job_id AND jobs.client_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.jobs
  WHERE jobs.id = proposals.job_id AND jobs.client_id = auth.uid()
));

CREATE OR REPLACE FUNCTION public.enforce_proposal_update_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean := public.has_role(auth.uid(), 'admin'::app_role);
  is_job_owner boolean := EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = OLD.job_id AND jobs.client_id = auth.uid()
  );
BEGIN
  IF is_admin THEN
    RETURN NEW;
  END IF;

  IF NEW.id <> OLD.id
     OR NEW.job_id <> OLD.job_id
     OR NEW.freelancer_id <> OLD.freelancer_id
     OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Proposal identity and ownership are immutable';
  END IF;

  IF auth.uid() = OLD.freelancer_id THEN
    -- freelancer cannot self-accept
    IF NEW.status <> OLD.status AND NEW.status NOT IN ('pending','withdrawn') THEN
      RAISE EXCEPTION 'Freelancer cannot set status to %', NEW.status;
    END IF;
  ELSIF is_job_owner THEN
    -- job owner may only change status
    IF NEW.bid_amount <> OLD.bid_amount
       OR NEW.delivery_days <> OLD.delivery_days
       OR NEW.cover_letter <> OLD.cover_letter THEN
      RAISE EXCEPTION 'Job owner may only update proposal status';
    END IF;
    IF NEW.status NOT IN ('pending','accepted','rejected') THEN
      RAISE EXCEPTION 'Invalid proposal status: %', NEW.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_proposal_update_rules ON public.proposals;
CREATE TRIGGER trg_enforce_proposal_update_rules
BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION public.enforce_proposal_update_rules();

-- 3) Revoke direct EXECUTE on SECURITY DEFINER helpers from anon (policies still work via authenticated role)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_profile_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_order_update_rules() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_proposal_update_rules() FROM PUBLIC, anon, authenticated;
