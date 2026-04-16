import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

const artists = [
  { id: 1, name: "VEIL", discipline: "Vocalist / Songwriter", bio: "A voice carved from smoke. Anonymous by design.", photo: "/djs/dj1.png" },
  { id: 2, name: "OBSIDIAN HAND", discipline: "Producer / Composer", bio: "Architect of low-end cathedrals and orchestral decay.", photo: "/djs/dj2.png" },
  { id: 3, name: "SISTER NOIR", discipline: "Live Performer", bio: "Cello and tape loops in candlelit basements.", photo: "/djs/dj3.png" },
  { id: 4, name: "THE SCRIBE", discipline: "Lyricist / Spoken Word", bio: "Words for those who refuse to speak first.", photo: "/djs/dj4.png" },
  { id: 5, name: "PALE ENGINE", discipline: "Multi-Instrumentalist", bio: "Analog synths, modular rituals, broken machines.", photo: "/djs/dj5.png" },
  { id: 6, name: "HOLY GHOST CHOIR", discipline: "Vocal Ensemble", bio: "Three voices. One breath. Unlisted recordings only.", photo: "/djs/dj6.png" },
];

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

      <section className="py-12 bg-background">
        <div className="container px-6 md:px-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {artists.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                className="group relative"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary relative border border-border/20 group-hover:border-primary/50 transition-colors duration-500 shadow-xl">
                  {/* LAYER 1 — Revealed photo (underneath) */}
                  <img
                    src={artist.photo}
                    alt={artist.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-110 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[1100ms] ease-out"
                  />

                  {/* LAYER 2 — Silhouette (on top, fades out on hover) */}
                  <div className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-950" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,97,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/brand/logo-seal.png"
                        alt=""
                        aria-hidden="true"
                        className="w-1/2 object-contain opacity-30 mix-blend-screen filter grayscale"
                      />
                    </div>
                  </div>

                  {/* Bottom gradient always present for legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

                  {/* Text content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                    <h2 className="text-2xl lg:text-3xl font-serif text-primary uppercase tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(201,169,97,0.5)]">
                      {artist.name}
                    </h2>
                    <p className="text-xs tracking-[0.2em] text-foreground/80 uppercase mb-3">
                      {artist.discipline}
                    </p>
                    <p className="text-sm text-muted-foreground font-light mb-6 max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {artist.bio}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <Link href={`/booking?artist=${encodeURIComponent(artist.name)}`}>
                        <Button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary uppercase tracking-widest text-xs rounded-none">
                          Inquire
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
