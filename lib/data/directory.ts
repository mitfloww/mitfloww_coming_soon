/**
 * Sample content for the Assets Store and Find a Freelancer previews.
 * These are illustrative listings, not real products or people; the pages say so.
 * Translatable text (descriptions, roles, skills) lives in lib/i18n/messages.
 */

export type AssetCategory = "Templates" | "Brand kits" | "Illustrations" | "Motion" | "UI kits" | "Photography";
export type Specialty = "Design" | "Video" | "Development" | "Illustration" | "Photography";

export interface Creator {
  name: string;
  initials: string;
  hue: number;
}

export interface Asset {
  slug: string;
  title: string;
  category: AssetCategory;
  creator: Creator;
  formats: string[];
  thumb: string;
}

const meera: Creator = { name: "Meera Nair", initials: "MN", hue: 24 };
const kalam: Creator = { name: "Studio Kalam", initials: "SK", hue: 150 };
const arjun: Creator = { name: "Arjun Menon", initials: "AM", hue: 265 };
const farah: Creator = { name: "Farah Siddiqui", initials: "FS", hue: 330 };
const kiran: Creator = { name: "Kiran Das", initials: "KD", hue: 40 };
const leela: Creator = { name: "Leela Thomas", initials: "LT", hue: 120 };

export const ASSET_CATEGORIES: AssetCategory[] = ["Templates", "Brand kits", "Illustrations", "Motion", "UI kits", "Photography"];

export const ASSETS: Asset[] = [
  { slug: "monoline-brand-kit", title: "Monoline Brand Kit", category: "Brand kits", creator: meera, formats: ["AI", "PDF"], thumb: "brandkit" },
  { slug: "invoice-quote-templates", title: "Invoice & Quote Templates", category: "Templates", creator: kalam, formats: ["FIG", "PDF"], thumb: "invoice" },
  { slug: "lower-thirds-pack", title: "Lower Thirds Pack", category: "Motion", creator: arjun, formats: ["AEP", "MOV"], thumb: "motion" },
  { slug: "line-icon-set", title: "Line Icon Set", category: "UI kits", creator: farah, formats: ["SVG", "FIG"], thumb: "icons" },
  { slug: "natural-light-portraits", title: "Natural Light Portraits", category: "Photography", creator: kiran, formats: ["JPG"], thumb: "photo" },
  { slug: "proposal-deck", title: "Proposal Deck Template", category: "Templates", creator: kalam, formats: ["KEY", "PPTX"], thumb: "deck" },
  { slug: "hand-drawn-botanicals", title: "Hand-drawn Botanicals", category: "Illustrations", creator: leela, formats: ["PNG", "SVG"], thumb: "botanical" },
  { slug: "story-templates", title: "Story Templates", category: "Templates", creator: meera, formats: ["FIG", "PSD"], thumb: "story" },
  { slug: "dashboard-ui-kit", title: "Dashboard UI Kit", category: "UI kits", creator: farah, formats: ["FIG"], thumb: "ui" },
  { slug: "transitions-toolkit", title: "Transitions Toolkit", category: "Motion", creator: arjun, formats: ["PRPROJ"], thumb: "transitions" },
  { slug: "monsoon-textures", title: "Monsoon Textures", category: "Photography", creator: kiran, formats: ["JPG"], thumb: "texture" },
  { slug: "packaging-mockups", title: "Packaging Mockups", category: "Brand kits", creator: leela, formats: ["PSD"], thumb: "mockup" },
];

export interface Person {
  slug: "meera-nair" | "arjun-menon" | "farah-siddiqui" | "kiran-das" | "leela-thomas" | "rohan-kulkarni" | "ananya-raj" | "studio-kalam";
  name: string;
  initials: string;
  hue: number;
  specialty: Specialty;
  city: string;
  state: string;
  remote: boolean;
  thumbs: string[];
}

export const SPECIALTIES: Specialty[] = ["Design", "Video", "Development", "Illustration", "Photography"];

export const PEOPLE: Person[] = [
  { slug: "meera-nair", name: "Meera Nair", initials: "MN", hue: 24, specialty: "Design", city: "Kochi", state: "Kerala", remote: true, thumbs: ["brandkit", "brand", "word"] },
  { slug: "arjun-menon", name: "Arjun Menon", initials: "AM", hue: 265, specialty: "Video", city: "Bengaluru", state: "Karnataka", remote: true, thumbs: ["motion", "film", "transitions"] },
  { slug: "farah-siddiqui", name: "Farah Siddiqui", initials: "FS", hue: 330, specialty: "Design", city: "Hyderabad", state: "Telangana", remote: true, thumbs: ["ui", "icons", "guide"] },
  { slug: "kiran-das", name: "Kiran Das", initials: "KD", hue: 40, specialty: "Photography", city: "Kozhikode", state: "Kerala", remote: false, thumbs: ["photo", "texture", "film"] },
  { slug: "leela-thomas", name: "Leela Thomas", initials: "LT", hue: 120, specialty: "Illustration", city: "Thiruvananthapuram", state: "Kerala", remote: true, thumbs: ["botanical", "mockup", "story"] },
  { slug: "rohan-kulkarni", name: "Rohan Kulkarni", initials: "RK", hue: 200, specialty: "Development", city: "Pune", state: "Maharashtra", remote: true, thumbs: ["ui", "deck", "icons"] },
  { slug: "ananya-raj", name: "Ananya Raj", initials: "AR", hue: 300, specialty: "Video", city: "Chennai", state: "Tamil Nadu", remote: true, thumbs: ["story", "social", "motion"] },
  { slug: "studio-kalam", name: "Studio Kalam", initials: "SK", hue: 150, specialty: "Design", city: "Mumbai", state: "Maharashtra", remote: true, thumbs: ["deck", "invoice", "guide"] },
];

/** Cities offered in the location filter, sorted like the original page. */
export const CITIES: { city: string; state: string }[] = Array.from(
  new Map(PEOPLE.map((p) => [`${p.city}|${p.state}`, { city: p.city, state: p.state }])).values(),
).sort((a, b) => (a.city + a.state).localeCompare(b.city + b.state));
