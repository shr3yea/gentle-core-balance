import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Brain,
  BookHeart,
  Flame,
  Archive,
  LifeBuoy,
  LogOut,
  PersonStanding,
  Timer,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BodyCheckIn } from "@/components/core/acute/BodyCheckIn";
import { BoxBreathing } from "@/components/core/acute/BoxBreathing";
import { BrainDump } from "@/components/core/acute/BrainDump";
import { Burner } from "@/components/core/acute/Burner";
import { Grounding54321 } from "@/components/core/acute/Grounding54321";
import { MomentsJournal } from "@/components/core/reflective/MomentsJournal";
import { RealityMatrix } from "@/components/core/reflective/RealityMatrix";
import { VaultReview } from "@/components/core/reflective/VaultReview";
import { supabase } from "@/integrations/supabase/client";

type Mode = "acute" | "reflective";
type AcuteScreen = "home" | "breathing" | "grounding" | "burner" | "body" | "dump";
type ReflectiveScreen = "home" | "matrix" | "vault" | "moments";

const MODE_KEY = "core.mode";

export function CoreApp({ userId }: { userId: string }) {
  const [mode, setMode] = useState<Mode>("acute");
  const [acuteScreen, setAcuteScreen] = useState<AcuteScreen>("home");
  const [reflectiveScreen, setReflectiveScreen] = useState<ReflectiveScreen>("home");

  useEffect(() => {
    const stored = window.localStorage.getItem(MODE_KEY);
    if (stored === "reflective" || stored === "acute") setMode(stored);
  }, []);

  const switchMode = (next: Mode) => {
    setMode(next);
    window.localStorage.setItem(MODE_KEY, next);
    if (next === "acute") setAcuteScreen("home");
    else setReflectiveScreen("home");
  };

  const acute = mode === "acute";
  const inSubScreen = acute ? acuteScreen !== "home" : reflectiveScreen !== "home";

  return (
    <div
      className={`${acute ? "acute" : "reflective"} min-h-screen bg-background font-sans text-foreground`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pt-5 pb-32">
        <header className="flex items-center justify-between">
          {inSubScreen ? (
            <button
              type="button"
              aria-label="Back to the main list"
              onClick={() => (acute ? setAcuteScreen("home") : setReflectiveScreen("home"))}
              className="inline-flex items-center gap-2 text-base text-muted-foreground"
            >
              <ArrowLeft className="size-5" aria-hidden="true" /> Back
            </button>
          ) : (
            <span className="font-display text-2xl font-semibold">Core</span>
          )}
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            aria-label="Sign out"
            className="text-muted-foreground"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </button>
        </header>

        <main className="mt-8 flex-1">
          {acute ? (
            <AcuteMode
              userId={userId}
              screen={acuteScreen}
              setScreen={setAcuteScreen}
              onVaulted={() => setAcuteScreen("home")}
            />
          ) : (
            <ReflectiveMode screen={reflectiveScreen} setScreen={setReflectiveScreen} />
          )}
        </main>
      </div>

      {/* Mode toggle: Acute Mode is always one tap away, from anywhere. */}
      <nav aria-label="Mode" className="fixed inset-x-0 bottom-0 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl gap-2 p-3">
          <button
            type="button"
            aria-pressed={acute}
            onClick={() => switchMode("acute")}
            className={`flex-1 rounded-2xl px-4 py-3 text-base font-medium ${
              acute ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Acute Mode
          </button>
          <button
            type="button"
            aria-pressed={!acute}
            onClick={() => switchMode("reflective")}
            className={`flex-1 rounded-2xl px-4 py-3 text-base font-medium ${
              !acute ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Reflective Mode
          </button>
        </div>
      </nav>
    </div>
  );
}

function AcuteMode({
  userId,
  screen,
  setScreen,
  onVaulted,
}: {
  userId: string;
  screen: AcuteScreen;
  setScreen: (screen: AcuteScreen) => void;
  onVaulted: () => void;
}) {
  if (screen === "breathing") return <BoxBreathing />;
  if (screen === "grounding") return <Grounding54321 onFinish={() => setScreen("home")} />;
  if (screen === "burner") return <Burner userId={userId} onDone={onVaulted} />;
  if (screen === "body") return <BodyCheckIn userId={userId} />;
  if (screen === "dump") return <BrainDump userId={userId} />;

  const tiles: { id: AcuteScreen; label: string; sub: string; icon: typeof Wind }[] = [
    { id: "breathing", label: "Box Breathing", sub: "Follow the circle, 4-4-4-4", icon: Wind },
    { id: "grounding", label: "5-4-3-2-1", sub: "One sense at a time", icon: Timer },
    { id: "burner", label: "Burner / Vault", sub: "Let it go, or set it aside", icon: Flame },
    { id: "body", label: "Body Check-In", sub: "Where you feel it", icon: PersonStanding },
    { id: "dump", label: "Brain Dump", sub: "Empty it out, keep nothing", icon: Brain },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl leading-relaxed">You're okay to just be here. Pick one thing.</p>
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => setScreen(tile.id)}
            className="flex items-center gap-4 rounded-2xl bg-card p-6 text-left"
          >
            <Icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-lg font-medium">{tile.label}</span>
              <span className="block text-base text-muted-foreground">{tile.sub}</span>
            </span>
          </button>
        );
      })}
      <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
        <LifeBuoy className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Core isn't crisis support. If you're in danger, contact a crisis line or someone you trust.
      </p>
    </div>
  );
}

function ReflectiveMode({
  screen,
  setScreen,
}: {
  screen: ReflectiveScreen;
  setScreen: (screen: ReflectiveScreen) => void;
}) {
  if (screen === "matrix") return <RealityMatrix />;
  if (screen === "vault") return <VaultReview />;
  if (screen === "moments") return <MomentsJournal />;

  const cards: { id: ReflectiveScreen; label: string; sub: string; icon: typeof Archive }[] = [
    {
      id: "matrix",
      label: "Reality Check Matrix",
      sub: "Examine a thought, one step at a time",
      icon: Brain,
    },
    { id: "vault", label: "The Vault", sub: "Revisit what you set aside", icon: Archive },
    { id: "moments", label: "Moments", sub: "Small wins and safe moments", icon: BookHeart },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl leading-tight font-semibold">A calmer minute</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Nothing here needs finishing. Start wherever it feels easiest.
        </p>
      </div>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => setScreen(card.id)}
            className="relative flex items-center gap-4 rounded-2xl bg-card p-6 text-left shadow-paper transition-shadow hover:shadow-lift"
          >
            {card.id === "matrix" && (
              <span aria-hidden="true" className="absolute -top-3 left-10 h-6 w-24 rotate-[-3deg] rounded-[2px] bg-washi/80" />
            )}
            <span aria-hidden="true" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sage/40">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-medium">{card.label}</span>
              <span className="block text-sm text-muted-foreground">{card.sub}</span>
            </span>
          </button>
        );
      })}
      <p className="text-xs text-muted-foreground">
        Core is a reflection tool, not therapy, medical care, or crisis support.
      </p>
    </div>
  );
}
