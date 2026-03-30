import { FadeUp } from "./ScrollAnimation";

const stats = [
  { value: "1 Advisor", label: "serves 500–900 farmers", borderColor: "border-accent-green" },
  { value: "0 Tools", label: "exist for advisors today", borderColor: "border-gold" },
  { value: "₹1,800", label: "avg. fertilizer saving / acre", borderColor: "border-primary-mid" },
];

const HeroSection = () => (
  <section className="bg-primary pt-28 pb-0">
    <div className="container-narrow px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeUp>
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-bold tracking-widest uppercase mb-6">
            Agritech for Advisors
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-primary-foreground leading-[1.1] mb-6">
            What if every agricultural advisor had a data command center?
          </h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-xl">
            FieldDesk gives extension officers, FPO agronomists and input dealers the soil intelligence tool they've never had — so 1 advisor can serve 500 farmers with data-backed confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="px-7 py-3.5 rounded-md bg-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity">
              Request a Free Pilot
            </a>
            <a href="#workflow" className="px-7 py-3.5 rounded-md border border-primary-foreground/40 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors">
              See How It Works
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="flex flex-col gap-4">
            {stats.map((s, i) => (
              <div key={i} className={`bg-primary-mid/30 border-l-4 ${s.borderColor} rounded-lg p-5`}>
                <div className="text-2xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-primary-foreground/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
    <div className="bg-primary-mid py-4 text-center">
      <p className="text-primary-foreground font-semibold tracking-wide text-sm sm:text-base">
        Better Advice. Better Farms. Better Data.
      </p>
    </div>
  </section>
);

export default HeroSection;
