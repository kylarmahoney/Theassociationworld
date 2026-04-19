import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { djs } from "@/data/djs";

export default function DJs() {
  return (
    <PageLayout>
      {/* HERO */}
      <section className="pt-36 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,97,0.08),transparent_60%)]" />
        <div className="container px-6 md:px-12 mx-auto text-center space-y-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.p variants={revealVariants} className="text-primary/70 text-[10px] tracking-[0.5em] uppercase">
              Est. MMXXV · The Collective
            </motion.p>
            <motion.h1
              variants={revealVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-serif uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-[#f5e6b8] via-[#c9a961] to-[#8a6f2e] drop-shadow-[0_0_40px_rgba(201,169,97,0.35)]"
            >
              The DJ Roster
            </motion.h1>
            <motion.div variants={revealVariants} className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <motion.p variants={revealVariants} className="text-muted-foreground/90 tracking-[0.25em] text-xs md:text-sm max-w-xl mx-auto uppercase font-light">
              Tap a name to view the artist.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* NAME LIST */}
      <section className="pb-32 bg-background">
        <div className="container px-6 md:px-12 mx-auto max-w-3xl">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="divide-y divide-border/30 border-y border-border/30"
          >
            {djs.map((dj, i) => {
              const number = String(i + 1).padStart(2, "0");
              return (
                <motion.li key={dj.username} variants={revealVariants}>
                  <Link
                    href={`/djs/${dj.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-6 md:py-8 transition-colors"
                  >
                    <span className="text-[10px] md:text-xs tracking-[0.35em] text-primary/50 font-light shrink-0 w-10">
                      {number}
                    </span>
                    <span className="flex-1 font-serif text-2xl md:text-4xl uppercase tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
                      {dj.stageName}
                    </span>
                    <span className="hidden md:inline text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 group-hover:text-primary/80 transition-colors">
                      View →
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center pt-12 max-w-2xl mx-auto"
          >
            <p className="text-muted-foreground/80 mb-8 font-light tracking-wide">
              Every booking is handled in confidence by our management.
            </p>
            <Link href="/booking">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground tracking-[0.25em] uppercase rounded-none px-10 text-xs">
                Begin an Inquiry
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
