import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Moment = { id: string; caption: string; mood_tag: string; created_at: string };
type Marker = { created_at: string };

const MOODS = ["calm", "proud", "steady", "relieved", "connected", "small win"];

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Moments Journal + rolling 7-day view. No streaks, no gap-shaming. */
export function MomentsJournal() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [checkins, setCheckins] = useState<Marker[]>([]);
  const [dumps, setDumps] = useState<Marker[]>([]);
  const [caption, setCaption] = useState("");
  const [mood, setMood] = useState(MOODS[0]!);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const since = new Date(Date.now() - 6 * 86400000);
    since.setHours(0, 0, 0, 0);
    const [m, b, d] = await Promise.all([
      supabase
        .from("moments")
        .select("id, caption, mood_tag, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("body_checkins").select("created_at").gte("created_at", since.toISOString()),
      supabase.from("dump_events").select("created_at").gte("created_at", since.toISOString()),
    ]);
    setMoments(m.data ?? []);
    setCheckins(b.data ?? []);
    setDumps(d.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!caption.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("moments")
      .insert({
        caption: caption.trim(),
        mood_tag: mood,
        user_id: (await supabase.auth.getUser()).data.user!.id,
      });
    setBusy(false);
    if (error) {
      toast.error("Couldn't save that moment.");
      return;
    }
    setCaption("");
    toast.success("Kept.");
    void load();
  };

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, offset) => {
      const date = new Date(today.getTime() - (6 - offset) * 86400000);
      const key = dayKey(date);
      return {
        key,
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        moments: moments.filter((item) => dayKey(new Date(item.created_at)) === key).length,
        body: checkins.filter((item) => dayKey(new Date(item.created_at)) === key).length,
        dumps: dumps.filter((item) => dayKey(new Date(item.created_at)) === key).length,
      };
    });
  }, [moments, checkins, dumps]);

  const lastMoment = moments[0];
  const daysSince = lastMoment
    ? Math.floor((Date.now() - new Date(lastMoment.created_at).getTime()) / 86400000)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-semibold">Moments</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Small wins and safe moments, kept exactly as small as they are.
        </p>
      </header>

      {daysSince !== null && daysSince >= 2 && (
        <div className="rounded-2xl bg-accent/40 p-5">
          <p className="text-base leading-relaxed">
            Welcome back. However long it's been, you haven't lost anything here — everything you
            kept is still waiting.
          </p>
        </div>
      )}

      <form onSubmit={add} className="relative rounded-2xl bg-card p-6 shadow-paper">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-8 h-6 w-24 rotate-[2deg] rounded-[2px] bg-washi/80"
        />
        <Input
          aria-label="What happened? A short caption for this moment"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Made tea and drank it while it was hot"
          className="border-none bg-transparent px-0 text-lg shadow-none focus-visible:ring-0"
        />
        <div role="group" aria-label="Mood tag" className="mt-4 flex flex-wrap gap-2">
          {MOODS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mood === option}
              onClick={() => setMood(option)}
              className={`rounded-full border px-4 py-2 text-sm ${
                mood === option
                  ? "border-primary bg-sage/40 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <Button
          type="submit"
          className="mt-5 h-12 w-full text-base"
          disabled={busy || !caption.trim()}
        >
          Keep this moment
        </Button>
      </form>

      <section>
        <h3 className="text-lg font-medium">The last seven days</h3>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const total = day.moments + day.body + day.dumps;
            return (
              <div
                key={day.key}
                role="img"
                aria-label={`${day.label}: ${day.moments} moments kept, ${day.body} body check-ins, ${day.dumps} brain dumps released`}
                className="flex flex-col items-center gap-2 rounded-xl bg-card p-2 shadow-paper"
              >
                <span aria-hidden="true" className="text-xs text-muted-foreground">
                  {day.label}
                </span>
                <span aria-hidden="true" className="flex flex-col items-center gap-1">
                  {total === 0 ? (
                    <span className="size-2 rounded-full bg-border" />
                  ) : (
                    <>
                      {day.moments > 0 && <span className="size-2.5 rounded-full bg-sage" />}
                      {day.body > 0 && <span className="size-2.5 rounded-full bg-clay" />}
                      {day.dumps > 0 && <span className="size-2.5 rounded-full bg-washi" />}
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Green: a moment kept. Clay: a body check-in. Teal: a brain dump released. Quiet days are
          just quiet days.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-medium">Kept so far</h3>
        {loading ? (
          <p className="text-base text-muted-foreground">Gathering…</p>
        ) : moments.length === 0 ? (
          <p className="text-base text-muted-foreground">
            Nothing kept yet. The first one can be very ordinary.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {moments.map((moment) => (
              <div key={moment.id} className="polaroid animate-rise">
                <div className="flex min-h-24 items-center justify-center rounded-[2px] bg-secondary/70 px-4 py-6 text-center">
                  <p className="text-base leading-relaxed">{moment.caption}</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {moment.mood_tag} · {new Date(moment.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
