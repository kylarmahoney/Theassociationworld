import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout, revealVariants, staggerContainer } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitBooking } from "@workspace/api-client-react";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required").max(200),
  phone: z.string().max(50).optional(),
  eventType: z.string().min(1, "Event type is required").max(100),
  eventDate: z.string().min(1, "Date is required").max(100),
  eventLocation: z.string().min(1, "Location is required").max(300),
  artist: z.string().min(1, "Artist selection is required").max(100),
  budget: z.string().max(100).optional(),
  details: z.string().max(5000).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [searchParams] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedArtist = urlParams.get("artist") || "No preference";
  
  const [isSuccess, setIsSuccess] = useState(false);
  const submitBooking = useSubmitBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      eventLocation: "",
      artist: preselectedArtist,
      budget: "",
      details: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    submitBooking.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
      }
    });
  };

  return (
    <PageLayout>
      <div className="pt-32 pb-20 relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[120px] rounded-full" />
        </div>

        <div className="container px-6 md:px-12 mx-auto relative z-10 max-w-3xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                variants={staggerContainer}
                className="bg-card/40 backdrop-blur-sm border border-border/50 p-8 md:p-12 rounded-sm shadow-2xl"
              >
                <motion.div variants={revealVariants} className="text-center mb-12 space-y-4">
                  <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.15em] text-primary">
                    Request Booking
                  </h1>
                  <p className="text-muted-foreground tracking-[0.2em] text-xs uppercase">
                    All inquiries are strictly confidential.
                  </p>
                </motion.div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Client Name" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Email *</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@domain.com" type="email" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Event Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-none focus:ring-primary">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border rounded-none">
                                <SelectItem value="Private Event">Private Event</SelectItem>
                                <SelectItem value="Corporate">Corporate</SelectItem>
                                <SelectItem value="Club Night">Club Night</SelectItem>
                                <SelectItem value="Festival">Festival</SelectItem>
                                <SelectItem value="Wedding">Wedding</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Event Date *</FormLabel>
                            <FormControl>
                              <Input type="date" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Location/Venue *</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Country or Venue Name" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="artist"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Requested Artist *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-none focus:ring-primary">
                                  <SelectValue placeholder="Select artist" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border rounded-none max-h-80">
                                <SelectItem value="No preference">No preference</SelectItem>
                                <SelectGroup>
                                  <SelectLabel className="text-primary/80 uppercase tracking-widest text-[10px]">DJs — The Roster</SelectLabel>
                                  <SelectItem value="ASSOCIATION WORLD">ASSOCIATION WORLD</SelectItem>
                                  <SelectItem value="NOCTURNE">NOCTURNE</SelectItem>
                                  <SelectItem value="SAINT MIDNIGHT">SAINT MIDNIGHT</SelectItem>
                                  <SelectItem value="ORACLE">ORACLE</SelectItem>
                                  <SelectItem value="VESPER">VESPER</SelectItem>
                                  <SelectItem value="IRON TONGUE">IRON TONGUE</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                  <SelectLabel className="text-primary/80 uppercase tracking-widest text-[10px]">Artists</SelectLabel>
                                  <SelectItem value="VEIL">VEIL</SelectItem>
                                  <SelectItem value="OBSIDIAN HAND">OBSIDIAN HAND</SelectItem>
                                  <SelectItem value="SISTER NOIR">SISTER NOIR</SelectItem>
                                  <SelectItem value="THE SCRIBE">THE SCRIBE</SelectItem>
                                  <SelectItem value="PALE ENGINE">PALE ENGINE</SelectItem>
                                  <SelectItem value="HOLY GHOST CHOIR">HOLY GHOST CHOIR</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Estimated Budget</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-none focus:ring-primary">
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border rounded-none">
                                <SelectItem value="Under $10k">Under $10k</SelectItem>
                                <SelectItem value="$10k-$25k">$10k-$25k</SelectItem>
                                <SelectItem value="$25k-$50k">$25k-$50k</SelectItem>
                                <SelectItem value="$50k+">$50k+</SelectItem>
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
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Additional Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us more about the vision for the event..." 
                                className="bg-background/50 border-border rounded-none min-h-[120px] focus-visible:ring-primary focus-visible:border-primary resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants} className="pt-6">
                      <Button 
                        type="submit" 
                        disabled={submitBooking.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.2em] py-8 text-sm rounded-none shadow-[0_0_20px_rgba(201,169,97,0.2)] hover:shadow-[0_0_30px_rgba(201,169,97,0.4)] transition-all"
                      >
                        {submitBooking.isPending ? "Transmitting..." : "Submit Request"}
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
                <div className="w-24 h-24 mx-auto rounded-full border border-primary/50 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(201,169,97,0.3)]">
                  <img src="/brand/logo-seal.png" alt="Seal" className="w-16 h-16 object-cover" />
                </div>
                <h2 className="text-2xl md:text-4xl font-serif text-primary uppercase tracking-[0.15em]">
                  Your request has been received.
                </h2>
                <p className="text-muted-foreground tracking-[0.2em] uppercase font-light">
                  Management will reach out in silence.
                </p>
                <div className="pt-12">
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
