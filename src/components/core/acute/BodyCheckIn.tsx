import { useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Zone = {
  id: string;
  label: string;
  what: string;
  exercises: { name: string; how: string }[];
};

const ZONES: Zone[] = [
  {
    id: "head",
    label: "Head / Brain",
    what: "Stress hormones can cause tension and racing thoughts.",
    exercises: [
      { name: "Mindful Focus", how: "Name five things you can see around you." },
      {
        name: "Jaw Release",
        how: "Drop your tongue from the roof of your mouth, let your jaw hang loose.",
      },
    ],
  },
  {
    id: "chest",
    label: "Chest / Lungs",
    what: "Your heart rate rises and breathing gets fast and shallow.",
    exercises: [
      { name: "Box Breathing", how: "In 4, hold 4, out 4, hold 4." },
      { name: "Elongated Exhale", how: "Breathe out for twice as long as you breathe in." },
    ],
  },
  {
    id: "stomach",
    label: "Stomach / Gut",
    what: "This can cause a nauseous or 'butterflies' feeling.",
    exercises: [
      { name: "Abdominal Breathing", how: "Hand on belly, breathe so your hand rises." },
      {
        name: "Warmth",
        how: "If available, warm tea or a heating pad can help relax tight muscles.",
      },
    ],
  },
  {
    id: "muscles",
    label: "Muscles / Skin",
    what: "Muscles tense and you may tremble or sweat.",
    exercises: [
      {
        name: "Progressive Muscle Relaxation",
        how: "Tense toes for 5 seconds, release, move upward through each muscle group.",
      },
      { name: "Shake It Out", how: "Shake your hands, arms, and legs for 30 seconds." },
    ],
  },
];

/** Body Check-In. Zone taps are logged silently; nothing else here touches the network. */
export function BodyCheckIn({ userId }: { userId: string }) {
  const [active, setActive] = useState<Zone | null>(null);

  const pick = (zone: Zone) => {
    setActive(zone);
    // Silent background write, not user-facing.
    void supabase.from("body_checkins").insert({ user_id: userId, zone: zone.id });
  };

  if (active) {
    return (
      <div className="flex animate-rise flex-col gap-6">
        <h2 className="text-2xl font-medium">{active.label}</h2>
        <p className="text-lg leading-relaxed">{active.what}</p>
        <div className="flex flex-col gap-3">
          {active.exercises.map((exercise) => (
            <div key={exercise.name} className="rounded-2xl bg-card p-5">
              <p className="text-lg font-medium">{exercise.name}</p>
              <p className="mt-1 text-base text-muted-foreground">{exercise.how}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Try either one, or both. No wrong choice.</p>
        <Button variant="secondary" className="h-14 text-base" onClick={() => setActive(null)}>
          Back to body
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base text-muted-foreground">Where do you feel it? Tap that part.</p>
      <div className="relative mx-auto w-full max-w-[280px]">
        <svg viewBox="0 0 200 420" className="w-full" role="presentation" aria-hidden="true" focusable="false">
          {/* silhouette */}
          <g className="fill-secondary">
            <circle cx="100" cy="46" r="34" />
            <rect x="88" y="78" width="24" height="20" rx="8" />
            <rect x="58" y="94" width="84" height="120" rx="34" />
            <rect x="30" y="104" width="26" height="120" rx="13" />
            <rect x="144" y="104" width="26" height="120" rx="13" />
            <rect x="64" y="208" width="72" height="70" rx="22" />
            <rect x="66" y="270" width="30" height="140" rx="15" />
            <rect x="104" y="270" width="30" height="140" rx="15" />
          </g>
        </svg>
        <button
          aria-label="Head and brain — tap for tension and racing-thought exercises"
          onClick={() => pick(ZONES[0]!)}
          type="button"
          className="absolute left-1/2 top-0 h-[19%] w-[38%] -translate-x-1/2 rounded-full hover:bg-primary/25 focus-visible:bg-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <button
          aria-label="Chest and lungs — tap for breathing exercises"
          onClick={() => pick(ZONES[1]!)}
          type="button"
          className="absolute left-1/2 top-[22%] h-[19%] w-[46%] -translate-x-1/2 rounded-3xl hover:bg-primary/25 focus-visible:bg-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <button
          aria-label="Stomach and gut — tap for belly-calming exercises"
          onClick={() => pick(ZONES[2]!)}
          type="button"
          className="absolute left-1/2 top-[47%] h-[19%] w-[40%] -translate-x-1/2 rounded-3xl hover:bg-primary/25 focus-visible:bg-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <button
          aria-label="Muscles and skin — tap for muscle-release exercises"
          onClick={() => pick(ZONES[3]!)}
          type="button"
          className="absolute left-1/2 top-[67%] h-[31%] w-[42%] -translate-x-1/2 rounded-3xl hover:bg-primary/25 focus-visible:bg-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </div>
      <div className="flex flex-col gap-3">
        {ZONES.map((zone) => (
          <Button
            key={zone.id}
            variant="secondary"
            className="h-14 justify-start text-base"
            onClick={() => pick(zone)}
          >
            {zone.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
