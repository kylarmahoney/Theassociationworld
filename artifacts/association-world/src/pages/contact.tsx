import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitContact } from "@workspace/api-client-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required").max(200),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const submitContact = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
      }
    });
  };

  return (
    <PageLayout>
      <div className="pt-32 pb-20 relative min-h-screen flex items-center justify-center">
        <div className="container px-6 md:px-12 mx-auto relative z-10 max-w-2xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                variants={staggerContainer}
                className="bg-card border border-border/50 p-8 md:p-12 rounded-sm shadow-xl relative overflow-hidden"
              >
                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

                <motion.div variants={revealVariants} className="text-center mb-10 space-y-4">
                  <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.15em] text-primary">
                    Reach Out
                  </h1>
                  <p className="text-muted-foreground tracking-normal sm:tracking-[0.15em] md:tracking-[0.2em] text-[10px] sm:text-xs uppercase break-all">
                    management@theassociationworld.com
                  </p>
                </motion.div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Name</FormLabel>
                            <FormControl>
                              <Input className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Email</FormLabel>
                            <FormControl>
                              <Input type="email" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background border-border rounded-none focus:ring-primary">
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border rounded-none">
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Press">Press</SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                                <SelectItem value="Membership Inquiry">Membership Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="bg-background border-border rounded-none min-h-[150px] focus-visible:ring-primary resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants} className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={submitContact.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest py-6 text-sm rounded-none transition-all shadow-[0_0_15px_rgba(201,169,97,0.15)]"
                      >
                        {submitContact.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-20"
              >
                <h2 className="text-2xl md:text-3xl font-serif text-primary uppercase tracking-[0.1em]">
                  Message Sent
                </h2>
                <p className="text-muted-foreground tracking-[0.2em] uppercase text-sm">
                  We have received your transmission.
                </p>
                <div className="pt-8">
                  <Link href="/">
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest rounded-none px-8">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}
