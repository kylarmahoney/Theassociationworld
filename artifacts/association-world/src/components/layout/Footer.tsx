import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/30 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(201,169,97,0.1)]">
              <img 
                src="/brand/logo-seal.png" 
                alt="Association World Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-[0.2em] uppercase">
              Association <span className="text-primary">World</span>
            </h2>
            <p className="text-muted-foreground tracking-[0.3em] text-xs uppercase">Loyalty. rESPECT. Silence. Unity.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {["DJS", "ARTISTS", "BOOKING", "MERCH", "CONTACT"].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`}>
                <span className="text-xs tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors cursor-pointer uppercase">
                  {link}
                </span>
              </Link>
            ))}
          </div>

          {/* Contact & Copyright */}
          <div className="pt-12 border-t border-border/30 w-full max-w-lg flex flex-col items-center space-y-4">
            <a 
              href="mailto:management@associationworld.com" 
              className="text-primary/80 hover:text-primary text-sm tracking-widest transition-colors"
            >
              management@associationworld.com
            </a>
            <p className="text-xs text-muted-foreground/50 tracking-widest uppercase">
              &copy; {currentYear} The Association World. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
