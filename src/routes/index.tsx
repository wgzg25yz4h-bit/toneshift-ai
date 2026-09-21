import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clipboard,
  Feather,
  Handshake,
  LoaderCircle,
  Snowflake,
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
    const options: Record<Tone, string> = {
      professional: "My workload has increased considerably, and I'd like to discuss priorities and how the additional effort can be recognised.",
      diplomatic: "I've noticed my workload has grown recently, and I'd appreciate a conversation about priorities and some acknowledgement of the extra effort involved.",
      ice: "My current workload has increased beyond its previous scope. I would like to request a formal review of priorities and recognition of the additional responsibilities.",
      friendly: "I've been taking on quite a bit more work lately. Could we chat about priorities and how that extra effort is being recognised?",
    };
    return options[tone];
  }
  if (text.includes("late") || text.includes("wait")) {
    const options: Record<Tone, string> = {
      professional: "The repeated delays are affecting my schedule. Please let me know when I can reliably expect this to be completed.",
      diplomatic: "The delays have made planning difficult on my side. Could you share a realistic timeline so we can coordinate more effectively?",
      ice: "The agreed timeline has not been met. Please provide a definitive completion date at your earliest convenience.",
      friendly: "The delays have made things a little tricky to plan. Could you let me know what timeline feels realistic from here?",
    };
    return options[tone];
  }
  if (text.includes("group") || text.includes("project") || text.includes("team")) {
    const options: Record<Tone, string> = {
      professional: "I need everyone to contribute consistently so we can complete this work fairly and on time. Please confirm which tasks you will own.",
      diplomatic: "I'd like us to rebalance the work so everyone has a clear and fair contribution. Could we agree on individual responsibilities?",
      ice: "The current distribution of responsibilities is unequal. Each team member is requested to confirm ownership of their assigned tasks.",
      friendly: "Could we divide the remaining work more evenly? It would help a lot if everyone picked a clear task to own.",
    };
    return options[tone];
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
      window.setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    }, 850);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="font-display text-lg font-semibold">ToneShift<span className="text-rose">.</span></a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
            <a href="#how" className="transition-colors hover:text-ink">How it works</a>
            <a href="#why" className="transition-colors hover:text-ink">Why tone matters</a>
            <a href="#cases" className="transition-colors hover:text-ink">Use cases</a>
          </nav>
          <Button asChild variant="ink"><a href="#tool">Start writing <ArrowRight /></a></Button>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-5 sm:px-8">
        <section className="grid items-start gap-10 border-b border-line py-14 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="md:col-span-7">
            <p className="mb-5 inline-flex rounded-full border border-line px-3 py-1 text-xs font-medium uppercase text-muted-foreground">AI communication assistant</p>
            <h1 className="max-w-[14ch] text-balance font-display text-4xl font-medium leading-none sm:text-5xl lg:text-[3.5rem]">Turn your rant into the right words.</h1>
            <p className="mt-6 max-w-[46ch] text-pretty font-serif text-lg leading-snug text-muted-foreground">Write what you really feel. ToneShift transforms emotional thoughts into messages you can actually send.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="ink" size="pill"><a href="#tool">Start writing <ArrowRight /></a></Button>
              <Button asChild variant="paper" size="pill"><a href="#how">See how it works</a></Button>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-3xl bg-card p-5 shadow-[0_16px_40px_-28px_color-mix(in_oklab,var(--ink)_28%,transparent)] ring-1 ring-ink/5">
              <div className="mb-3 flex justify-between text-[11px] font-medium uppercase text-muted-foreground"><span>From</span><span className="text-rose">Diplomatic</span></div>
              <p className="font-serif text-base leading-snug text-muted-foreground">my boss keeps piling work on me and never says thanks…</p>
              <div className="my-4 flex items-center gap-2 text-muted-foreground"><span className="h-px flex-1 bg-line"/><span>↓</span><span className="h-px flex-1 bg-line"/></div>
              <p className="font-serif text-base leading-snug">I've noticed my workload has grown recently, and I'd appreciate a conversation about priorities and some acknowledgement of the extra effort involved.</p>
            </div>
          </div>
        </section>

        <section id="tool" className="scroll-mt-20 py-14 md:py-20">
          <div className="mx-auto max-w-3xl rounded-[28px] bg-card p-6 shadow-[0_28px_70px_-48px_color-mix(in_oklab,var(--ink)_35%,transparent)] ring-1 ring-ink/5 sm:p-8 md:p-10">
            <h2 className="text-balance font-display text-2xl font-medium sm:text-3xl">Say what you actually feel</h2>
            <p className="mt-2 max-w-[48ch] font-serif text-base leading-snug text-muted-foreground">Write it exactly how it comes to mind. No need to make it sound professional.</p>
            <div className={cn("mt-5 rounded-2xl border bg-paper/60 p-4 transition-colors focus-within:border-rose", error ? "border-destructive" : "border-line")}>
              <textarea value={input} maxLength={500} onChange={(e) => { setInput(e.target.value); setError(""); }} rows={5} placeholder="my boss keeps piling work on me and never says thanks…" className="w-full resize-none bg-transparent font-serif text-base leading-snug text-ink outline-none placeholder:text-muted-foreground/70" aria-label="Your original message"/>
              <div className="mt-2 flex justify-end text-xs tabular-nums text-muted-foreground">{input.length} / 500</div>
            </div>
            {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}

            <p className="mb-3 mt-7 text-sm font-medium">Pick a vibe for the translation</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {tones.map((item) => {
                const Icon = item.icon;
                const selected = tone === item.id;
                return <Button key={item.id} type="button" variant="ghost" onClick={() => setTone(item.id)} aria-pressed={selected} className={cn("h-auto min-h-24 whitespace-normal rounded-2xl border p-4 text-left hover:bg-paper/80", selected ? "border-rose bg-rose/10 ring-1 ring-rose/25" : "border-line bg-paper/50")}>
                  <span className="flex w-full items-start justify-between gap-4">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", item.color === "rose" && "bg-rose/15 text-rose", item.color === "blue" && "bg-blue/15 text-blue", item.color === "sage" && "bg-sage/15 text-sage", item.color === "sand" && "bg-sand/20 text-sand")}><Icon className="size-4"/></span>
                    <span className="min-w-0 flex-1"><span className={cn("flex items-center justify-end gap-1 text-[11px] font-medium uppercase", selected ? "text-rose" : "text-muted-foreground")}>{selected && <Check className="size-3"/>}{item.label}</span><span className="mt-2.5 block text-right text-sm font-normal text-muted-foreground">{item.copy}</span></span>
                  </span>
                </Button>;
              })}
            </div>

            <Button variant="ink" size="pill" className="mt-7 w-full sm:w-auto" onClick={generate} disabled={loading}>
              {loading ? <><LoaderCircle className="ts-spin"/>Finding the right words…</> : <>Translate the rant <ArrowRight /></>}
            </Button>

            {output && !loading && <div ref={outputRef} className="ts-reveal mt-8 border-t border-line pt-7">
              <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-display text-lg font-medium">Output — the send-this zone</h3><span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1 text-xs font-medium text-sage"><span className="size-1.5 rounded-full bg-sage"/>Ready to send</span></div>
              <div className="mt-4 rounded-2xl border border-line bg-paper/60 p-5"><p className="text-pretty font-serif text-lg leading-snug">{output}</p></div>
              <div className="mt-4 flex flex-wrap gap-3"><Button variant="ink" onClick={copy}>{copied ? <><Check />Copied</> : <><Clipboard />Copy message</>}</Button><Button variant="paper" onClick={() => { setOutput(""); document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" }); }}>Try another vibe</Button></div>
            </div>}
          </div>
        </section>

        <section id="how" className="grid scroll-mt-20 gap-6 border-t border-line py-14 md:grid-cols-3 md:py-20">
          {[ ["01", "Write freely", "Let the frustration out first. No editing, no filtering — just the raw thought.", "text-rose"], ["02", "Choose your tone", "Professional, diplomatic, ice formal, or friendly — you pick the register.", "text-sage"], ["03", "Send with care", "Copy the result and hit send. The point stays; the heat comes down.", "text-blue"] ].map(([n,title,copy,color]) => <article key={n} className="rounded-2xl bg-card p-6 ring-1 ring-ink/5"><span className={cn("font-display text-2xl font-medium", color)}>{n}</span><h3 className="mt-3 font-display text-lg font-medium">{title}</h3><p className="mt-1.5 max-w-[30ch] font-serif text-sm leading-snug text-muted-foreground">{copy}</p></article>)}
        </section>

        <section id="why" className="grid scroll-mt-20 gap-8 border-t border-line py-14 md:grid-cols-2 md:items-center md:py-20">
          <h2 className="max-w-[12ch] font-display text-3xl font-medium leading-tight sm:text-4xl">Your point deserves to land, not get lost in the delivery.</h2>
          <p className="max-w-[52ch] font-serif text-lg leading-snug text-muted-foreground">Strong feelings often point to a legitimate concern. ToneShift keeps that concern intact while removing the heat that can distract from it.</p>
        </section>

        <section id="cases" className="scroll-mt-20 border-t border-line py-14 md:py-20">
          <div className="grid gap-8 md:grid-cols-3"><div><p className="text-xs font-medium uppercase text-rose">Students</p><p className="mt-2 font-serif text-lg">Group projects, deadline extensions and difficult feedback.</p></div><div><p className="text-xs font-medium uppercase text-sage">At work</p><p className="mt-2 font-serif text-lg">Workload concerns, boundaries and manager conversations.</p></div><div><p className="text-xs font-medium uppercase text-blue">Everyday</p><p className="mt-2 font-serif text-lg">Awkward follow-ups, misunderstandings and honest requests.</p></div></div>
        </section>
      </main>

      <footer className="border-t border-line"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-8"><span className="font-display text-base font-medium text-ink">ToneShift<span className="text-rose">.</span></span><span>Say what you actually feel. Send it the way you mean it.</span></div></footer>
    </div>
  );
}