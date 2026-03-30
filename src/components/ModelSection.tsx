import { Building2, Landmark, Store, UserCheck, Wheat, ShoppingBag } from "lucide-react";
import { FadeUp, SectionLabel, SectionHeadline } from "./ScrollAnimation";

const payers = [
  { icon: Building2, title: "FPO / Cooperative", price: "₹5K–15K/month" },
  { icon: Landmark, title: "State Agri. Dept.", price: "₹500–1.2K/advisor/seat" },
  { icon: Store, title: "Input Distributor", price: "₹15K–40K/season" },
];

const users = [
  { icon: UserCheck, title: "Extension Officer", desc: "Uses daily portfolio view" },
  { icon: Wheat, title: "FPO Agronomist", desc: "Manages member soil profiles" },
  { icon: ShoppingBag, title: "Input Dealer", desc: "Sees seasonal demand forecast" },
];

const ModelSection = () => (
  <section id="model" className="bg-sage-light section-padding">
    <div className="container-narrow text-center">
      <FadeUp>
        <SectionLabel>The Model</SectionLabel>
        <SectionHeadline className="text-ink mb-2">Who Uses It — Who Pays</SectionHeadline>
        <p className="text-muted-foreground mb-12">B2B2C model: institutions pay, advisors use, farmers benefit</p>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-xs font-bold tracking-widest uppercase text-gold mb-4">Who Pays</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {payers.map((p, i) => (
            <div key={i} className="bg-background rounded-xl border border-border p-5 shadow-sm">
              <p.icon className="mx-auto mb-3 text-gold" size={28} />
              <h3 className="font-bold text-ink text-sm">{p.title}</h3>
              <p className="text-accent-green font-semibold text-sm mt-1">{p.price}</p>
            </div>
          ))}
        </div>
      </FadeUp>
      <FadeUp delay={0.15}>
        <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-6">
          <span className="text-gold font-bold text-sm">FD</span>
        </div>
      </FadeUp>
      <FadeUp delay={0.2}>
        <p className="text-xs font-bold tracking-widest uppercase text-accent-green mb-4">Who Uses It</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {users.map((u, i) => (
            <div key={i} className="bg-background rounded-xl border border-border p-5 shadow-sm">
              <u.icon className="mx-auto mb-3 text-accent-green" size={28} />
              <h3 className="font-bold text-ink text-sm">{u.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{u.desc}</p>
            </div>
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
);

export default ModelSection;
