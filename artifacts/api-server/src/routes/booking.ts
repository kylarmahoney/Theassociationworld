import { Router, type IRouter } from "express";
import { SubmitBookingBody, SubmitBookingResponse } from "@workspace/api-zod";
import { sendEmail } from "../lib/email";
import { renderEmail, type EmailSection } from "../lib/emailTemplate";

const router: IRouter = Router();

router.post("/booking", async (req, res) => {
  const parsed = SubmitBookingBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    duration,
    city,
    country,
    venueName,
    venueDirections,
    talentType,
    artist,
    hours,
    bringSpeakers,
    budget,
    downPayment,
    details,
    waiverAccepted,
  } = parsed.data;

  const isDj = talentType === "DJ";

  if (isDj && !waiverAccepted) {
    return res.status(400).json({ error: "Waiver must be accepted" });
  }

  if (isDj && (!hours || hours.trim().length === 0)) {
    return res.status(400).json({ error: "Hours are required for DJ bookings" });
  }

  const waiverText = `By submitting this booking, the client acknowledges and agrees to the following: (1) Equipment liability — the client assumes full financial responsibility for any Association World DJ equipment that is damaged by water, spills, mishandling, or other damage while at the client's venue, and will pay the full cost of repair or replacement. (2) Performance injury release — the client releases Association World, its DJs, and artists from liability for any injuries sustained by performing artists at the client's venue or in the course of performance, and the client agrees to maintain a safe performance environment.`;

  const subjectTag = isDj ? "Booking" : "Artist Inquiry";
  const eyebrow = isDj ? "New Booking Request" : "New Artist Inquiry";
  const title = isDj
    ? `${artist} — ${eventType}`
    : `${artist} — ${eventType}`;
  const intro = isDj
    ? `A booking request has been submitted through theassociationworld.com. Review the details below and reply directly to the client to confirm pricing, deposit, and availability.`
    : `An artist inquiry has been submitted through theassociationworld.com. Pricing and availability are confirmed by call or email — reply to the client to continue the conversation.`;

  const sections: EmailSection[] = [
    {
      heading: "Client",
      fields: [
        { label: "Name", value: name, highlight: true },
        { label: "Email", value: email },
        { label: "Phone", value: phone },
      ],
    },
    {
      heading: "Talent",
      fields: [
        { label: "Type", value: talentType },
        { label: isDj ? "Requested DJ" : "Requested Artist", value: artist, highlight: true },
        ...(isDj
          ? [
              { label: "Hours Booked", value: hours },
              { label: "DJ-Supplied Speakers", value: bringSpeakers ? "Yes — extra fee applies" : "No" },
            ]
          : []),
      ],
    },
    {
      heading: "Event",
      fields: [
        { label: "Event Type", value: eventType },
        { label: "Date", value: eventDate, highlight: true },
        { label: "Duration", value: duration },
      ],
    },
    {
      heading: "Venue",
      fields: [
        { label: "City", value: city },
        { label: "Country", value: country },
        { label: "Venue Name", value: venueName },
        { label: "Directions / Notes", value: venueDirections, multiline: true },
      ],
    },
    ...(isDj
      ? [
          {
            heading: "Pricing",
            fields: [
              { label: "Budget", value: budget },
              { label: "Down Payment", value: downPayment },
            ],
            note: "Pricing negotiated per event. 50% deposit required to lock the date. Last-minute bookings may include additional fees.",
          } satisfies EmailSection,
        ]
      : []),
    ...(details
      ? [
          {
            heading: "Additional Details",
            body: details,
          } satisfies EmailSection,
        ]
      : []),
    isDj
      ? {
          heading: "Waiver",
          fields: [{ label: "Accepted", value: "Yes — agreed at submission", highlight: true }],
          note: waiverText,
        }
      : {
          heading: "Notes",
          note: "Live artist inquiry — pricing and availability to be confirmed by call or email.",
        },
  ];

  const html = renderEmail({
    preheader: `${subjectTag} — ${artist} for ${eventType} on ${eventDate}`,
    eyebrow,
    title,
    intro,
    badge: isDj ? "Booking Request" : "Artist Inquiry",
    sections,
    replyEmail: email,
  });

  const result = await sendEmail({
    subject: `[${subjectTag}] ${artist} — ${eventType} — ${name}`,
    html,
    replyTo: email,
  });

  if (!result.ok) {
    req.log.error({ err: result.error }, "Failed to send booking email");
    return res.status(500).json({ error: result.error ?? "Send failed" });
  }

  const data = SubmitBookingResponse.parse({ ok: true });
  return res.json(data);
});

export default router;
