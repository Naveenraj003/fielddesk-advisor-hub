const links = ["Problem", "Product", "How It Works", "Who Pays", "POC", "Contact"];
const hrefs = ["#problem", "#product", "#workflow", "#model", "#poc", "#contact"];

const Footer = () => (
  <footer className="bg-ink">
    <div className="container-narrow px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid sm:grid-cols-3 gap-8 items-start">
        <div>
          <span className="text-xl font-bold text-gold">FieldDesk</span>
          <p className="text-sm text-primary-foreground/50 mt-2">Better Advice. Better Farms. Better Data.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l, i) => (
            <a key={l} href={hrefs[i]} className="text-sm text-primary-foreground/50 hover:text-gold transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-sm text-primary-foreground/50 sm:text-right">Built for Tamil Nadu.<br />Scaling for India.</p>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-4 text-center">
      <p className="text-xs text-primary-foreground/40">Better Advice. Better Farms. Better Data. © 2025 FieldDesk</p>
    </div>
  </footer>
);

export default Footer;
