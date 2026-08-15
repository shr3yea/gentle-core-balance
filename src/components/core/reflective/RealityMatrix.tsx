import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { HeartHandshake, Scale, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reflectTone, reflectValidate, type ReflectTone } from "@/lib/reflect.functions";

const TONES: { id: ReflectTone; label: string; blurb: string; icon: typeof Scale }[] = [
  {
    id: "gentle",
    label: "Gentle Friend",
    blurb: "Warm validation, nothing to fix",
    icon: HeartHandshake,
  },
  { id: "evidence", label: "Evidence Examiner", blurb: "For and against, plainly", icon: Scale },
  { id: "action", label: "Tiny Action", blurb: "One 30-second thing to do", icon: Sparkles },
];

/** Reality Check Matrix — two-step reflection, second call only after a tone is chosen. */
export function RealityMatrix() {
  const validate = useServerFn(reflectValidate);
  const respond = useServerFn(reflectTone);

  const [thought, setThought] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  const [crisis, setCrisis] = useState(false);
  const [tone, setTone] = useState<ReflectTone | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (!thought.trim()) return;
    setBusy(true);
    try {
      const result = await validate({ data: { thought: thought.trim() } });
      setValidation(result.text);
      setCrisis(result.crisis);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't reach the reflection helper.");
    } finally {
      setBusy(false);
    }
  };

  const chooseTone = async (next: ReflectTone) => {
    if (!validation) return;
    setTone(next);
    setAnswer(null);
    setBusy(true);
    try {
      const result = await respond({
        data: { thought: thought.trim(), validation, tone: next },
      });
      setAnswer(result.text);
      if (result.crisis) setCrisis(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't reach the reflection helper.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setThought("");
    setValidation(null);
    setAnswer(null);
    setTone(null);
    setCrisis(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-semibold">Reality Check Matrix</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Write the thought that's pulling at you. We'll look at it together, slowly.
        </p>
      </header>

      <div className="relative rounded-2xl bg-card p-6 shadow-paper">
        <span className="absolute -top-3 left-8 h-6 w-24 rotate-[-2deg] rounded-[2px] bg-washi/80" />
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g. If I say the wrong thing tomorrow, everyone will think less of me."
          className="min-h-32 resize-none border-none bg-transparent px-0 text-lg leading-relaxed shadow-none focus-visible:ring-0"
          disabled={!!validation}
        />
        {!validation && (
          <Button
            className="mt-2 h-12 w-full text-base"
            onClick={start}
            disabled={busy || !thought.trim()}
          >
            {busy ? "Reading it carefully…" : "Look at this thought"}
          </Button>
        )}
      </div>

      {validation && (
        <div className="animate-rise rounded-2xl border border-border bg-secondary/60 p-6">
          <p className="text-lg leading-relaxed whitespace-pre-line">{validation}</p>
        </div>
      )}

      {validation && !crisis && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            What would help next?
          </p>
          {TONES.map((option) => {
            const Icon = option.icon;
            const selected = tone === option.id;
            return (
              <button
                key={option.id}
                onClick={() => chooseTone(option.id)}
                disabled={busy}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-shadow ${
                  selected
                    ? "border-primary bg-card shadow-lift"
                    : "border-border bg-card hover:shadow-paper"
                }`}
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-sage/40">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-lg font-medium">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">{option.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {busy && tone && !answer && (
        <p className="text-base text-muted-foreground">Thinking it through…</p>
      )}

      {answer && (
        <div className="animate-rise rounded-2xl bg-card p-6 shadow-paper">
          <p className="text-lg leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      )}

      {validation && (
        <Button variant="secondary" className="h-12 text-base" onClick={reset}>
          Start with a different thought
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        Reflection prompts are generated support, not clinical advice.
      </p>
    </div>
  );
}
