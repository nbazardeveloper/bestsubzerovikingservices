import { useEffect, useRef, useState } from "react";

interface Props {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Decorative, non-interactive (pointer-events-none, no controls) looping
 * background video played via a YouTube embed. Mounting the iframe eagerly
 * pulls in YouTube's full player bundle plus a large batch of third-party
 * (ads/doubleclick) requests and cookies on every page load, even though
 * this section sits well below the fold — a major, unnecessary hit to
 * Lighthouse performance and the third-party-cookie audit.
 *
 * Instead we only mount the iframe once the container is about to enter the
 * viewport (IntersectionObserver, generous rootMargin so it's ready before
 * the user scrolls to it), so the cost is deferred instead of paid upfront.
 */
export function LazyYouTubeBackground({ videoId, title, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&disablekb=1`}
          title={title}
          allow="autoplay; encrypted-media"
          frameBorder={0}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" aria-hidden />
      )}
    </div>
  );
}
