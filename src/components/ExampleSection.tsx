import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const without = [
  { val: "₹8,000", label: "Fertilizer cost based on neighbour's guess" },
  { val: "3× over", label: "Watered field, rain came within 2 days" },
  { val: "Soil damage", label: "Too much nitrogen applied" },
  { val: "Only 80%", label: "Of expected yield achieved" },
  { val: "₹0 saved", label: "No optimization, no forecast check" },
];
const withFD = [
  { val: "₹6,200", label: "Optimized mix — saved ₹1,800" },
  { val: "0 wasted", label: "Irrigation skipped, rain forecast correct" },
  { val: "Perfect N", label: "Right nitrogen level, healthy soil" },
  { val: "+15%", label: "Yield increase over previous season" },
  { val: "₹1,800", label: "Direct saving on inputs per acre" },
];

const ExampleSection = () => (
  <section className="bg-background section-padding">
    <div className="container-narrow">
      <FadeUp>
        <SectionLabel>Real Example</SectionLabel>
        <SectionHeadline className="text-ink mb-2">A Real Result — Salem, Tamil Nadu</SectionHeadline>
        <p className="text-muted-foreground mb-10">Murugan | Maize Farmer | 1.2 Acres | Soil pH 8.2 | Nitrogen: Low</p>
      </FadeUp>
      <div className="grid md:grid-cols-2 gap-6">
        <FadeUp delay={0.1}>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-destructive/10 px-5 py-3 flex items-center gap-2">
              <span className="text-destructive font-bold">❌ Without FieldDesk</span>
            </div>
            <div className="p-5 space-y-3">
              {without.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="shrink-0 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-bold min-w-[80px] text-center">{r.val}</span>
                  <span className="text-sm text-ink/80">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-accent-green/10 px-5 py-3 flex items-center gap-2">
              <span className="text-accent-green font-bold">✅ With FieldDesk</span>
            </div>
            <div className="p-5 space-y-3">
              {withFD.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="shrink-0 px-3 py-1 rounded-md bg-accent-green/10 text-accent-green text-xs font-bold min-w-[80px] text-center">{r.val}</span>
                  <span className="text-sm text-ink/80">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default ExampleSection;
