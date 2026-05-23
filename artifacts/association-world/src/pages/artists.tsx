import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { artists } from "@/data/artists";

export default function Artists() {
  return (
    <PageLayout>
      <div className="pt-32 pb-20 relative">
        <div className="container px-6 md:px-12 mx-auto text-center space-y-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.h1 variants={revealVariants} className="text-4xl md:text-6xl font-serif uppercase tracking-[0.15em] text-primary">
              The Artists
            </motion.h1>
            <motion.p variants={revealVariants} className="text-muted-foreground tracking-[0.2em] text-sm md:text-base max-w-2xl mx-auto uppercase">
              Beyond the booth. Producers, voices, and ritualists of the collective.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <section className="pb-32 bg-background">
        <div className="container px-6 md:px-12 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 md:gap-y-20">
            {artists.map((artist, i) => {
              const number = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.08 }}
                  className="group relative"
                >
                  {/* Portrait frame */}
                  <Link href={`/artists/${artist.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 rounded-sm shadow-[0_25px_60px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:shadow-[0_35px_80px_-20px_rgba(201,169,97,0.35)] group-hover:-translate-y-1">
                    {/* Hairline gold frame */}
                    <div className="absolute inset-0 border border-border/40 group-hover:border-primary/60 transition-colors duration-700 z-30 pointer-events-none" />
                    <div className="absolute inset-[3px] border border-primary/0 group-hover:border-primary/10 transition-colors duration-700 z-30 pointer-events-none" />

                    {/* Image */}
                    <img
                      src={artist.photo}
                      alt={artist.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out filter grayscale contrast-110 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                    />

                    {/* Film vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-10" />

                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none z-10" />

                    {/* Light sweep on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1400ms] ease-out pointer-events-none z-20" />

                    {/* Number tag */}
                    <div className="absolute top-5 left-5 text-[10px] tracking-[0.35em] text-primary/60 font-light z-20">
                      {number}
                    </div>

                    {/* Inquire button slides up */}
                    <div className="absolute inset-x-5 bottom-5 z-20 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <Link href={`/booking?artist=${encodeURIComponent(artist.name)}`} onClick={(e) => e.stopPropagation()}>
                        <Button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/80 uppercase tracking-[0.25em] text-[10px] rounded-none h-9 backdrop-blur-sm">
                          Inquire
                        </Button>
                      </Link>
                    </div>
                  </div>
                  </Link>

                  {/* Meta below frame */}
                  <div className="pt-6 space-y-2 text-center">
                    <Link href={`/artists/${artist.slug}`}>
                      <h2 className="font-serif text-xl md:text-2xl uppercase tracking-[0.15em] text-foreground group-hover:text-primary transition-colors duration-500 cursor-pointer hover:text-primary">
                        {artist.name}
                      </h2>
                    </Link>
                    <div className="mx-auto h-px w-8 bg-primary/40 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                    <p className="text-[10px] tracking-[0.3em] text-muted-foreground/80 uppercase">
                      {artist.discipline}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center border-t border-border/30 pt-16 max-w-2xl mx-auto"
          >
            <p className="text-muted-foreground mb-8 font-light tracking-wide">
              Looking for our DJ roster instead?
            </p>
            <Link href="/djs">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground tracking-widest uppercase rounded-none px-8">
                View The Roster
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
