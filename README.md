core

tagline: core, for when your mind won't sit still

live demo: https://gentle-core-balance.vercel.app

i am someone who usually feels anxious before exams, an event, or before doing anything new. so i decided to build this app whose main focus is on anxiety. anxiety shows up in different forms, harsh self talk, racing thoughts, physical tension, lingering worries, and moments of good that go unnoticed. this app treats these as connected signals, not separate tools, and personalizes itself over time based on the individual user's actual patterns, not preset menus.

core isn't a replacement for therapy or professional help. if you're in crisis, please reach out to a crisis line or someone you trust.

two modes

there are two modes, acute mode for when someone is feeling very anxious right now, and reflective mode for when they're calm.

acute mode

this mode focuses on making the user feel calm in the moment. it works fully offline, no gemini call needed, so it's available anywhere, anytime, even without signal.

box breathing and the 5 4 3 2 1 method are simple grounding exercises. box breathing has you follow an animated circle on a 4 4 4 4 count. 5 4 3 2 1 walks you through your senses one at a time, something you see, something you feel, something you hear, something you smell, something you taste, just to bring you back into your body.

brain dump is for when there are too many thoughts in your head to think straight. you write out whatever's there, and it's never saved anywhere. the second you clear it, it's gone. no pressure, no record of it, nothing to reread later.

the burner and vault work with one specific worry instead of everything at once. you can burn it, and it disappears right away, or you can vault it, and it's saved so you can come back to it later. when you open a vaulted worry, it asks if it's still bothering you or not. worries can feel like a huge, unsolvable thing in the moment, but nothing lasts forever, and even a worry eventually gets resolved. i wanted the vault to reflect that instead of just being a list.

body check in lets you tap wherever you're feeling the anxiety in your body, head, chest, stomach, or muscles, and it shows you something specific you can actually do to ease it in that spot.

reflective mode

for when the person is calm. this is where the ai features live.

reality check matrix isn't a chatbot, it's a structured flow. you write down a thought that's bothering you, and it responds by validating the feeling first and asking a gentle reality check question, without minimizing anything or jumping straight to advice. then you get to choose how you want to be talked to next, gentle friend, evidence examiner, or tiny action, and it responds in that tone.

vault review lets you come back to your vaulted worries whenever you want and check if they're resolved yet.

moments journal is for small good things, even the tiniest ones, kept as small as they actually are. it shows a rolling seven day view so you can look back and feel good about what happened, even things you might've otherwise forgotten. there's no streak pressure and no gap shaming, if you come back after any length of absence, you just get a warm welcome back instead of a broken streak or empty calendar.

i wanted to build a monthly or yearly version of this too, but didn't have enough time or data to demonstrate it properly, so that's something for later.

why ai is used the way it is

the reflective mode ai responses, powered by gemini, are only used where reflection actually needs judgment, the reality check matrix and the optional vault perspective note. everything else, grounding, brain dump, burner, body check in, works without any ai call at all, on purpose. those are moments where the priority is speed and privacy, not conversation. i didn't want ai everywhere just to say the app uses ai, i wanted it only where it actually adds something.

the reality check matrix isn't one ai call, it's two, and that was intentional. the first call only validates the feeling and asks a gentle question back, it doesn't try to fix or reframe anything yet, because jumping straight to "here's the solution" is exactly what makes people feel unheard when they're anxious. only after that does the user get to pick how they want to be responded to, and the second ai call is shaped around that specific choice. so the ai isn't giving one generic response to everyone, it's adapting to how that person actually wants to be talked to in that moment.

since this is a mood related tool, i built in guardrails so the ai can't make a bad moment worse. it always validates before questioning, never uses toxic positivity language, and if a message suggests someone might be in crisis, it stops the normal flow and points them to real support instead of continuing the exercise.

tech stack
react + typescript (vite)
supabase, auth, postgres database, and edge functions
row level security scoped to auth.uid() on every table
gemini calls are routed server side through supabase edge functions, so the api key is never exposed to the client
gemini api, free tier, powers the reality check matrix and the optional vault perspective note
bun as the package manager
built with lovable
database tables
worries, burner/vault entries, no timer or reopen field, by design
body_checkins, silent zone tap logging
dump_events, brain dump event markers only, never the text itself
moments, moments journal entries
what's not in this build

weekly pattern reflection and longer term (monthly/yearly) pattern insights were designed but not fully built, they need history to say anything meaningful, and i didn't have the time or data to demo them properly for this hackathon.

what's next

things i'd want to add with more time.

multilingual support, anxiety doesn't only show up in english, and this app should be usable in more than one language
ambient calming background sound
voice guided breathing, a spoken voice dictating breathe in, breathe out for the box breathing exercise, so the app is usable without needing to look at the screen, especially important for visually impaired users, or for anyone who wants to close their eyes while grounding themselves
longer term pattern insights (monthly/yearly), once there's enough usage data to make them
