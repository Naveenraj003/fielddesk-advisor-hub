import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#workflow" },
  { label: "Who Pays", href: "#model" },
  { label: "POC", href: "#poc" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary/90 backdrop-blur-md" : "bg-primary"}`}>
      <div className="container-narrow flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <a href="#" className="text-xl font-bold text-gold">FieldDesk</a>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">{l.label}</a>
          ))}
        </div>
        <a href="#contact" className="hidden md:inline-flex items-center px-5 py-2 rounded-md bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          Request Pilot
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-primary border-t border-primary-mid px-4 pb-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-primary-foreground/80 hover:text-gold transition-colors">{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="block mt-2 text-center px-5 py-2 rounded-md bg-gold text-gold-foreground text-sm font-semibold">
            Request Pilot
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
