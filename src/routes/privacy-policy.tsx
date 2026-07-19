import { createFileRoute } from "@tanstack/react-router";
import { absUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Best Sub-Zero & Viking Service NY & NJ" },
      {
        name: "description",
        content:
          "How Best Sub-Zero & Viking Service collects, uses and protects information submitted through this website when you request an appliance repair estimate.",
      },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "Our privacy policy." },
      { property: "og:url", content: absUrl("/privacy-policy") },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absUrl("/privacy-policy") }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}.
      </p>

      <div className="prose prose-neutral mt-10 max-w-none text-foreground">
        <h2>Information we collect</h2>
        <p>
          When you submit a service request through this website, we collect the information you
          provide — typically your name, phone number, email address (optional), service area and a
          description of your appliance issue. We may also automatically collect basic technical
          data such as your browser type and pages visited.
        </p>

        <h2>How we use your information</h2>
        <p>
          We use the information you provide solely to respond to your service request, schedule a
          diagnostic or repair, and communicate about the work being performed. We do not sell your
          information.
        </p>

        <h2>Communication</h2>
        <p>
          By submitting a request, you agree that we may contact you by phone, text message or email
          regarding your service inquiry. You can ask us to stop contacting you at any time.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep service records for as long as needed to provide our services, comply with legal
          obligations and resolve disputes. You may request deletion of your data by contacting us.
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable steps to protect the information submitted through this website. No
          online submission system is fully secure, but we work to prevent unauthorized access.
        </p>

        <h2>Third parties</h2>
        <p>
          We rely on trusted service providers to operate this website (for example, our hosting and
          database providers). These providers process data on our behalf.
        </p>

        <h2>Your choices</h2>
        <p>
          You may contact us at any time to review, correct or delete information you've submitted,
          or to opt out of further communications.
        </p>

        <h2>Contact</h2>
        <p>
          Best Sub-Zero &amp; Viking Service — +1 (888) 702-8565 —
          info@bestsubzerovikingservices.com.
        </p>
      </div>
    </div>
  );
}
