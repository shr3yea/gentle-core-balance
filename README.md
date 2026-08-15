# Core Grounding

Core — Lovable Build Prompt

Build a mental health support app called Core using React, Supabase (auth + database), and the Gemini API for AI-assisted reflection. Core philosophy: bridge acute grounding (for panic/high-anxiety moments) and reflective processing (for calm moments), without rumination triggers, toxic positivity, or guilt-inducing streak mechanics.

Core is not a replacement for professional mental health care. This must be communicated clearly in the app, not just documentation.

Onboarding / Disclaimer (build first, it's tiny)

On first load, show a brief screen the user taps through (not a dismissible toast — it should register):

"Core is a self-reflection and grounding tool. It is not a substitute for therapy, medical care, or crisis support. If you're in crisis, please reach out to a crisis line or someone you trust."

Then into the app, defaulting to whichever mode (Acute/Reflective) was last used, or Acute Mode on first-ever open.

Global Nav

Explicit mode toggle between Acute Mode and Reflective Mode, visible from anywhere, one tap to switch. Acute Mode must be reachable in one tap from any screen in the app.

ACUTE MODE

For high-stress moments. Must work fully offline — zero API calls, zero Supabase writes except where explicitly noted.

Visual style: flattened background, no textures, no decorative doodles, no non-essential menu items. Dark/calm palette. Large single-tap targets only.

1. Instant Grounding

Box breathing: animated circle expanding/contracting on a 4-4-4-4 count

5-4-3-2-1 grounding: one prompt per screen, advancing on tap — 5 seen → 4 felt → 3 heard → 2 smelled → 1 tasted

Fully offline, no persistence

2. The Burner / Vault

Text input for a worry

"Burn It" — burn/dissolve animation, text cleared from local state only, NEVER written to Supabase, no API call, no logging of the text anywhere

"Vault It" — saves to Supabase (worries table: id, user_id, text, created_at — no timer or reopen field of any kind), returns to Acute Mode. No AI call on either action.

3. Body Check-In

Clickable body silhouette with four zones. Tapping a zone shows what's physically happening in plain, non-diagnostic language, then two tappable exercise cards (user picks either, or both):

Head / Brain — "Stress hormones can cause tension and racing thoughts."

Mindful Focus: Name five things you can see around you

Jaw Release: Drop your tongue from the roof of your mouth, let your jaw hang loose

Chest / Lungs — "Your heart rate rises and breathing gets fast and shallow."

Box Breathing: In 4, hold 4, out 4, hold 4

Elongated Exhale: Breathe out for twice as long as you breathe in

Stomach / Gut — "This can cause a nauseous or 'butterflies' feeling."

Abdominal Breathing: Hand on belly, breathe so your hand rises

Warmth: If available, warm tea or a heating pad can help relax tight muscles

Muscles / Skin — "Muscles tense and you may tremble or sweat."

Progressive Muscle Relaxation: Tense toes for 5 seconds, release, move upward through each muscle group

Shake It Out: Shake your hands, arms, and legs for 30 seconds

Log each zone tap silently to Supabase (body_checkins table: id, user_id, zone, created_at) — not user-facing, just a background write. No AI involved anywhere in this feature.

4. Brain Dump

Free-form text box, zero autosave, zero persistence of the text itself

Single "Clear & Release" button wipes the text instantly

On clear, log only an event marker to Supabase (dump_events table: id, user_id, created_at) — never the text content

No AI processing of this text, ever

REFLECTIVE MODE

For calm moments — richer visuals and AI features live here.

Visual style: soft palette, clean rounded/serif font pairing, warm scrapbook feel — but restrained. A few intentional touches (a subtle polaroid frame, a washi-tape accent on key cards) are fine; don't apply decoration everywhere.

1. Reality Check Matrix (flagship feature — build and polish this first)

Text input for a distressing thought

Gemini call 1 (Validate + De-catastrophize). System prompt:

"You are a supportive companion helping someone examine a difficult thought. Respond in exactly two sentences: 1) Validate the emotion without judgment, using the user's own words where possible — never minimize. 2) Ask one gentle reality-check question separating the feeling from fact (e.g. whether this is a guaranteed outcome or anxiety predicting the worst case). Do not offer a reframe yet, only ask the question. Never use toxic-positivity phrasing like 'think happy thoughts' or 'it'll all work out.' If the user's message suggests intent to harm themselves or others, do not continue the reflection exercise — instead gently encourage them to contact a crisis line or trusted person."

After this response, show three selectable tone buttons:

Gentle Friend — warm compassionate validation, 1–2 sentences, no advice

Evidence Examiner — brief evidence for vs. against the thought, neutral factual tone, 2–3 lines

Tiny Action — one 30-second somatic action stated as a direct instruction, no explanation

Gemini call 2 fires only after tone selection, parameterized by chosen tone + original thought + call 1 response as context

Guardrail requirement: the app must not be vulnerable to negative self-talk spiraling further. If the user's input in this flow (or Vault review, below) contains language suggesting self-harm intent, the AI response must not continue the normal flow — redirect to the crisis message instead of generating a reflection.

2. Vault Review

Shows Vaulted worries (from worries table) as an accumulating stack/jar visual

Nothing is auto-surfaced — user manually opens the Vault and taps an entry

On opening: "Is this still burdening you?" Yes / No

No → dissolve animation, delete the row from Supabase, small positive micro-animation

Yes → optional button for a Gemini perspective note (fires only on explicit tap, same validation-first tone as the Matrix, never diagnostic language, same crisis-language guardrail as above)

3. Moments Journal & Micro-Triumphs

Simplified for hackathon timeline — no photo upload.

Short caption + mood tag entries for small wins or safe moments (moments table: id, user_id, caption, mood_tag, created_at)

Rolling 7-day view aggregating moments, grounding exercises, and body check-ins into a simple grid

No gap-shaming: returning after any absence shows a warm welcome-back message — never a broken streak, greyed calendar, or empty-day grid

(Skip Pattern Cards and Weekly Pattern Reflection for the initial build — they need accumulated history to say anything meaningful and risk showing an empty state on a fresh demo account. Add only if time allows, with a seeded demo account.)

Technical Setup

Supabase auth — email/password is fine, or a single hardcoded demo user_id if time is tight

Row-level security scoped to user_id on every table

Route Gemini calls through a Supabase Edge Function, not directly from the client, so the API key isn't exposed. (If Edge Functions cause friction, a direct client call with a "hackathon demo, not production" note is an acceptable fallback — don't let this become a time sink.)

Tables: worries (id, user_id, text, created_at), body_checkins (id, user_id, zone, created_at), dump_events (id, user_id, created_at), moments (id, user_id, caption, mood_tag, created_at)

Build Priority Order

Onboarding disclaimer

Reality Check Matrix (flagship — most build time here)

Instant Grounding

Burner / Vault

Brain Dump

Body Check-In (with zone content above)

Simplified Moments Journal

Confirm after building

Acute Mode makes zero network requests except the silent body_checkins write and explicit Vault It saves

Brain Dump and Burner text are never written to Supabase or logged anywhere

The worries table has no timer/reopen field

RLS policies are active on all tables

Crisis-language guardrail is active on both Gemini call sites (Matrix + Vault perspective note)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gentle-core-balance.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/60f4fa03-46ad-4973-aff0-1c32ab765938).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
