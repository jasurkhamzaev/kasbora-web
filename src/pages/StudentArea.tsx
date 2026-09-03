import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../lib/router";
import { useStore, readiness, skillName } from "../state/store";
import { useI18n } from "../lib/i18n";
import { Btn, Pill, StatusPill, Modal, Field, Bar, Empty, Icon, I, Avatar, Stamp } from "../components/ui";
import { Donut } from "../components/charts";
import { uid, now, daysAhead, fmtUZS, LEVEL_LABEL, Attempt } from "../data/seed";

/* ============ ASSESSMENT PLAYER ============ */
function AssessmentPlayer({ assessmentId, onDone }: { assessmentId: string; onDone: () => void }) {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const asmt = db.assessments.find(a => a.id === assessmentId)!;
  const [qs, setQs] = useState(() => [...asmt.questions].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(asmt.durationSec);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pastes, setPastes] = useState(0);
  const [finished, setFinished] = useState<Attempt | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const tick = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(tick); return 0; } return t - 1; }), 1000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    const onVis = () => { if (document.hidden) setTabSwitches(s => s + 1); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const submit = (auto = false) => {
    if (doneRef.current) return; doneRef.current = true;
    const correct = qs.filter(q => answers[q.id] === q.answer).length;
    const pct = Math.round((correct / qs.length) * 100);
    const passed = pct >= asmt.passing;
    const attempt: Attempt = {
      id: uid(), studentId: me!.id, assessmentId: asmt.id, pct, passed,
      level: pct >= 85 ? "ADVANCED" : pct >= 70 ? "INTERMEDIATE" : pct >= 50 ? "JUNIOR" : "BEGINNER",
      attemptNo: db.attempts.filter(a => a.studentId === me!.id && a.assessmentId === asmt.id).length + 1,
      date: now(), tabSwitches, pastes,
    };
    dispatch({
      type: "ATTEMPT", attempt,
      verify: passed ? { skillId: asmt.skillId, level: attempt.level, score: pct } : null,
    });
    setFinished(attempt);
    if (auto) toast(t("Vaqt tugadi — javoblar yuborildi"), "info");
  };

  useEffect(() => { if (timeLeft === 0 && !finished) submit(true); }, [timeLeft]);

  if (finished) {
    return (
      <div className="card-soft p-8 text-center max-w-lg mx-auto anim-pop">
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${finished.passed ? "bg-lime-soft border-[1.5px] border-pine text-pine" : "bg-coral-soft border-[1.5px] border-coral text-coral"}`}>
          <Icon d={finished.passed ? I.check : I.x} size={30} />
        </div>
        <h3 className="font-display font-extrabold text-2xl mb-1">{finished.passed ? t("Tabriklaymiz — o'tdingiz!") : t("Bu safar o'ta olmadingiz")}</h3>
        <div className="font-mono text-[14px] text-ink-soft mb-5">{finished.pct}/100 · {t(LEVEL_LABEL[finished.level])}</div>
        {finished.passed && (
          <div className="rounded-lg bg-lime-soft border-[1.5px] border-pine px-4 py-3 mb-5 flex items-center justify-center gap-2">
            <Stamp tone="pine">VERIFIED ✓</Stamp>
            <span className="text-[13px] font-semibold">{skillName(db, asmt.skillId)} {t("skill VERIFIED bo'ldi")}</span>
          </div>
        )}
        {finished.tabSwitches > 0 && (
          <div className="rounded-lg bg-amber-soft border border-amber/40 px-4 py-2.5 mb-5 text-[12.5px] text-amber">
            {finished.tabSwitches} {t("tab_warn")}
          </div>
        )}
        {!finished.passed && <p className="text-[13px] text-ink-soft mb-5">{t("Qayta tayyorlanib, yana urinib ko'ring")}</p>}
        <div className="flex gap-2 justify-center">
          <Btn variant={finished.passed ? "lime" : "outline"} onClick={onDone}>{t("Dashboard'ga qaytish")}</Btn>
          {!finished.passed && <Btn variant="solid" onClick={() => { setQs([...asmt.questions].sort(() => Math.random() - 0.5)); setAnswers({}); setTimeLeft(asmt.durationSec); setTabSwitches(0); setPastes(0); setFinished(null); setIdx(0); doneRef.current = false; }}>{t("Qayta topshirish")}</Btn>}
        </div>
      </div>
    );
  }

  const q = qs[idx];
  const mm = Math.floor(timeLeft / 60), ss = String(timeLeft % 60).padStart(2, "0");
  return (
    <div className="card-soft p-6 max-w-2xl mx-auto anim-slide-up">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="font-display font-bold text-[15px]">{asmt.title}</div>
        <div className={`font-mono font-bold text-[14px] px-3 py-1 rounded-lg border-[1.5px] ${timeLeft < 60 ? "border-coral text-coral live-dot" : "border-line text-ink"}`}>{mm}:{ss}</div>
      </div>
      <div className="mb-4">
        <Bar value={((idx + 1) / qs.length) * 100} color="var(--color-pine)" h={7} />
        <div className="font-mono text-[12px] text-ink-soft mt-1.5">{t("Savol")} {idx + 1} / {qs.length} · {qs.length} {t("savol")} · {asmt.durationSec / 60} {t("daqiqa")}</div>
      </div>
      <div className="rounded-lg bg-cream border border-line p-4 mb-4">
        <p className="text-[14px] font-semibold leading-relaxed">{q.text}</p>
        {q.code && <pre className="mt-3 rounded-md bg-ink text-lime-soft text-[12px] p-3 overflow-x-auto font-mono">{q.code}</pre>}
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
        {q.options.map((opt, oi) => {
          const sel = answers[q.id] === oi;
          return (
            <button key={oi} onClick={() => setAnswers({ ...answers, [q.id]: oi })}
              onPaste={() => setPastes(p => p + 1)}
              className={`text-left px-4 py-3 rounded-lg border-[1.5px] text-[13px] font-semibold transition-all btn-press ${sel ? "bg-lime-soft border-pine shadow-[2px_2px_0_0_rgba(11,93,67,0.3)]" : "border-line hover:border-ink"}`}>
              <span className={`inline-flex w-5 h-5 rounded-full border-[1.5px] items-center justify-center mr-2 font-mono text-[12px] ${sel ? "bg-pine text-cream border-pine" : "border-ink-soft"}`}>{String.fromCharCode(65 + oi)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <Btn variant="outline" small disabled={idx === 0} onClick={() => setIdx(i => i - 1)}><Icon d={I.x} size={0} className="hidden" />{t("Oldingi")}</Btn>
        {idx < qs.length - 1
          ? <Btn variant="lime" small onClick={() => setIdx(i => i + 1)}>{t("Keyingi")} →</Btn>
          : <Btn variant="lime" small onClick={() => submit()}>{t("Yakunlash ✓")}</Btn>}
      </div>
      <div className="mt-4 pt-3 border-t border-dashed border-line text-[12px] text-ink-soft font-mono">
        {t("ac_note")} {t("urinish. O'tish balli — 70.")}
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */
function Dashboard({ go }: { go: (t: string) => void }) {
  const { db, me } = useStore();
  const { t } = useI18n();
  const r = readiness(db, me!.id);
  const mySkills = (db.studentSkills[me!.id] || []).filter(s => s.status === "VERIFIED");
  const myAttempts = db.attempts.filter(a => a.studentId === me!.id);
  const tasksPassed = db.submissions.filter(s => s.studentId === me!.id && s.status === "PASSED").length;
  const steps = [
    { l: t("Baseline"), d: t("Birinchi assessment"), done: myAttempts.length > 0 },
    { l: t("Verified skills"), d: `${mySkills.length} ${t("tasdiqlangan")}`, done: mySkills.length > 0 },
    { l: t("Hiring tracks"), d: `${tasksPassed} ${t("topshiriq o'tdi")}`, done: tasksPassed > 0 },
    { l: "Readiness", d: `${r.score}/100`, done: r.score >= 70 },
    { l: "Interview", d: db.interviews.some(i => i.studentId === me!.id) ? t("Jarayonda") : t("Kutilmoqda"), done: db.interviews.some(i => i.studentId === me!.id && i.status === "COMPLETED") },
    { l: "Hired", d: db.offers.some(o => o.studentId === me!.id && o.status === "ACCEPTED") ? t("Tabriklaymiz! 🎉") : t("Maqsad"), done: db.offers.some(o => o.studentId === me!.id && o.status === "ACCEPTED") },
  ];
  const hired = steps[5].done;
  return (
    <div className="space-y-5">
      <div className="card-soft p-5 border-l-4 !border-l-pine doc-stripes flex items-center gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="lbl block mb-1">{t("cj_t")}</div>
          <div className="font-display font-extrabold text-xl">{me!.name}</div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((s, i) => (
            <React.Fragment key={s.l}>
              <div className="flex flex-col items-center w-[70px]" title={`${s.l} — ${s.d}`}>
                <span className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center ${s.done ? "bg-pine border-pine text-cream" : "bg-cream border-line text-ink-soft"}`}>
                  <Icon d={s.done ? I.check : I.arrow} size={11} />
                </span>
                <span className="font-mono text-[12px] text-ink-soft mt-1 truncate w-full text-center">{s.l}</span>
              </div>
              {i < steps.length - 1 && <span className={`w-4 h-[2px] -mt-4 ${steps[i + 1].done || s.done ? "bg-pine" : "bg-line"}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-5">
        <div className="card-soft p-5 flex flex-col items-center text-center">
          <Donut value={r.score} size={150} color={r.bandColor} sub={t("readiness")} />
          <div className="font-display font-bold text-[15px] mt-3" style={{ color: r.bandColor }}>{t(r.band)}</div>
          <div className="font-mono text-[12px] text-ink-soft mt-1">{t("Work Readiness Score")}</div>
          <div className="font-mono text-[12px] text-pine mt-0.5">{t("Ochiq formula: 30/20/30/10/10")}</div>
          <Btn variant="outline" small className="mt-4" onClick={() => go("passport")}>{t("Batafsil →")}</Btn>
        </div>

        <div className="space-y-5">
          <div className="card-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="lbl">{t("Verified skill'larim")}</span>
              <Pill tone="pine">{mySkills.length} ✓</Pill>
            </div>
            {mySkills.length === 0
              ? <Empty title={t("Hali verified skill yo'q")} body={t("dash_empty_b")}><Btn variant="lime" small onClick={() => go("assessments")}>{t("Assessment topshirish")}</Btn></Empty>
              : (
                <div className="flex flex-wrap gap-2">
                  {mySkills.map(s => (
                    <span key={s.skillId} className="flex items-center gap-2 rounded-lg bg-lime-soft border-[1.5px] border-pine px-3 py-2">
                      <span className="font-display font-bold text-[13px]">{skillName(db, s.skillId)}</span>
                      <span className="font-mono text-[12px] font-bold text-pine">{s.score}/100</span>
                      <Icon d={I.check} size={12} className="text-pine" />
                    </span>
                  ))}
                </div>
              )}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { ic: I.shield, t: t("Assessment topshirish"), d: t("quick1_d"), g: "assessments" },
              { ic: I.brief, t: t("Loyiha topish"), d: `${db.projects.filter(p => p.status === "APPLICATIONS_OPEN" || p.status === "PUBLISHED").length} ${t("ta ochiq loyiha")}`, g: "projects" },
              { ic: I.passport, t: t("Passport qurish"), d: t("quick3_d"), g: "passport" },
            ].map(c => (
              <button key={c.g} onClick={() => go(c.g)} className="card-soft p-4 text-left btn-press hover:border-pine hover:-translate-y-0.5 transition-all">
                <span className="w-9 h-9 rounded-lg bg-lime-soft border-[1.5px] border-ink flex items-center justify-center text-pine mb-2.5"><Icon d={c.ic} size={17} /></span>
                <div className="font-display font-bold text-[13px]">{c.t}</div>
                <div className="font-mono text-[12px] text-ink-soft mt-0.5">{c.d}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ ASSESSMENTS ============ */
function AssessmentsTab() {
  const { db, me } = useStore();
  const { t } = useI18n();
  const [playing, setPlaying] = useState<string | null>(null);
  const MAX = 3;
  if (playing) return <AssessmentPlayer assessmentId={playing} onDone={() => setPlaying(null)} />;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {db.assessments.map(a => {
        const mine = db.attempts.filter(x => x.studentId === me!.id && x.assessmentId === a.id);
        const best = mine.reduce((m, x) => Math.max(m, x.pct), 0);
        const used = mine.length >= MAX;
        return (
          <div key={a.id} className="card-soft p-5 hover:border-pine transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="font-display font-bold text-[14.5px]">{a.title}</div>
              <Pill tone={mine.some(x => x.passed) ? "pine" : "ink"}>{mine.some(x => x.passed) ? "VERIFIED" : a.difficulty}</Pill>
            </div>
            <div className="font-mono text-[12px] text-ink-soft mb-3">
              {a.questions.length} {t("savol")} · {a.durationSec / 60} {t("daqiqa")} · {t("O'tish balli")}: {a.passing}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-ink-soft">
                {t("Urinishlar")}: {mine.length}/{MAX}{mine.length > 0 && <> · {t("eng yaxshi")}: <b className="text-pine">{best}</b></>}
              </span>
              <Btn variant={mine.some(x => x.passed) ? "outline" : "lime"} small disabled={used && !mine.some(x => x.passed)} onClick={() => setPlaying(a.id)}>
                {used && !mine.some(x => x.passed) ? t("Urinishlar tugadi") : mine.some(x => x.passed) ? t("Qayta topshirish") : t("Boshlash")}
              </Btn>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ TASKS ============ */
function TasksTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const [sub, setSub] = useState<string | null>(null);
  const [text, setText] = useState(""); const [url, setUrl] = useState(""); const [live, setLive] = useState("");
  const task = sub ? db.tasks.find(x => x.id === sub) : null;
  const mySub = (taskId: string) => db.submissions.find(s => s.taskId === taskId && s.studentId === me!.id);
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {db.tasks.map(tk => {
          const s = mySub(tk.id);
          return (
            <div key={tk.id} className="card-soft p-5 hover:border-pine transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="font-display font-bold text-[14.5px]">{tk.title}</div>
                {s ? <StatusPill s={s.status} /> : <Pill tone="moss">{skillName(db, tk.skillId)}</Pill>}
              </div>
              <p className="text-[12.5px] text-ink-soft leading-relaxed mb-3">{tk.description}</p>
              <div className="font-mono text-[12px] text-ink-soft mb-3">{t("deadline")}: {tk.deadlineDays} {t("kun")}</div>
              {s && s.feedback && (
                <div className="rounded-lg bg-cream border border-line px-3.5 py-2.5 mb-3">
                  <div className="font-mono text-[12px] font-bold text-pine mb-1">{s.feedback.overall}/100 · {s.feedback.authorName}</div>
                  <p className="text-[12px] text-ink-soft">{s.feedback.comment}</p>
                </div>
              )}
              {!s && <Btn variant="lime" small onClick={() => { setSub(tk.id); setText(""); setUrl(""); setLive(""); }}>{t("Submission yuborish →")}</Btn>}
              {s && !s.feedback && <span className="font-mono text-[12px] text-amber">{t("mentor tekshiruvida")}</span>}
            </div>
          );
        })}
      </div>
      <Modal open={!!task} onClose={() => setSub(null)} title={t("Submission yuborish →")}>
        {task && (
          <div className="space-y-4">
            <Field label={t("Yechim tavsifi / PR linki")}>
              <textarea className="field min-h-[90px]" value={text} onChange={e => setText(e.target.value)} placeholder={t("izoh_hint")} />
            </Field>
            <Field label="GitHub URL"><input className="field" value={url} onChange={e => setUrl(e.target.value)} placeholder="github.com/…" /></Field>
            <Field label={t("Live preview URL")} hint={t("live_hint")}><input className="field" value={live} onChange={e => setLive(e.target.value)} placeholder="https://…" /></Field>
            <Btn variant="lime" className="w-full" onClick={() => {
              if (text.trim().length < 10) { toast(t("Kamida 10 belgi izoh yozing"), "err"); return; }
              dispatch({ type: "TASK_SUBMIT", sub: { id: uid(), taskId: task.id, studentId: me!.id, status: "SUBMITTED", text: text.trim(), url, liveUrl: live, date: now() } });
              toast(t("Topshiriq yuborildi — mentor tekshiradi"), "ok"); setSub(null);
            }}>{t("Yuborish")} ✓</Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============ PROJECTS ============ */
function ProjectsTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const [apply, setApply] = useState<string | null>(null);
  const [cover, setCover] = useState(""); const [portfolio, setPortfolio] = useState("");
  const open = db.projects.filter(p => p.status === "APPLICATIONS_OPEN" || p.status === "PUBLISHED");
  const applied = (id: string) => db.applications.some(a => a.projectId === id && a.studentId === me!.id);
  const proj = apply ? db.projects.find(p => p.id === apply) : null;
  return (
    <div>
      {open.length === 0 && <Empty title={t("Ochiq loyihalar yo'q")} body={t("Tez orada yangi real kompaniya loyihalari e'lon qilinadi.")} />}
      <div className="grid md:grid-cols-2 gap-4">
        {open.map(p => {
          const company = db.users.find(u => u.id === p.companyId);
          return (
            <div key={p.id} className="card-soft p-5 hover:border-pine transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="font-display font-bold text-[14.5px] leading-snug">{p.title}</div>
                <StatusPill s={p.status} />
              </div>
              <div className="font-mono text-[12px] text-pine font-bold mb-2">{company?.org}</div>
              <p className="text-[12.5px] text-ink-soft leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.skillIds.map(s => <span key={s} className="font-mono text-[12px] px-2 py-0.5 rounded bg-lime-soft border border-pine/30 text-pine-deep font-bold">{skillName(db, s)}</span>)}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-[12px] text-ink-soft">{p.durationDays} {t("kun")} · {fmtUZS(p.payment)}</span>
                {applied(p.id)
                  ? <Pill tone="pine">{t("Ariza berilgan ✓")}</Pill>
                  : <Btn variant="lime" small onClick={() => { setApply(p.id); setCover(""); }}>{t("Apply →")}</Btn>}
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={!!proj} onClose={() => setApply(null)} title={proj?.title || ""}>
        <div className="space-y-4">
          <Field label={t("Cover message *")} hint={t("cover_hint")}>
            <textarea className="field min-h-[100px]" value={cover} onChange={e => setCover(e.target.value)} />
          </Field>
          <Field label="Portfolio"><input className="field" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://…" /></Field>
          <Btn variant="lime" className="w-full" onClick={() => {
            if (cover.trim().length < 20) { toast(t("err_cover"), "err"); return; }
            dispatch({ type: "APPLY", app: { id: uid(), projectId: proj!.id, studentId: me!.id, cover: cover.trim(), portfolio, status: "APPLIED", date: now(), progress: 0 } });
            toast(t("Ariza yuborildi! Employer ko'rib chiqadi"), "ok"); setApply(null);
          }}>{t("Ariza yuborish ✓")}</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ============ APPLICATIONS ============ */
function ApplicationsTab({ go }: { go: (t: string) => void }) {
  const { db, me } = useStore();
  const { t } = useI18n();
  const mine = db.applications.filter(a => a.studentId === me!.id);
  if (mine.length === 0) return <Empty title={t("Arizalar yo'q")} body={t("appl_empty_b")}><Btn variant="lime" small onClick={() => go("projects")}>{t("Loyihalarni ko'rish")}</Btn></Empty>;
  return (
    <div className="space-y-3">
      {mine.map(a => {
        const p = db.projects.find(x => x.id === a.projectId);
        const company = p ? db.users.find(u => u.id === p.companyId) : null;
        const active = a.status === "ACCEPTED" || a.status === "IN_PROGRESS";
        return (
          <div key={a.id} className="card-soft p-5 hover:border-pine transition-colors">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
              <div>
                <div className="font-display font-bold text-[14.5px]">{p?.title}</div>
                <div className="font-mono text-[12px] text-ink-soft">{company?.org}</div>
              </div>
              <StatusPill s={a.status} />
            </div>
            {active && (
              <div className="mt-3">
                <div className="flex justify-between text-[12px] font-mono mb-1"><span>{t("Loyiha progressi")}</span><span className="font-bold text-pine">{a.progress}%</span></div>
                <Bar value={a.progress} color="var(--color-pine)" />
                <div className="mt-2"><Pill tone="sky">{t("Workspace")}</Pill></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============ INTERVIEWS ============ */
function InterviewsTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t, fmtDate } = useI18n();
  const mine = db.interviews.filter(i => i.studentId === me!.id);
  if (mine.length === 0) return <Empty title={t("Interview yo'q")} body={t("int_empty_b")} />;
  return (
    <div className="space-y-3">
      {mine.map(iv => {
        const company = db.users.find(u => u.id === iv.companyId);
        return (
          <div key={iv.id} className="card-soft p-5 flex items-center gap-4 flex-wrap hover:border-pine transition-colors">
            <span className="w-11 h-11 rounded-xl bg-lime-soft border-[1.5px] border-ink flex items-center justify-center text-pine"><Icon d={I.cal} size={20} /></span>
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold text-[14px]">{company?.org} — {iv.type === "VIDEO" ? t("Video") : iv.type === "OFFICE" ? t("Ofisda") : t("Telefon")}</div>
              <div className="font-mono text-[12px] text-ink-soft">{fmtDate(iv.date)} · {iv.time} · {iv.url}</div>
            </div>
            <StatusPill s={iv.status} />
            {iv.status === "INVITED" && (
              <div className="flex gap-2">
                <Btn variant="lime" small onClick={() => { dispatch({ type: "INTERVIEW_RESPOND", id: iv.id, status: "CONFIRMED" }); toast(t("Interview tasdiqlandi"), "ok"); }}>{t("Qabul qilish ✓")}</Btn>
                <Btn variant="outline" small onClick={() => { dispatch({ type: "INTERVIEW_RESPOND", id: iv.id, status: "DECLINED" }); toast(t("Rad etildi"), "info"); }}>{t("Rad etish")}</Btn>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============ OFFERS ============ */
function OffersTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const mine = db.offers.filter(o => o.studentId === me!.id);
  const etasks = db.employerTasks.filter(x => x.studentId === me!.id);
  const [et, setEt] = useState<string | null>(null); const [etText, setEtText] = useState(""); const [etLive, setEtLive] = useState("");
  const task = et ? etasks.find(x => x.id === et) : null;
  if (mine.length === 0 && etasks.length === 0) return <Empty title={t("off_empty_t")} body={t("off_empty_b")} />;
  return (
    <div className="space-y-3">
      {etasks.map(x => (
        <div key={x.id} className="card-soft p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            <div className="font-display font-bold text-[14px]">{x.title}</div>
            <StatusPill s={x.status} />
          </div>
          <p className="text-[12.5px] text-ink-soft mb-2">{x.description}</p>
          <div className="font-mono text-[12px] text-ink-soft mb-3">deadline: {x.deadline}</div>
          {x.status === "ASSIGNED" && <Btn variant="lime" small onClick={() => { setEt(x.id); setEtText(""); setEtLive(""); }}>{t("Submission yuborish →")}</Btn>}
          {x.status === "SUBMITTED" && <span className="font-mono text-[12px] text-amber">{t("mentor tekshiruvida")}</span>}
          {(x.status === "PASSED" || x.status === "FAILED") && <p className="text-[12.5px]"><b className={x.status === "PASSED" ? "text-pine" : "text-coral"}>{x.score}/100</b> — {x.feedback}</p>}
        </div>
      ))}
      {mine.map(o => {
        const company = db.users.find(u => u.id === o.companyId);
        return (
          <div key={o.id} className="card-soft p-5 border-l-4 !border-l-pine">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
              <div className="font-display font-bold text-[14.5px]">{o.role} — {company?.org}</div>
              <StatusPill s={o.status === "ACCEPTED" ? "HIRED" : o.status} />
            </div>
            <div className="font-mono text-[12px] text-pine font-bold mb-2">{o.salary}</div>
            {o.message && <p className="text-[12.5px] text-ink-soft mb-3">{o.message}</p>}
            {o.status === "ACCEPTED" && (
              <div className="rounded-lg bg-lime-soft border-[1.5px] border-pine px-4 py-3 mb-3">
                <div className="font-display font-bold text-[14px] text-pine-deep mb-1">{t("Tabriklaymiz! 🎉")}</div>
                <p className="text-[12px] text-ink-soft">{t("legal_employer")}</p>
              </div>
            )}
            {o.status === "OFFERED" && (
              <div className="flex gap-2">
                <Btn variant="lime" small onClick={() => { dispatch({ type: "OFFER_RESPOND", id: o.id, status: "ACCEPTED" }); toast(t("Tabriklaymiz! 🎉"), "ok"); }}>{t("Qabul qilish ✓")}</Btn>
                <Btn variant="outline" small onClick={() => dispatch({ type: "OFFER_RESPOND", id: o.id, status: "DECLINED" })}>{t("Rad etish")}</Btn>
              </div>
            )}
          </div>
        );
      })}
      <Modal open={!!task} onClose={() => setEt(null)} title={task?.title || ""}>
        <div className="space-y-4">
          <Field label={t("Yechim tavsifi / PR linki")}><textarea className="field min-h-[100px]" value={etText} onChange={e => setEtText(e.target.value)} /></Field>
          <Field label={t("Live preview URL")}><input className="field" value={etLive} onChange={e => setEtLive(e.target.value)} placeholder="https://…" /></Field>
          <Btn variant="lime" className="w-full" onClick={() => {
            if (etText.trim().length < 10) { toast(t("Kamida 10 belgi izoh yozing"), "err"); return; }
            dispatch({ type: "ETASK_SUBMIT", id: task!.id, submission: etText.trim(), liveUrl: etLive });
            toast(t("Employer task yuborildi"), "ok"); setEt(null);
          }}>{t("Yuborish")} ✓</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ============ PASSPORT TAB ============ */
function PassportTab() {
  const { db, me } = useStore();
  const { t } = useI18n();
  const r = readiness(db, me!.id);
  const link = `${window.location.origin}${window.location.pathname}#/p/${me!.username}`;
  const copy = () => { navigator.clipboard?.writeText(link); };
  const mySkills = db.studentSkills[me!.id] || [];
  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
      <div className="card-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="lbl">{t("Work Readiness Score")} — {t("Ochiq formula: 30/20/30/10/10")}</span>
        </div>
        <div className="flex items-center gap-5 mb-5 flex-wrap">
          <Donut value={r.score} size={130} color={r.bandColor} sub={t("readiness")} />
          <div className="flex-1 min-w-[220px] space-y-2.5">
            {r.parts.map(p => (
              <div key={p.key}>
                <div className="flex justify-between text-[12.5px] mb-1"><span className="font-semibold">{t(p.label)} <span className="font-mono text-pine font-bold">×{p.weight}%</span></span><span className="font-mono font-bold">{p.value}</span></div>
                <Bar value={p.value} color={r.bandColor} h={7} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to={`/p/${me!.username}`}><Btn variant="solid" small><Icon d={I.passport} size={13} /> {t("Ommaviy passport")}</Btn></Link>
          <Btn variant="outline" small onClick={copy}><Icon d={I.link} size={13} /> {t("Link nusxalandi")}</Btn>
        </div>
      </div>
      <div className="card-soft p-6">
        <span className="lbl block mb-4">{t("Skill'larim")}</span>
        <div className="space-y-2.5">
          {mySkills.length === 0 && <p className="text-[13px] text-ink-soft">{t("Hali verified skill yo'q")}</p>}
          {mySkills.map(s => (
            <div key={s.skillId} className="flex items-center gap-3">
              <span className="w-28 font-semibold text-[13px] truncate">{skillName(db, s.skillId)}</span>
              <Bar value={s.score || 40} color={s.status === "VERIFIED" ? "var(--color-pine)" : "var(--color-line)"} h={8} />
              <span className="font-mono text-[12px] w-14 text-right font-bold">{s.score ?? "—"}</span>
              {s.status === "VERIFIED" ? <Icon d={I.check} size={13} className="text-pine" /> : <Pill tone="ink">{t("self-declared")}</Pill>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ PAGE ============ */
export default function StudentArea({ tab }: { tab: string }) {
  const TABS = ["dashboard", "assessments", "tasks", "projects", "applications", "interviews", "offers", "passport"];
  const active = TABS.includes(tab) ? tab : "dashboard";
  const go = (g: string) => { window.location.hash = "#/student/" + g; };
  return (
    <div>
      {active === "dashboard" && <Dashboard go={go} />}
      {active === "assessments" && <AssessmentsTab />}
      {active === "tasks" && <TasksTab />}
      {active === "projects" && <ProjectsTab />}
      {active === "applications" && <ApplicationsTab go={go} />}
      {active === "interviews" && <InterviewsTab />}
      {active === "offers" && <OffersTab />}
      {active === "passport" && <PassportTab />}
    </div>
  );
}
