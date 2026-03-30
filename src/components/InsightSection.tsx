import { FadeUp, SectionHeadline } from "./ScrollAnimation";
import { X, Check } from "lucide-react";

const InsightSection = () => (
  <section className="bg-primary section-padding">
    <div className="container-narrow text-center">
      <FadeUp>
        <p className="italic text-gold text-sm mb-4">The Core Insight</p>
        <SectionHeadline className="text-primary-foreground max-w-3xl mx-auto mb-12">
          Stop building for the farmer.<br />Build for the person the farmer already trusts.
        </SectionHeadline>
      </FadeUp>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <FadeUp delay={0.1}>
          <div className="border-2 border-destructive/50 rounded-xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <X className="text-destructive" size={20} />
              <h3 className="font-bold text-primary-foreground">Old Approach</h3>
            </div>
            <div className="text-primary-foreground/60 text-sm space-y-2 mb-4">
              <p>App → directly to thousands of farmers</p>
              <p>Each farmer needs to download, trust, and learn the app</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Low adoption", "No trust", "No scale"].map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="border-2 border-accent-green/50 rounded-xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Check className="text-accent-green" size={20} />
              <h3 className="font-bold text-primary-foreground">FieldDesk Approach</h3>
            </div>
            <div className="text-primary-foreground/60 text-sm space-y-2 mb-4">
              <p>FieldDesk → Advisor → 500+ Farmers</p>
              <p>Trusted advisor delivers insights via WhatsApp</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Trusted delivery", "Massive reach", "Zero friction"].map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default InsightSection;
