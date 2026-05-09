import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { djs, handleDjImgError } from "@/data/djs";
import { artists } from "@/data/artists";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [djsOpen, setDjsOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "brightness(0.5)" }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                filter: "brightness(1)",
                boxShadow: "0 0 80px rgba(201,169,97,0.4)" 
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border border-primary/50 relative"
            >
              <img src="/brand/logo-seal.png" alt="Seal" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PageLayout hideNav={showIntro} hideFooter={showIntro}>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Ambient Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </div>

          {/* Background intro video — fades to mascot when finished */}
          <motion.video
            key="hero-intro-video"
            src="/brand/hero-intro.mov"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setVideoEnded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoEnded ? 0 : 0.55 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none mix-blend-screen"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/40 to-background/30 pointer-events-none" />

          <div className="container relative z-10 px-6 md:px-12 flex flex-col items-center text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={!showIntro ? "visible" : "hidden"}
              className="flex flex-col items-center space-y-8"
            >
              <motion.div variants={revealVariants} className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#f5e6b8] via-[#c9a961] to-[#8a6f2e] tracking-[0.1em] drop-shadow-[0_0_40px_rgba(201,169,97,0.6)]">
                  ASSOCIATION WORLD
                </h1>
                <p className="text-primary tracking-[0.3em] md:tracking-[0.5em] text-sm md:text-base uppercase font-medium">Loyalty. RESPECT. Silence. Unity.</p>
              </motion.div>
              
              <motion.div variants={revealVariants} className="max-w-2xl text-muted-foreground/80 leading-relaxed font-light">
                <p>Not Entertainment. A Movement.</p>
                <p>We Dictate The Pulse Of The Night.

                - Hadrian</p>
              </motion.div>

            </motion.div>
          </div>

          {/* Decorative Mascot — appears as the intro video fades out */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none mix-blend-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={
              !showIntro && videoEnded
                ? { opacity: 0.18, y: 0 }
                : { opacity: 0, y: 60 }
            }
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            <img src="/brand/mascot.png" alt="Mascot" className="w-full h-auto mask-image-bottom" />
          </motion.div>
        </section>

        {/* ETHOS SECTION */}
        <section className="py-32 relative bg-background border-t border-border/30">
          <div className="container px-6 md:px-12 mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start"
              >
                <motion.h2 variants={revealVariants} className="text-3xl md:text-5xl font-serif text-primary uppercase tracking-[0.1em]">
                  The Ethos
                </motion.h2>
                <motion.div variants={revealVariants} className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent md:from-primary md:via-primary md:to-transparent" />
                <motion.p variants={revealVariants} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                  Behind unmarked doors and velvet ropes, a covenant of artists and architects of the night operates in silence. We do not seek the spotlight; we control it.
                </motion.p>
                <motion.p variants={revealVariants} className="text-muted-foreground leading-relaxed">
                  For the high-end client who demands more than a performance. We provide an experience steeped in exclusivity, mystery, and unparalleled sound.
                </motion.p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
                className="relative h-[600px] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 blur-2xl" />
                <img src="/brand/mascot.png" alt="Silence" className="h-full object-contain relative z-10 drop-shadow-[0_0_50px_rgba(201,169,97,0.3)] animate-pulse-slow" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* COLLAPSIBLE ROSTERS */}
        <section className="py-28 bg-[#050505] relative">
          <div className="container px-6 md:px-12 mx-auto max-w-5xl space-y-6">
            {/* DJs accordion */}
            <div className="border-y border-border/40">
              <button
                type="button"
                onClick={() => setDjsOpen((v) => !v)}
                aria-expanded={djsOpen}
                className="group w-full flex items-center justify-between gap-6 py-8 md:py-10 text-left"
              >
                <span className="font-serif text-3xl md:text-5xl uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-[#f5e6b8] via-[#c9a961] to-[#8a6f2e] drop-shadow-[0_0_30px_rgba(201,169,97,0.3)]">
                  Roster of DJs
                </span>
                <motion.span
                  animate={{ rotate: djsOpen ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-primary/80 group-hover:text-primary"
                >
                  <ChevronDown size={28} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {djsOpen && (
                  <motion.div
                    key="djs-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7 pb-10 pt-2">
                      {djs.map((dj, i) => (
                        <Link key={dj.username} href={`/djs/${dj.slug}`} className="group block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 rounded-sm border border-border/40 group-hover:border-primary/60 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] group-hover:shadow-[0_20px_50px_-15px_rgba(201,169,97,0.35)] transition-all duration-500">
                            <img
                              src={dj.image}
                              alt={dj.stageName}
                              loading="lazy"
                              onError={(e) => handleDjImgError(e, i)}
                              className="absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out filter grayscale contrast-110 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                          </div>
                          <p className="mt-3 text-center font-serif text-sm md:text-base uppercase tracking-[0.18em] text-foreground group-hover:text-primary transition-colors">
                            {dj.stageName}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Artists accordion */}
            <div className="border-b border-border/40">
              <button
                type="button"
                onClick={() => setArtistsOpen((v) => !v)}
                aria-expanded={artistsOpen}
                className="group w-full flex items-center justify-between gap-6 py-8 md:py-10 text-left"
              >
                <span className="font-serif text-3xl md:text-5xl uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-[#f5e6b8] via-[#c9a961] to-[#8a6f2e] drop-shadow-[0_0_30px_rgba(201,169,97,0.3)]">
                  The Artists
                </span>
                <motion.span
                  animate={{ rotate: artistsOpen ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-primary/80 group-hover:text-primary"
                >
                  <ChevronDown size={28} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {artistsOpen && (
                  <motion.div
                    key="artists-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7 pb-10 pt-2">
                      {artists.map((artist) => (
                        <Link key={artist.id} href={`/artists/${artist.slug}`} className="group block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 rounded-sm border border-border/40 group-hover:border-primary/60 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] group-hover:shadow-[0_20px_50px_-15px_rgba(201,169,97,0.35)] transition-all duration-500">
                            <img
                              src={artist.photo}
                              alt={artist.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out filter grayscale contrast-110 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                          </div>
                          <p className="mt-3 text-center font-serif text-sm md:text-base uppercase tracking-[0.18em] text-foreground group-hover:text-primary transition-colors">
                            {artist.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center pt-6 gap-4 flex-wrap">
              <Link href="/djs">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground tracking-widest uppercase rounded-none px-8 text-xs">
                  Full DJ Roster
                </Button>
              </Link>
              <Link href="/artists">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground tracking-widest uppercase rounded-none px-8 text-xs">
                  All Artists
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
