import { motion } from "framer-motion";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const djs = [
  { id: 1, name: "THE COVENANT", genre: "Curator / Founder", image: "/djs/dj1.png" },
  { id: 2, name: "NOCTURNE", genre: "Deep House / Melodic Techno", image: "/djs/dj2.png" },
  { id: 3, name: "SAINT MIDNIGHT", genre: "Afro House / Organic", image: "/djs/dj3.png" },
  { id: 4, name: "ORACLE", genre: "Progressive / Dark", image: "/djs/dj4.png" },
  { id: 5, name: "VESPER", genre: "Minimal / Tech", image: "/djs/dj5.png" },
  { id: 6, name: "IRON TONGUE", genre: "Industrial / Peak Time", image: "/djs/dj6.png" },
];

export default function DJs() {
  return (
    <PageLayout>
      <div className="pt-32 pb-20 relative">
        <div className="container px-6 md:px-12 mx-auto text-center space-y-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.h1 variants={revealVariants} className="text-4xl md:text-6xl font-serif uppercase tracking-[0.15em] text-primary">
              The Roster
            </motion.h1>
            <motion.p variants={revealVariants} className="text-muted-foreground tracking-[0.2em] text-sm md:text-base max-w-2xl mx-auto uppercase">
              Architects of sound. Bound by silence.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <section className="py-12 bg-background">
        <div className="container px-6 md:px-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {djs.map((dj, i) => (
              <motion.div
                key={dj.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                className="group relative"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary relative border border-border/20 group-hover:border-primary/50 transition-colors duration-500 shadow-xl">
                  <img 
                    src={dj.image} 
                    alt={dj.name} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-2xl lg:text-3xl font-serif text-primary uppercase tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(201,169,97,0.5)]">
                      {dj.name}
                    </h2>
                    <p className="text-xs tracking-[0.2em] text-foreground/80 uppercase mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {dj.genre}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <Link href={`/booking?artist=${encodeURIComponent(dj.name)}`}>
                        <Button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary uppercase tracking-widest text-xs rounded-none">
                          Request Booking
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
