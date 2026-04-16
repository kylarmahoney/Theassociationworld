import { motion } from "framer-motion";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

const products = [
  { id: 1, name: "INITIATE HOODIE", price: "$185", image: "/merch/merch1.png", isExclusive: false },
  { id: 2, name: "COVENANT TEE", price: "$85", image: "/merch/merch2.png", isExclusive: false },
  { id: 3, name: "SILENCE CAP", price: "$65", image: "/merch/merch3.png", isExclusive: false },
  { id: 4, name: "ARCHITECT HEAVY HOODIE", price: "$250", image: "/merch/merch4.png", isExclusive: true },
];

export default function Merch() {
  return (
    <PageLayout>
      <div className="pt-32 pb-20 relative">
        <div className="container px-6 md:px-12 mx-auto text-center space-y-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.h1 variants={revealVariants} className="text-4xl md:text-6xl font-serif uppercase tracking-[0.15em] text-primary">
              The Collection
            </motion.h1>
            <motion.p variants={revealVariants} className="text-muted-foreground tracking-[0.2em] text-sm md:text-base max-w-2xl mx-auto uppercase">
              Uniforms for the initiated.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <section className="py-12 bg-background">
        <div className="container px-6 md:px-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary border border-border/20 mb-6 group-hover:border-primary/30 transition-colors duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  {product.isExclusive && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-100 transition-opacity">
                      <div className="text-center px-4">
                        <p className="text-primary font-serif uppercase tracking-widest text-lg drop-shadow-[0_0_10px_rgba(201,169,97,0.5)] mb-2">Members Only</p>
                        <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Access required</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-serif uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm tracking-widest text-muted-foreground">
                    {product.price}
                  </p>
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
            <h3 className="text-2xl font-serif text-primary uppercase tracking-[0.1em] mb-4">Season 01</h3>
            <p className="text-muted-foreground mb-8 font-light">The full collection is reserved for our inner circle. Limited drops available to the public quarterly.</p>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground tracking-widest uppercase rounded-none px-8">
              Join the waitlist
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
