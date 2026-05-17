import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout, revealVariants } from "@/components/layout/PageLayout";

const formStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitBooking } from "@workspace/api-client-react";
import { djs } from "@/data/djs";
import { artists } from "@/data/artists";

const bookingSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().email("Valid email is required").max(200),
    phone: z.string().max(50).optional(),
    eventType: z.string().min(1, "Event type is required").max(100),
    eventDate: z.string().min(1, "Date is required").max(100),
    duration: z.string().max(100).optional(),
    city: z.string().min(1, "City is required").max(120),
    country: z.string().min(1, "Country is required").max(120),
    venueName: z.string().min(1, "Venue name is required").max(200),
    venueDirections: z.string().max(1000).optional(),
    talentType: z.enum(["DJ", "Artist"], {
      errorMap: () => ({ message: "Choose DJ or Artist" }),
    }),
    artist: z.string().min(1, "Selection is required").max(100),
    hours: z.string().max(50).optional(),
    bringSpeakers: z.boolean().optional(),
    budget: z.string().max(100).optional(),
    downPayment: z.string().max(100).optional(),
    details: z.string().max(5000).optional(),
    waiverAccepted: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.talentType === "DJ") {
      if (!data.hours || data.hours.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["hours"], message: "Hours are required" });
      }
      if (!data.waiverAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["waiverAccepted"],
          message: "You must accept the waiver to submit",
        });
      }
    }
  });

type BookingFormValues = z.infer<typeof bookingSchema>;


function isWeekendDate(value: string): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (isNaN(d.getTime())) return false;
  const day = d.getUTCDay();
  return day === 0 || day === 5 || day === 6;
}

export default function Booking() {
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedName = urlParams.get("artist") || "";
  const preselectedIsArtist = artists.some((a) => a.name === preselectedName);
  const preselectedIsDj = djs.some((d) => d.stageName === preselectedName);
  const preselectedType: "DJ" | "Artist" = preselectedIsArtist ? "Artist" : "DJ";

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
      duration: "",
      city: "",
      country: "",
      venueName: "",
      venueDirections: "",
      talentType: preselectedType,
      artist: preselectedIsArtist || preselectedIsDj ? preselectedName : "",
      hours: "",
      bringSpeakers: false,
      budget: "",
      downPayment: "",
      details: "",
      waiverAccepted: false,
    },
  });

  const talentType = form.watch("talentType");
  const eventDate = form.watch("eventDate");
  const hoursStr = form.watch("hours") ?? "";
  const bringSpeakers = form.watch("bringSpeakers") ?? false;
  const isDj = talentType === "DJ";
  const isWeekend = isWeekendDate(eventDate);

  const isLastMinute = useMemo(() => {
    if (!eventDate) return false;
    const ev = new Date(eventDate);
    if (isNaN(ev.getTime())) return false;
    const diffDays = (ev.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays < 14;
  }, [eventDate]);

  const showPricingNote = isDj && (isWeekend || isLastMinute || bringSpeakers || hoursStr.length > 0);

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
                variants={formStagger}
                className="bg-card/40 backdrop-blur-sm border border-border/50 p-6 md:p-12 rounded-sm shadow-2xl"
              >
                <motion.div variants={revealVariants} className="text-center mb-12 space-y-4">
                  <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.15em] text-primary">
                    {isDj ? "Request Booking" : "Artist Inquiry"}
                  </h1>
                  <p className="text-muted-foreground tracking-[0.2em] text-xs uppercase">
                    {isDj
                      ? "All inquiries are strictly confidential."
                      : "Tell us about your event. We'll call or email you back."}
                  </p>
                </motion.div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="talentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Booking Type *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue("artist", "", { shouldValidate: false });
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-none focus:ring-primary">
                                  <SelectValue placeholder="DJ or Artist" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border rounded-none">
                                <SelectItem value="DJ">DJ</SelectItem>
                                <SelectItem value="Artist">Live Artist</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      {isDj ? (
                        <FormField
                          key="dj-select"
                          control={form.control}
                          name="artist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Requested DJ *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background/50 border-border rounded-none focus:ring-primary">
                                    <SelectValue placeholder="Select DJ" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-card border-border rounded-none max-h-80">
                                  <SelectItem value="No preference">No preference — any available DJ</SelectItem>
                                  {djs.map((dj) => (
                                    <SelectItem key={dj.username} value={dj.stageName}>
                                      {dj.stageName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-primary/80 text-xs" />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          key="artist-select"
                          control={form.control}
                          name="artist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Requested Artist *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background/50 border-border rounded-none focus:ring-primary">
                                    <SelectValue placeholder="Select artist" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-card border-border rounded-none max-h-80">
                                  <SelectItem value="No preference">No preference</SelectItem>
                                  {artists.map((a) => (
                                    <SelectItem key={a.id} value={a.name}>
                                      {a.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-primary/80 text-xs" />
                            </FormItem>
                          )}
                        />
                      )}
                    </motion.div>

                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Full Name" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
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
                            {isDj && eventDate && (
                              <p className="text-[10px] tracking-[0.2em] uppercase text-primary/70 mt-1">
                                {isWeekend ? "Weekend / Fri–Sun · +20% surcharge" : "Weekday rate applies"}
                              </p>
                            )}
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Booking Window</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 9pm – 1am" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {isDj && (
                      <>
                        <motion.div variants={revealVariants} className="space-y-1 pt-2">
                          <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70">DJ Rate Card</p>
                          <div className="h-px w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
                        </motion.div>

                        <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Hours Booked *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    placeholder="e.g. 4"
                                    className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary"
                                    {...field}
                                  />
                                </FormControl>
                                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70 mt-1">
                                  Final price negotiated · 50% deposit required
                                </p>
                                <FormMessage className="text-primary/80 text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bringSpeakers"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">DJ-Supplied Speakers</FormLabel>
                                <FormControl>
                                  <label className="flex items-start gap-3 cursor-pointer group bg-background/50 border border-border rounded-none p-3 h-[42px] items-center">
                                    <input
                                      type="checkbox"
                                      checked={!!field.value}
                                      onChange={(e) => field.onChange(e.target.checked)}
                                      className="h-4 w-4 accent-primary cursor-pointer shrink-0"
                                    />
                                    <span className="text-xs text-foreground/90 group-hover:text-primary transition-colors">
                                      Yes — bring full speaker rig (+$150)
                                    </span>
                                  </label>
                                </FormControl>
                                <FormMessage className="text-primary/80 text-xs" />
                              </FormItem>
                            )}
                          />
                        </motion.div>

                        {showPricingNote && (
                          <motion.div
                            variants={revealVariants}
                            className="border border-primary/40 bg-primary/[0.04] p-5 space-y-2 text-sm font-light"
                          >
                            <div className="text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-2">Pricing Notes</div>
                            <p className="text-foreground/80">
                              Final price is negotiated directly with management once we review your request.
                              A 50% deposit is required to confirm the booking.
                            </p>
                            {isWeekend && (
                              <p className="text-primary/80">Weekend (Fri–Sun) date selected — premium pricing applies.</p>
                            )}
                            {bringSpeakers && (
                              <p className="text-primary/80">Speaker rig requested — additional fee included in final quote.</p>
                            )}
                            {isLastMinute && (
                              <p className="text-primary/80">
                                Last-minute booking (within 14 days) — May include additional costs and fees.
                              </p>
                            )}
                          </motion.div>
                        )}
                      </>
                    )}

                    <motion.div variants={revealVariants} className="space-y-1 pt-2">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70">Venue</p>
                      <div className="h-px w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
                    </motion.div>

                    <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Houston" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Country *</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Venue Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. The Rooftop, Club Nocturne" className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="venueDirections"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Address & Directions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Full street address, entrance instructions, load-in notes..."
                                className="bg-background/50 border-border rounded-none min-h-[90px] focus-visible:ring-primary focus-visible:border-primary resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {isDj && (
                      <>
                        <motion.div variants={revealVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <SelectItem value="Under $1k">Under $1k</SelectItem>
                                    <SelectItem value="$1k-$5k">$1k-$5k</SelectItem>
                                    <SelectItem value="$5k-$10k">$5k-$10k</SelectItem>
                                    <SelectItem value="$10k+">$10k+</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-primary/80 text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="downPayment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">Down Payment</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. $200 deposit"
                                    className="bg-background/50 border-border rounded-none focus-visible:ring-primary focus-visible:border-primary"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-primary/80 text-xs" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </>
                    )}

                    <motion.div variants={revealVariants}>
                      <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-foreground/80">
                              {isDj ? "Additional Details" : "Tell us about your event"}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  isDj
                                    ? "Tell us more about the vision for the event..."
                                    : "What's the event? What are you hoping the artist will do? Any references, songs, vibes..."
                                }
                                className="bg-background/50 border-border rounded-none min-h-[120px] focus-visible:ring-primary focus-visible:border-primary resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-primary/80 text-xs" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {isDj && (
                      <>
                        <motion.div variants={revealVariants} className="space-y-1 pt-2">
                          <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70">The Waiver</p>
                          <div className="h-px w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
                        </motion.div>

                        <motion.div variants={revealVariants}>
                          <FormField
                            control={form.control}
                            name="waiverAccepted"
                            render={({ field }) => (
                              <FormItem className="border border-primary/30 bg-primary/[0.03] p-5 md:p-6 space-y-4">
                                <div className="space-y-3 text-xs md:text-sm leading-relaxed text-foreground/80 font-light">
                                  <p className="uppercase tracking-[0.2em] text-primary text-[11px] font-medium">Booking terms & release</p>
                                  <p>
                                    <span className="text-primary/90">1. Equipment liability —</span> The client assumes full financial responsibility for any Association World DJ equipment that is damaged by water, spills, mishandling, or other damage while at the client's venue, and agrees to pay the full cost of repair or replacement.
                                  </p>
                                  <p>
                                    <span className="text-primary/90">2. Performance injury release —</span> The client releases Association World, its DJs, and artists from liability for any injuries sustained by performing artists at the client's venue or in the course of performance, and agrees to maintain a safe performance environment.
                                  </p>
                                </div>
                                <FormControl>
                                  <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-primary/20">
                                    <input
                                      type="checkbox"
                                      checked={!!field.value}
                                      onChange={(e) => field.onChange(e.target.checked)}
                                      className="mt-1 h-4 w-4 accent-primary cursor-pointer shrink-0"
                                    />
                                    <span className="text-xs md:text-sm text-foreground/90 group-hover:text-primary transition-colors">
                                      I have read and agree to the equipment liability and injury release terms above. *
                                    </span>
                                  </label>
                                </FormControl>
                                <FormMessage className="text-primary/80 text-xs" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </>
                    )}

                    {!isDj && (
                      <motion.div
                        variants={revealVariants}
                        className="border border-primary/30 bg-primary/[0.03] p-5 text-xs md:text-sm leading-relaxed text-foreground/80 font-light"
                      >
                        <p className="uppercase tracking-[0.2em] text-primary text-[11px] font-medium mb-2">How this works</p>
                        <p>
                          Live artist bookings are handled personally — no public rate card. Send your inquiry below and management will call or email you with what we can do for your event.
                        </p>
                      </motion.div>
                    )}

                    <motion.div variants={revealVariants} className="pt-4">
                      <Button
                        type="submit"
                        disabled={submitBooking.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.2em] py-8 text-sm rounded-none shadow-[0_0_20px_rgba(201,169,97,0.2)] hover:shadow-[0_0_30px_rgba(201,169,97,0.4)] transition-all"
                      >
                        {submitBooking.isPending
                          ? "Transmitting..."
                          : isDj
                          ? "Submit Booking Request"
                          : "Send Inquiry"}
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
