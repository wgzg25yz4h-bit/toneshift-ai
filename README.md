# ToneShift AI

Build a polished, modern web application called “ToneShift”.

IMPORTANT:
This is not supposed to look like a basic student prototype. Build it as if it were a real startup/SaaS product that could actually be launched.

CORE CONCEPT:
ToneShift is an AI-powered communication assistant that helps people transform emotional, frustrated or informal thoughts into messages that are appropriate for the situation.

The core concept is:

“Say what you actually feel. Send it the way you mean it.”

The target audience is primarily students, interns, employees and young professionals who sometimes write messages while stressed, frustrated or emotional, but want to communicate clearly and appropriately.

The central user journey must be extremely simple:

WRITE → CHOOSE YOUR TONE → TRANSLATE → REVIEW → COPY

-----------------------------------
1. NAVIGATION
-----------------------------------

Create a clean navigation bar.

Left:
ToneShift logo/name.

Navigation:
- How it works
- Why tone matters
- Use cases

Right:
“Start writing” as a prominent CTA.

The navigation should remain clean and minimal.

-----------------------------------
2. HERO SECTION
-----------------------------------

Create a strong hero section with the headline:

“Turn your rant into the right words.”

Subheadline:

“Write what you really feel. ToneShift transforms emotional thoughts into messages you can actually send.”

Add a small badge above the headline:

“AI communication assistant”

Primary CTA:
“Start writing”

Secondary CTA:
“See how it works”

The visual focus should immediately communicate that this is a communication/tone transformation tool.

Do not make the hero overly complicated.

-----------------------------------
3. MAIN PRODUCT EXPERIENCE
-----------------------------------

The writing tool should be the visual center of the application.

Create a large rounded card.

Heading:

“Say what you actually feel”

Supporting text:

“Write it exactly how it comes to mind. No need to make it sound professional.”

Large textarea placeholder:

“my boss keeps piling work on me and never says thanks…”

Add a character counter.

Below the textarea:

“Pick a vibe for the translation”

Create four selectable tone cards:

PROFESSIONAL
“Clear & workplace-ready.”

DIPLOMATIC
“Tactful & respectful.”

ICE FORMAL
“Distant & precise.”

FRIENDLY
“Warm & approachable.”

Each card should have:
- appropriate icon
- title
- short description
- hover state
- selected state

The selected tone must be visually obvious through a subtle border, background change and check indicator.

Default selected tone:
Diplomatic.

-----------------------------------
4. GENERATION
-----------------------------------

Add a prominent CTA:

“Translate the rant →”

When clicked:
- validate the input
- show a polished loading state
- prevent duplicate clicks
- change the button text temporarily to something like:
“Finding the right words…”
- smoothly reveal the output section

Empty input should display:

“Give us something to work with first.”

-----------------------------------
5. OUTPUT
-----------------------------------

Create:

“OUTPUT — the send-this zone”

Add a status badge:

“Ready to send”

Display the generated message in a clean message card.

Example:

“I've noticed my workload has grown recently, and I'd really appreciate some acknowledgement of the extra effort involved.”

Add two buttons:

“Copy message”

“Try another vibe”

When copied, change the button to:

“Copied ✓”

The generated result should preserve the user's original meaning while adapting the communication style.

-----------------------------------
6. GENERATION LOGIC
-----------------------------------

If an AI API is available, structure the application so it can easily connect to an AI model.

If no API is configured, create a convincing demo mode with multiple predefined examples and transformations.

Do NOT return the same response for every input.

The logic should follow:

- preserve the user's meaning
- do not invent facts
- remove unnecessary emotional exaggeration
- maintain legitimate concerns
- avoid insults
- avoid robotic language
- keep the message concise
- adjust vocabulary and sentence structure based on tone

Tone definitions:

PROFESSIONAL:
Clear, confident, concise and workplace appropriate.

DIPLOMATIC:
Tactful, constructive and respectful while still communicating the actual issue.

ICE FORMAL:
Highly formal, emotionally neutral and somewhat distant.

FRIENDLY:
Warm, natural, approachable and collaborative.

IMPORTANT:
Do not automatically make every message overly polite.

The user's actual point must remain intact.

-----------------------------------
7. DESIGN
-----------------------------------

Use a premium editorial/SaaS aesthetic.

Use:
- clean white or warm off-white background
- subtle pastel accents
- modern typography
- rounded cards
- subtle shadows
- generous whitespace
- elegant icons
- strong visual hierarchy
- subtle micro-interactions

Avoid:
- childish design
- excessive gradients
- clutter
- generic AI-dashboard aesthetics
- unnecessary animations

Make the application responsive for desktop, tablet and mobile.

Build the complete working application, not a static mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b7229092-240e-4bcf-b5f1-9bb0719da873).

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
