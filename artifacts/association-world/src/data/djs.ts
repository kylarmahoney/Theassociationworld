export type DJ = {
  stageName: string;
  username: string;
  subtitle: string;
  image: string;
  instagram: string;
};

export const fallbackPortraits = ["/djs/dj1.png", "/djs/dj2.png", "/djs/dj3.png", "/djs/dj4.png", "/djs/dj5.png", "/djs/dj6.png"];

type RosterEntry = Omit<DJ, "image"> & { image?: string };

const roster: RosterEntry[] = [
  { stageName: "Cid Ray", username: "@djcidray", subtitle: "DJ", image: "/djs/djcidray.jpg", instagram: "https://instagram.com/djcidray" },
  { stageName: "DJ Zitro", username: "@djzitro_", subtitle: "DJ", image: "/djs/djzitro.jpg", instagram: "https://instagram.com/djzitro_" },
  { stageName: "DJ Nonstopp", username: "@djnonstopp", subtitle: "DJ", image: "/djs/djnonstopp.jpg", instagram: "https://instagram.com/djnonstopp" },
  { stageName: "DJ Kid Kreo", username: "@djkidkreo", subtitle: "DJ", image: "/djs/djkidkreo.jpg", instagram: "https://instagram.com/djkidkreo" },
  { stageName: "DJ NickyZ", username: "@infamousnickyz", subtitle: "DJ", image: "/djs/infamousnickyz.jpg", instagram: "https://instagram.com/infamousnickyz" },
  { stageName: "Go DJ Jemini", username: "@godjjemini", subtitle: "DJ", image: "/djs/godjjemini.jpg", instagram: "https://instagram.com/godjjemini" },
  { stageName: "DJ Jay", username: "@djjaytx", subtitle: "DJ", image: "/djs/djjaytx.jpg", instagram: "https://instagram.com/djjaytx" },
  { stageName: "Mad Sounds", username: "@djmadsounds", subtitle: "DJ", image: "/djs/djmadsounds.jpg", instagram: "https://instagram.com/djmadsounds" },
  { stageName: "StandMan409", username: "@djstandman409", subtitle: "DJ", image: "/djs/djstandman409.jpg", instagram: "https://instagram.com/djstandman409" },
  { stageName: "WKD", username: "@djwkd23", subtitle: "DJ", image: "/djs/djwkd23.jpg", instagram: "https://instagram.com/djwkd23" },
  { stageName: "RNZO DTX", username: "@djrnzodtx", subtitle: "DJ", instagram: "https://instagram.com/djrnzodtx" },
  { stageName: "Kevin Banks", username: "@kvnbnks", subtitle: "Artist / DJ", instagram: "https://instagram.com/kvnbnks" },
  { stageName: "Jacob Andrew", username: "@_jacobandrew", subtitle: "Artist / Producer", instagram: "https://instagram.com/_jacobandrew" },
  { stageName: "DJ ANARCHY", username: "@djanarchyrmx", subtitle: "Open Format DJ", instagram: "https://instagram.com/djanarchyrmx" },
  { stageName: "Tony Bangz", username: "@djtonybangz", subtitle: "Resident DJ", instagram: "https://instagram.com/djtonybangz" },
  { stageName: "DJ Ex", username: "@iamdjex", subtitle: "Producer / DJ / Creative Director", image: "/djs/iamdjex.jpg", instagram: "https://instagram.com/iamdjex" },
];

export const djs: DJ[] = roster.map((dj, i) => ({
  ...dj,
  image: dj.image ?? fallbackPortraits[i % fallbackPortraits.length],
}));

export function handleDjImgError(e: React.SyntheticEvent<HTMLImageElement>, index: number) {
  const img = e.currentTarget;
  if (!img.dataset.fallback) {
    img.dataset.fallback = "true";
    img.src = fallbackPortraits[index % fallbackPortraits.length];
  }
}
