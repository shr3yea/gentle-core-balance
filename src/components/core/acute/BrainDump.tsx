import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

/**
 * Brain Dump.
 * The text is never autosaved, never persisted, never sent to any API.
 * On clear, only an empty event marker row is written.
 */
export function BrainDump({ userId }: { userId: string }) {
  const [text, setText] = useState("");
  const [clearing, setClearing] = useState(false);

  const clear = async () => {
    setClearing(true);
    setText("");
    // Marker only. The content above is already gone from state.
    await supabase.from("dump_events").insert({ user_id: userId });
    setClearing(false);
    toast("Released.");
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base text-muted-foreground">
        Empty your head out here. Nothing is saved, nothing is read back to you.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Anything. Everything. No order needed."
        className="min-h-72 resize-none bg-card text-lg leading-relaxed"
      />
      <Button className="h-16 text-lg" onClick={clear} disabled={clearing || !text}>
        Clear &amp; Release
      </Button>
    </div>
  );
}
