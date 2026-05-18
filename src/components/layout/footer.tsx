import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background mt-12">
      <div className="container py-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="font-bold text-white">π</span>
            </div>
            <span className="font-bold">WorkChain Pi</span>
          </div>
          <p className="text-muted-foreground">
            Freelance marketplace powered by the Pi Network.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Marketplace</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/browse" className="hover:text-foreground">Browse Gigs</Link></li>
            <li><Link to="/hire-work" className="hover:text-foreground">Hire Work</Link></li>
            <li><Link to="/post-job" className="hover:text-foreground">Post a Job</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/wallet" className="hover:text-foreground">Wallet</Link></li>
            <li><Link to="/settings" className="hover:text-foreground">Settings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal & Support</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact Developer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WorkChain Pi. All rights reserved.
      </div>
    </footer>
  );
};