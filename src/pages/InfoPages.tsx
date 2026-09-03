import React, { useMemo, useState } from "react";
import { Link } from "../lib/router";
import { useI18n, LocaleControls } from "../lib/i18n";
import { Btn, Pill, Reveal, Stamp, Icon, I } from "../components/ui";
import { QrBox, QrReal, passportUrl, Donut } from "../components/charts";
import { KasboraLogo } from "../components/Logo";
import { seedDB } from "../data/seed";

/* ================= shared shell ================= */
function Shell({ kicker, title, accent, children }: {
  kicker: string; title: React.ReactNode; accent?: React.ReactNode; children: React.ReactNode;
}) {
  const { t, theme } = useI18n();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-[70] border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03] active:scale-[0.97]" aria-label="KASBORA" title={t("Bosh sahifa")}>
              <KasboraLogo height={25} light={theme === "dark"} />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LocaleControls />
            <Link to="/register" className="hidden sm:block"><Btn variant="lime" small>{t("Boshlash →")}</Btn></Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-10 w-full">
        <Reveal>
          <div className="lbl mb-3">{kicker}</div>
          <h1 className="font-display font-extrabold tracking-tight leading-[1.05] text-[clamp(1.8rem,4.6vw,3.2rem)] max-w-3xl">
            {title}{accent}
          </h1>
        </Reveal>
      </section>

      <main className="max-w-6xl mx-auto px-4 w-full flex-1">{children}</main>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 w-full">
        <Reveal>
          <div className="rounded-xl border-[1.5px] border-ink bg-doc text-docink p-7 md:p-10 flex items-center gap-6 flex-wrap doc-stripes">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[12px] tracking-[0.25em] text-lime mb-2">{t("PILOT OCHIQ · TATU TALABALARI UCHUN")}</div>
              <div className="font-display font-extrabold text-[clamp(1.3rem,3vw,2rem)] leading-tight">{t("cta_h")}</div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/register"><Btn variant="lime">{t("Start Your Career →")}</Btn></Link>
              <Link to="/login"><Btn variant="outline" className="!text-docink !border-docline hover:!bg-docink/10">{t("Demo hisoblarni sinash")}</Btn></Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t-[1.5px] border-ink bg-paper">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap gap-2 text-[12px] text-ink-soft font-mono">
          <Link to="/" className="hover:text-pine transition-colors">© 2025 KASBORA</Link>
          <span>{t("footer_mvp")}</span>
        </div>
      </footer>
    </div>
  );
}

/* ================= 1. JARAYON ================= */
const STEPS = [
  { t: "st1_t", d: "st1_d", tag: "Nazariya", ic: I.spark }, { t: "st2_t", d: "st2_d", tag: "Assessment", ic: I.shield },
  { t: "st3_t", d: "st3_d", tag: "Mentor", ic: I.users }, { t: "st4_t", d: "st4_d", tag: "Kompaniya", ic: I.brief },
  { t: "st5_t", d: "st5_d", tag: "Skill Passport", ic: I.passport }, { t: "st6_t", d: "st6_d", tag: "Offer", ic: I.star },
];
const LIFECYCLE = ["APPLIED", "SHORTLISTED", "INTERVIEW", "EMPLOYER_TASK", "PASSED", "OFFER", "HIRED"];

export function ProcessPage() {
  const { t } = useI18n();
  return (
    <Shell kicker={t("KASBORA jarayoni")} title={<> {t("Bilimdan ishga — olti bosqich")}</>}
      accent={<span className="text-pine">.</span>}>
      <Reveal>
        <p className="text-[14.5px] md:text-[15.5px] text-ink-soft leading-relaxed max-w-2xl mb-10">{t("proc_p")}</p>
      </Reveal>

      {/* timeline */}
      <div className="relative mb-14">
        <div className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-2 bottom-2 w-[2.5px] bg-line" />
        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 70}>
              <div className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <span className="absolute left-[22px] md:left-1/2 -translate-x-1/2 top-5 z-[2] w-11 h-11 rounded-xl bg-paper border-[1.5px] border-ink flex items-center justify-center shadow-[2px_2px_0_0_rgba(20,32,26,0.5)]">
                  <Icon d={s.ic} size={19} className="text-pine" />
                </span>
                <div className={`pl-16 md:pl-0 ${i % 2 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                  <div className={`card-soft p-5 md:p-6 btn-press hover:border-pine hover:shadow-[0_14px_30px_rgba(11,93,67,0.14)] hover:-translate-y-1 transition-all duration-300`}>
                    <div className={`flex items-center gap-3 mb-2 flex-wrap ${i % 2 ? "" : "md:justify-end"}`}>
                      <span className="font-display font-extrabold text-3xl text-line">0{i + 1}</span>
                      <h2 className="font-display font-bold text-[16px] md:text-[17px]">{t(s.t)}</h2>
                      <Pill tone={i % 2 ? "sky" : "moss"}>{t(s.tag)}</Pill>
                    </div>
                    <p className="text-[13.5px] md:text-[14px] text-ink-soft leading-relaxed">{t(s.d)}</p>
                  </div>
                </div>
                <div />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* hiring lifecycle */}
      <Reveal>
        <div className="card-soft p-6 md:p-8 mb-6">
          <div className="lbl mb-4">{t("proc_lifecycle")}</div>
          <p className="text-[13.5px] text-ink-soft leading-relaxed max-w-2xl mb-6">{t("proc_lifecycle_d")}</p>
          <div className="flex flex-wrap items-center gap-2">
            {LIFECYCLE.map((s, i) => (
              <React.Fragment key={s}>
                <span className={`px-3 py-1.5 rounded-lg border-[1.5px] font-mono text-[12px] font-bold tracking-wide transition-all hover:-translate-y-0.5 ${s === "HIRED" ? "bg-pine text-lime border-pine" : s === "OFFER" ? "bg-lime-soft border-pine text-pine-deep" : "bg-cream border-ink"}`}>{s}</span>
                {i < LIFECYCLE.length - 1 && <Icon d={I.arrow} size={13} className="text-ink-soft" />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-dashed border-line font-mono text-[12px] text-ink-soft flex items-center gap-2 flex-wrap">
            <Icon d={I.x} size={12} className="text-coral" /> {t("proc_reject")} — <span className="font-bold text-coral">REJECTED</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { ic: I.shield, t: t("Anti-cheat monitoring"), d: t("ac_d") },
            { ic: I.eye, t: "Blind Review", d: t("f5a").slice(0, 90) + "…" },
            { ic: I.star, t: "North Star", d: t("north_star_d") },
          ].map((c, i) => (
            <div key={c.t} className="card-soft p-5 hover:-translate-y-1 hover:border-pine transition-all duration-300">
              <span className="w-9 h-9 rounded-lg bg-lime-soft border-[1.5px] border-ink flex items-center justify-center text-pine mb-3"><Icon d={c.ic} size={17} /></span>
              <div className="font-display font-bold text-[14px] mb-1">{c.t}</div>
              <div className="text-[12.5px] text-ink-soft leading-relaxed">{c.d}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </Shell>
  );
}

/* ================= 2. SKILL'LAR ================= */
const SAMPLE_QS: Record<string, { q: string; opts: string[] }> = {
  sk_html: { q: "Navigatsiya bloklari uchun semantik teg qaysi?", opts: ["<div>", "<nav> ✓", "<section>", "<span>"] },
  sk_css: { q: "Eng yuqori CSS spesifikatsiya?", opts: [".class", "#id", "element", "inline style ✓"] },
  sk_js: { q: "0.1 + 0.2 === 0.3 nega false?", opts: ["JS xatosi", "Aniqlik yo'qotilishi ✓", "Operator xato", "0.3 yo'q"] },
  sk_react: { q: "Qaysi hook side-effectlar uchun ishlatiladi?", opts: ["useState", "useEffect ✓", "useMemo", "useRef"] },
  sk_git: { q: "Commit tarixini qaysi buyruq chiziqli qiladi?", opts: ["merge", "rebase ✓", "stash", "cherry-pick"] },
  sk_rest: { q: "Resursni to'liq yangilash metodi?", opts: ["POST", "PUT ✓", "PATCH", "GET"] },
  sk_qa: { q: "Butun tizimni oxirigacha tekshiradigan test turi?", opts: ["Unit", "Integration", "End-to-end ✓", "Smoke"] },
  sk_figma: { q: "Auto Layout nimani avtomatlashtiradi?", opts: ["Ranglarni", "Joylashuv va padding ✓", "Eksportni", "Kommentariyalarni"] },
};
const SOURCES = ["SELF_DECLARED", "ASSESSMENT", "TASK", "PROJECT", "MENTOR", "EMPLOYER"];
const LEVELS = [["BEGINNER", "0–49"], ["JUNIOR", "50–69"], ["INTERMEDIATE", "70–84"], ["ADVANCED", "85–94"], ["EXPERT", "95–100"]];

export function SkillsInfoPage() {
  const { t } = useI18n();
  const [idx, setIdx] = useState(2);
  const verifiedCount = useMemo(() => (skillId: string) =>
    Object.values(seedDB.studentSkills).flat().filter(s => s.skillId === skillId && s.status === "VERIFIED").length, []);
  const sk = seedDB.skills[idx];
  const sq = SAMPLE_QS[sk.id];
  const asmt = seedDB.assessments.find(a => a.skillId === sk.id);

  return (
    <Shell kicker={t("Pilotdagi skill'lar")} title={t("Har badge ortida — real isbot")} accent={<span className="text-pine">.</span>}>
      <Reveal>
        <p className="text-[14.5px] md:text-[15.5px] text-ink-soft leading-relaxed max-w-2xl mb-10">{t("skills_p")}</p>
      </Reveal>

      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start mb-14">
        {/* hex grid */}
        <Reveal>
          <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start content-start">
            {seedDB.skills.map((s, i) => {
              const active = i === idx;
              return (
                <button key={s.id} onClick={() => setIdx(i)}
                  className={`group relative w-[96px] h-[104px] md:w-[106px] md:h-[114px] flex flex-col items-center justify-center gap-0.5 transition-all duration-300 btn-press ${active ? "-translate-y-1" : "hover:-translate-y-1"}`}>
                  <span className={`absolute inset-0 hex ${active ? "bg-pine-deep" : "bg-ink"} transition-colors`} />
                  <span className={`absolute inset-[2.5px] hex ${active ? "bg-pine" : "bg-cream group-hover:bg-pine"} transition-colors`} />
                  <span className={`relative font-display font-extrabold text-[15px] ${active ? "text-lime" : "text-ink group-hover:text-lime"} transition-colors`}>{s.name.split(" ")[0].slice(0, 4)}</span>
                  <span className={`relative text-[12px] font-mono tracking-wider ${active ? "text-docink/80" : "text-ink-soft group-hover:text-docink/80"} transition-colors`}>{s.name.length > 9 ? s.name.slice(0, 9) + "…" : s.name}</span>
                  <span className={`relative font-mono text-[12px] font-bold ${active ? "text-lime" : "text-pine group-hover:text-lime"} transition-colors`}>{verifiedCount(s.id)} ✓ {t("verified")}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* detail */}
        <Reveal delay={100}>
          <div key={sk.id} className="anim-pop card-soft p-6 md:p-7">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-2xl">{sk.name}</span>
                <Pill tone="moss">{sk.category}</Pill>
              </div>
              {asmt && <Pill tone="ink">{asmt.questions.length} {t("savol")} · {Math.round(asmt.durationSec / 60)} {t("daqiqa")}</Pill>}
            </div>
            {sq ? (
              <>
                <div className="lbl mb-2.5">{t("Namuna savol")}</div>
                <div className="font-display font-bold text-[14.5px] mb-3">{sq.q}</div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {sq.opts.map(o => (
                    <span key={o} className={`text-[12.5px] font-semibold px-3 py-2.5 rounded-lg border-[1.5px] transition-all ${o.includes("✓") ? "border-pine bg-lime-soft text-pine-deep" : "border-line text-ink-soft hover:border-ink"}`}>{o}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border-[1.5px] border-dashed border-line px-4 py-6 text-center font-mono text-[12.5px] text-ink-soft mb-4">{t("tez kunda")}</div>
            )}
            {asmt && (
              <div className="flex items-center gap-2 flex-wrap text-[12.5px] text-ink-soft">
                <Icon d={I.shield} size={14} className="text-pine" />
                {t("O'tish balli")}: <b className="text-ink">{asmt.passing}/100</b> · {t("ac_note")}
              </div>
            )}
            <Link to="/register" className="block mt-5"><Btn variant="lime" small className="w-full">{t("Assessment topshirish")} →</Btn></Link>
          </div>
        </Reveal>
      </div>

      {/* verification sources */}
      <Reveal>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="card-soft p-6">
            <div className="lbl mb-4">{t("sk_sources_h")}</div>
            <div className="space-y-2.5">
              {SOURCES.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-cream border-[1.5px] border-ink flex items-center justify-center font-mono text-[12px] font-bold shrink-0">{i + 1}</span>
                  <span className="font-mono text-[12.5px] font-bold tracking-wide">{s}</span>
                  <span className="flex-1 border-t border-dashed border-line" />
                  {i === 0 ? <Pill tone="amber">{t("isbot_emas")}</Pill> : <Pill tone="pine">VERIFIED ✓</Pill>}
                </div>
              ))}
            </div>
            <p className="mt-4 pt-4 border-t border-dashed border-line text-[12.5px] text-ink-soft leading-relaxed">{t("f2a")}</p>
          </div>
          <div className="card-soft p-6">
            <div className="lbl mb-4">{t("sk_levels_h")}</div>
            <div className="space-y-3">
              {LEVELS.map(([l, r], i) => (
                <div key={l}>
                  <div className="flex justify-between text-[12.5px] mb-1">
                    <span className="font-display font-bold">{l}</span>
                    <span className="font-mono font-bold text-pine">{r}</span>
                  </div>
                  <div className="h-[9px] rounded-full bg-line/50 border border-line overflow-hidden">
                    <div className="h-full rounded-full bar-anim bg-pine" style={{ width: `${20 + i * 20}%`, animationDelay: i * 90 + "ms" }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 pt-4 border-t border-dashed border-line text-[12.5px] text-ink-soft leading-relaxed">{t("sk_levels_d")}</p>
          </div>
        </div>
      </Reveal>
    </Shell>
  );
}

/* ================= 3. MALAKA PASPORTI ================= */
const PERSONAS = [
  { name: "Ali Karimov", role: "Frontend Developer", year: "2026", initials: "AK", seed: "kasbora.uz/p/alikarimov", wrs: 84, projects: 3, assessments: 7, er: "4.7", skills: [["React", 86, "ASSESSMENT"], ["JavaScript", 82, "ASSESSMENT"], ["Git", 91, "ASSESSMENT"], ["HTML", 88, "TASK"]] as [string, number, string][] },
  { name: "Madina Yusupova", role: "React Developer", year: "2025", initials: "MY", seed: "kasbora.uz/p/madinayusupova", wrs: 81, projects: 2, assessments: 8, er: "4.9", skills: [["React", 86, "ASSESSMENT"], ["REST API", 74, "ASSESSMENT"], ["Git", 78, "ASSESSMENT"], ["API Int.", 91, "TASK"]] as [string, number, string][] },
  { name: "Bekzod Ergashev", role: "Frontend", year: "2025", initials: "BE", seed: "kasbora.uz/p/bekzod", wrs: 66, projects: 0, assessments: 4, er: "—", skills: [["JavaScript", 79, "ASSESSMENT"], ["Git", 75, "ASSESSMENT"], ["React", 73, "PROJECT"]] as [string, number, string][] },
];

function PassportDemoCard({ p }: { p: typeof PERSONAS[number] }) {
  const { t } = useI18n();
  const band = p.wrs >= 85 ? "Yuqori tayyor" : p.wrs >= 70 ? "Ishga tayyor" : "Rivojlanmoqda";
  const bandBg = p.wrs >= 85 ? "bg-pine" : p.wrs >= 70 ? "bg-sky" : "bg-amber";
  return (
    <div className="anim-pop perf card bg-doc text-docink p-6 md:p-7 shadow-[8px_8px_0_0_rgba(20,32,26,0.9)] doc-stripes">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="font-mono text-[12px] tracking-[0.25em] text-lime mb-1">{t("pp_rep")}</div>
          <div className="font-display font-extrabold text-xl md:text-2xl tracking-tight">SKILL PASSPORT</div>
          <div className="font-mono text-[12px] text-docink/60 mt-1">№ UZ-KSB-2025-0001 · KASBORA</div>
        </div>
        <QrReal value={passportUrl(p.seed.split("/").pop() || p.seed)} size={70} />
      </div>
      <div className="flex gap-4 items-center mb-5">
        <div className="w-14 h-14 rounded-xl bg-lime text-pine-ink font-display font-extrabold text-xl flex items-center justify-center border-2 border-docink/30 shrink-0">{p.initials}</div>
        <div className="min-w-0">
          <div className="font-display font-bold text-lg truncate">{p.name}</div>
          <div className="text-[12px] text-docink/70 truncate">{p.role} · TATU · {p.year}</div>
        </div>
      </div>
      <div className="space-y-2 font-mono text-[12px] mb-5">
        {p.skills.map(([n, s, src]) => (
          <div key={n} className="flex items-center gap-3 border-b border-dashed border-docline pb-2">
            <span className="w-24 md:w-28 text-docink/85 uppercase">{n}</span>
            <span className="flex-1 h-[5px] rounded bg-docink/15 overflow-hidden"><span className="block h-full bg-lime bar-anim" style={{ width: s + "%" }} /></span>
            <span className="font-bold w-14 text-right">{s}/100</span>
            <span className="w-24 text-right text-[12px] text-lime tracking-widest">{src} ✓</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center mb-5">
        {[[String(p.projects), t("real loyiha")], [String(p.assessments), "assessment"], [p.er, t("employer ★")]].map(([v, l]) => (
          <div key={l} className="rounded-lg border border-docline py-2">
            <div className="font-display font-extrabold text-lg text-lime">{v}</div>
            <div className="text-[12px] font-mono text-docink/60 uppercase tracking-wider">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-docink/60 shrink-0">Work Readiness</span>
        <span className="flex-1 h-2 rounded bg-docink/15 overflow-hidden"><span className={`block h-full bar-anim ${bandBg}`} style={{ width: p.wrs + "%" }} /></span>
        <span className="font-display font-extrabold text-xl text-lime">{p.wrs}</span>
        <span className={`font-mono text-[12px] px-2 py-0.5 rounded-full border ${bandBg} text-docink border-docline`}>{t(band)}</span>
      </div>
    </div>
  );
}

function Calculator() {
  const { t } = useI18n();
  const W = [
    { k: "assessment", label: "c_assessment", weight: 30 }, { k: "practice", label: "c_practice", weight: 20 },
    { k: "project", label: "c_project", weight: 30 }, { k: "mentor", label: "c_mentor", weight: 10 }, { k: "employer", label: "c_employer", weight: 10 },
  ];
  const [v, setV] = useState<Record<string, number>>({ assessment: 85, practice: 78, project: 80, mentor: 90, employer: 40 });
  const total = Math.round(W.reduce((s, w) => s + v[w.k] * w.weight / 100, 0));
  const band = total >= 85 ? ["Yuqori tayyor", "#0B5D43"] : total >= 70 ? ["Ishga tayyor", "#2A7F9E"] : total >= 50 ? ["Rivojlanmoqda", "#B27205"] : ["Boshlang'ich", "#D9431F"];
  const presets = [["Yangi talaba", { assessment: 45, practice: 0, project: 0, mentor: 0, employer: 0 }], ["O'rtacha bitiruvchi", { assessment: 68, practice: 60, project: 30, mentor: 70, employer: 0 }], ["KASBORA bitiruvchisi", { assessment: 86, practice: 88, project: 92, mentor: 90, employer: 75 }]] as const;
  return (
    <div className="card-soft p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="lbl">{t("Interaktiv kalkulyator")}</div>
        <div className="flex gap-2 flex-wrap">
          {presets.map(([n, pv]) => (
            <button key={n} onClick={() => setV({ ...pv })} className="font-mono text-[12px] font-bold px-2.5 py-1 rounded-full border-[1.5px] border-ink bg-cream hover:bg-lime btn-press">{t(n)}</button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div className="space-y-4">
          {W.map(w => (
            <div key={w.k}>
              <div className="flex justify-between text-[12.5px] mb-1.5">
                <span className="font-semibold">{t(w.label)} <span className="font-mono text-[12px] text-pine font-bold">×{w.weight}%</span></span>
                <span className="font-mono font-bold">{v[w.k]}</span>
              </div>
              <input type="range" min={0} max={100} aria-label={t(w.label)} value={v[w.k]} onChange={e => setV({ ...v, [w.k]: Number(e.target.value) })} className="w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 md:pl-6">
          <Donut value={total} size={160} color={band[1]} sub={t("readiness")} />
          <div className="font-display font-bold text-[15px]" style={{ color: band[1] }}>{t(band[0])}</div>
        </div>
      </div>
      <p className="mt-5 pt-4 border-t border-dashed border-line text-[12.5px] text-ink-soft">{t("calc_note")}</p>
      <p className="font-mono text-[12px] text-ink-soft mt-2">{t("calc_bands")}</p>
    </div>
  );
}

export function PassportInfoPage() {
  const { t } = useI18n();
  const [pi, setPi] = useState(0);
  return (
    <Shell kicker={t("Eng muhim hujjat")} title={t("Skill Passport — sizning isbotingiz")} accent={<span className="text-pine">.</span>}>
      <Reveal>
        <p className="text-[14.5px] md:text-[15.5px] text-ink-soft leading-relaxed max-w-2xl mb-10">{t("passport_p")}</p>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-10 items-start mb-14">
        <Reveal>
          <div>
            <div className="flex gap-2 flex-wrap mb-5">
              {PERSONAS.map((p, i) => (
                <button key={p.name} onClick={() => setPi(i)}
                  className={`px-3.5 py-2 rounded-lg border-[1.5px] font-display font-bold text-[12px] transition-all btn-press ${pi === i ? "bg-pine text-cream border-pine shadow-[3px_3px_0_0_rgba(20,32,26,0.6)]" : "bg-paper border-line text-ink-soft hover:border-ink hover:text-ink"}`}>
                  {p.name.split(" ")[0]} · {p.wrs}
                </button>
              ))}
            </div>
            <div className="space-y-2.5 mb-6">
              {[
                { ic: I.qr, n: t("QR-verifikatsiya"), d: t("qr_d") },
                { ic: I.shield, n: t("Anti-cheat monitoring"), d: t("ac_d") },
                { ic: I.check, n: t("Mentor tasdig'i"), d: t("mt_d") },
              ].map(b => (
                <div key={b.n} className="flex items-start gap-3 card-soft px-4 py-3.5 hover:border-pine transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-lime-soft border-[1.5px] border-pine/40 text-pine flex items-center justify-center shrink-0"><Icon d={b.ic} size={16} /></span>
                  <div>
                    <div className="font-display font-bold text-[13.5px]">{b.n}</div>
                    <div className="text-[12.5px] text-ink-soft">{b.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/p/alikarimov"><Btn variant="solid">{t("Jonli passport'ni ochish →")}</Btn></Link>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative lg:pt-4">
            <PassportDemoCard p={PERSONAS[pi]} />
            <div className="absolute -top-1 right-6 rotate-6 z-[3]"><Stamp className="bg-cream border-pine !text-pine">VERIFIED ✓</Stamp></div>
          </div>
        </Reveal>
      </div>

      <Reveal><div className="mb-6"><Calculator /></div></Reveal>

      <Reveal delay={80}>
        <div className="card-soft p-6 md:p-8">
          <div className="lbl mb-4">{t("pp_bands_h")}</div>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { r: "0–49", b: "Boshlang'ich", c: "bg-coral", d: "pp_b1" }, { r: "50–69", b: "Rivojlanmoqda", c: "bg-amber", d: "pp_b2" },
              { r: "70–84", b: "Ishga tayyor", c: "bg-sky", d: "pp_b3" }, { r: "85–100", b: "Yuqori tayyor", c: "bg-pine", d: "pp_b4" },
            ].map((b, i) => (
              <div key={b.r} className="rounded-lg border-[1.5px] border-line p-4 hover:border-ink hover:-translate-y-1 transition-all duration-300">
                <div className={`w-full h-2 rounded-full ${b.c} mb-3 bar-anim`} style={{ width: `${25 + i * 25}%`, animationDelay: i * 100 + "ms" }} />
                <div className="font-mono text-[12px] font-bold text-ink-soft">{b.r}</div>
                <div className="font-display font-bold text-[14px] mb-1">{t(b.b)}</div>
                <div className="text-[12px] text-ink-soft leading-relaxed">{t(b.d)}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Shell>
  );
}

/* ================= 4. FAQ ================= */
export function FaqPage() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);
  const FAQS = [["f1q", "f1a"], ["f2q", "f2a"], ["f3q", "f3a"], ["f4q", "f4a"], ["f5q", "f5a"], ["f6q", "f6a"]];
  return (
    <Shell kicker={t("Savol-javob")} title={t("Ko'p beriladigan savollar")} accent={<span className="text-pine">?</span>}>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start pb-4">
        <div className="space-y-3">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} delay={i * 50}>
              <div className={`card-soft overflow-hidden transition-colors ${open === i ? "bg-lime-soft/60 border-pine" : ""}`}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="font-display font-bold text-[13.5px] md:text-[14.5px] flex items-center gap-3">
                    <span className={`font-mono text-[12px] shrink-0 ${open === i ? "text-pine" : "text-ink-soft"}`}>0{i + 1}</span>{t(q)}
                  </span>
                  <span className={`w-8 h-8 shrink-0 rounded-lg border-[1.5px] border-ink flex items-center justify-center font-bold transition-transform duration-300 ${open === i ? "bg-pine text-lime rotate-45" : "bg-cream"}`}>+</span>
                </button>
                <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden"><p className="px-5 pb-5 pl-[52px] text-[13.5px] text-ink-soft leading-relaxed">{t(a)}</p></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="card-soft p-6 lg:sticky lg:top-24">
            <div className="lbl mb-3">{t("faq_contact")}</div>
            <p className="text-[13.5px] text-ink-soft leading-relaxed mb-5">{t("faq_contact_d")}</p>
            <div className="space-y-2.5 mb-5">
              <a href="mailto:hello@kasbora.uz" className="flex items-center gap-3 rounded-lg border-[1.5px] border-line bg-paper px-4 py-3 hover:border-pine transition-colors">
                <Icon d={I.mail} size={16} className="text-pine" /><span className="font-mono text-[12.5px] font-bold">hello@kasbora.uz</span>
              </a>
              <a href="https://t.me/kasbora_bot" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border-[1.5px] border-line bg-paper px-4 py-3 hover:border-pine transition-colors">
                <Icon d={I.tg} size={16} className="text-pine" /><span className="font-mono text-[12.5px] font-bold">@kasbora_bot</span>
              </a>
            </div>
            <Link to="/register"><Btn variant="lime" className="w-full">{t("Boshlash →")}</Btn></Link>
          </div>
        </Reveal>
      </div>
    </Shell>
  );
}
