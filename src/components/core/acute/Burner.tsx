import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

/**
 * The Burner / Vault.
 * "Burn It" clears local state only — the text is never sent anywhere or logged.
 * "Vault It" is the only network call in this component.
 */
export function Burner({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [text, setText] = useState("");
  const [burning, setBurning] = useState(false);
  const [saving, setSaving] = useState(false);

  const burn = () => {
    if (!text.trim()) return;
    setBurning(true);
    window.setTimeout(() => {
      setText("");
      setBurning(false);
      toast("Gone. Nothing was saved.");
    }, 1100);
  };

  const vault = async () => {
    if (!text.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("worries").insert({ user_id: userId, text: text.trim() });
    setSaving(false);
    if (error) {
      toast.error("Couldn't put that away. Try again?");
      return;
    }
    setText("");
    toast.success("Put away. It'll wait for you.");
    onDone();
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base text-muted-foreground">
        Write the worry down. Then either let it go, or set it aside for later.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on you right now?"
        className={`min-h-44 resize-none bg-card text-lg leading-relaxed ${burning ? "animate-burn" : ""}`}
        disabled={burning}
      />
      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          className="h-16 text-lg"
          onClick={burn}
          disabled={burning || !text.trim()}
        >
          Burn It
        </Button>
        <Button
          className="h-16 text-lg"
          onClick={vault}
          disabled={saving || burning || !text.trim()}
        >
          {saving ? "Putting it away…" : "Vault It"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Burning clears the text from this screen only. It's never stored.
      </p>
    </div>
  );
}
