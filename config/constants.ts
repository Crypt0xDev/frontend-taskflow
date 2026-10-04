export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY;
export const SESSION_FLAG_COOKIE = process.env.NEXT_PUBLIC_SESSION_FLAG_COOKIE;
export const REQUEST_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT_MS);
export const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE);
export const SESSION_MAX_AGE_MINUTES = Number(process.env.NEXT_PUBLIC_SESSION_MAX_AGE_MINUTES);
export const MAIL_FROM = process.env.NEXT_PUBLIC_MAIL_FROM;

export const SOCIAL_LINKS = {
  github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
  x: process.env.NEXT_PUBLIC_SOCIAL_X,
} as const;

export const LEGAL = {
  owner: process.env.NEXT_PUBLIC_LEGAL_OWNER,
  company: process.env.NEXT_PUBLIC_LEGAL_COMPANY,
  contactEmail: process.env.NEXT_PUBLIC_LEGAL_CONTACT_EMAIL,
  country: "Perú",
  anpdRegistration: process.env.NEXT_PUBLIC_LEGAL_ANPD_REGISTRATION,
  lastUpdated: "3 de octubre de 2026",
} as const;

export const AVATARS = ["🐱", "🦊", "🐼", "🐧", "🦁", "🐸", "🐵", "🦉", "🐨", "🐯"];
