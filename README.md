Core

Live demo: https://gentle-core-balance-e5jesi759-shr3yeas-projects.vercel.app

I'm someone who usually feels anxious before exams, before an event, or before doing anything new. So I decided to build this app with a main focus on anxiety.

Anxiety shows up in different forms harsh self-talk, racing thoughts, physical tension, lingering worries. This app treats these as connected signals, not separate tools, and personalizes itself over time based on the individual user's actual patterns, not preset menus.

IMP!!!-Core is not a replacement for therapy or professional help. If you're in crisis, please reach out to a crisis line or someone you trust.

Two Modes

There are two modes Acute Mode, for when someone is feeling very anxious, and Reflective Mode, for when they're calm.

Acute Mode

This mode focuses on making the user feel calm right now. It has:

Box breathing and the 5-4-3-2-1 method — grounding exercises for the moment
Works fully offline (no Gemini call needed) so it's available anywhere, anytime, even without signal
Brain Dump — we usually have so many thoughts when we're anxious, and it feels really nice to dump them somewhere to clear our mind. Brain Dump lets you write out anything that's on your mind. It's never saved anywhere it disappears the moment you clear it.
The Burner / Vault — similar idea to Brain Dump, but for something specific that's worrying you. You can burn it, and the worry disappears immediately, or vault it, and it's saved so you can come back to it later. When you open a vaulted worry, it asks if it's resolved yet or not. Worries can feel like a huge, unsolvable thing in the moment but nothing lasts forever, and even a worry eventually gets resolved. I wanted the Vault to reflect that.
Body Check-In — anxiety can be felt in different parts of the body. This feature lets you tap the body part where you're feeling it, and it shows you something you can do to feel better or ease it.
Reflective Mode

For when the person is calm. This is where the AI features live.

Reality Check Matrix — not a freeform chatbot, but a structured flow: you write down a thought, and it responds by validating the feeling first and asking a gentle reality check question, without minimizing anything. Then you can choose what kind of response you'd like  Gentle Friend, Evidence Examiner, or Tiny Action and it responds in that tone.
Vault Review — come back to your vaulted worries whenever you want and check if they're resolved.
Moments Journal — post photos and notes about small good things, even the tiniest ones. It shows a weekly recap so you can look back and feel good about what happened, even things you might've forgotten about otherwise.

I wanted to build a monthly or yearly version of this too, but didn't have enough time or data to demonstrate it properly, so that's a future addition.

Why AI is used the way it is

The Reflective Mode AI responses (Gemini) are only used where reflection actually needs judgment  the Reality Check Matrix and the optional Vault perspective note. Everything else (grounding, Brain Dump, Burner, Body Check-In) works without any AI call at all, on purpose those are moments where the priority is speed and privacy, not conversation. I didn't want AI everywhere just to say the app uses AI, I wanted it only where it actually adds something.

The Reality Check Matrix isn't one AI call, it's two, and that was intentional. The first call only validates the feeling and asks a gentle question back it doesn't try to fix or reframe anything yet, because jumping straight to "here's the solution" is exactly what makes people feel unheard when they're anxious. Only after that does the user get to pick how they want to be responded to — Gentle Friend, Evidence Examiner, or Tiny Action and the second AI call is shaped around that specific choice. So the AI isn't giving one generic response to everyone, it's adapting to how that person actually wants to be talked to in that moment.

Since this is a mood-related tool, I built in guardrails so the AI can't make a bad moment worse  it always validates before questioning, never uses toxic-positivity language, and if a message suggests someone might be in crisis, it stops the normal flow and points them to real support instead of continuing the exercise.

Tech Stack
React + TypeScript (Vite)
Supabase — auth, Postgres database, and Edge Functions
Row-level security scoped to auth.uid() on every table
Gemini calls are routed server-side through Supabase Edge Functions, so the API key is never exposed to the client
Gemini API — powers the Reality Check Matrix (two-stage call) and the optional Vault perspective note
Bun as the package manager
Built with Lovable
Database tables
worries — Burner/Vault entries (no timer or reopen field, by design)
body_checkins — silent zone-tap logging
dump_events — Brain Dump event markers only (never the text itself)
moments — Moments Journal entries

What's next

Things I'd want to add with more time:

Multilingual support — anxiety doesn't only show up in English, and this app should be usable in more than one language
Ambient calming background sound — an optional soft, non-intrusive audio layer for Acute Mode
Voice-guided breathing — a spoken voice dictating "breathe in, breathe out" for the box breathing exercise, so the app is usable without needing to look at the screen — especially important for visually impaired users, or for anyone who wants to close their eyes while grounding themselves
Longer-term pattern insights (monthly/yearly), once there's enough usage data to make them meaningful instead of empty


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
