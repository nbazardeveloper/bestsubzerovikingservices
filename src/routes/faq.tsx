import { createFileRoute } from "@tanstack/react-router";
import { absUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FinalCta } from "@/components/site/FinalCta";

const FAQ = [
  {
    q: "Do you offer same-day service?",
    a: "Same-day service depends on technician availability that day.",
  },
  {
    q: "How much is the diagnostic fee?",
    a: "The diagnostic fee is $95 ($125 in Manhattan), and it's waived when you complete the repair with us.",
  },
  {
    q: "Do you use OEM parts?",
    a: "We use OEM or manufacturer-approved parts whenever available.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Warranty depends on the specific repair and the parts installed.",
  },
  {
    q: "Which brands do you service?",
    a: "We specialize in Sub-Zero, Viking and Wolf — across ranges, stoves, cooktops, ovens and refrigeration. We also service other premium residential brands including Thermador, Bosch, Dacor, GE Monogram and Bertazzoni.",
  },
  {
    q: "Which appliances or brands do you NOT service?",
    a: "We do not service LG, Samsung or Liebherr refrigerators, and we do not repair dishwashers, washing machines or dryers. Our focus is premium residential kitchen appliances and high-end refrigeration.",
  },
  {
    q: "Do you install new appliances?",
    a: "No. We specialize in repair and maintenance only — we do not perform new appliance installations.",
  },
  {
    q: "Are you an authorized Sub-Zero, Viking or Wolf dealer?",
    a: "No. We are an independent service company specializing in the repair and maintenance of Sub-Zero, Viking and Wolf appliances. We are not the manufacturer, an authorized dealer, or a factory-affiliated service center for these brands.",
  },
  {
    q: "Where do you provide service?",
    a: "We serve Staten Island, Brooklyn, Queens, Long Island near Queens (Great Neck and nearby Nassau towns), Jersey City, Elizabeth, and North & Central New Jersey.",
  },
  {
    q: "Do you service commercial appliances?",
    a: "We service residential appliances only, not commercial.",
  },
  {
    q: "What should I have ready when I schedule?",
    a: "Please have your appliance's model number, serial number and a brief description of the problem ready before scheduling.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Appliance Repair Questions Answered | NY & NJ Service" },
      {
        name: "description",
        content:
          "Answers about diagnostic fees, same-day service, warranties, OEM parts, brands we service and coverage areas for premium residential appliance repair.",
      },
      { property: "og:title", content: "Frequently Asked Questions" },
      { property: "og:description", content: "Answers to common appliance-repair questions." },
      { property: "og:url", content: absUrl("/faq") },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absUrl("/faq") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Frequently asked <span className="text-accent">questions</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Everything you may want to know before scheduling a repair.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <FinalCta />
    </div>
  );
}
