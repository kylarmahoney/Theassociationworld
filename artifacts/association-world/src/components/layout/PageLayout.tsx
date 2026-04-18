import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export function PageLayout({ children, className = "", hideNav = false, hideFooter = false }: PageLayoutProps) {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${className}`}>
      {!hideNav && <Navbar />}
      <motion.main 
        className="flex-grow flex flex-col relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};
