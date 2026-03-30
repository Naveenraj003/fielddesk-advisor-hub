import { Search, Brain, FolderOpen, TrendingDown, User } from "lucide-react";
import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const facts = [
  "Responsible for 900 farmers across 18 villages",
  "Receives 20+ farmer calls daily",
  "Answers entirely from memory",
  "Uses Excel + WhatsApp — zero data tool",
  "Cannot prioritize which farmer needs urgent help",
];

const painPoints = [
  { icon: Search, title: "Can't Prioritize", desc: "900 farmers, no way to know which 10 need attention today" },
  { icon: Brain, title: "Advice from Memory", desc: "Recommendations rely on recall, not data" },
  { icon: FolderOpen, title: "Stale Soil Data", desc: "Soil Health Card data sits unused in a govt Excel file" },
  { icon: TrendingDown, title: "No Impact Proof", desc: "Cannot demonstrate value to superiors or institutions" },
];

const ProblemSection = () => (
  <section id="problem" className="bg-cream section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>The Problem</SectionLabel>
        <SectionHeadline className="text-ink mb-12 max-w-3xl">
          The Real Problem Isn't the Farmer. It's the Advisor With No Tool.
        </SectionHeadline>
      </FadeUp>
      <div className="grid lg:grid-cols-2 gap-10">
        <FadeUp delay={0.1}>
          <div className="bg-background rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
                <User className="text-accent-green" size={24} />
              </div>
              <div>
                <div className="font-bold text-ink">Senthil</div>
                <div className="text-sm text-muted-foreground">Extension Officer</div>
              </div>
            </div>
            <ul className="space-y-3 mb-5">
              {facts.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-accent-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="bg-gold/10 border border-gold/30 rounded-md px-4 py-2 text-sm font-bold text-gold">
              Zero data tool. Zero portfolio view.
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="grid sm:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-background rounded-xl p-5 shadow-sm border border-border">
                <p.icon className="text-accent-green mb-3" size={24} />
                <h3 className="font-bold text-ink mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default ProblemSection;
