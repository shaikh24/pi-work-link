import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface TwoFactorAuthProps {
  isEnabled?: boolean;
  onToggle?: () => void;
}

/**
 * Two-Factor Authentication placeholder.
 *
 * The previous implementation was a mock UI that accepted any 6-digit
 * code with a hardcoded shared TOTP secret embedded in the client. It
 * gave users a false sense of security and has been removed.
 *
 * Real TOTP MFA must be implemented server-side using Supabase Auth's
 * MFA APIs (`supabase.auth.mfa.enroll/challenge/verify`) so secrets are
 * generated and verified on the backend.
 */
const TwoFactorAuth = (_props: TwoFactorAuthProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        <Badge variant="secondary">Not available</Badge>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>2FA is coming soon</AlertTitle>
        <AlertDescription>
          Two-factor authentication will be powered by our authentication
          provider's verified TOTP flow. The previous mock UI was removed
          because it did not provide real protection.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TwoFactorAuth;
