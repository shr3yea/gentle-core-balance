import { useState } from "react";
import { Heart, LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * First-run disclaimer. Two deliberate taps — not a dismissible toast.
 */
export function Disclaimer({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="reflective flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md animate-rise">
        <div className="rounded-3xl bg-card p-8 shadow-paper">
          {step === 0 ? (
            <>
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-sage/40 text-foreground">
                <Heart className="size-5" />
              </span>
              <h1 className="mt-5 text-3xl leading-tight font-semibold">Core</h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                A place to steady yourself when things spike, and to think things through when
                they've settled.
              </p>
              <Button className="mt-8 h-12 w-full text-base" onClick={() => setStep(1)}>
                Continue
              </Button>
            </>
          ) : (
            <>
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent/60 text-accent-foreground">
                <LifeBuoy className="size-5" />
              </span>
              <h2 className="mt-5 text-2xl leading-snug font-semibold">Before you start</h2>
              <p className="mt-4 text-base leading-relaxed">
                Core is a self-reflection and grounding tool. It is not a substitute for therapy,
                medical care, or crisis support. If you're in crisis, please reach out to a crisis
                line or someone you trust.
              </p>
              <Button className="mt-8 h-12 w-full text-base" onClick={onDone}>
                I understand
              </Button>
              <button
                onClick={() => setStep(0)}
                className="mt-3 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Back
              </button>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Core never replaces professional care.
        </p>
      </div>
    </div>
  );
}
