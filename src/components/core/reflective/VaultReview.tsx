import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { reflectVaultNote } from "@/lib/reflect.functions";

type Worry = { id: string; text: string; created_at: string };

/** Vault Review. Nothing is auto-surfaced; the user opens each entry deliberately. */
export function VaultReview() {
  const note = useServerFn(reflectVaultNote);
  const [worries, setWorries] = useState<Worry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Worry | null>(null);
  const [perspective, setPerspective] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [released, setReleased] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("worries")
      .select("id, text, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error("Couldn't open the vault right now.");
    setWorries(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const close = () => {
    setOpen(null);
    setPerspective(null);
    setDissolving(false);
    setReleased(false);
  };

  const letGo = async (worry: Worry) => {
    setDissolving(true);
    const { error } = await supabase.from("worries").delete().eq("id", worry.id);
    if (error) {
      setDissolving(false);
      toast.error("Couldn't let that go yet. Try again?");
      return;
    }
    window.setTimeout(() => {
      setWorries((list) => list.filter((item) => item.id !== worry.id));
      setDissolving(false);
      setReleased(true);
    }, 900);
  };

  const askPerspective = async (worry: Worry) => {
    setBusy(true);
    try {
      const result = await note({ data: { worry: worry.text } });
      setPerspective(result.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't reach the reflection helper.");
    } finally {
      setBusy(false);
    }
  };

  if (open) {
    return (
      <div className="flex flex-col gap-6">
        {released ? (
          <div role="status" aria-live="polite" className="flex animate-pop flex-col items-center gap-4 py-16 text-center">
            <span aria-hidden="true" className="inline-flex size-14 items-center justify-center rounded-full bg-sage/50">
              <Sparkles className="size-6" aria-hidden="true" />
            </span>
            <p className="text-2xl font-semibold">Let go.</p>
            <p className="max-w-xs text-base text-muted-foreground">
              That one's off your shelf now.
            </p>
            <Button className="mt-4 h-12 w-full max-w-xs text-base" onClick={close}>
              Back to the vault
            </Button>
          </div>
        ) : (
          <>
            <div
              className={`rounded-2xl bg-card p-6 shadow-paper ${dissolving ? "animate-dissolve" : "animate-rise"}`}
            >
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Set aside {new Date(open.created_at).toLocaleDateString()}
              </p>
              <p className="mt-3 text-lg leading-relaxed whitespace-pre-line">{open.text}</p>
            </div>
            <p className="text-xl font-medium">Is this still burdening you?</p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="h-14 flex-1 text-base"
                onClick={() => void letGo(open)}
                disabled={dissolving}
              >
                No
              </Button>
              <Button
                className="h-14 flex-1 text-base"
                onClick={() => setPerspective(perspective ?? "")}
                disabled={dissolving}
              >
                Yes
              </Button>
            </div>
            {perspective !== null && (
              <div className="flex animate-rise flex-col gap-4">
                {perspective === "" ? (
                  <Button
                    variant="secondary"
                    className="h-12 text-base"
                    onClick={() => void askPerspective(open)}
                    disabled={busy}
                  >
                    {busy ? "Thinking it through…" : "Ask for a perspective note"}
                  </Button>
                ) : (
                  <div className="rounded-2xl border border-border bg-secondary/60 p-6">
                    <p className="text-lg leading-relaxed whitespace-pre-line">{perspective}</p>
                  </div>
                )}
              </div>
            )}
            <Button variant="ghost" className="h-12 text-base" onClick={close}>
              Put it back
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-semibold">The Vault</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Worries you set aside. They stay here until you choose to open one.
        </p>
      </header>

      {loading ? (
        <p className="text-base text-muted-foreground">Opening the vault…</p>
      ) : worries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-lg">Nothing in here yet.</p>
          <p className="mt-2 text-base text-muted-foreground">
            Anything you vault from Acute Mode will wait for you here.
          </p>
        </div>
      ) : (
        <>
          <div aria-hidden="true" className="relative mx-auto flex h-40 w-40 items-end justify-center rounded-b-[5rem] rounded-t-3xl border-2 border-border bg-secondary/40 p-3">
            <div className="flex w-full flex-wrap items-end justify-center gap-1 pb-4">
              {worries.slice(0, 18).map((worry, index) => (
                <span
                  key={worry.id}
                  className="size-4 animate-pop rounded-full bg-clay/70"
                  style={{ animationDelay: `${index * 40}ms` }}
                />
              ))}
            </div>
            <span className="absolute -top-3 h-6 w-28 rounded-[2px] bg-washi/80" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {worries.length} {worries.length === 1 ? "worry" : "worries"} in the jar
          </p>
          <div className="flex flex-col gap-3">
            {worries.map((worry) => (
              <button
                key={worry.id}
                type="button"
                onClick={() => setOpen(worry)}
                className="rounded-2xl bg-card p-5 text-left shadow-paper transition-shadow hover:shadow-lift"
              >
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  {new Date(worry.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2 line-clamp-2 text-base leading-relaxed">{worry.text}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
