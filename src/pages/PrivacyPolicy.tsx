import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: May 2026</p>

      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>
              We collect the information you provide when you sign up (email, display name, Pi
              Network username), and data generated while using WorkChain Pi such as jobs, gigs,
              proposals, orders, messages, reviews, and wallet activity.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Data</h2>
            <p>
              Your data is used to operate the marketplace, process Pi payments, match clients with
              freelancers, send notifications, and improve the service. We never sell your personal
              data.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Pi Network Integration</h2>
            <p>
              When you authenticate or pay with Pi, your Pi access token and payment metadata are
              validated server-side against the Pi Network API. We store only the minimum data needed
              to credit your wallet and verify transactions.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Data Security</h2>
            <p>
              We use industry-standard encryption, Row-Level Security, and server-side validation to
              protect your data. Sensitive credentials are stored as encrypted secrets.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Your Rights</h2>
            <p>
              You can request access to, correction of, or deletion of your personal data at any
              time by contacting the developer.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Cookies</h2>
            <p>
              We use minimal cookies and local storage for session management and your theme
              preference. No third-party advertising trackers are used.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Changes</h2>
            <p>
              We may update this policy. Material changes will be announced in-app.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}