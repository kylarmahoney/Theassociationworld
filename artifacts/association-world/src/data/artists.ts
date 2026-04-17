export type Artist = {
  id: number;
  name: string;
  discipline: string;
  bio: string;
  photo: string;
};

export const artists: Artist[] = [
  { id: 1, name: "VEIL", discipline: "Vocalist / Songwriter", bio: "A voice carved from smoke. Anonymous by design.", photo: "/djs/dj1.png" },
  { id: 2, name: "OBSIDIAN HAND", discipline: "Producer / Composer", bio: "Architect of low-end cathedrals and orchestral decay.", photo: "/djs/dj2.png" },
  { id: 3, name: "SISTER NOIR", discipline: "Live Performer", bio: "Cello and tape loops in candlelit basements.", photo: "/djs/dj3.png" },
  { id: 4, name: "THE SCRIBE", discipline: "Lyricist / Spoken Word", bio: "Words for those who refuse to speak first.", photo: "/djs/dj4.png" },
  { id: 5, name: "PALE ENGINE", discipline: "Multi-Instrumentalist", bio: "Analog synths, modular rituals, broken machines.", photo: "/djs/dj5.png" },
  { id: 6, name: "HOLY GHOST CHOIR", discipline: "Vocal Ensemble", bio: "Three voices. One breath. Unlisted recordings only.", photo: "/djs/dj6.png" },
];
