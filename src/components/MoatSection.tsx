import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const layers = [
  {
    color: "bg-accent-green",
    title: "Advisor Workflow Lock-in",
    desc: "Once Senthil has 900 farmer profiles, his entire institutional memory lives in FieldDesk. Switching means starting from zero.",
    badge: "Built in Year 1",
  },
  {
    color: "bg-gold",
    title: "Proprietary Soil + Outcome Dataset",
    desc: "After 2 seasons: verified soil data + recommendations + actual yield outcomes for thousands of farms. No API gives you this.",
    badge: "Built in Year 2",
  },
  {
    color: "bg-sky-500",
    title: "The Trust Network",
    desc: "FieldDesk owns the advisor relationship. Scale advisors → scale farmers, without the cost of direct farmer acquisition.",
    badge: "Built in Year 2–3",
  },
];

const MoatSection = () => (
  <section className="bg-sky-light section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>The Moat</SectionLabel>
        <SectionHeadline className="text-ink mb-12">The Competitive Moat — 3 Layers</SectionHeadline>
      </FadeUp>
      <div className="space-y-4 mb-10">
        {layers.map((l, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="flex rounded-xl overflow-hidden border border-border bg-background shadow-sm">
              <div className={`${l.color} w-2 shrink-0`} />
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-bold text-ink mb-1">{l.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl">{l.desc}</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-ink">{l.badge}</span>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
      <div className="bg-primary rounded-xl p-6 text-center">
        <p className="text-primary-foreground/80 italic text-sm sm:text-base leading-relaxed">
          "We're not building the next agri-app.<br />We're building the payment gateway every agri-app is missing."
        </p>
      </div>
    </div>
  </section>
);

export default MoatSection;
