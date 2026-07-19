import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { MessageCircle, X, Send, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/site.functions";

// Same booking widget used on /contact — reused here so a chat visitor can
// go straight from "I have a question" to "I picked a time" without leaving
// the conversation.
const BOOKING_URL = "https://api.prosbuddy.com/widget/bookings/now-schedule-service";

type Step = "name" | "phone" | "message" | "submitting" | "scheduler";

type ChatMessage = {
  from: "bot" | "user";
  text: string;
};

// A lightweight "chat-style" lead form: it feels like a conversation (bot
// asks one thing at a time, replies appear as bubbles) but every answer
// flows into the exact same submitLead() call — and therefore the same
// `leads` table in Supabase — that the full Contact page form already
// uses. No new vendor, no separate inbox to check. The last step embeds
// the same ProsBuddy scheduler iframe as /contact so visitors can book a
// time themselves before the conversation even ends.
export function ChatWidget() {
  const submit = useServerFn(submitLead);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("name");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hi! 👋 I can help you get a quote or book a repair. What's your name?" },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  function say(text: string) {
    setMessages((m) => [...m, { from: "bot", text }]);
  }

  function reply(text: string) {
    setMessages((m) => [...m, { from: "user", text }]);
  }

  function handleName(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setName(value);
    reply(value);
    setInput("");
    say(`Thanks, ${value}! What's the best phone number to reach you?`);
    setStep("phone");
  }

  function handlePhone(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (value.length < 5) {
      toast.error("Please add a valid phone number");
      return;
    }
    setPhone(value);
    reply(value);
    setInput("");
    say(
      "Got it. In a sentence or two, what's going on with your appliance? Brand and model help, if you know them.",
    );
    setStep("message");
  }

  async function finish(message: string) {
    setStep("submitting");
    try {
      await submit({
        data: {
          name,
          phone,
          message: message || undefined,
          source_page: "chat-widget",
        },
      });
      say(
        "Thanks — a technician will follow up shortly. Want to lock in a time right now? Pick a slot below, or we'll call you.",
      );
      setStep("scheduler");
    } catch (err) {
      say("Sorry, something went wrong sending that. Please call or text us directly instead.");
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setStep("scheduler");
    }
  }

  function handleMessage(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    reply(value || "(skipped)");
    setInput("");
    finish(value);
  }

  function skipMessage() {
    reply("(skipped)");
    finish("");
  }

  function reset() {
    setMessages([
      {
        from: "bot",
        text: "Hi! 👋 I can help you get a quote or book a repair. What's your name?",
      },
    ]);
    setInput("");
    setName("");
    setPhone("");
    setStep("name");
  }

  return (
    <>
      {/* Launcher — sits above the mobile fixed "Request Service" bar
          (which is full-width at the very bottom on small screens), and
          in the standard bottom-right corner on desktop. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="fixed inset-x-3 bottom-[9.5rem] z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-96 md:bottom-[5.5rem]">
          <div className="flex items-center justify-between gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="text-sm font-semibold">Best Sub-Zero &amp; Viking Service</p>
              <p className="text-xs text-primary-foreground/70">
                Usually replies within a few hours
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "bot"
                    ? "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground"
                    : "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-sm text-accent-foreground"
                }
              >
                {m.text}
              </div>
            ))}

            {step === "scheduler" ? (
              <div className="space-y-2 pt-1">
                <div className="overflow-hidden rounded-lg border border-border">
                  <iframe
                    title="Book a service appointment online"
                    src={BOOKING_URL}
                    width="100%"
                    height="360"
                    className="border-0"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                  >
                    <CalendarClock className="h-3.5 w-3.5" /> Open scheduler in a new tab
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Start over
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {step === "name" || step === "phone" ? (
            <form
              onSubmit={step === "name" ? handleName : handlePhone}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <Input
                autoFocus
                type={step === "phone" ? "tel" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={step === "name" ? "Your name…" : "Your phone number…"}
                className="h-10"
              />
              <Button type="submit" size="icon" aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          ) : null}

          {step === "message" ? (
            <form
              onSubmit={handleMessage}
              className="flex items-end gap-2 border-t border-border p-3"
            >
              <Textarea
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Brand, model, and the issue…"
                rows={2}
                className="min-h-0 flex-1 resize-none"
              />
              <div className="flex flex-col gap-1.5">
                <Button type="submit" size="icon" aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
                <button
                  type="button"
                  onClick={skipMessage}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Skip
                </button>
              </div>
            </form>
          ) : null}

          {step === "submitting" ? (
            <div className="border-t border-border p-3 text-center text-xs text-muted-foreground">
              Sending…
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
