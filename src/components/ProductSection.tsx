import { LayoutDashboard, Leaf, BarChart3 } from "lucide-react";
import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const modules = [
  {
    icon: LayoutDashboard,
    num: "01",
    title: "Portfolio Dashboard",
    subtitle: "See all 900 farmers at a glance",
    headerColor: "bg-accent-green",
    points: [
      "Status flags: 🟢 On Track 🟡 Needs Attention 🔴 Urgent",
      "Auto-prioritized daily call list",
      "Sort by village, crop, urgency, last visit",
      "Never let a critical farm fall through the cracks",
    ],
  },
  {
    icon: Leaf,
    num: "02",
    title: "Soil Intelligence Engine",
    subtitle: "Turn a soil report into an action plan",
    headerColor: "bg-gold",
    points: [
      "Photo the report → OCR reads values instantly",
      "Crop-specific nutrient deficit calculation",
      "LP-optimized fertilizer mix (cheapest that works)",
      "Irrigation advice from live 5-day weather forecast",
    ],
  },
  {
    icon: BarChart3,
    num: "03",
    title: "Advisor Intelligence Layer",
    subtitle: "Prove your impact with data",
    headerColor: "bg-sky-500",
    points: [
      "Season performance: recommendations vs. outcomes",
      "Portfolio health analytics by village & crop",
      "Exportable impact report for department heads",
      "Yield feedback loop — system improves each season",
    ],
  },
];

const ProductSection = () => (
  <section id="product" className="bg-sky-light section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>The Product</SectionLabel>
        <SectionHeadline className="text-ink mb-12">What Is FieldDesk? — 3 Modules, 1 Platform</SectionHeadline>
      </FadeUp>
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((m, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden h-full flex flex-col">
              <div className={`${m.headerColor} px-5 py-3 flex items-center gap-3`}>
                <m.icon size={20} className="text-primary-foreground" />
                <span className="text-xs font-bold text-primary-foreground/70">{m.num}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-ink mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{m.subtitle}</p>
                <ul className="space-y-2 flex-1">
                  {m.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-ink/80">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-green shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default ProductSection;
