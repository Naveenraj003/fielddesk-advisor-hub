import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const streams = [
  { num: "1", title: "Institutional SaaS", who: "FPOs & Agri Departments", price: "₹500–1,500/advisor/month", timeline: "Month 6–18", color: "border-l-accent-green" },
  { num: "2", title: "Dealer Intelligence", who: "Input Distributors", price: "₹15K–40K/season", timeline: "Month 3–6", color: "border-l-gold" },
  { num: "3", title: "Insurance Data API", who: "Crop Insurers / Banks", price: "₹50–150/farm/season", timeline: "Year 2", color: "border-l-sky-500" },
];

const bars = [
  { label: "M 0–3", val: "₹0", desc: "Free POC", w: "w-[5%]" },
  { label: "M 3–6", val: "₹30K/mo", desc: "", w: "w-[15%]" },
  { label: "M 6–12", val: "₹3–5L/mo", desc: "", w: "w-[45%]" },
  { label: "M 12–24", val: "₹15–30L/mo", desc: "", w: "w-[90%]" },
];

const RevenueSection = () => (
  <section className="bg-cream section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>Revenue</SectionLabel>
        <SectionHeadline className="text-ink mb-12">Business Model — 3 Streams, 3 Timelines</SectionHeadline>
      </FadeUp>
      <div className="grid lg:grid-cols-2 gap-10">
        <FadeUp delay={0.1}>
          <div className="space-y-4">
            {streams.map((s) => (
              <div key={s.num} className={`bg-background rounded-xl border border-border border-l-4 ${s.color} p-5 shadow-sm`}>
                <h3 className="font-bold text-ink mb-1">Stream {s.num}: {s.title}</h3>
                <p className="text-sm text-muted-foreground">Who: {s.who}</p>
                <p className="text-sm text-muted-foreground">Price: {s.price}</p>
                <p className="text-sm text-muted-foreground">Timeline: {s.timeline}</p>
              </div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-ink mb-6">Revenue Growth Timeline</h3>
            <div className="space-y-5">
              {bars.map((b, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-semibold text-ink">{b.val}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div className={`${b.w} h-3 rounded-full bg-accent-green`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default RevenueSection;
