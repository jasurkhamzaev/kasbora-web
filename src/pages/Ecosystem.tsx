import React, { useState } from "react";
import { Link, navigate } from "../lib/router";
import { useI18n, LocaleControls } from "../lib/i18n";
import { Btn, Pill, Reveal, Stamp, Icon, I } from "../components/ui";
import { KasboraLogo } from "../components/Logo";
import { QrBox, QrReal } from "../components/charts";

const API_ENDPOINTS = [
  {
    m: "GET", path: "/api/v1/passports/{username}",
    desc: "Skill Passport verifikatsiyasi — QR kod skanerlanganda chaqiriladi",
    res: `{
  "username": "alikarimov",
  "name": "Ali Karimov",
  "verified": true,
  "work_readiness_score": 84,
  "verified_skills": ["React:86", "JavaScript:82", "Git:91"],
  "projects_completed": 3,
  "employer_rating": 4.7,
  "qr_fingerprint": "UZ-KSB-2025-0001",
  "issued_at": "2025-11-02"
}`,
  },
  {
    m: "GET", path: "/api/v1/candidates?skill=react&min_readiness=70",
    desc: "Filtrlangan kandidat qidiruv (employer API key talab qilinadi)",
    res: `{
  "total": 12,
  "candidates": [
    { "username": "alikarimov", "readiness": 84, "skills": 4 },
    { "username": "madinayusupova", "readiness": 81, "skills": 4 }
  ],
  "filters": { "skill": "react", "min_readiness": 70 }
}`,
  },
  {
    m: "GET", path: "/api/v1/readiness/{student_id}",
    desc: "Work Readiness Score — shaffof formula komponentlari bilan",
    res: `{
  "score": 84,
  "band": "Job Ready",
  "breakdown": {
    "assessment": { "weight": 0.30, "value": 85 },
    "practice":   { "weight": 0.20, "value": 88 },
    "project":    { "weight": 0.30, "value": 92 },
    "mentor":     { "weight": 0.10, "value": 90 },
    "employer":   { "weight": 0.10, "value": 75 }
  }
}`,
  },
  {
    m: "POST", path: "/api/v1/assessments/{id}/attempts",
    desc: "Assessment urinishini yuborish (webhook: natija tayyor bo'lganda)",
    res: `{
  "attempt_id": "at_9f2k",
  "status": "completed",
  "score": 82,
  "passed": true,
  "skill_verified": "JavaScript",
  "anti_cheat": { "tab_switches": 0, "pastes": 0 }
}`,
  },
  {
    m: "GET", path: "/api/v1/universities/{id}/stats",
    desc: "Universitet analytics — EduOS dashboard'lari uchun",
    res: `{
  "students": 1240,
  "assessments_completed": 910,
  "projects_completed": 430,
  "interviewed": 210,
  "hired": 87,
  "employment_rate": 0.202,
  "verified_to_hired_rate": 0.15
}`,
  },
];

const CODE_SNIPPET = `const res = await fetch(
  "https://api.kasbora.uz/v1/passports/alikarimov",
  { headers: { Authorization: "Bearer <API_KEY>" } }
);
const passport = await res.json();
// passport.verified === true → QR haqiqiy ✓`;

function PhoneMock() {
  const { t } = useI18n();
  const [notifOpen, setNotifOpen] = useState(false);
  return (
    <div className="relative mx-auto w-[272px] md:w-[292px]">
      <div className="rounded-[2.4rem] border-[3px] border-ink bg-ink p-2.5 shadow-[10px_12px_0_0_rgba(20,32,26,0.25)]">
        <div className="rounded-[1.9rem] overflow-hidden bg-paper relative" style={{ height: 520 }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-ink z-20" />
          {/* tg header */}
          <div className="bg-[#229ED9] text-white px-4 pt-9 pb-3 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-paper text-[#229ED9] font-display font-extrabold text-[13px] flex items-center justify-center">K</span>
            <div className="min-w-0">
              <div className="font-display font-bold text-[13px] leading-tight">KASBORA</div>
              <div className="text-[12px] text-white/80 font-mono">mini app · bot</div>
            </div>
            <button onClick={() => setNotifOpen(!notifOpen)} className="ml-auto relative" aria-label={t("Bildirishnomalar")}>
              <Icon d={I.bell} size={17} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-coral border border-white text-[12px] font-bold flex items-center justify-center live-dot" />
            </button>
          </div>
          {notifOpen && (
            <div className="anim-pop absolute top-[74px] left-3 right-3 z-30 rounded-xl border-[1.5px] border-ink bg-paper shadow-[4px_4px_0_0_rgba(20,32,26,0.3)] p-3 space-y-2">
              {[
                ["Interview taklifi", "ABC Digital · 15:00"],
                ["Assessment natijasi", "JavaScript 82/100 ✓ VERIFIED"],
              ].map(([tt, d]) => (
                <div key={tt} className="flex items-start gap-2 text-[12px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral mt-1 shrink-0" />
                  <span><b>{tt}</b><span className="block text-ink-soft">{d}</span></span>
                </div>
              ))}
            </div>
          )}
          {/* content */}
          <div className="px-4 py-4 space-y-3">
            <div className="rounded-xl border-[1.5px] border-ink bg-doc text-docink p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[12px] tracking-widest text-lime">WORK READINESS</span>
                <span className="font-display font-extrabold text-xl text-lime">84</span>
              </div>
              <div className="h-[7px] rounded bg-docink/15 overflow-hidden"><div className="h-full bg-lime bar-anim" style={{ width: "84%" }} /></div>
              <div className="text-[12px] text-docink/70 font-mono mt-1.5">{t("wr_phone")}</div>
            </div>
            <div className="rounded-xl border-[1.5px] border-line bg-paper p-3">
              <div className="font-display font-bold text-[12.5px] mb-2">{t("Bugungi progress")}</div>
              {[
                { l: "Git assessment", v: "91 ✓", done: true },
                { l: t("Loyiha"), v: t("review'da"), done: false },
                { l: "ABC landing", v: "50%", done: false },
              ].map(x => (
                <div key={x.l} className="flex items-center gap-2 py-1.5 border-b border-dashed border-line last:border-0 text-[12px]">
                  <span className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${x.done ? "bg-pine border-pine text-lime" : "border-line"}`}>{x.done && <Icon d={I.check} size={9} />}</span>
                  <span className="flex-1 truncate">{x.l}</span>
                  <span className={`font-mono font-bold text-[12px] ${x.done ? "text-pine" : "text-ink-soft"}`}>{x.v}</span>
                </div>
              ))}
            </div>
            <button className="w-full rounded-xl border-[1.5px] border-ink bg-lime py-2.5 font-display font-bold text-[12.5px] btn-press shadow-[2px_2px_0_0_#14201A]">
              {t("Keyingi assessment →")}
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 border-t-[1.5px] border-ink bg-cream flex">
            {[I.home, I.tasks, I.passport, I.bell].map((ic, i) => (
              <span key={i} className={`flex-1 py-2.5 flex justify-center ${i === 0 ? "text-pine" : "text-ink-soft/60"}`}><Icon d={ic} size={16} /></span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -left-6 top-16 anim-floaty"><Stamp className="bg-cream !text-[#1B7FB0] border-[#229ED9]">Telegram</Stamp></div>
      <div className="absolute -right-4 bottom-24 anim-floaty" style={{ animationDelay: "0.6s" }}><Stamp tone="pine" className="bg-cream">PWA</Stamp></div>
    </div>
  );
}

export default function Ecosystem() {
  const { t, theme } = useI18n();
  const [ep, setEp] = useState(0);
  const [key, setKey] = useState("ksb_test_4f8d2a");
  const active = API_ENDPOINTS[ep];

  return (
    <div className="min-h-screen dotgrid-bg">
      <header className="sticky top-0 z-[70] border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03]"><KasboraLogo height={27} light={theme === "dark"} /></Link>
          <div className="flex items-center gap-2">
            <LocaleControls className="hidden sm:flex" />
            <Pill tone="ink">{t("EKOTIZIM")}</Pill>
            <Link to="/" className="hidden sm:block"><Btn variant="outline" small>{t("← Bosh sahifa")}</Btn></Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <Reveal>
          <div className="max-w-2xl mb-10">
            <div className="lbl mb-2">{t("KASBORA ekotizimi")}</div>
            <h1 className="font-display font-extrabold text-[clamp(1.7rem,4vw,2.8rem)] leading-tight mb-4">
              {t("eco_h").split("—")[0]}— <span className="text-pine">{t("eco_h").split("—")[1] || ""}</span>
            </h1>
            <p className="text-[14px] md:text-[15px] text-ink-soft leading-relaxed">{t("eco_p")}</p>
          </div>
        </Reveal>

        {/* TELEGRAM + MOBILE */}
        <section className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          <Reveal dir="left"><PhoneMock /></Reveal>
          <Reveal delay={100}>
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Pill tone="sky">{t("PILOTDA JONLI")}</Pill><Pill tone="ink">{t("MOBIL")}</Pill>
              </div>
              <h2 className="font-display font-extrabold text-[clamp(1.4rem,3vw,2.1rem)] leading-tight mb-4">{t("eco_tg_h")}</h2>
              <p className="text-[13.5px] md:text-[14px] text-ink-soft leading-relaxed mb-5 max-w-lg">{t("eco_tg_p")}</p>
              <div className="space-y-2.5 mb-6 max-w-lg">
                {[
                  [t("tg1_t"), t("tg1_d")], [t("tg2_t"), t("tg2_d")], [t("tg3_t"), t("tg3_d")],
                ].map(([tt, d]) => (
                  <div key={tt} className="flex items-start gap-3 card-soft px-4 py-3 hover:border-pine transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-lime-soft border-[1.5px] border-pine/40 text-pine flex items-center justify-center shrink-0 mt-0.5"><Icon d={I.tg} size={14} /></span>
                    <div><div className="font-display font-bold text-[12.5px]">{tt}</div><div className="text-[12.5px] text-ink-soft">{d}</div></div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 card-soft p-4 max-w-lg">
                <QrReal value="https://t.me/kasbora_bot" size={64} />
                <div>
                  <div className="font-display font-bold text-[13.5px]">@kasbora_bot</div>
                  <div className="text-[12px] text-ink-soft font-mono">{t("eco_bot")}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* OPEN API */}
        <section className="mb-16">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap"><Pill tone="ink">OPEN API</Pill><Pill tone="pine">v1 · REST + JSON</Pill></div>
                <h2 className="font-display font-extrabold text-[clamp(1.4rem,3vw,2.1rem)] leading-tight">{t("e2_t")}</h2>
              </div>
              <div className="card-soft px-4 py-2.5 flex items-center gap-2">
                <span className="font-mono text-[12px] text-ink-soft uppercase tracking-wider">{t("API key")}</span>
                <code className="font-mono text-[12.5px] font-bold text-pine">{key}</code>
                <button onClick={() => setKey("ksb_live_" + Math.random().toString(36).slice(2, 8))}
                  className="w-7 h-7 rounded-md border-[1.5px] border-ink bg-cream hover:bg-lime flex items-center justify-center btn-press" aria-label="Rotate key">
                  <Icon d={I.spark} size={13} />
                </button>
              </div>
            </div>
          </Reveal>
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-5">
            <Reveal>
              <div className="space-y-2.5">
                {API_ENDPOINTS.map((e, i) => (
                  <button key={e.path} onClick={() => setEp(i)}
                    className={`w-full text-left card-soft p-4 btn-press transition-all ${ep === i ? "border-pine shadow-[3px_3px_0_0_rgba(11,93,67,0.3)] bg-lime-soft/40" : "hover:border-ink"}`}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className={`font-mono text-[12px] font-bold px-2 py-0.5 rounded border-[1.5px] ${e.m === "GET" ? "text-pine border-pine bg-lime-soft" : "text-amber border-amber bg-amber-soft"}`}>{e.m}</span>
                      <code className="font-mono text-[12px] font-bold truncate">{e.path}</code>
                    </div>
                    <div className="text-[12.5px] text-ink-soft">{e.desc}</div>
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card overflow-hidden shadow-[6px_6px_0_0_rgba(20,32,26,0.9)]">
                <div className="bg-[#0C1712] text-docink px-4 py-2.5 flex items-center gap-2">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral" /><span className="w-2.5 h-2.5 rounded-full bg-amber" /><span className="w-2.5 h-2.5 rounded-full bg-lime" />
                  </span>
                  <span className="font-mono text-[12px] ml-2 text-docink/70 truncate">200 OK · {active.path.split("?")[0]}</span>
                  <span className="ml-auto font-mono text-[12px] text-lime shrink-0">~42ms</span>
                </div>
                <pre key={ep} className="anim-pop bg-[#0C1712] text-[#B8E994] text-[12px] leading-relaxed p-4 md:p-5 overflow-x-auto font-mono">{active.res}</pre>
                <div className="border-t-[1.5px] border-ink bg-cream px-4 py-3">
                  <div className="font-mono text-[12px] text-ink-soft uppercase tracking-wider mb-1.5">{t("Misol — passport verifikatsiya kodi")}</div>
                  <pre className="text-[12px] leading-relaxed font-mono overflow-x-auto">{CODE_SNIPPET}</pre>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section className="mb-16">
          <Reveal>
            <div className="lbl mb-2">{t("Integratsiyalar")}</div>
            <h2 className="font-display font-extrabold text-[clamp(1.4rem,3vw,2.1rem)] leading-tight mb-6">{t("int_d")}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ic: I.wallet, tt: "Click / Payme", d: t("i_click"), s: t("JONLI"), tone: "lime" },
              { ic: I.tg, tt: "Telegram Bot", d: t("i_tg"), s: t("PILOT"), tone: "sky" },
              { ic: I.build, tt: "EduOS / SIS", d: t("i_eduos"), s: t("YO'LDA"), tone: "amber" },
              { ic: I.brief, tt: "HRIS", d: t("i_hris"), s: t("YO'LDA"), tone: "amber" },
              { ic: I.shield, tt: "my.gov.uz", d: t("i_gov"), s: t("REJA"), tone: "coral" },
              { ic: I.api, tt: "Open API", d: t("i_api"), s: t("JONLI"), tone: "lime" },
              { ic: I.mail, tt: "Email", d: t("i_mail"), s: t("JONLI"), tone: "lime" },
              { ic: I.bolt, tt: "Push / SMS", d: t("i_push"), s: t("YO'LDA"), tone: "amber" },
            ].map((c, i) => (
              <Reveal key={c.tt} delay={i * 60}>
                <div className="card-soft p-4 h-full hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,32,26,0.12)] transition-all duration-300 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-lg bg-lime-soft border-[1.5px] border-ink flex items-center justify-center text-pine"><Icon d={c.ic} size={17} /></span>
                    <Pill tone={c.tone}>{c.s}</Pill>
                  </div>
                  <div className="font-display font-bold text-[13.5px] mb-1">{c.tt}</div>
                  <div className="text-[12.5px] text-ink-soft leading-relaxed flex-1">{c.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ROADMAP */}
        <section className="mb-10">
          <Reveal>
            <div className="lbl mb-2">{t("Roadmap")}</div>
            <h2 className="font-display font-extrabold text-[clamp(1.4rem,3vw,2.1rem)] leading-tight mb-6">{t("rm_d")}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { p: t("rm1_p"), tt: t("rm1_t"), items: [t("rm1_1"), t("rm1_2"), t("rm1_3"), t("rm1_4"), t("rm1_5")], c: "border-l-pine", tag: t("JONLI"), tone: "lime" },
              { p: t("rm2_p"), tt: t("rm2_t"), items: [t("rm2_1"), t("rm2_2"), t("rm2_3"), t("rm2_4"), t("rm2_5")], c: "border-l-sky", tag: t("YO'LDA"), tone: "sky" },
              { p: t("rm3_p"), tt: t("rm3_t"), items: [t("rm3_1"), t("rm3_2"), t("rm3_3"), t("rm3_4"), t("rm3_5")], c: "border-l-amber", tag: t("REJA"), tone: "amber" },
            ].map((ph, i) => (
              <Reveal key={ph.p} delay={i * 90}>
                <div className={`card-soft p-5 h-full border-l-4 ${ph.c}`}>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-mono text-[12px] font-bold tracking-widest text-ink-soft">{ph.p}</span>
                    <Pill tone={ph.tone}>{ph.tag}</Pill>
                  </div>
                  <div className="font-display font-bold text-[15px] mb-3">{ph.tt}</div>
                  <ul className="space-y-1.5">
                    {ph.items.map(it => (
                      <li key={it} className="flex items-start gap-2 text-[12.5px] text-ink-soft">
                        <span className="text-pine mt-0.5 shrink-0"><Icon d={I.check} size={12} /></span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <div className="card-soft p-6 md:p-8 flex items-center gap-5 flex-wrap border-l-4 !border-l-pine">
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold text-[16px] mb-1">{t("Ekotizimni ko'rish →").replace(" →", "")}</div>
              <div className="text-[13px] text-ink-soft">{t("demo_login_d")} <code className="font-mono bg-cream px-1.5 py-0.5 rounded border border-line font-bold">kasbora123</code></div>
            </div>
            <Btn variant="lime" onClick={() => navigate("/login")}>{t("Demo kirish →")}</Btn>
            <Btn variant="outline" onClick={() => navigate("/")}>{t("Bosh sahifa")}</Btn>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
