import { Sprout, Brain, Settings, CloudRain, MessageCircle, ChevronRight } from "lucide-react";
import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const steps = [
  { icon: Sprout, title: "Soil Report", desc: "Advisor photographs govt. soil report. OCR extracts all values automatically.", color: "bg-accent-green" },
  { icon: Brain, title: "AI Analysis", desc: "System classifies nutrients, calculates deficits vs. crop requirement.", color: "bg-gold" },
  { icon: Settings, title: "LP Optimize", desc: "Linear program finds cheapest fertilizer mix that meets all nutrient needs.", color: "bg-sky-500" },
  { icon: CloudRain, title: "Weather Check", desc: "5-day rain forecast integrated. Irrigation advice auto-generated.", color: "bg-accent-green" },
  { icon: MessageCircle, title: "WhatsApp Out", desc: "Pre-formatted Tamil message sent from advisor's name to farmer's number.", color: "bg-emerald-600" },
];

const WorkflowSection = () => (
  <section id="workflow" className="bg-cream section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>The Workflow</SectionLabel>
        <SectionHeadline className="text-ink mb-12">From Soil Report to Farmer's WhatsApp in Minutes</SectionHeadline>
      </FadeUp>
      <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-4">
        {steps.map((s, i) => (
          <FadeUp key={i} delay={i * 0.08} className="flex items-center gap-4 flex-1">
            <div className="bg-background rounded-xl shadow-sm border border-border p-5 flex-1">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={20} className="text-primary-foreground" />
              </div>
              <h3 className="font-bold text-ink text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="hidden lg:block text-muted-foreground shrink-0" size={20} />
            )}
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default WorkflowSection;
