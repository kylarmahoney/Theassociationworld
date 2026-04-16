import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/djs", label: "DJS" },
  { href: "/artists", label: "ARTISTS" },
  { href: "/booking", label: "BOOKING" },
  { href: "/merch", label: "MERCH" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="relative z-50 flex items-center gap-4 group">
          <div className="w-12 h-12 relative rounded-full overflow-hidden border border-primary/30 group-hover:border-primary/80 transition-colors duration-500 shadow-[0_0_15px_rgba(201,169,97,0.15)] group-hover:shadow-[0_0_25px_rgba(201,169,97,0.4)]">
            <img 
              src="/brand/logo-seal.png" 
              alt="Association World Logo" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm tracking-[0.2em] font-medium transition-all duration-300 hover:text-primary ${
                location === link.href ? "text-primary text-shadow-glow" : "text-foreground/70"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/booking">
            <Button className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-[0_0_15px_rgba(201,169,97,0.15)] hover:shadow-[0_0_30px_rgba(201,169,97,0.4)] uppercase tracking-widest text-xs px-8">
              Book Now
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative z-50 text-foreground hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center min-h-screen pt-20 pb-10"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <span className={`text-2xl font-serif tracking-[0.2em] uppercase transition-colors ${
                      location === link.href ? "text-primary" : "text-foreground/80 hover:text-primary"
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-8"
              >
                <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-primary text-primary-foreground uppercase tracking-widest text-sm px-12 py-6">
                    Book Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
