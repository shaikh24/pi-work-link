import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactDeveloper() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Missing fields", description: "Please complete name, email and message.", variant: "destructive" });
      return;
    }
    setSending(true);
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`);
    const subject = encodeURIComponent(form.subject || "WorkChain Pi — Contact");
    window.location.href = `mailto:developer@workchainpi.app?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message ready", description: "Your email client has been opened." });
    }, 600);
  };

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-2">Contact Developer</h1>
      <p className="text-muted-foreground mb-8">
        Questions, feedback, or bug reports? We'd love to hear from you.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Reach out</CardTitle>
            <CardDescription>Other ways to get in touch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:developer@workchainpi.app" className="hover:underline">
                developer@workchainpi.app
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Pi Chat: @workchainpi</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-primary" />
              <a href="https://pi-work-link.lovable.app" className="hover:underline">
                pi-work-link.lovable.app
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Send a message</CardTitle>
            <CardDescription>We typically reply within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" className="min-h-32" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? "Opening…" : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}