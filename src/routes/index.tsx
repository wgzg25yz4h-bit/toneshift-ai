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
  ChevronDown,
    GraduationCap,
  MessageCircle,
  Snowflake,
  Sparkles,
  Users,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { rewriteMessage } from "@/lib/toneshift.functions";
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

type Tone = "casual" | "professional" | "diplomatic" | "ice" | "friendly";

const tones = [
  { id: "professional" as const, label: "Professional", copy: "Clear & workplace-ready.", icon: BriefcaseBusiness, color: "blue" },
  { id: "diplomatic" as const, label: "Diplomatic", copy: "Tactful & respectful.", icon: Handshake, color: "rose" },
  { id: "ice" as const, label: "Ice formal", copy: "Distant & precise.", icon: Snowflake, color: "sage" },
  { id: "friendly" as const, label: "Friendly", copy: "Warm & approachable.", icon: Feather, color: "sand" },
];

const spectrum: { id: Tone; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "diplomatic", label: "Diplomatic" },
  { id: "ice", label: "Formal" },
];
const toneName = (t: Tone) => (t === "casual" ? "Casual" : tones.find((x) => x.id === t)!.label);

const examples = [
  { original: "You keep giving me more work and never even say thanks.", tone: "Professional", result: "I’ve noticed that my workload has increased recently, and I’d appreciate discussing how we can prioritize the additional responsibilities." },
  { original: "This deadline is completely unrealistic.", tone: "Diplomatic", result: "I’m concerned that the current deadline may be challenging to meet while maintaining the expected quality. Could we discuss the timeline or priorities?" },
  { original: "Why did you not answer my email?", tone: "Friendly", result: "Hey! Just wanted to follow up on my previous email in case it got buried in your inbox." },
];

const useCases = [
  { title: "Workplace", copy: "Need to push back on your workload without sounding confrontational?", icon: BriefcaseBusiness, sample: "i'm drowning in tasks and you just keep adding more without asking if i even have time", tone: "professional" as Tone },
  { title: "University", copy: "Want to ask a professor for an extension without sounding demanding?", icon: GraduationCap, sample: "i need more time for the essay due friday because i was sick all last week, i literally cant finish it", tone: "diplomatic" as Tone },
  { title: "Teamwork", copy: "Need to address a group member who isn’t contributing?", icon: Users, sample: "jonas hasnt done anything for our group project in 2 weeks and im sick of doing his part", tone: "diplomatic" as Tone },
  { title: "Everyday", copy: "Want to say something honestly without starting an argument?", icon: MessageCircle, sample: "you always cancel our plans last minute and it really annoys me", tone: "friendly" as Tone },
];

function ToneShift() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("diplomatic");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // originalUserInput is the snapshot used for every regeneration; generatedMessage is never reused as input.
  const [originalUserInput, setOriginalUserInput] = useState("");
  const [whatChanged, setWhatChanged] = useState<string[]>([]);
  const [showChanges, setShowChanges] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [outputTone, setOutputTone] = useState<Tone>("diplomatic");
  const rewrite = useServerFn(rewriteMessage);

  const runGeneration = async (source: string, nextTone: Tone) => {
    setError("");
    setLoading(true);
    setCopied(false);
    try {
      const res = await rewrite({ data: { input: source, tone: nextTone } });
      if (!res.ok) { setError(res.error); return; }
      setOriginalUserInput(source);
      setOutputTone(nextTone);
      setOutput(res.message);
      setWhatChanged(res.changes);
      window.setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      setError("We couldn't reach ToneShift. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generate = () => {
    if (loading) return;
    if (!input.trim()) { setError("Give us something to work with first."); return; }
    void runGeneration(input, tone);
  };

  const shiftTone = (next: Tone) => {
    if (loading || !originalUserInput) return;
    setTone(next);
    void runGeneration(originalUserInput, next);
  };

  const tryExample = (sample: string, t: Tone) => {
    setInput(sample);
    setTone(t);
    setError("");
    document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.getElementById("message")?.focus({ preventScroll: true }), 500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = output;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      const succeeded = document.execCommand("copy");
      fallback.remove();
      if (succeeded) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    }
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

            {output && (
              <div ref={outputRef} className={cn("ts-reveal mt-12 scroll-mt-24 border-t-2 border-ink pt-7 transition-opacity", loading && "opacity-50")} aria-busy={loading}>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div className="min-w-0"><p className="ts-section-label">Final copy · Step 03</p><h3 className="mt-2 font-display text-2xl font-medium sm:text-3xl">Output — the send-this zone</h3></div>
                  <span className="inline-flex w-fit items-center gap-2 border border-sage/40 bg-sage/10 px-3 py-1.5 text-xs font-semibold text-sage"><Check className="size-3.5" />Ready to send · {toneName(outputTone)}</span>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <blockquote key={output} className="ts-reveal border-l-4 border-rose bg-paper px-5 py-6 font-serif text-xl leading-relaxed shadow-sm sm:px-7 sm:py-8 sm:text-2xl">“{output}”</blockquote>
                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <Button variant="ink" className="min-h-11 min-w-40" onClick={copy}>{copied ? <><Check />Copied ✓</> : <><Clipboard />Copy message</>}</Button>
                    <Button variant="paper" className="min-h-11 min-w-40" onClick={() => document.getElementById("spectrum")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Try another vibe</Button>
                  </div>
                </div>

                <div className="mt-6 border border-line bg-paper">
                  <button type="button" onClick={() => setShowChanges((v) => !v)} aria-expanded={showChanges} aria-controls="what-changed" className="flex min-h-12 w-full items-center justify-between px-5 text-left font-display text-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    What changed? <ChevronDown className={cn("size-5 transition-transform", showChanges && "rotate-180")} />
                  </button>
                  {showChanges && (
                    <ul id="what-changed" className="grid gap-2 border-t border-line px-5 py-4 sm:grid-cols-2">
                      {whatChanged.map((c) => <li key={c} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-sage" />{c}</li>)}
                    </ul>
                  )}
                </div>

                <div id="spectrum" className="mt-10 scroll-mt-24">
                  <p className="ts-section-label">Tone Spectrum</p>
                  <p className="mt-2 font-serif text-lg text-muted-foreground">Different situations call for different tones. Choose the version that fits your audience.</p>
                  <div className="relative mt-5" role="radiogroup" aria-label="Tone spectrum">
                    <div className="absolute left-[10%] right-[10%] top-[18px] h-px bg-line" aria-hidden="true" />
                    <div className="relative grid grid-cols-5">
                      {spectrum.map((s) => {
                        const active = outputTone === s.id;
                        return (
                          <button key={s.id} type="button" role="radio" aria-checked={active} disabled={loading} onClick={() => shiftTone(s.id)} className="group flex min-h-16 flex-col items-center gap-2 rounded-md text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait">
                            <span className={cn("grid size-9 place-items-center rounded-full border-2 bg-paper transition-all", active ? "border-rose bg-rose text-primary-foreground" : "border-line group-hover:border-ink")}>{active && <Check className="size-4" />}</span>
                            <span className={cn("text-xs sm:text-sm", active ? "font-semibold text-ink" : "text-muted-foreground")}>{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Button variant="paper" className="min-h-11" onClick={() => setShowCompare((v) => !v)} aria-expanded={showCompare}>{showCompare ? "Hide comparison" : "Compare original vs. send-ready"}</Button>
                  {showCompare && (
                    <div className="ts-reveal mt-5 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
                      <div className="border border-line bg-paper p-5"><p className="ts-section-label">Your original message</p><p className="mt-3 whitespace-pre-wrap font-serif text-lg text-muted-foreground">{originalUserInput}</p></div>
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase text-rose md:flex-col"><ArrowRight className="size-4 rotate-90 md:rotate-0" />{toneName(outputTone)}</div>
                      <div className="border-l-4 border-rose bg-paper p-5 shadow-sm"><p className="ts-section-label">Your send-ready version</p><p className="mt-3 font-serif text-lg">{output}</p></div>
                    </div>
                  )}
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

        <section id="why" className="scroll-mt-20 border-y border-line bg-secondary/50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 md:py-20 lg:px-10">
            <p className="ts-section-label">Why tone matters</p>
            <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-medium leading-tight sm:text-4xl">Tone doesn’t change what you mean. It changes how your message is received.</h2>
            <div className="mt-8 grid gap-4">
              {examples.map((e) => (
                <article key={e.original} className="grid items-center gap-3 border border-line bg-paper p-5 md:grid-cols-[1fr_auto_1.4fr] md:gap-6">
                  <div><p className="text-xs font-semibold uppercase text-muted-foreground">Original</p><p className="mt-1 font-serif text-lg">“{e.original}”</p></div>
                  <span className="inline-flex w-fit items-center gap-1.5 border border-rose/40 px-2.5 py-1 text-xs font-semibold uppercase text-rose">{e.tone} <ArrowRight className="size-3.5" /></span>
                  <div><p className="text-xs font-semibold uppercase text-sage">Send-ready</p><p className="mt-1 font-serif text-lg">“{e.result}”</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cases" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-8 md:py-20 lg:px-10">
          <p className="ts-section-label">Use cases</p>
          <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">Built for real-life awkward messages.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u) => {
              const Icon = u.icon;
              return (
                <article key={u.title} className="flex flex-col border border-line bg-card p-5">
                  <Icon className="size-5 text-rose" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl font-medium">{u.title}</h3>
                  <p className="mt-2 flex-1 font-serif leading-snug text-muted-foreground">{u.copy}</p>
                  <Button variant="paper" className="mt-5 min-h-11 w-full" onClick={() => tryExample(u.sample, u.tone)} aria-label={`Try the ${u.title} example`}>Try this <ArrowRight /></Button>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-ink"><div className="mx-auto grid max-w-7xl gap-3 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-8 lg:px-10"><span className="font-display text-lg font-medium text-ink">ToneShift<span className="text-rose">.</span></span><span>Say what you actually feel. Send it the way you mean it.</span></div></footer>
    </div>
  );
}