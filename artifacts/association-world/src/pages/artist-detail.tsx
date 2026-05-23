import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { findArtistBySlug } from "@/data/artists";
import NotFound from "@/pages/not-found";

export default function ArtistDetail() {
  const [, params] = useRoute("/artists/:slug");
  const slug = params?.slug ?? "";
  const artist = findArtistBySlug(slug);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!artist) return <NotFound />;

  const photos = artist.photos.length > 0 ? artist.photos : [artist.photo];
  const hasMultiple = photos.length > 1;
  const goPrev = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setPhotoIndex((i) => (i + 1) % photos.length);

  return (
    <PageLayout>
      <section className="pt-32 pb-24 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,97,0.08),transparent_60%)] pointer-events-none" />
        <div className="container px-6 md:px-12 mx-auto max-w-6xl relative z-10">
          <Link href="/artists" className="fixed top-24 left-4 md:left-8 z-40 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/80 hover:text-primary transition-colors bg-background/70 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            <ArrowLeft size={14} /> Back to Artists
          </Link>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
          >
            <motion.div variants={revealVariants} className="space-y-3">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 rounded-sm shadow-[0_25px_60px_-20px_rgba(0,0,0,0.8)] group select-none">
                <div className="absolute inset-0 border border-primary/40 z-30 pointer-events-none" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={photoIndex}
                    src={photos[photoIndex]}
                    alt={`${artist.name} — photo ${photoIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover filter contrast-110"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] pointer-events-none z-10" />

                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-primary/40 bg-background/60 backdrop-blur-sm text-primary/80 hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-primary/40 bg-background/60 backdrop-blur-sm text-primary/80 hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhotoIndex(i)}
                          aria-label={`Show photo ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === photoIndex ? "w-8 bg-primary" : "w-1.5 bg-primary/40 hover:bg-primary/70"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {hasMultiple && (
                <div className="flex gap-3 justify-center">
                  {photos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      aria-label={`Show photo ${i + 1}`}
                      className={`relative w-16 h-20 overflow-hidden rounded-sm border transition-all duration-300 ${
                        i === photoIndex
                          ? "border-primary shadow-[0_0_15px_rgba(201,169,97,0.4)]"
                          : "border-border/40 hover:border-primary/60 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={revealVariants} className="space-y-7 md:pt-6">
              <p className="text-[10px] tracking-[0.5em] uppercase text-primary/60">Association World · Artist</p>
              <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-[#f5e6b8] via-[#c9a961] to-[#8a6f2e]">
                {artist.name}
              </h1>
              <div className="h-px w-24 bg-gradient-to-r from-primary/60 to-transparent" />
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground/90">
                {artist.discipline}
              </p>

              <p className="text-base text-foreground/80 font-light leading-relaxed max-w-md">
                {artist.bio}
              </p>

              <div className="space-y-3 pt-4">
                <div className="text-[10px] tracking-[0.3em] uppercase text-primary/60">Booking Terms</div>
                <div className="border border-border/50 bg-card/30 backdrop-blur-sm p-5 space-y-2 text-sm font-light">
                  <p><span className="text-primary/80">Pricing:</span> Negotiated per event with management.</p>
                  <p><span className="text-primary/80">Deposit:</span> 50% required to confirm the booking.</p>
                  <p><span className="text-primary/80">Last-minute bookings:</span> May include additional costs and fees.</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href={`/booking?artist=${encodeURIComponent(artist.name)}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.25em] text-xs rounded-none px-8 h-12 shadow-[0_0_20px_rgba(201,169,97,0.2)] hover:shadow-[0_0_30px_rgba(201,169,97,0.4)] transition-all">
                    Send Inquiry
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
