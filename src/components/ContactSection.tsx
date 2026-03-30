import { useState, FormEvent } from "react";
import { FadeUp, SectionHeadline } from "./ScrollAnimation";

const roles = ["FPO", "State Agri Department", "Input Dealer", "Research Institution", "Other"];

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", org: "", role: "", state: "", email: "", phone: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-primary section-padding">
      <div className="container-narrow text-center">
        <FadeUp>
          <p className="italic text-gold text-sm mb-4">Ready to Start?</p>
          <SectionHeadline className="text-primary-foreground max-w-3xl mx-auto mb-4">
            The problem was never that farmers lacked information.<br />The problem was that advisors had no professional tool.
          </SectionHeadline>
          <p className="text-primary-foreground/60 max-w-xl mx-auto mb-12">
            Be among the first FPOs and agriculture departments to pilot FieldDesk in Tamil Nadu. Free 8-week pilot for qualifying organizations.
          </p>
        </FadeUp>
        <FadeUp delay={0.15}>
          {submitted ? (
            <div className="bg-background rounded-xl p-10 max-w-lg mx-auto shadow-lg">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-ink mb-2">Thank You!</h3>
              <p className="text-muted-foreground">We'll be in touch within 48 hours to discuss your pilot.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-background rounded-xl p-6 sm:p-8 max-w-lg mx-auto shadow-lg text-left">
              <div className="space-y-4">
                <input required placeholder="Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
                <input placeholder="Organization" value={form.org} onChange={e => setForm(p => ({ ...p, org: e.target.value }))} className="w-full rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
                <select required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold">
                  <option value="">Select Role *</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input placeholder="State" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className="w-full rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
                <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              <button type="submit" className="w-full mt-6 px-6 py-3 rounded-md bg-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity">
                Request Free Pilot Access
              </button>
            </form>
          )}
        </FadeUp>
        <FadeUp delay={0.25}>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              { title: "Advisor gets a tool", sub: "First time ever" },
              { title: "Farmer gets better advice", sub: "Through trust" },
              { title: "Institutions pay for proof", sub: "Logical business" },
            ].map((p, i) => (
              <div key={i} className="px-5 py-3 rounded-full bg-primary-mid/40 text-center">
                <div className="text-sm font-semibold text-primary-foreground">{p.title}</div>
                <div className="text-xs text-primary-foreground/50">{p.sub}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default ContactSection;
