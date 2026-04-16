import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <PageLayout hideFooter>
      <div className="min-h-[80vh] flex items-center justify-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-md"
        >
          <div className="relative">
            <h1 className="text-8xl font-serif text-primary opacity-20 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-2xl font-serif uppercase tracking-[0.2em] text-foreground shadow-black drop-shadow-xl">
                Not Found
              </h2>
            </div>
          </div>
          
          <p className="text-muted-foreground tracking-[0.1em] font-light uppercase text-sm">
            This door does not exist. Return to the known path.
          </p>
          
          <div className="pt-8">
            <Link href="/">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest rounded-none px-8">
                Go Back
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
