import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AuthCard } from "@/components/core/AuthCard";
import { CoreApp } from "@/components/core/CoreApp";
import { Disclaimer } from "@/components/core/Disclaimer";
import { useAuthUser } from "@/hooks/useAuthUser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Core — Grounding and reflection, in one place" },
      {
        name: "description",
        content:
          "Core bridges acute grounding for panic moments and calm reflection for quieter ones. No streaks, no toxic positivity.",
      },
      { property: "og:title", content: "Core — Grounding and reflection, in one place" },
      {
        property: "og:description",
        content:
          "Steady yourself when things spike, and think things through when they've settled. Core is a self-reflection tool, not a substitute for care.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SEEN_KEY = "core.disclaimerSeen";

function Index() {
  const { user, loading } = useAuthUser();
  const [ready, setReady] = useState(false);
  const [seenDisclaimer, setSeenDisclaimer] = useState(false);

  useEffect(() => {
    setSeenDisclaimer(window.localStorage.getItem(SEEN_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready || loading) {
    return <div className="reflective min-h-screen bg-background" />;
  }

  if (!seenDisclaimer) {
    return (
      <Disclaimer
        onDone={() => {
          window.localStorage.setItem(SEEN_KEY, "1");
          setSeenDisclaimer(true);
        }}
      />
    );
  }

  if (!user) return <AuthCard />;

  return <CoreApp userId={user.id} />;
}
