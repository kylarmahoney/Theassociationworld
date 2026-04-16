import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/djs", label: "DJS" },
  { href: "/artists", label: "ARTISTS" },
  { href: "/booking", label: "BOOKING" },
  { href: "/merch", label: "MERCH" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/60 py-3 md:py-4"
          : "bg-background/70 backdrop-blur-sm border-b border-border/20 py-3 md:py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center gap-4 group shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden border border-primary/30 group-hover:border-primary/80 transition-colors duration-500 shadow-[0_0_15px_rgba(201,169,97,0.15)] group-hover:shadow-[0_0_25px_rgba(201,169,97,0.4)]">
            <img
              src="/brand/logo-seal.png"
              alt="Association World Logo"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </Link>

        {/* Section nav — visible on all screens, horizontally scrollable on mobile */}
        <nav
          className="flex-1 min-w-0 flex items-center justify-end gap-3 md:gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} ref={isActive ? activeRef : undefined}>
                <span
                  className={`relative whitespace-nowrap text-[11px] md:text-sm tracking-[0.18em] md:tracking-[0.2em] font-medium transition-all duration-300 hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/70"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-primary shadow-[0_0_8px_rgba(201,169,97,0.7)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Book Now (desktop only) */}
        <Link href="/booking" className="hidden lg:block shrink-0">
          <Button className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-[0_0_15px_rgba(201,169,97,0.15)] hover:shadow-[0_0_30px_rgba(201,169,97,0.4)] uppercase tracking-widest text-xs px-8">
            Book Now
          </Button>
        </Link>
      </div>
    </header>
  );
}
