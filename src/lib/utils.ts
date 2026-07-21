import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared slug generator for admin forms (projects, services, ...) whose
// `slug` column is NOT NULL + UNIQUE in Supabase. Left blank (or duplicated
// across two rows), a save fails with a raw Postgres "duplicate key value
// violates unique constraint ..._slug_key" error — auto-deriving it from the
// title keeps the field populated by default so that error is much harder to
// hit by accident.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
