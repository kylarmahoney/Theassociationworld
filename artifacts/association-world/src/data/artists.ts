export type Artist = {
  id: number;
  name: string;
  discipline: string;
  bio: string;
  photo: string;
  slug: string;
};

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const roster: Omit<Artist, "slug">[] = [
  { id: 1, name: "KISSEZ", discipline: "Rap / Hip-Hop / R&B", bio: "Rap, hip-hop and R&B with a velvet edge — confident pen, melodic delivery, and a presence built for the stage.", photo: "/artists/kissez.jpeg" },
];

export const artists: Artist[] = roster.map((a) => ({ ...a, slug: toSlug(a.name) }));

export const findArtistBySlug = (slug: string) => artists.find((a) => a.slug === slug);
