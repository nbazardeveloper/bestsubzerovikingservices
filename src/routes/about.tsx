import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

const PROCESS = [
  {
    step: "01",
    title: "Diagnose",
    body: "We inspect the appliance and identify the actual cause — not the symptom.",
  },
  {
    step: "02",
    title: "Explain",
    body: "We walk you through what's wrong in plain language, so you can decide with confidence.",
  },
  {
    step: "03",
    title: "Transparent estimate",
    body: "We quote the repair up-front. The $95 diagnostic fee is waived when you proceed.",
  },
  {
    step: "04",
    title: "Repair",
    body: "We complete the repair using OEM or manufacturer-approved parts whenever available.",
  },
];

const VALUES = [
  "Focus on premium brands and craftsmanship, not high volume.",
  "Honest recommendations — including when repair isn't worth it.",
  "Transparent pricing with no hidden fees.",
  "Care for the appliance, the kitchen and the customer.",
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | 13 Years of Premium Appliance Repair in NY & NJ" },
      {
        name: "description",
        content:
          "Founded to give homeowners honest, professional, long-lasting repair for premium kitchen appliances. 13 years of accurate diagnostics and transparent pricing.",
      },
      { property: "og:title", content: "About Best Sub-Zero & Viking Service" },
      {
        property: "og:description",
        content: "13 years of premium appliance repair across NY & NJ.",
      },
      { property: "og:url", content: absUrl("/about") },
    ],
    links: [{ rel: "canonical", href: absUrl("/about") }],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              About us
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Premium appliance repair, done <span className="text-accent">honestly</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Founded to give homeowners honest, professional, long-lasting repair for premium
              kitchen appliances — focused primarily on Sub-Zero, Viking and Wolf while also
              servicing other high-end residential brands.
            </p>
            <p className="mt-4 max-w-xl text-muted-foreground">
              13 years of accurate diagnostics, transparent communication and quality workmanship —
              helping customers avoid unnecessary replacements.
            </p>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              We are an independent service company — not the manufacturer, an authorized dealer, or
              a factory-affiliated service center for Sub-Zero, Viking or Wolf.
            </p>
          </div>
          <ImagePlaceholder
            aspect="video"
            label="Premium kitchen appliances"
            src="/images/hero5.webp"
            alt="Built-in Sub-Zero wine cooler and refrigerator in a premium kitchen"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Our <span className="text-accent">process</span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A clear, predictable path from first call to a working appliance.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.step} className="rounded-lg border border-border bg-card p-6">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Step {p.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-8">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Our <span className="text-accent">values</span>
          </h2>
          <ul className="mt-8 grid gap-3">
            {VALUES.map((v) => (
              <li key={v} className="flex items-start gap-3 text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" aria-hidden />
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link to="/contact" className="text-accent hover:underline">
              Schedule a diagnostic →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
