import { TrendingUp, TrendingDown, Users, Coins, Cpu, Clock } from "lucide-react";
import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const stats = [
  { icon: TrendingUp, value: "+15%", label: "Average Yield Increase", border: "border-t-accent-green" },
  { icon: TrendingDown, value: "-12%", label: "Fertilizer Cost Reduced", border: "border-t-gold" },
  { icon: Users, value: "3×", label: "More Farmers Served Per Advisor", border: "border-t-sky-500" },
  { icon: Coins, value: "₹1,800", label: "Saved Per Acre Per Season", border: "border-t-accent-green" },
  { icon: Cpu, value: "0 kg", label: "Extra Hardware Needed", border: "border-t-gold" },
  { icon: Clock, value: "8 wks", label: "POC to First Validation", border: "border-t-sky-500" },
];

const ImpactSection = () => (
  <section className="bg-primary section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>The Impact</SectionLabel>
        <SectionHeadline className="text-primary-foreground mb-12">Why It Matters — The Numbers</SectionHeadline>
      </FadeUp>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <FadeUp key={i} delay={i * 0.08}>
            <div className={`bg-primary-mid/30 rounded-xl border-t-4 ${s.border} p-6`}>
              <s.icon className="text-primary-foreground/50 mb-3" size={22} />
              <div className="text-3xl font-bold text-primary-foreground mb-1">{s.value}</div>
              <div className="text-sm text-primary-foreground/60">{s.label}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactSection;
