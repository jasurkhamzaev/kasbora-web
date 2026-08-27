import React from "react";
import { Link } from "../lib/router";
import { useStore, readiness, skillName } from "../state/store";
import { useI18n } from "../lib/i18n";
import { Btn, Pill, Stamp, Icon, I, Avatar, Empty } from "../components/ui";
import { QrBox, Donut } from "../components/charts";
import { KasboraLogo } from "../components/Logo";
import { LEVEL_LABEL } from "../data/seed";

export default function PassportPage({ username }: { username: string }) {
  const { db, me, toast } = useStore();
  const { t, theme, fmtDate } = useI18n();
  const user = db.users.find(u => u.username === username && u.role === "STUDENT");

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 dotgrid-bg">
        <KasboraLogo height={30} light={theme === "dark"} />
        <div className="card-soft p-8 mt-6 text-center max-w-sm">
          <div className="font-display font-extrabold text-3xl text-coral mb-2">404</div>
          <div className="font-display font-bold text-[15px] mb-1">{t("Topilmadi")}</div>
          <p className="text-[13px] text-ink-soft mb-4">{t("pp_404")}</p>
          <Link to="/"><Btn variant="solid" small>{t("Bosh sahifa")}</Btn></Link>
        </div>
      </div>
    );
  }

  const prof = db.profiles[user.id];
  const isEmployer = me?.role === "EMPLOYER" || me?.role === "ADMIN";
  const hidden = prof?.visibility === "PRIVATE" || (prof?.visibility === "EMPLOYER_ONLY" && !isEmployer);
  const r = readiness(db, user.id);
  const verified = (db.studentSkills[user.id] || []).filter(s => s.status === "VERIFIED");
  const allSkills = db.studentSkills[user.id] || [];
  const projects = db.applications.filter(a => a.studentId === user.id && (a.status === "COMPLETED" || a.status === "IN_PROGRESS"));
  const doneProjects = projects.filter(a => a.status === "COMPLETED");
  const attemptsCount = new Set(db.attempts.filter(a => a.studentId === user.id && a.passed).map(a => a.assessmentId)).size;
  const fbList = db.submissions.filter(s => s.studentId === user.id && s.feedback).map(s => s.feedback!);
  const mentorAvg = fbList.length ? (fbList.reduce((s, f) => s + f.overall, 0) / fbList.length / 20).toFixed(1) : "—";
  const seed = `kasbora.uz/p/${username}`;

  if (hidden) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 dotgrid-bg">
        <KasboraLogo height={30} light={theme === "dark"} />
        <div className="card-soft p-8 mt-6 text-center max-w-md">
          <span className="mx-auto w-14 h-14 rounded-xl bg-amber-soft border-[1.5px] border-amber text-amber flex items-center justify-center mb-4"><Icon d={I.eye} size={24} /></span>
          <div className="font-display font-bold text-[16px] mb-2">{user.name}</div>
          <p className="text-[13px] text-ink-soft leading-relaxed">{t("Skill Passport'ni faqat ish beruvchilarga ko'rinadigan qilib sozlagan.")}</p>
          <Link to="/" className="inline-block mt-5"><Btn variant="solid" small>{t("Bosh sahifa")}</Btn></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dotgrid-bg pb-16">
      {/* top bar (print'da yashirinadi) */}
      <header className="no-print sticky top-0 z-[60] border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="transition-transform hover:scale-[1.03]"><KasboraLogo height={22} light={theme === "dark"} /></Link>
          <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard?.writeText("https://" + seed).catch(() => {}); toast(t("Link nusxalandi"), "info"); }}
              className="h-9 px-3 rounded-lg border-[1.5px] border-ink bg-cream hover:bg-lime-soft flex items-center gap-1.5 font-mono text-[12px] font-bold btn-press transition-colors">
              <Icon d={I.link} size={13} /> kasbora.uz/p/{username}
            </button>
            <Btn variant="solid" small onClick={() => window.print()}><Icon d={I.doc} size={13} /> {t("PDF eksport")}</Btn>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="lbl mb-3 no-print">{t("pp_pub")} · QR-verifikatsiya</div>

        {/* DOCUMENT */}
        <div className="perf card bg-doc text-docink p-6 md:p-9 shadow-[10px_10px_0_0_rgba(20,32,26,0.9)] doc-stripes">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
            <div>
              <div className="font-mono text-[12px] tracking-[0.28em] text-lime mb-1.5">O'ZBEKISTON RESPUBLIKASI</div>
              <h1 className="font-display font-extrabold text-[clamp(1.6rem,4.5vw,2.5rem)] tracking-tight leading-none">SKILL PASSPORT</h1>
              <div className="font-mono text-[12px] text-docink/60 mt-2">№ UZ-KSB-2025-{String(user.id.length * 7919 % 9000 + 1000)} · KASBORA · {fmtDate(prof?.joined || "2025-01-01")}</div>
            </div>
            <QrBox seed={seed} size={92} />
          </div>

          {/* holder */}
          <div className="flex items-center gap-4 mb-7 flex-wrap">
            <Avatar name={user.name} color={user.color} size={64} />
            <div className="min-w-0 flex-1">
              <div className="font-display font-extrabold text-xl md:text-2xl">{user.name}</div>
              <div className="text-[13px] text-docink/70">{prof?.specialization || "Frontend Developer"} · {prof?.university} · '{String(prof?.gradYear || "").slice(2)} · {prof?.city}</div>
              {prof?.about && <p className="text-[12.5px] text-docink/60 mt-1.5 max-w-lg leading-relaxed">{prof.about}</p>}
            </div>
            <div className="absolute right-8 top-24 hidden md:block rotate-6"><Stamp className="bg-doc !text-lime border-lime">VERIFIED ✓</Stamp></div>
          </div>

          <div className="grid md:grid-cols-[1.25fr_1fr] gap-7">
            {/* skills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[12px] tracking-[0.2em] text-lime">{t("Tasdiqlangan skill'lar").toUpperCase()}</span>
                <span className="font-mono text-[12px] text-docink/60">{verified.length}/{allSkills.length}</span>
              </div>
              <div className="space-y-2.5">
                {allSkills.map(s => (
                  <div key={s.skillId} className="flex items-center gap-3 border-b border-dashed border-docline pb-2 font-mono text-[12.5px]">
                    <span className="w-24 md:w-28 text-docink/90 uppercase">{skillName(db, s.skillId)}</span>
                    <span className="flex-1 h-[6px] rounded bg-docink/15 overflow-hidden">
                      <span className={`block h-full bar-anim ${s.status === "VERIFIED" ? "bg-lime" : "bg-docink/30"}`} style={{ width: (s.score || 35) + "%" }} />
                    </span>
                    <span className="font-bold w-14 text-right">{s.score ? s.score + "/100" : "—"}</span>
                    {s.status === "VERIFIED"
                      ? <span className="w-24 text-right text-[12px] text-lime tracking-wider">{s.source} ✓</span>
                      : <span className="w-24 text-right text-[12px] text-docink/50">{t("self-declared")}</span>}
                  </div>
                ))}
                {allSkills.length === 0 && <p className="text-[12.5px] text-docink/60 font-mono">{t("skill_empty")}</p>}
              </div>

              {/* projects */}
              <div className="font-mono text-[12px] tracking-[0.2em] text-lime mt-6 mb-3">{t("Real loyihalar").toUpperCase()}</div>
              <div className="space-y-2.5">
                {projects.map(a => {
                  const p = db.projects.find(x => x.id === a.projectId)!;
                  const company = db.users.find(u => u.id === p.companyId);
                  return (
                    <div key={a.id} className="rounded-lg border border-docline px-3.5 py-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-display font-bold text-[13px]">{p.title}</span>
                        <span className="font-mono text-[12px] text-lime">{a.status === "COMPLETED" ? "✓" : `${a.progress}%`}</span>
                      </div>
                      <div className="font-mono text-[12px] text-docink/60 mt-0.5">
                        {company?.org} · {p.durationDays} {t("kun")}
                        {a.status === "COMPLETED" && p.employerRating ? ` · ${t("employer ★")} ${p.employerRating}/5` : ""}
                      </div>
                    </div>
                  );
                })}
                {projects.length === 0 && <p className="text-[12.5px] text-docink/60 font-mono">—</p>}
              </div>
            </div>

            {/* readiness */}
            <div className="flex flex-col items-center text-center">
              <Donut value={r.score} size={170} color="#D9F24F" sub={t("readiness")}
                label={<span className="font-display font-extrabold text-4xl text-lime">{r.score}</span>} />
              <div className="font-display font-bold text-[15px] mt-2 text-lime">{t(r.band)}</div>
              <div className="font-mono text-[12px] text-docink/60 mt-1">{t("Ochiq formula: 30/20/30/10/10")}</div>
              <div className="grid grid-cols-3 gap-2.5 w-full mt-5">
                {[[String(doneProjects.length), t("real loyiha")], [String(attemptsCount), "assessment"], [String(mentorAvg), t("Mentor reytingi")]].map(([v, l]) => (
                  <div key={l} className="rounded-lg border border-docline py-2.5">
                    <div className="font-display font-extrabold text-lg text-lime">{v}</div>
                    <div className="font-mono text-[12px] text-docink/60 uppercase tracking-wider leading-tight">{l}</div>
                  </div>
                ))}
              </div>
              <div className="w-full mt-5 pt-4 border-t border-dashed border-docline space-y-1.5 text-left">
                {r.parts.map(p => (
                  <div key={p.key} className="flex items-center gap-2 font-mono text-[12px]">
                    <span className="w-32 text-docink/75">{t(p.label)}</span>
                    <span className="flex-1 h-[4px] rounded bg-docink/15 overflow-hidden"><span className="block h-full bg-lime/80" style={{ width: (p.value * p.weight / 30) + "%" }} /></span>
                    <span className="w-16 text-right font-bold text-docink">{p.value}×{p.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* footer of the document */}
          <div className="mt-8 pt-4 border-t border-dashed border-docline flex items-center justify-between gap-3 flex-wrap">
            <span className="font-mono text-[12px] text-docink/55 max-w-md leading-relaxed">{t("pp_gen")}</span>
            <div className="flex items-center gap-2">
              <Pill tone="lime">{user.username}</Pill>
              <Stamp tone="pine" className="bg-doc !text-lime border-lime">KASBORA ✓</Stamp>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="no-print flex gap-3 flex-wrap justify-center mt-8">
          <Link to="/"><Btn variant="outline">← {t("Bosh sahifa")}</Btn></Link>
          {!me && <Link to="/register"><Btn variant="lime">{t("O'zingiznikini quring")}</Btn></Link>}
        </div>
      </main>
    </div>
  );
}
