import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { containsCrisisLanguage, CRISIS_MESSAGE } from "@/lib/crisis";

export type ReflectTone = "gentle" | "evidence" | "action";

const MATRIX_SYSTEM_PROMPT =
  "You are a supportive companion helping someone examine a difficult thought. Respond in exactly two sentences: 1) Validate the emotion without judgment, using the user's own words where possible — never minimize. 2) Ask one gentle reality-check question separating the feeling from fact (e.g. whether this is a guaranteed outcome or anxiety predicting the worst case). Do not offer a reframe yet, only ask the question. Never use toxic-positivity phrasing like 'think happy thoughts' or 'it'll all work out.' If the user's message suggests intent to harm themselves or others, do not continue the reflection exercise — instead gently encourage them to contact a crisis line or trusted person.";

const TONE_PROMPTS: Record<ReflectTone, string> = {
  gentle:
    "Respond as a Gentle Friend: warm, compassionate validation in 1-2 sentences. No advice, no reframe, no questions. Never use toxic-positivity phrasing.",
  evidence:
    "Respond as an Evidence Examiner: in 2-3 short lines, lay out the evidence for the thought and the evidence against it in a neutral, factual tone. No cheerleading, no toxic positivity, no diagnosis.",
  action:
    "Respond as Tiny Action: give exactly one 30-second somatic action, stated as a direct instruction. No explanation, no preamble, no encouragement text.",
};

const VAULT_SYSTEM_PROMPT =
  "You are a supportive companion offering a brief perspective note on a worry a person set aside a while ago. Validate the feeling first in the person's own words, then offer one gentle, non-diagnostic perspective or question. Maximum three sentences. Never diagnose, never use clinical labels, never use toxic-positivity phrasing like 'it'll all work out.' If the message suggests intent to harm themselves or others, do not continue — gently encourage them to contact a crisis line or trusted person.";

const GEMINI_MODEL = "gemini-2.5-flash";

async function callModel(system: string, user: string): Promise<string> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    return "The reflection helper isn't available right now. Your own words are still here whenever you want to sit with them.";
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Gemini API error", response.status, detail);
    if (response.status === 429) {
      throw new Error("Too many requests right now — please try again in a moment.");
    }
    throw new Error("The reflection helper couldn't respond just now.");
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
  return text && text.length > 0
    ? text
    : "I don't have words for this one. Sitting with it gently is enough for now.";
}


/** Reality Check Matrix — call 1: validate + de-catastrophize. */
export const reflectValidate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { thought: string }) => ({
    thought: String(input.thought ?? "").slice(0, 2000),
  }))
  .handler(async ({ data }) => {
    if (containsCrisisLanguage(data.thought)) {
      return { crisis: true, text: CRISIS_MESSAGE };
    }
    const text = await callModel(MATRIX_SYSTEM_PROMPT, data.thought);
    return { crisis: false, text };
  });

/** Reality Check Matrix — call 2: fires only after the user picks a tone. */
export const reflectTone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { thought: string; validation: string; tone: ReflectTone }) => ({
    thought: String(input.thought ?? "").slice(0, 2000),
    validation: String(input.validation ?? "").slice(0, 2000),
    tone: input.tone,
  }))
  .handler(async ({ data }) => {
    if (containsCrisisLanguage(data.thought)) {
      return { crisis: true, text: CRISIS_MESSAGE };
    }
    const tonePrompt = TONE_PROMPTS[data.tone] ?? TONE_PROMPTS.gentle;
    const system = `${tonePrompt} If the user's message suggests intent to harm themselves or others, do not continue the exercise — gently encourage them to contact a crisis line or trusted person.`;
    const user = `The person's original thought: "${data.thought}"\n\nWhat was already said to them: "${data.validation}"\n\nNow give your response in the requested style.`;
    const text = await callModel(system, user);
    return { crisis: false, text };
  });

/** Vault Review — perspective note, only on explicit tap. */
export const reflectVaultNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { worry: string }) => ({
    worry: String(input.worry ?? "").slice(0, 2000),
  }))
  .handler(async ({ data }) => {
    if (containsCrisisLanguage(data.worry)) {
      return { crisis: true, text: CRISIS_MESSAGE };
    }
    const text = await callModel(VAULT_SYSTEM_PROMPT, data.worry);
    return { crisis: false, text };
  });
