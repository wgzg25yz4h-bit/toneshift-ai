import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clipboard,
  Feather,
  Handshake,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ToneShift — Say what you feel. Send what you mean." },
      { name: "description", content: "Transform emotional thoughts into clear, appropriate messages with ToneShift." },
      { property: "og:title", content: "ToneShift — Turn your rant into the right words" },
      { property: "og:description", content: "Transform emotional thoughts into clear, appropriate messages you can actually send." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToneShift,
});

type Tone = "professional" | "diplomatic" | "ice" | "friendly";

const tones = [
  { id: "professional" as const, label: "Professional", copy: "Clear & workplace-ready.", icon: BriefcaseBusiness, color: "blue" },
  { id: "diplomatic" as const, label: "Diplomatic", copy: "Tactful & respectful.", icon: Handshake, color: "rose" },
  { id: "ice" as const, label: "Ice formal", copy: "Distant & precise.", icon: Snowflake, color: "sage" },
  { id: "friendly" as const, label: "Friendly", copy: "Warm & approachable.", icon: Feather, color: "sand" },
];

const toneOpeners: Record<Tone, string> = {
  professional: "I'd like to address a concern directly.",
  diplomatic: "I'd like to share something that I think would help us work together more effectively.",
  ice: "I am writing to formally raise a concern.",
  friendly: "Hey — I wanted to share something that's been on my mind.",
};

function transformMessage(input: string, tone: Tone) {
  const text = input.toLowerCase();
  if ((text.includes("boss") || text.includes("manager")) && (text.includes("work") || text.includes("task"))) {
    return {
      professional: "My workload has increased considerably, and I'd like to discuss priorities and how the additional effort can be recognised.",
      diplomatic: "I've noticed my workload has grown recently, and I'd appreciate a conversation about priorities and some acknowledgement of the extra effort involved.",
      ice: "My current workload has increased beyond its previous scope. I would like to request a formal review of priorities and recognition of the additional responsibilities.",
      friendly: "I've been taking on quite a bit more work lately. Could we chat about priorities and how that extra effort is being recognised?",
    }[tone];
  }
  if (text.includes("late") || text.includes("wait")) {
    return {
      professional: "The repeated delays are affecting my schedule. Please let me know when I can reliably expect this to be completed.",
      diplomatic: "The delays have made planning difficult on my side. Could you share a realistic timeline so we can coordinate more effectively?",
      ice: "The agreed timeline has not been met. Please provide a definitive completion date at your earliest convenience.",
      friendly: "The delays have made things a little tricky to plan. Could you let me know what timeline feels realistic from here?",
    }[tone];
  }
  if (text.includes("group") || text.includes("project") || text.includes("team")) {
    return {
      professional: "I need everyone to contribute consistently so we can complete this work fairly and on time. Please confirm which tasks you will own.",
      diplomatic: "I'd like us to rebalance the work so everyone has a clear and fair contribution. Could we agree on individual responsibilities?",
      ice: "The current distribution of responsibilities is unequal. Each team member is requested to confirm ownership of their assigned tasks.",
      friendly: "Could we divide the remaining work more evenly? It would help a lot if everyone picked a clear task to own.",
    }[tone];
  }
  const cleaned = input.trim().replace(/\s+/g, " ").replace(/[!?]{2,}/g, ".").replace(/\b(stupid|idiot|useless|hate)\b/gi, "frustrating");
  const concern = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  const endings: Record<Tone, string> = {
    professional: "I'd appreciate a clear response and a practical way forward.",
    diplomatic: "I'd value your perspective and hope we can find a constructive way forward.",
    ice: "Please advise how this matter will be addressed.",
    friendly: "Could we talk about how to make this work better?",
  };
  return `${toneOpeners[tone]} My concern is that ${concern.replace(/[.]?$/, ".")} ${endings[tone]}`;
}

function ToneShift() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("diplomatic");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const generate = () => {
    if (!input.trim()) {
      setError("Give us something to work with first.");
      return;
    }
    setError("");
    setLoading(true);
    setCopied(false);
    window.setTimeout(() => {
      setOutput(transformMessage(input, tone));
      setLoading(false);
      window.setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }, 850);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-8 lg:px-10">
          <a href="#top" className="min-w-0 font-display text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">ToneShift<span className="text-rose">.</span></a>
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase text-muted-foreground lg:flex" aria-label="Main navigation">
            <a href="#how" className="ts-nav-link">How it works</a>
            <a href="#why" className="ts-nav-link">Why tone matters</a>
            <a href="#cases" className="ts-nav-link">Use cases</a>
          </nav>
          <Button asChild variant="ink" size="pill" className="h-11"><a href="#tool">Start writing <ArrowRight /></a></Button>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-7xl items-end gap-10 px-4 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-16 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-8">
            <p className="ts-kicker mb-5"><Sparkles className="size-3.5" /> AI communication assistant</p>
            <h1 className="max-w-[13ch] text-balance font-display text-5xl font-medium leading-[0.98] sm:text-6xl lg:text-7xl">Turn your rant into the right words.</h1>
          </div>
          <div className="border-l border-line pl-5 lg:col-span-4 lg:mb-1">
            <p className="max-w-[40ch] font-serif text-lg leading-snug text-muted-foreground">Write what you really feel. ToneShift transforms emotional thoughts into messages you can actually send.</p>
            <a href="#tool" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-line underline-offset-8 transition-colors hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Begin with your words <ArrowDown className="size-4" /></a>
          </div>
        </section>

        <section id="tool" className="scroll-mt-20 border-y border-line bg-card py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="mb-7 grid gap-3 border-b border-ink pb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="min-w-0">
                <p className="ts-section-label">The writing desk · Step 01</p>
                <h2 className="mt-2 text-balance font-display text-3xl font-medium sm:text-4xl">Say what you actually feel</h2>
                <p className="mt-2 font-serif text-base text-muted-foreground sm:text-lg">Write it exactly as it comes to mind. No need to make it sound professional.</p>
              </div>
              <p className="hidden text-right text-xs uppercase text-muted-foreground md:block">Write → choose → translate</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className={cn("ts-writing-surface", error && "border-destructive")}>
                  <label htmlFor="message" className="ts-section-label block">Input · your original thought</label>
                  <textarea id="message" value={input} maxLength={500} onChange={(e) => { setInput(e.target.value); setError(""); }} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate(); }} rows={9} placeholder="my boss keeps piling work on me and never says thanks…" className="mt-5 min-h-64 w-full resize-none bg-transparent font-serif text-xl leading-relaxed text-ink outline-none placeholder:text-muted-foreground/70 sm:text-2xl" aria-describedby={error ? "message-error message-count" : "message-count"} aria-invalid={Boolean(error)} />
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">Press ⌘ Enter or Ctrl Enter to translate</span>
                    <span id="message-count" className="ml-auto tabular-nums">{input.length} / 500</span>
                  </div>
                </div>
                <div className="min-h-7" aria-live="polite">{error && <p id="message-error" className="mt-2 text-sm font-medium text-destructive" role="alert">{error}</p>}</div>
              </div>

              <div className="flex flex-col lg:col-span-5">
                <fieldset>
                  <legend className="ts-section-label">Step 02 · Pick a vibe</legend>
                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                    {tones.map((item) => {
                      const Icon = item.icon;
                      const selected = tone === item.id;
                      return (
                        <Button key={item.id} type="button" variant="ghost" onClick={() => setTone(item.id)} aria-pressed={selected} className={cn("ts-tone-card", selected && "ts-tone-card-selected")}>
                          <span className="flex w-full items-start justify-between gap-2">
                            <span className={cn("ts-tone-icon", `ts-tone-${item.color}`)}><Icon /></span>
                            <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border transition-all", selected ? "border-rose bg-rose text-primary-foreground" : "border-line text-transparent")} aria-hidden="true"><Check className="size-3" /></span>
                          </span>
                          <span className="mt-4 block w-full text-left font-display text-base font-medium sm:text-lg">{item.label}</span>
                          <span className="mt-1 block w-full text-left text-xs font-normal leading-snug text-muted-foreground sm:text-sm">{item.copy}</span>
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>

                <Button variant="ink" size="pill" className="mt-6 h-14 w-full text-base shadow-[0_10px_28px_-18px_color-mix(in_oklab,var(--ink)_70%,transparent)]" onClick={generate} disabled={loading} aria-busy={loading}>
                  {loading ? <><Sparkles className="ts-pulse-spark" /><span>Finding the right words<span className="ts-ellipsis" aria-hidden="true">…</span></span></> : <><Sparkles />Translate the rant <ArrowRight /></>}
                </Button>
                <span className="sr-only" aria-live="polite">{loading ? "Finding the right words" : ""}</span>
              </div>
            </div>

            {output && !loading && (
              <div ref={outputRef} className="ts-reveal mt-12 border-t-2 border-ink pt-7">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div className="min-w-0"><p className="ts-section-label">Final copy · Step 03</p><h3 className="mt-2 font-display text-2xl font-medium sm:text-3xl">Output — the send-this zone</h3></div>
                  <span className="inline-flex w-fit items-center gap-2 border border-sage/40 bg-sage/10 px-3 py-1.5 text-xs font-semibold text-sage"><Check className="size-3.5" />Ready to send</span>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <blockquote className="border-l-4 border-rose bg-paper px-5 py-6 font-serif text-xl leading-relaxed shadow-sm sm:px-7 sm:py-8 sm:text-2xl">“{output}”</blockquote>
                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <Button variant="ink" className="min-h-11 min-w-40" onClick={copy}>{copied ? <><Check />Copied ✓</> : <><Clipboard />Copy message</>}</Button>
                    <Button variant="paper" className="min-h-11 min-w-40" onClick={() => { setOutput(""); document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" }); }}>Try another vibe</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-8 md:py-20 lg:px-10">
          <p className="ts-section-label">How it works</p>
          <div className="mt-5 grid border-y border-line md:grid-cols-3">
            {[["01", "Write freely", "Let the frustration out first. No editing, no filtering — just the raw thought."], ["02", "Choose your tone", "Professional, diplomatic, ice formal, or friendly — you pick the register."], ["03", "Send with care", "Copy the result and hit send. The point stays; the heat comes down."]].map(([n, title, copy]) => <article key={n} className="border-b border-line py-6 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"><span className="text-xs font-semibold text-rose">{n}</span><h3 className="mt-3 font-display text-xl font-medium">{title}</h3><p className="mt-2 max-w-[31ch] font-serif leading-snug text-muted-foreground">{copy}</p></article>)}
          </div>
        </section>

        <section id="why" className="border-y border-line bg-secondary/50">
          <div className="mx-auto grid max-w-7xl gap-7 px-4 py-14 sm:px-8 md:grid-cols-2 md:items-center md:py-20 lg:px-10">
            <div><p className="ts-section-label">Why tone matters</p><h2 className="mt-3 max-w-[15ch] font-display text-3xl font-medium leading-tight sm:text-4xl">Your point deserves to land, not get lost in the delivery.</h2></div>
            <p className="max-w-[52ch] border-l border-line pl-5 font-serif text-lg leading-snug text-muted-foreground">Strong feelings often point to a legitimate concern. ToneShift keeps that concern intact while removing the heat that can distract from it.</p>
          </div>
        </section>

        <section id="cases" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-8 md:py-20 lg:px-10">
          <p className="ts-section-label">Use cases</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3"><div><p className="text-xs font-semibold uppercase text-rose">Students</p><p className="mt-2 font-serif text-lg">Group projects, deadline extensions and difficult feedback.</p></div><div><p className="text-xs font-semibold uppercase text-sage">At work</p><p className="mt-2 font-serif text-lg">Workload concerns, boundaries and manager conversations.</p></div><div><p className="text-xs font-semibold uppercase text-blue">Everyday</p><p className="mt-2 font-serif text-lg">Awkward follow-ups, misunderstandings and honest requests.</p></div></div>
        </section>
      </main>

      <footer className="border-t border-ink"><div className="mx-auto grid max-w-7xl gap-3 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-8 lg:px-10"><span className="font-display text-lg font-medium text-ink">ToneShift<span className="text-rose">.</span></span><span>Say what you actually feel. Send it the way you mean it.</span></div></footer>
    </div>
  );
}