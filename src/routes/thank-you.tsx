import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOOGLE_ADS_ID = "AW-429679538";
const GOOGLE_ADS_CONVERSION = `${GOOGLE_ADS_ID}/4XDUCLyameMcELLH8cwB`;
const CONVERSION_SENT_KEY = "booking-conversion-sent";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// The ProsBuddy scheduler redirects here after a completed booking. gtag.js is
// loaded directly rather than through the deferred GTM loader in __root.tsx so
// the conversion still fires if the visitor closes the page right away.
function sendBookingConversion() {
  // A refresh of this page isn't a new booking. Storage can throw when blocked,
  // in which case the conversion is still worth sending.
  try {
    if (sessionStorage.getItem(CONVERSION_SENT_KEY)) return;
    sessionStorage.setItem(CONVERSION_SENT_KEY, "1");
  } catch {
    // Ignored — see above.
  }

  window.dataLayer = window.dataLayer || [];
  // gtag.js only recognizes the `arguments` object, not a plain array.
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", GOOGLE_ADS_ID);
  gtag("event", "conversion", { send_to: GOOGLE_ADS_CONVERSION });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(script);
}

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You | Best Sub-Zero & Viking Service" },
      { name: "description", content: "Your service appointment request has been received." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  useEffect(() => {
    sendBookingConversion();
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center md:px-8">
      <CheckCircle2 className="mx-auto h-12 w-12 text-accent" aria-hidden />
      <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
        Thank <span className="text-accent">you</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        We've received your service appointment request. Our team will contact you to confirm the
        details.
      </p>
      <Link to="/" className="mt-8 inline-flex">
        <Button size="lg">Back to home</Button>
      </Link>
    </section>
  );
}
