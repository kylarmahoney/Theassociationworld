export type Artist = {
  id: number;
  name: string;
  discipline: string;
  bio: string;
  photo: string;
  photos: string[];
  slug: string;
};

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type RosterEntry = Omit<Artist, "slug" | "photo"> & { photo?: string };

const roster: RosterEntry[] = [
  {
    id: 1,
    name: "KISSEZ",
    discipline: "Rap / Hip-Hop / R&B",
    bio: "Rap, hip-hop and R&B with a velvet edge — confident pen, melodic delivery, and a presence built for the stage.",
    photos: ["/artists/kissez-1.jpeg", "/artists/kissez-2.jpeg"],
  },
  {
    id: 2,
    name: "SKE",
    discipline: "Rap / Hip-Hop / R&B",
    bio: "Rap, hip-hop and R&B with a sharp, understated cool — measured delivery, lyrical patience, and a presence that holds the room.",
    photos: ["/artists/ske-1.jpeg", "/artists/ske-2.jpeg"],
  },
  {
    id: 3,
    name: "QUANYBOY",
    discipline: "Rap / Hip-Hop",
    bio: "Houston-bred rap and hip-hop with weight and swagger — heavy chains, heavier bars, and an unmistakable presence.",
    photos: ["/artists/quanyboy-1.jpeg", "/artists/quanyboy-2.jpeg"],
  },
  {
    id: 4,
    name: "YODATALIBAN",
    discipline: "Rap / Hip-Hop",
    bio: "Rap and hip-hop with a calm, calculated edge — streetwise storytelling, deliberate cadence, and a quiet command of the mic.",
    photos: ["/artists/yodataliban-1.jpeg", "/artists/yodataliban-2.jpeg"],
  },
];

export const artists: Artist[] = roster.map((a) => ({
  ...a,
  slug: toSlug(a.name),
  photo: a.photo ?? a.photos[0]!,
}));

export const findArtistBySlug = (slug: string) => artists.find((a) => a.slug === slug);
