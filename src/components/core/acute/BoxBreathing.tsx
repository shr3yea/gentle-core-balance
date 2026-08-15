import { useEffect, useRef, useState } from "react";

const PHASES = [
  { label: "Breathe in", scale: 1 },
  { label: "Hold", scale: 1 },
  { label: "Breathe out", scale: 0.55 },
  { label: "Hold", scale: 0.55 },
] as const;

/** 4-4-4-4 box breathing. Fully offline, no writes. */
export function BoxBreathing() {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setPhase((p) => (p + 1) % 4);
        return 4;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const current = PHASES[phase]!;

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="flex size-64 items-center justify-center rounded-full border border-border">
        <div
          className="flex size-56 items-center justify-center rounded-full bg-primary/25 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${current.scale})` }}
        >
          <span className="text-5xl font-semibold text-foreground">{count}</span>
        </div>
      </div>
      <p className="text-2xl font-medium">{current.label}</p>
      <p className="text-base text-muted-foreground">Follow the circle. In 4, hold 4, out 4, hold 4.</p>
    </div>
  );
}
