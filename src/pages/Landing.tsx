import React, { useEffect, useMemo, useState } from "react";
import { Link, navigate } from "../lib/router";
import { useI18n } from "../lib/i18n";
import { Btn, Pill, Reveal, CountUp, Stamp, Bar, Icon, I } from "../components/ui";
import { QrBox, QrReal, passportUrl, Donut } from "../components/charts";
import { KasboraLogo } from "../components/Logo";
import { seedDB } from "../data/seed";

const PARTNERS = ["ABC DIGITAL", "SARBON LABS", "PAYZONE", "TEZ YUK", "GREEN CODE", "SAMO MEDIA", "DIGITAAL", "BUXORO SOFT", "UZTECH BANK", "ORZU APP"];

const SAMPLE_QS = [
  { q: "Navigatsiya bloklari uchun semantik teg qaysi?", opts: ["<div>", "<nav> ✓", "<section>", "<span>"] },
  { q: "Eng yuqori CSS spesifikatsiya?", opts: [".class", "#id", "element", "inline style ✓"] },
  { q: "0.1 + 0.2 === 0.3 nega false?", opts: ["JS xatosi", "Aniqlik yo'qotilishi ✓", "Operator xato", "0.3 yo'q"] },
  { q: "Qaysi hook side-effectlar uchun ishlatiladi?", opts: ["useState", "useEffect ✓", "useMemo", "useRef"] },
  { q: "Commit tarixini qaysi buyruq chiziqli qiladi?", opts: ["merge", "rebase ✓", "stash", "cherry-pick"] },
  { q: "Resursni to'liq yangilash metodi?", opts: ["POST", "PUT ✓", "PATCH", "GET"] },
];

const AUDIENCES = [
  { id: "student", tab: "Talaba", title: "aud_st_t", desc: "aud_st_d2", cta: "Talaba sifatida boshlash", to: "/register", chips: ["Assessment", "Mentor", "Real loyiha", "Skill Passport", "QR-verifikatsiya"] },
  { id: "employer", tab: "Ish beruvchi", title: "aud_em_t", desc: "aud_em_d2", cta: "Ish beruvchi sifatida qo'shilish", to: "/login", chips: ["Skill (verified)", "Blind Review", "AI Dashboard", "Interview", "Offer"] },
  { id: "university", tab: "Universitet", title: "aud_un_t", desc: "aud_un_d2", cta: "Universitet sifatida hamkorlik", to: "/login", chips: ["Analytics", "Talabalar", "Employment rate", "Import qilish"] },
] as const;

const STEPS = [
  { t: "st1_t", d: "st1_d", tag: "Nazariya" }, { t: "st2_t", d: "st2_d", tag: "Assessment" },
  { t: "st3_t", d: "st3_d", tag: "Mentor" }, { t: "st4_t", d: "st4_d", tag: "Kompaniya" },
  { t: "st5_t", d: "st5_d", tag: "Skill Passport" }, { t: "st6_t", d: "st6_d", tag: "Offer" },
];

const PERSONAS = [
  { name: "Ali Karimov", role: "Frontend Developer", year: "2026", initials: "AK", seed: "kasbora.uz/p/alikarimov", wrs: 84, projects: 3, assessments: 7, er: "4.7", skills: [["React", 86, "ASSESSMENT"], ["JavaScript", 82, "ASSESSMENT"], ["Git", 91, "ASSESSMENT"], ["HTML", 88, "TASK"]] as [string, number, string][] },
  { name: "Madina Yusupova", role: "React Developer", year: "2025", initials: "MY", seed: "kasbora.uz/p/madinayusupova", wrs: 81, projects: 2, assessments: 8, er: "4.9", skills: [["React", 86, "ASSESSMENT"], ["REST API", 74, "ASSESSMENT"], ["Git", 78, "ASSESSMENT"], ["API Int.", 91, "TASK"]] as [string, number, string][] },
  { name: "Bekzod Ergashev", role: "Frontend", year: "2025", initials: "BE", seed: "kasbora.uz/p/bekzod", wrs: 66, projects: 0, assessments: 4, er: "—", skills: [["JavaScript", 79, "ASSESSMENT"], ["Git", 75, "ASSESSMENT"], ["React", 73, "PROJECT"]] as [string, number, string][] },
];

/* ---------- living bits ---------- */
function JourneyRail() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const J = ["O'rganish", "Isbotlash", "Amaliyot", "Real loyiha", "Pasport", "Ish beruvchi", "Suhbat", "Task", "Ishga joylashish"];
  useEffect(() => {
    const iv = setInterval(() => setStep(s => (s + 1) % (J.length + 2)), 950);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="card-soft relative p-4 md:p-5 doc-stripes">
      <div className="flex items-center justify-between mb-3">
        <span className="lbl">{t("Talaba yo'li — jonli simulyatsiya")}</span>
        <span className="live-dot w-2.5 h-2.5 rounded-full bg-coral" />
      </div>
      <div className="relative">
        <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-line" />
        <div className="absolute left-[9px] top-2 w-[2px] bg-pine transition-all duration-700 ease-out"
          style={{ height: `${Math.min(step, J.length - 1) / (J.length - 1) * 100}%` }} />
        {J.map((j, i) => {
          const done = step > i, active = step === i;
          return (
            <div key={j} className="relative flex items-center gap-3 py-[4px]">
              <span className={`z-[1] w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${done ? "bg-pine border-pine text-lime" : active ? "bg-lime border-pine scale-125" : "bg-cream border-line"}`}>
                {done && <Icon d={I.check} size={10} />}
              </span>
              <span className={`text-[12px] font-mono font-bold tracking-wide ${active ? "text-pine" : done ? "text-ink" : "text-ink-soft"} transition-colors`}>{t(j)}</span>
            </div>
          );
        })}
      </div>
      {step > J.length - 1 && (
        <div className="mt-3 anim-pop flex items-center justify-between gap-2 rounded-lg border-[1.5px] border-pine bg-lime-soft px-3 py-2">
          <span className="font-display text-[12px] font-bold text-pine-deep">{t("OFFER QABUL QILINDI → HIRED")}</span>
          <Stamp tone="pine">VERIFIED ✓</Stamp>
        </div>
      )}
    </div>
  );
}

function PassportTeaser() {
  return (
    <div className="card-soft anim-floaty relative bg-doc text-docink p-5 max-w-[340px] mx-auto lg:ml-auto lg:mr-2 z-[2] shadow-[6px_6px_0_0_rgba(217,242,79,0.9)]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[12px] tracking-[0.2em] text-lime">SKILL PASSPORT · UZ</span>
        <QrReal value={passportUrl("alikarimov")} size={52} />
      </div>
      <div className="font-display font-bold text-lg leading-tight">Ali Karimov</div>
      <div className="text-[12px] text-docink/70 mb-3">Frontend Developer · TATU</div>
      <div className="space-y-1.5 font-mono text-[12px]">
        {[["React", 86], ["JavaScript", 82], ["Git", 91]].map(([n, s]) => (
          <div key={n as string} className="flex items-center gap-2">
            <span className="w-24">{n}</span>
            <span className="flex-1 h-[5px] rounded bg-docink/15 overflow-hidden"><span className="block h-full bg-lime" style={{ width: s + "%" }} /></span>
            <span className="font-bold">{s}</span>
            <span className="text-lime"><Icon d={I.check} size={11} /></span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-dashed border-docline flex items-center justify-between">
        <span className="text-[12px] text-docink/70">Work Readiness</span>
        <span className="font-display font-extrabold text-lime text-xl">84<span className="text-[12px] text-docink/60">/100</span></span>
      </div>
      <div className="absolute -top-3 -right-3"><Stamp tone="pine" className="bg-lime !text-pine-ink border-pine-ink rotate-6">VERIFIED</Stamp></div>
    </div>
  );
}

function LiveProofCard() {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [closed, setClosed] = useState(false);
  const EV = ["tk1", "tk5", "tk2", "tk3", "tk6"];
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % EV.length), 5000);
    return () => clearInterval(iv);
  }, []);
  if (closed) return null;
  return (
    <div key={idx} className="anim-slide-up card-soft relative flex items-start gap-3 p-3.5 max-w-[340px] mx-auto lg:ml-auto lg:mr-2">
      <span className="live-dot mt-1 w-2 h-2 rounded-full bg-coral shrink-0" />
      <div className="text-[12px] leading-snug min-w-0">{t(EV[idx])}
        <div className="text-[12px] text-ink-soft font-mono mt-0.5 uppercase tracking-wider">KASBORA · live</div>
      </div>
      <button onClick={() => setClosed(true)} className="absolute top-1.5 right-1.5 text-ink-soft hover:text-coral" aria-label={t("Yopish")}>
        <Icon d={I.x} size={12} />
      </button>
    </div>
  );
}

function PassportDemoCard({ p, idx }: { p: typeof PERSONAS[number]; idx: number }) {
  const { t } = useI18n();
  const band = p.wrs >= 85 ? "Yuqori tayyor" : p.wrs >= 70 ? "Ishga tayyor" : "Rivojlanmoqda";
  const bandBg = p.wrs >= 85 ? "bg-pine" : p.wrs >= 70 ? "bg-sky" : "bg-amber";
  return (
    <div key={idx} className="anim-pop perf card bg-doc text-docink p-6 md:p-7 shadow-[8px_8px_0_0_rgba(20,32,26,0.9)] doc-stripes">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="font-mono text-[12px] tracking-[0.25em] text-lime mb-1">O'ZBEKISTON RESPUBLIKASI</div>
          <div className="font-display font-extrabold text-xl md:text-2xl tracking-tight">SKILL PASSPORT</div>
          <div className="font-mono text-[12px] text-docink/60 mt-1">№ UZ-KSB-2025-{String(idx + 1).padStart(4, "0")} · KASBORA</div>
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
            <span className="w-20 text-right text-[12px] text-lime tracking-widest">{src} ✓</span>
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
          <div className="font-mono text-[12px] text-ink-soft text-center leading-relaxed max-w-[220px]">{t("calc_bands")}</div>
        </div>
      </div>
      <p className="mt-5 pt-4 border-t border-dashed border-line text-[12.5px] text-ink-soft">{t("calc_note")}</p>
    </div>
  );
}

/* ---------- page ---------- */
export default function Landing() {
  const { t, theme } = useI18n();
  const [faq, setFaq] = useState(0);
  const [aud, setAud] = useState(0);
  const [menu, setMenu] = useState(false);
  const [skillIdx, setSkillIdx] = useState(2);
  const [passportIdx, setPassportIdx] = useState(0);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const verifiedCount = useMemo(() => (skillId: string) =>
    Object.values(seedDB.studentSkills).flat().filter(s => s.skillId === skillId && s.status === "VERIFIED").length, []);

  const A = AUDIENCES[aud];
  const sq = SAMPLE_QS[skillIdx % SAMPLE_QS.length];
  const TICKS = ["tk1", "tk2", "tk3", "tk4", "tk5", "tk6", "tk7"];
  const FAQS = [["f1q", "f1a"], ["f2q", "f2a"], ["f3q", "f3a"], ["f4q", "f4a"], ["f5q", "f5a"], ["f6q", "f6a"]];
  const TESTIS = [
    { k: "t1", name: "Ali Karimov", role: "Junior Frontend · TATU '26", rot: "-rotate-1" },
    { k: "t2", name: "Zamira Aliyeva", role: "HR Lead · ABC Digital", rot: "rotate-1" },
    { k: "t3", name: "Dilshod Rahimov", role: "Senior Frontend Mentor", rot: "-rotate-[0.5deg]" },
  ];

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-[70] border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03] active:scale-[0.97]" aria-label="KASBORA"><KasboraLogo height={27} light={theme === "dark"} /></Link>
          <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-semibold" aria-label="Asosiy menyu">
            <Link to="/jarayon" className="hover:text-pine transition-colors">{t("Jarayon")}</Link>
            <Link to="/skilllar" className="hover:text-pine transition-colors">{t("Skill'lar")}</Link>
            <Link to="/malaka-pasporti" className="hover:text-pine transition-colors">{t("Skill Passport")}</Link>
            <Link to="/ekotizim" className="hover:text-pine transition-colors">{t("Ekotizim")}</Link>
            <Link to="/faq" className="hover:text-pine transition-colors">{t("FAQ")}</Link>
            <Link to="/login" className="text-ink-soft hover:text-ink transition-colors">{t("Kirish")}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LocaleMini /></div>
            <Link to="/register" className="hidden sm:block"><Btn variant="lime" small>{t("Boshlash →")}</Btn></Link>
            <button className="lg:hidden w-10 h-10 rounded-lg border-[1.5px] border-ink bg-cream flex items-center justify-center" onClick={() => setMenu(!menu)} aria-label={t("Menyu")}>
              <Icon d={menu ? I.x : <path d="M4 7h16M4 12h16M4 17h16" />} size={17} />
            </button>
          </div>
        </div>
        {menu && (
          <div className="lg:hidden border-t border-line bg-paper px-4 py-4 anim-pop">
            <div className="flex items-center justify-between gap-2 mb-3">
              <LocaleMini />
              <Link to="/register"><Btn variant="lime" small>{t("Boshlash →")}</Btn></Link>
            </div>
            <nav className="flex flex-col gap-1 text-[14px] font-semibold">
              {[[t("Jarayon"), "#/jarayon"], [t("Skill'lar"), "#/skilllar"], [t("Skill Passport"), "#/malaka-pasporti"], [t("Ekotizim"), "#/ekotizim"], [t("FAQ"), "#/faq"], [t("Kirish"), "#/login"]].map(([l, h]) => (
                <a key={l} href={h} onClick={() => setMenu(false)} className="py-2.5 border-b border-line/60 last:border-0 hover:text-pine">{l}</a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* OPENER */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 md:pt-12 md:pb-14">
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {AUDIENCES.map((a, i) => (
              <button key={a.id} onClick={() => setAud(i)}
                className={`px-4 py-2 rounded-full border-[1.5px] font-display font-bold text-[12.5px] transition-all btn-press ${aud === i ? "bg-ink text-lime border-ink shadow-[3px_3px_0_0_#0B5D43]" : "bg-paper text-ink-soft border-line hover:border-ink hover:text-ink"}`}>
                {t(a.tab)}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-10 items-start">
          <div className="rev-l in">
            <div className="flex items-center gap-2.5 mb-5 flex-wrap">
              <Pill tone="ink">{t("PILOT · TATU × 10 KOMPANIYA")}</Pill>
              <Pill tone="moss">{t("1 kasb: Junior Frontend Developer")}</Pill>
            </div>
            <h1 className="font-display font-extrabold tracking-tight leading-[1.04] text-[clamp(1.9rem,5vw,3.5rem)]">
              <span className="lm in"><span>{t("Diplom yetarli emas.")}</span></span>
              <span className="lm in" style={{ transitionDelay: "120ms" }}>
                <span className="text-pine relative">{t("Tajribani isbotlang.")}
                  <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7c60-5 180-5 296-2" stroke="#D9F24F" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
                </span>
              </span>
            </h1>
            <p className="mt-5 text-[14.5px] md:text-[16px] text-ink-soft max-w-xl leading-relaxed">{t("hero_sub")}</p>
            <div key={aud} className="anim-pop mt-6 card-soft p-4 md:p-5 max-w-xl border-l-4 !border-l-pine">
              <div className="font-display font-bold text-[15px] mb-1">{t(A.title)}</div>
              <p className="text-[13px] text-ink-soft leading-relaxed mb-3">{t(A.desc)}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {A.chips.map(c => <span key={c} className="font-mono text-[12px] font-bold px-2 py-1 rounded bg-lime-soft border border-pine/30 text-pine-deep">{t(c)}</span>)}
              </div>
              <Btn variant={aud === 1 ? "solid" : "lime"} small onClick={() => navigate(A.to)}>{t(A.cta)} →</Btn>
            </div>
            <div className="mt-7 flex items-center gap-5 font-mono text-[12px] text-ink-soft flex-wrap">
              <span>{t("1 universitet · pilot")}</span>
              <span>{t("10 kompaniya · real loyihalar")}</span>
              <span>{t("100+ talaba · birinchi oqim")}</span>
            </div>
          </div>
          <div className="space-y-4">
            <JourneyRail />
            <PassportTeaser />
            <LiveProofCard />
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="border-y-[1.5px] border-ink bg-cream py-5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-3 flex items-center gap-3 flex-wrap">
          <span className="lbl">{t("Pilotda ishtirok etayotganlar")}</span>
          <span className="flex-1 h-px bg-line" />
          <Pill tone="pine">{t("10 kompaniya · 1 universitet")}</Pill>
        </div>
        <div className="marquee-track flex gap-12 whitespace-nowrap w-max px-4">
          {[...PARTNERS, ...PARTNERS, "TATU", "TATU"].map((p, i) => (
            <span key={i} className={`font-display font-extrabold text-[15px] tracking-wide ${p === "TATU" ? "text-pine" : "text-ink/40 hover:text-ink transition-colors"}`}>{p}</span>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div className="border-b-[1.5px] border-ink bg-doc text-docink overflow-hidden py-2.5">
        <div className="marquee-track flex gap-10 whitespace-nowrap w-max">
          {[...TICKS, ...TICKS].map((k, i) => (
            <span key={i} className="font-mono text-[12px] tracking-wide flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block" />{t(k)}
            </span>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="lbl mb-3">{t("Muammo")}</div>
              <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight">{t("Nazariya bor. Isbot yo'q.")}</h2>
              <p className="mt-4 text-[13.5px] md:text-[14.5px] text-ink-soft leading-relaxed max-w-lg">{t("problem_p")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["78%", "s1", "text-coral"], ["6", "s2", "text-amber"], ["4.2×", "s3", "text-sky"], ["15%", "s4", "text-pine"]].map(([v, k, c], i) => (
                <Reveal key={k} delay={i * 90}>
                  <div className="card-soft p-4 h-full flex flex-col justify-between gap-2 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,32,26,0.12)] transition-all duration-300">
                    <div className={`font-display font-extrabold text-2xl md:text-[1.7rem] ${c}`}>{v}</div>
                    <div className="text-[12px] md:text-[12.5px] text-ink-soft leading-snug">{t(k)}</div>
                  </div>
                </Reveal>
              ))}
              <div className="col-span-2 text-[12px] text-ink-soft font-mono px-1">{t("pilot_note")}</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION INDEX — to'liq bo'limlar alohida sahifalarda */}
      <section className="border-y-[1.5px] border-ink bg-cream">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <div className="lbl mb-2">{t("idx_h")}</div>
              <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight">{t("idx_t")}</h2>
              <p className="text-[13.5px] text-ink-soft mt-3 leading-relaxed">{t("idx_p")}</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { n: "01", to: "/jarayon", t: "KASBORA jarayoni", d: "idx_proc_d", tag: "6 bosqich", ic: I.bolt, edge: "!border-l-pine" },
              { n: "02", to: "/skilllar", t: "Pilotdagi skill'lar", d: "idx_sk_d", tag: "8 skill", ic: I.spark, edge: "!border-l-sky" },
              { n: "03", to: "/malaka-pasporti", t: "Malaka pasporti", d: "idx_pp_d", tag: "QR + PDF", ic: I.passport, edge: "!border-l-amber" },
              { n: "04", to: "/faq", t: "Savol-javob", d: "idx_faq_d", tag: "6 savol", ic: I.doc, edge: "!border-l-coral" },
            ].map((s, i) => (
              <Reveal key={s.to} delay={i * 80}>
                <Link to={s.to} className={`group block card-soft p-6 border-l-4 ${s.edge} hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(20,32,26,0.14)] transition-all duration-300 h-full`}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="w-12 h-12 rounded-lg bg-paper border-[1.5px] border-ink flex items-center justify-center group-hover:bg-lime group-hover:-rotate-6 transition-all duration-300">
                      <Icon d={s.ic} size={20} />
                    </span>
                    <span className="font-display font-extrabold text-3xl text-line group-hover:text-lime transition-colors">{s.n}</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h3 className="font-display font-bold text-[16px] md:text-[17px] group-hover:text-pine transition-colors">{t(s.t)}</h3>
                    <Pill tone="ink">{t(s.tag)}</Pill>
                  </div>
                  <p className="text-[13px] md:text-[13.5px] text-ink-soft leading-relaxed mb-4">{t(s.d)}</p>
                  <span className="inline-flex items-center gap-2 font-display font-bold text-[12.5px] text-pine">
                    {t("full_read")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5"><Icon d={I.arrow} size={15} /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SKILL BADGES — ko'chirildi: /skilllar */}
      {false && <section className="max-w-6xl mx-auto px-4 py-14">
        <Reveal>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
            <div>
              <div className="lbl mb-2">{t("Pilotdagi skill'lar")}</div>
              <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight mb-4">{t("Har badge ortida — real isbot")}</h2>
              <p className="text-[13.5px] md:text-[14px] text-ink-soft leading-relaxed mb-6 max-w-md">{t("skills_p")}</p>
              <div key={skillIdx} className="anim-pop card-soft p-5 max-w-md">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <Pill tone="pine">{seedDB.skills[skillIdx].name} · {verifiedCount(seedDB.skills[skillIdx].id)} ✓ {t("verified")}</Pill>
                  <span className="font-mono text-[12px] text-ink-soft uppercase tracking-wider">{t("Namuna savol")}</span>
                </div>
                <div className="font-display font-bold text-[14.5px] mb-3">{sq.q}</div>
                <div className="grid grid-cols-2 gap-2">
                  {sq.opts.map(o => (
                    <span key={o} className={`text-[12px] font-semibold px-3 py-2 rounded-lg border-[1.5px] ${o.includes("✓") ? "border-pine bg-lime-soft text-pine-deep" : "border-line text-ink-soft"}`}>{o}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3.5 justify-center lg:justify-end content-center">
              {seedDB.skills.map((sk, i) => {
                const active = i === skillIdx;
                return (
                  <button key={sk.id} onClick={() => setSkillIdx(i)}
                    className={`group relative w-[92px] h-[100px] md:w-[104px] md:h-[112px] flex flex-col items-center justify-center gap-0.5 transition-all duration-300 btn-press ${active ? "-translate-y-1" : "hover:-translate-y-1"}`}>
                    <span className={`absolute inset-0 hex ${active ? "bg-pine-deep" : "bg-ink"} transition-colors`} />
                    <span className={`absolute inset-[2.5px] hex ${active ? "bg-pine" : "bg-cream group-hover:bg-pine"} transition-colors`} />
                    <span className={`relative font-display font-extrabold text-[15px] md:text-base ${active ? "text-lime" : "text-ink group-hover:text-lime"} transition-colors`}>{sk.name.split(" ")[0].slice(0, 4)}</span>
                    <span className={`relative text-[12px] font-mono tracking-wider ${active ? "text-cream/80" : "text-ink-soft group-hover:text-cream/80"} transition-colors`}>{sk.name.length > 8 ? sk.name.slice(0, 8) + "…" : sk.name}</span>
                    <span className={`relative font-mono text-[12px] font-bold ${active ? "text-lime" : "text-pine group-hover:text-lime"} transition-colors`}>{verifiedCount(sk.id)} ✓</span>
                  </button>
                );
              })}
              <div className="relative w-[92px] h-[100px] md:w-[104px] md:h-[112px] flex flex-col items-center justify-center opacity-50 cursor-not-allowed">
                <span className="absolute inset-0 rounded-xl border-[1.5px] border-dashed border-ink-soft bg-cream" />
                <span className="relative font-display font-extrabold text-[15px] text-ink-soft">Py</span>
                <span className="relative text-[12px] font-mono tracking-wider text-ink-soft">Python</span>
                <span className="relative font-mono text-[12px] text-ink-soft">{t("tez kunda")}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>}

      {/* PASSPORT DEMO + SECURITY — ko'chirildi: /malaka-pasporti */}
      {false && (
      <section id="passport" className="border-y-[1.5px] border-ink bg-cream">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <Reveal dir="left">
              <div>
                <div className="lbl mb-2">{t("Eng muhim hujjat")}</div>
                <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight mb-4">{t("Skill Passport — sizning isbotingiz")}</h2>
                <p className="text-[13.5px] md:text-[14px] text-ink-soft leading-relaxed mb-5 max-w-lg">{t("passport_p")}</p>
                <div className="flex gap-2 flex-wrap mb-5">
                  {PERSONAS.map((p, i) => (
                    <button key={p.name} onClick={() => setPassportIdx(i)}
                      className={`px-3.5 py-2 rounded-lg border-[1.5px] font-display font-bold text-[12px] transition-all btn-press ${passportIdx === i ? "bg-pine text-cream border-pine shadow-[3px_3px_0_0_#14201A]" : "bg-paper border-line text-ink-soft hover:border-ink hover:text-ink"}`}>
                      {p.name.split(" ")[0]} · {p.wrs}
                    </button>
                  ))}
                </div>
                <div className="space-y-2.5 mb-6">
                  {[["qr", "QR-verifikatsiya", "qr_d"], ["shield", "Anti-cheat monitoring", "ac_d"], ["check", "Mentor tasdig'i", "mt_d"]].map(([ic, n, d], i) => (
                    <div key={n} className="flex items-start gap-3 card-soft px-4 py-3 hover:border-pine transition-colors">
                      <span className="w-8 h-8 rounded-lg bg-lime-soft border-[1.5px] border-pine/40 text-pine flex items-center justify-center shrink-0">
                        <Icon d={(I as Record<string, React.ReactNode>)[ic]} size={15} />
                      </span>
                      <div>
                        <div className="font-display font-bold text-[13px]">{t(n)}</div>
                        <div className="text-[12px] text-ink-soft">{t(d)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link to="/p/alikarimov"><Btn variant="solid">{t("Jonli passport'ni ochish →")}</Btn></Link>
                  <Btn variant="outline" onClick={() => navigate("/register")}>{t("O'zingiznikini quring")}</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative lg:pt-4">
                <PassportDemoCard p={PERSONAS[passportIdx]} idx={passportIdx} />
                <div className="absolute -top-1 right-6 rotate-6 z-[3]"><Stamp className="bg-cream border-pine !text-pine">VERIFIED ✓</Stamp></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={100}><div className="mt-12"><Calculator /></div></Reveal>
        </div>
      </section>
      )}

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <Reveal>
          <div className="lbl mb-2">{t("Haqiqiy ovozlar")}</div>
          <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight mb-8">{t("Pilot ishtirokchilari nima deydi")}</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIS.map((ts, i) => (
            <Reveal key={ts.k} delay={i * 110}>
              <figure className={`card-soft p-5 md:p-6 ${ts.rot} hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,32,26,0.12)] transition-all duration-300 relative h-full flex flex-col`}>
                <span className="absolute -top-2.5 right-5 bg-lime border-[1.5px] border-ink rounded-sm px-2 py-0.5 font-mono text-[12px] font-bold tracking-widest rotate-2">KASBORA</span>
                <span className="text-line mb-2"><Icon d={<path d="M7 7h4v4H7c0 3-1 4-3 5v-2c1-.5 1.5-1.5 1.5-3H7V7zm9 0h4v4h-4c0 3-1 4-3 5v-2c1-.5 1.5-1.5 1.5-3H16V7z" />} size={26} /></span>
                <blockquote className="text-[13.5px] leading-relaxed flex-1">{t(ts.k)}</blockquote>
                <figcaption className="mt-4 pt-4 border-t border-dashed border-line">
                  <div className="font-display font-bold text-[13px]">{ts.name}</div>
                  <div className="text-[12px] text-ink-soft font-mono">{ts.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ECOSYSTEM TEASER */}
      <section className="border-y-[1.5px] border-ink bg-doc text-docink">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
              <div>
                <div className="font-mono text-[12px] tracking-[0.25em] text-lime mb-2">{t("EKOTIZIM")}</div>
                <h2 className="font-display font-extrabold text-[clamp(1.4rem,3vw,2.2rem)] leading-tight">{t("Platforma — veb-saytdan kattaroq")}</h2>
              </div>
              <Link to="/ekotizim"><Btn variant="lime">{t("Ekotizimni ko'rish →")}</Btn></Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[["tg", "e1_t", "e1_d"], ["api", "e2_t", "e2_d"], ["wallet", "e3_t", "e3_d"]].map(([ic, tt, dd], i) => (
              <Reveal key={tt} delay={i * 90}>
                <div className="border border-docline rounded-xl p-5 hover:border-lime/60 hover:bg-docink/[0.04] transition-all duration-300 h-full">
                  <span className="w-10 h-10 rounded-lg bg-lime text-pine-ink flex items-center justify-center mb-3"><Icon d={(I as Record<string, React.ReactNode>)[ic]} size={19} /></span>
                  <div className="font-display font-bold text-[14.5px] mb-1">{t(tt)}</div>
                  <div className="text-[12.5px] text-docink/65 leading-relaxed">{t(dd)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — ko'chirildi: /faq */}
      {false && <section id="faq" className="max-w-3xl mx-auto px-4 py-14">
        <Reveal>
          <div className="lbl mb-2">{t("Savol-javob")}</div>
          <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.2vw,2.2rem)] leading-tight mb-7">{t("Ko'p beriladigan savollar")}</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map(([fq, fa], i) => (
            <Reveal key={fq} delay={i * 50}>
              <div className={`card-soft overflow-hidden transition-colors ${faq === i ? "bg-lime-soft/60" : ""}`}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setFaq(faq === i ? -1 : i)}>
                  <span className="font-display font-bold text-[13.5px] md:text-[14px]">{t(fq)}</span>
                  <span className={`w-7 h-7 shrink-0 rounded-lg border-[1.5px] border-ink flex items-center justify-center font-bold transition-transform duration-300 ${faq === i ? "bg-pine text-lime rotate-45" : "bg-cream"}`}>+</span>
                </button>
                <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: faq === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden"><p className="px-5 pb-5 text-[13px] md:text-[13.5px] text-ink-soft leading-relaxed">{t(fa)}</p></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border-[1.5px] border-ink bg-doc text-docink p-8 md:p-12">
            <svg className="absolute -right-8 -top-8 opacity-10" width="300" height="300" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path d="M13 8v48M13 32L44 8M13 32l31 24" stroke="#D9F24F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="relative max-w-2xl">
              <div className="font-mono text-[12px] tracking-[0.25em] text-lime mb-3">{t("PILOT OCHIQ · TATU TALABALARI UCHIN")}</div>
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.8vw,2.7rem)] leading-tight mb-4">{t("cta_h")}</h2>
              <p className="text-docink/75 mb-6 text-[14px] md:text-[15px] max-w-xl">{t("cta_p")}</p>
              <div className="flex gap-3 flex-wrap">
                <Btn variant="lime" onClick={() => navigate("/register")}>{t("Start Your Career →")}</Btn>
                <Btn variant="outline" className="!text-docink !border-docline hover:!bg-docink/10" onClick={() => navigate("/login")}>{t("Demo hisoblarni sinash")}</Btn>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[1.5px] border-ink bg-paper">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
          <div>
            <KasboraLogo height={24} light={theme === "dark"} />
            <p className="mt-3 text-[12.5px] text-ink-soft max-w-xs leading-relaxed">{t("footer_about")}</p>
            <div className="mt-3 font-mono text-[12px] tracking-widest text-pine">LEARN · PROVE · EXPERIENCE · GET HIRED</div>
          </div>
          {[
            { h: t("Platforma"), items: [[t("Jarayon"), "#/jarayon"], [t("Skill'lar"), "#/skilllar"], [t("Skill Passport"), "#/malaka-pasporti"], [t("Ekotizim"), "#/ekotizim"], [t("FAQ"), "#/faq"], [t("Demo kirish"), "#/login"]] },
            { h: t("Ishtirokchilar"), items: [[t("Talabalar"), "#/register"], [t("Ish beruvchilar"), "#/login"], [t("Universitetlar"), "#/login"], [t("Mentorlar"), "#/login"]] },
            { h: t("Huquqiy"), items: [[t("Maxfiylik siyosati"), "#/faq"], [t("Shartlar"), "#/faq"], [t("Shaxsiy ma'lumotlar"), "#/faq"], ["hello@kasbora.uz", "#/login"]] },
          ].map(col => (
            <div key={col.h}>
              <div className="lbl mb-3">{col.h}</div>
              <ul className="space-y-2 text-[13px] font-semibold">
                {col.items.map(([l, h]) => <li key={l}><a className="hover:text-pine transition-colors" href={h}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="max-w-6xl mx-auto px-4 py-4 pb-24 md:pb-4 flex items-center justify-between flex-wrap gap-2 text-[12px] text-ink-soft font-mono">
            <span>{t("footer_rights")}</span>
            <span>{t("footer_mvp")}</span>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className={`fixed bottom-0 inset-x-0 z-[65] md:hidden border-t-[1.5px] border-ink bg-paper/95 backdrop-blur px-4 py-2.5 flex items-center gap-3 transition-transform duration-300 ${sticky ? "translate-y-0" : "translate-y-full"}`}>
        <div className="min-w-0">
          <div className="font-display font-bold text-[12.5px] leading-tight">{t("Tajribani isbotlang")}</div>
          <div className="text-[12px] text-ink-soft font-mono">{t("bepul · 10 daqiqada boshlanadi")}</div>
        </div>
        <div className="ml-auto"><Btn variant="lime" small onClick={() => navigate("/register")}>{t("Boshlash →")}</Btn></div>
      </div>
    </div>
  );
}

/* mini locale controls for landing header (imported at top level) */
import { LocaleControls as LocaleMini } from "../lib/i18n";
