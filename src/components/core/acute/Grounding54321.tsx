import { useState } from "react";

import { Button } from "@/components/ui/button";

const STEPS = [
  {
    count: 5,
    sense: "things you can see",
    hint: "Look around slowly. Name them out loud if you can.",
  },
  { count: 4, sense: "things you can feel", hint: "Fabric, floor, temperature, your own hands." },
  { count: 3, sense: "things you can hear", hint: "Near sounds, far sounds, your own breath." },
  { count: 2, sense: "things you can smell", hint: "Air, coffee, soap, anything at all." },
  { count: 1, sense: "thing you can taste", hint: "Whatever is already in your mouth counts." },
] as const;

/** 5-4-3-2-1 grounding. One prompt per screen, tap to advance. Offline, no persistence. */
export function Grounding54321({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const done = index >= STEPS.length;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-8 py-12 text-center">
        <p className="text-2xl font-medium">You're here.</p>
        <p className="max-w-sm text-base text-muted-foreground">
          Nothing about this was recorded. You can run it again any time.
        </p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button className="h-14 text-base" onClick={() => setIndex(0)}>
            Again
          </Button>
          <Button variant="secondary" className="h-14 text-base" onClick={onFinish}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  const step = STEPS[index]!;

  return (
    <button
      type="button"
      aria-label={`${step.count} ${step.sense}. ${step.hint} Activate to continue.`}
      onClick={() => setIndex((i) => i + 1)}
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 rounded-3xl bg-card px-6 py-14 text-center"
    >
      <span className="text-7xl font-semibold text-primary">{step.count}</span>
      <span className="text-2xl font-medium">{step.sense}</span>
      <span className="max-w-xs text-base text-muted-foreground">{step.hint}</span>
      <span className="mt-6 text-sm text-muted-foreground">Tap anywhere to continue</span>
    </button>
  );
}
