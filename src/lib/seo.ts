// SEO helpers shared across route `head()` functions.
// Keeps generated <title> in the 50–60 char range and <meta name="description">
// in the 150–160 char range, per project SEO standards, even for dynamic
// (DB-driven) content such as individual service pages.

const SITE_NAME = "Best Sub-Zero & Viking Service";

const TITLE_SUFFIXES = [
  ` | Sub-Zero & Viking Repair Experts in NY & NJ`,
  ` | Sub-Zero & Viking Repair Experts`,
  ` | ${SITE_NAME}`,
  ` | NY & NJ Appliance Repair`,
  ` | NY & NJ Repair`,
  ` | NY & NJ`,
];

/**
 * Builds a page <title> from a base string, appending a brand/location
 * suffix chosen so the final title lands within 50–60 characters.
 * Falls back to the shortest suffix (or the bare base) if nothing fits.
 */
export function buildTitle(base: string): string {
  for (const suffix of TITLE_SUFFIXES) {
    const total = base.length + suffix.length;
    if (total >= 50 && total <= 60) return base + suffix;
  }
  // Nothing landed in range (very short or very long base) — best effort.
  const withShortest = base + TITLE_SUFFIXES[TITLE_SUFFIXES.length - 1];
  return withShortest.length <= 60 ? withShortest : base.slice(0, 60);
}

/**
 * Builds a <meta name="description"> from a short summary + a longer body,
 * truncated at a word boundary so the result lands within 150–160 chars.
 */
export function buildMetaDescription(short: string, long: string, max = 160, min = 150): string {
  const combined = long ? `${short} ${long}` : short;
  if (combined.length <= max) return combined;

  let truncated = combined.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace >= min - 1) truncated = truncated.slice(0, lastSpace);
  truncated = truncated.replace(/[,;:.\-–—\s]+$/, "");
  return `${truncated}…`;
}
