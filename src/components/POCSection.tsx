import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const phases = [
  { weeks: "Wk 1–2", title: "Recruit", desc: "Find 2 extension officers in Salem / Dharmapuri. Deep workflow interviews.", color: "bg-accent-green" },
  { weeks: "Wk 3–4", title: "Dashboard", desc: "Deploy Module 1 only. Portfolio Dashboard. Watch natural usage.", color: "bg-gold" },
  { weeks: "Wk 5–6", title: "Soil AI", desc: "Add soil engine for top 20 farmers. First WhatsApp recommendation sent.", color: "bg-accent-green" },
  { weeks: "Wk 7–8", title: "Validate", desc: "Interview officers & 5 farmers. Build case study. Start first commercial talk.", color: "bg-sky-500" },
];

const POCSection = () => (
  <section id="poc" className="bg-cream section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>The POC</SectionLabel>
        <SectionHeadline className="text-ink mb-2">The 8-Week Proof of Concept</SectionHeadline>
        <p className="text-muted-foreground mb-12">Two extension officers. One district. Prove it works before scaling.</p>
      </FadeUp>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {phases.map((p, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="bg-background rounded-xl border border-border shadow-sm p-5 h-full">
              <div className={`w-10 h-10 rounded-lg ${p.color} flex items-center justify-center mb-3`}>
                <span className="text-primary-foreground font-bold text-xs">{i + 1}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{p.weeks}</p>
              <h3 className="font-bold text-ink mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
      <FadeUp delay={0.3}>
        <div className="bg-primary-mid rounded-xl p-5 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-primary-foreground/90">
          <span>✓ Advisor uses it daily</span>
          <span>✓ 60%+ WhatsApp delivery</span>
          <span>✓ 5 farmers confirm acting</span>
          <span>✓ 1 advisor says 'I'd pay for this'</span>
        </div>
      </FadeUp>
    </div>
  </section>
);

export default POCSection;
