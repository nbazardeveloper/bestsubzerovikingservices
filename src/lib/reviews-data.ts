import type { Testimonial } from "@/components/site/TestimonialCarousel";

// Real Google reviews (client-provided, verbatim aside from minor brand-name
// capitalization for consistency with the rest of the site). Shared between
// the homepage testimonial carousel and the dedicated /reviews page so both
// stay in sync.
export const SITE_REVIEWS: Testimonial[] = [
  {
    quote:
      "Ben was incredibly helpful in my time of need. I had a high pitched noise coming from my Sub-Zero fridge and he was able to isolate the issue and get it resolved within the day. He was extremely professional and knowledgeable. He took the time to explain things and made sure everything was perfect as he wrapped up. Highly recommend.",
    author: "Jessica Laurella",
    meta: "8 reviews · 2 photos",
    time: "a month ago",
    service: "Refrigerator/freezer repair, stove, cooktop & oven repair",
  },
  {
    quote:
      "Fast, skilled and reasonably priced! Ben and his assistant repaired my 13-year-old Wolf range without requiring a bunch of new parts or up-charging me for every little thing. After having several bad experiences with other repair people and seeing the difference, I won't ever call anyone other than Ben.",
    author: "Ayla Yavin",
    meta: "5 reviews",
    time: "4 months ago",
    service: "Oven repair",
  },
  {
    quote:
      "Ben from Viking Sub-Zero is the best repair! He will contact you to let you know when he is coming. He is extremely knowledgeable, neat and polite. He is the best and we have used him for years.",
    author: "Jill Miller",
    meta: "6 reviews",
    time: "a month ago",
  },
  {
    quote:
      "Ben was extremely knowledgeable and knew what to do right away for servicing our Sub-Zero refrigerator. He had the part ready to be replaced the same day. Highly recommend!",
    author: "Saddia Patton",
    meta: "Local Guide · 23 reviews · 15 photos",
    time: "6 months ago",
    service: "Refrigerator/freezer repair",
  },
];
