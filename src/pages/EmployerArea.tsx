import React, { useState } from "react";
import { Link } from "../lib/router";
import { useStore, skillName, readiness } from "../state/store";
import { useI18n } from "../lib/i18n";
import { Btn, Pill, StatusPill, Modal, Field, Empty, Icon, I, Avatar } from "../components/ui";
import { Funnel } from "../components/charts";
import { uid, now, daysAhead, fmtUZS } from "../data/seed";

export const EMPLOYER_TABS = [
  { id: "dashboard", l: "AI Dashboard", ic: I.bolt },
  { id: "projects", l: "Loyihalar", ic: I.brief },
  { id: "candidates", l: "Kandidatlar", ic: I.search },
  { id: "blind", l: "Blind Review", ic: I.eye },
  { id: "interviews", l: "Interviewlar", ic: I.cal },
  { id: "tasks", l: "Tasklar", ic: I.tasks },
  { id: "offers", l: "Offerlar", ic: I.star },
];

/* ---------- AI DASHBOARD ---------- */
function AiDashboard({ go }: { go: (t: string) => void }) {
  const { db, me } = useStore();
  const { t } = useI18n();
  const cid = me!.id;
  const myApps = db.applications.filter(a => db.projects.some(p => p.id === a.projectId && p.companyId === cid));
  const funnel = [
    { label: "Applied", value: myApps.length },
    { label: "Shortlist", value: myApps.filter(a => a.status !== "APPLIED" && a.status !== "REJECTED").length },
    { label: "Interview", value: db.interviews.filter(i => i.companyId === cid).length },
    { label: "Task", value: db.employerTasks.filter(x => x.companyId === cid).length },
    { label: "Hired", value: db.offers.filter(o => o.companyId === cid && o.status === "ACCEPTED").length },
  ];
  const kpis = [
    { l: "Time-to-hire", v: t("6 kun"), d: t("CV saralashsiz: 21 kun edi"), c: "text-pine" },
    { l: t("Tejalgan xarajat"), v: t("1.8 mln"), d: t("so'm — agentlik fee'larisiz"), c: "text-sky" },
    { l: t("Verified kandidat"), v: String(db.users.filter(u => u.role === "STUDENT").length), d: t("passport bilan filtrlangan"), c: "text-amber" },
    { l: "Hired (pilot)", v: String(db.offers.filter(o => o.companyId === cid && o.status === "ACCEPTED").length), d: t("rasmiy shartnoma yo'lda"), c: "text-coral" },
  ];
  return (
    <div className="space-y-5">
      <div className="card-soft p-4 md:p-5 flex items-center gap-3.5 flex-wrap border-l-4 !border-l-pine doc-stripes">
        <span className="w-10 h-10 rounded-lg bg-pine text-lime border-[1.5px] border-ink flex items-center justify-center"><Icon d={I.bolt} size={18} /></span>
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-[14.5px]">{t("Employer AI Dashboard")}</div>
          <div className="text-[12px] text-ink-soft">{t("Voronka, vaqt va xarajat — jonli hisob. Telegram'dagi 300 ta CV emas, faqat isbotlangan passport'lar.")}</div>
        </div>
        <Btn variant="lime" small onClick={() => go("candidates")}>{t("Kandidatlar bazasi")} →</Btn>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.l} className="card-soft p-4 hover:-translate-y-0.5 transition-all">
            <div className={`font-display font-extrabold text-[1.6rem] ${k.c}`}>{k.v}</div>
            <div className="font-bold text-[12px] mt-1">{k.l}</div>
            <div className="text-[12px] text-ink-soft font-mono mt-0.5">{k.d}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="card-soft p-5">
          <span className="lbl block mb-4">{t("Hiring voronkasi — Applied → Hired")}</span>
          <Funnel steps={funnel} />
        </div>
        <div className="card-soft p-5">
          <span className="lbl block mb-3">{t("Tezkor amallar")}</span>
          <div className="space-y-2.5">
            {[
              { t: t("Yangi loyiha yaratish"), d: t("brief + skill talablari"), ic: I.plus, g: "projects" },
              { t: t("Blind review navbati"), d: `${db.blindReviews.filter(b => b.companyId === cid && b.status === "PENDING").length} ${t("ta anonim submission")}`, ic: I.eye, g: "blind" },
              { t: t("Interview belgilash"), d: t("kandidatni tanlang"), ic: I.cal, g: "interviews" },
              { t: t("Offer yuborish"), d: t("task o'tgan kandidatlarga"), ic: I.star, g: "offers" },
            ].map(a => (
              <button key={a.t} onClick={() => go(a.g)} className="w-full flex items-center gap-3 rounded-lg border-[1.5px] border-line bg-paper px-3.5 py-2.5 text-left btn-press hover:border-pine hover:bg-lime-soft/40 transition-all">
                <span className="w-8 h-8 rounded-lg border-[1.5px] border-ink bg-lime flex items-center justify-center shrink-0"><Icon d={a.ic} size={15} /></span>
                <span className="min-w-0">
                  <span className="block font-display font-bold text-[12.5px]">{a.t}</span>
                  <span className="block text-[12px] text-ink-soft font-mono">{a.d}</span>
                </span>
                <span className="ml-auto text-pine"><Icon d={I.arrow} size={14} /></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- PROJECTS ---------- */
function ProjectsTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const cid = me!.id;
  const mine = db.projects.filter(p => p.companyId === cid);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", description: "", skillIds: [] as string[], difficulty: "Junior", durationDays: 14, payment: 500000, positions: 1, deadline: daysAhead(14), category: "Frontend" });
  const create = () => {
    if (f.title.trim().length < 5 || f.skillIds.length === 0) { toast(t("Sarlavha (5+ belgi) va kamida 1 ta skill tanlang"), "err"); return; }
    dispatch({ type: "CREATE_PROJECT", project: { id: uid(), companyId: cid, status: "DRAFT", ...f, title: f.title.trim(), description: f.description.trim() } });
    toast(t("Yaratish (admin tasdig'iga yuboriladi)"), "ok");
    setOpen(false); setF({ title: "", description: "", skillIds: [], difficulty: "Junior", durationDays: 14, payment: 500000, positions: 1, deadline: daysAhead(14), category: "Frontend" });
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="lbl">{t("Loyihalaringiz")} ({mine.length})</span>
        <Btn variant="lime" small onClick={() => setOpen(true)}><Icon d={I.plus} size={14} /> {t("Loyiha yaratish")}</Btn>
      </div>
      {mine.length === 0 && <Empty title={t("Loyihalar yo'q")} body={t("Birinchi real loyihangizni yarating — talabalar apply qiladi.")} />}
      <div className="grid md:grid-cols-2 gap-4">
        {mine.map(p => {
          const apps = db.applications.filter(a => a.projectId === p.id);
          return (
            <div key={p.id} className="card-soft p-5 hover:border-pine transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-display font-bold text-[14.5px] leading-snug">{p.title}</div>
                <StatusPill s={p.status} />
              </div>
              <p className="text-[12.5px] text-ink-soft leading-relaxed mb-2.5">{p.description}</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-[12px] text-ink-soft">{p.durationDays} {t("kun")} · {fmtUZS(p.payment)} · {apps.length} {t("ariza")}</span>
                {p.status === "DRAFT" ? <Pill tone="amber">{t("Admin tasdig'ida")}</Pill>
                  : (p.status === "APPLICATIONS_OPEN" || p.status === "IN_PROGRESS")
                    ? <Btn variant="outline" small onClick={() => { dispatch({ type: "PROJECT_STATUS", id: p.id, status: "CLOSED" }); toast(t("Loyiha yopildi"), "info"); }}>{t("Yopish")}</Btn>
                    : p.status === "COMPLETED" && p.employerRating ? <Pill tone="pine">★ {p.employerRating}</Pill> : null}
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={t("Yangi loyiha")} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Field label={t("Sarlavha") + " *"}><input className="field" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label={t("Tavsif")}><textarea className="field min-h-[80px]" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></Field></div>
          <div className="sm:col-span-2">
            <Field label={t("Kerakli skill'lar") + " *"}>
              <div className="flex flex-wrap gap-1.5">
                {db.skills.map(s => {
                  const on = f.skillIds.includes(s.id);
                  return <button key={s.id} onClick={() => setF({ ...f, skillIds: on ? f.skillIds.filter(x => x !== s.id) : [...f.skillIds, s.id] })}
                    className={`px-2.5 py-1 rounded-full border-[1.5px] font-mono text-[12px] font-bold transition-all btn-press ${on ? "bg-pine text-cream border-pine" : "bg-cream border-line hover:border-ink"}`}>{s.name}</button>;
                })}
              </div>
            </Field>
          </div>
          <Field label={t("Davomiylik (kun)")}><input type="number" className="field" value={f.durationDays} onChange={e => setF({ ...f, durationDays: +e.target.value || 14 })} /></Field>
          <Field label={t("To'lov (so'm)")}><input type="number" className="field" value={f.payment} onChange={e => setF({ ...f, payment: +e.target.value || 0 })} /></Field>
        </div>
        <Btn variant="lime" className="w-full mt-5" onClick={create}>{t("Yaratish (admin tasdig'iga yuboriladi)")}</Btn>
      </Modal>
    </div>
  );
}

/* ---------- CANDIDATES ---------- */
function CandidatesTab() {
  const { db } = useStore();
  const { t } = useI18n();
  const [skill, setSkill] = useState(""); const [minR, setMinR] = useState(0);
  const students = db.users.filter(u => u.role === "STUDENT" && !u.suspended);
  const list = students.filter(s => {
    const skills = db.studentSkills[s.id] || [];
    if (skill && !skills.some(x => x.skillId === skill && x.status === "VERIFIED")) return false;
    if (readiness(db, s.id).score < minR) return false;
    return true;
  });
  return (
    <div>
      <div className="card-soft p-4 mb-4 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <Field label={t("Skill (verified)")}><select className="field" value={skill} onChange={e => setSkill(e.target.value)}><option value="">{t("Barchasi")}</option>{db.skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label={`${t("Min readiness")}: ${minR}`}><input type="range" min={0} max={100} step={5} aria-label={t("Min readiness")} value={minR} onChange={e => setMinR(+e.target.value)} className="w-full" /></Field>
        <Btn variant="outline" small onClick={() => { setSkill(""); setMinR(0); }}>{t("Tozalash")}</Btn>
      </div>
      <div className="font-mono text-[12px] text-ink-soft mb-3">{list.length} {t("ta")} · {t("faqat verified skill'lar bo'yicha")}</div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map(s => {
          const prof = db.profiles[s.id];
          const r = readiness(db, s.id);
          const verified = (db.studentSkills[s.id] || []).filter(x => x.status === "VERIFIED").slice(0, 3);
          return (
            <div key={s.id} className="card-soft p-5 hover:border-pine transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={s.name} color={s.color} size={44} />
                <div className="min-w-0">
                  <div className="font-display font-bold text-[14.5px] truncate">{s.name}</div>
                  <div className="text-[12px] text-ink-soft font-mono truncate">{prof?.specialization || "Frontend"} · {prof?.university}</div>
                </div>
                <span className="ml-auto font-display font-extrabold text-xl" style={{ color: r.bandColor }}>{r.score}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {verified.map(v => <span key={v.skillId} className="font-mono text-[12px] px-2 py-0.5 rounded bg-lime-soft border border-pine/40 text-pine-deep font-bold">{skillName(db, v.skillId)} {v.score} ✓</span>)}
                {verified.length === 0 && <span className="font-mono text-[12px] text-ink-soft">{t("Hali verified skill yo'q")}</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to={`/p/${s.username}`}><Btn variant="solid" small><Icon d={I.passport} size={13} /> {t("Passport'ni ko'rish")}</Btn></Link>
                <Link to="/employer/interviews"><Btn variant="outline" small>{t("Interview")} →</Btn></Link>
              </div>
            </div>
          );
        })}
      </div>
      {list.length === 0 && <Empty title={t("Filtrga mos kandidat topilmadi")} body={t("Filtrlarni yumshating yoki min readiness chegarasini pasaytiring.")} />}
    </div>
  );
}

/* ---------- BLIND REVIEW ---------- */
function BlindReviewTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t, fmtAgo } = useI18n();
  const cid = me!.id;
  const [sel, setSel] = useState<string | null>(null);
  const [score, setScore] = useState(75); const [comment, setComment] = useState("");
  const mine = db.blindReviews.filter(b => b.companyId === cid);
  const active = mine.find(b => b.id === sel) || mine.find(b => b.status === "PENDING");
  const submitScore = () => {
    if (!active) return;
    if (comment.trim().length < 5) { toast(t("Kamida 5 belgili izoh yozing"), "err"); return; }
    dispatch({ type: "BLIND_SCORE", id: active.id, score, comment: comment.trim(), reviewer: me!.org || me!.name });
    toast(t("Baho yozildi — shaxs hali yashirin"), "ok");
    setSel(null); setScore(75); setComment("");
  };
  return (
    <div>
      <div className="card-soft p-4 mb-4 flex items-center gap-3 flex-wrap border-l-4 !border-l-violet doc-stripes">
        <span className="w-10 h-10 rounded-lg bg-violet text-cream border-[1.5px] border-ink flex items-center justify-center"><Icon d={I.eye} size={17} /></span>
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-[14px]">{t("Blind Review Panel")}</div>
          <div className="text-[12px] text-ink-soft">{t("Xolis tanlov: ism, universitet va rasm yashirilgan. Faqat kod va natija baholanadi.")}</div>
        </div>
        <Pill tone="violet">{mine.filter(b => b.status === "PENDING").length} {t("navbatda")}</Pill>
      </div>
      <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-5">
        <div className="space-y-2.5">
          {mine.length === 0 && <Empty title={t("Submission yo'q")} body={t("Kandidatlar employer task topshirganda bu yerda anonim ko'rinadi.")} />}
          {mine.map(b => (
            <button key={b.id} onClick={() => setSel(b.id)}
              className={`w-full text-left card-soft p-4 btn-press transition-all ${active?.id === b.id ? "border-violet shadow-[3px_3px_0_0_rgba(124,58,237,0.35)]" : "hover:border-ink"}`}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="w-9 h-9 rounded-full border-[1.5px] border-dashed border-ink bg-cream flex items-center justify-center font-mono font-bold text-[12px] shrink-0">A{b.id.slice(-2).toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-[13px] truncate">{b.taskTitle}</div>
                  <div className="font-mono text-[12px] text-ink-soft">{fmtAgo(b.submittedAt)} · {t("anonim")}</div>
                </div>
                <StatusPill s={b.status} />
              </div>
              {b.scores.length > 0 && <div className="font-mono text-[12px] text-violet">{t("O'rtacha")}: <b>{Math.round(b.scores.reduce((s, x) => s + x.score, 0) / b.scores.length)}/100</b> ({b.scores.length} {t("baho")})</div>}
              {b.status === "REVEALED" && <div className="font-mono text-[12px] text-pine font-bold">{t("Shaxs ochildi")} ✓</div>}
            </button>
          ))}
        </div>
        {active ? (
          <div className="card-soft p-5">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="lbl">{t("Anonim submission")} · {active.taskTitle}</span>
              <Pill tone="violet">{t("shaxs yashirilgan")}</Pill>
            </div>
            <pre className="rounded-lg bg-ink text-lime-soft text-[12px] leading-relaxed p-4 overflow-x-auto mb-3 font-mono whitespace-pre-wrap">{active.code}</pre>
            <div className="font-mono text-[12px] text-ink-soft mb-4">GitHub: {active.githubUrl} · Live: {active.liveUrl}</div>
            {active.status === "PENDING" && (
              <div className="border-t border-dashed border-line pt-4">
                <div className="flex justify-between text-[12.5px] mb-1"><span className="font-bold">{t("Bahoingiz")}</span><span className="font-mono font-bold text-violet">{score}/100</span></div>
                <input type="range" min={0} max={100} aria-label={t("Bahoingiz")} value={score} onChange={e => setScore(+e.target.value)} className="w-full mb-3" />
                <Field label={t("Izoh") + " *"}><textarea className="field min-h-[70px]" value={comment} onChange={e => setComment(e.target.value)} placeholder={t("Kod sifati, yondashuv, natija...")} /></Field>
                <div className="flex gap-2 mt-4">
                  <Btn variant="lime" onClick={submitScore}>{t("Bahoni yozish")}</Btn>
                  <Btn variant="outline" onClick={() => { dispatch({ type: "BLIND_REVEAL", id: active.id, reviewer: me!.org || me!.name }); toast(t("Shaxs ochildi"), "info"); }}>{t("Shaxsni ochish")} →</Btn>
                </div>
              </div>
            )}
            {active.status === "REVEALED" && (
              <div className="anim-pop rounded-lg border-[1.5px] border-pine bg-lime-soft px-4 py-3 flex items-center gap-3">
                <Avatar name={db.users.find(u => u.id === active.candidateId)?.name || "?"} color={db.users.find(u => u.id === active.candidateId)?.color} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-[13.5px]">{db.users.find(u => u.id === active.candidateId)?.name}</div>
                  <div className="text-[12px] font-mono text-ink-soft">{t("Shaxs ochildi — passport'ga o'ting")}</div>
                </div>
                <Link to={`/p/${db.users.find(u => u.id === active.candidateId)?.username}`}><Btn variant="solid" small>{t("Passport")} →</Btn></Link>
              </div>
            )}
          </div>
        ) : (
          <div className="card-soft p-8 flex items-center justify-center text-ink-soft text-[13px]">{t("Navbatdagi submission'ni tanlang")}</div>
        )}
      </div>
    </div>
  );
}

/* ---------- INTERVIEWS ---------- */
function InterviewsTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t, fmtDate } = useI18n();
  const cid = me!.id;
  const mine = db.interviews.filter(i => i.companyId === cid);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ studentId: "", date: daysAhead(3), time: "15:00", type: "VIDEO" as "VIDEO" | "OFFICE" | "PHONE", url: "meet.google.com/", notes: "" });
  const students = db.users.filter(u => u.role === "STUDENT");
  const invite = () => {
    if (!f.studentId) { toast(t("Kandidatni tanlang"), "err"); return; }
    dispatch({ type: "INVITE_INTERVIEW", iv: { id: uid(), companyId: cid, status: "INVITED", ...f } });
    toast(t("Interview taklifi yuborildi"), "ok");
    setOpen(false); setF({ studentId: "", date: daysAhead(3), time: "15:00", type: "VIDEO", url: "meet.google.com/", notes: "" });
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="lbl">{t("Interviewlar")} ({mine.length})</span>
        <Btn variant="lime" small onClick={() => setOpen(true)}><Icon d={I.cal} size={14} /> {t("Invite to Interview")}</Btn>
      </div>
      {mine.length === 0 && <Empty title={t("Interviewlar yo'q")} body={t("Kandidatlarni interview'ga taklif qiling — Meet/Zoom linki kifoya.")} />}
      <div className="space-y-3">
        {mine.map(iv => {
          const st = db.users.find(u => u.id === iv.studentId);
          return (
            <div key={iv.id} className="card-soft p-4 flex items-center gap-4 flex-wrap hover:border-pine transition-colors">
              <Avatar name={st?.name || "?"} color={st?.color} size={40} />
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold text-[13.5px]">{st?.name} — {iv.type === "VIDEO" ? t("Video") : iv.type === "OFFICE" ? t("Ofisda") : t("Telefon")}</div>
                <div className="font-mono text-[12px] text-ink-soft">{fmtDate(iv.date)} · {iv.time} · {iv.url}</div>
              </div>
              <StatusPill s={iv.status} />
              {(iv.status === "CONFIRMED" || iv.status === "INVITED") && (
                <Btn variant="outline" small onClick={() => { dispatch({ type: "INTERVIEW_RESPOND", id: iv.id, status: "COMPLETED" }); toast(t("Interview yakunlandi"), "ok"); }}>{t("Yakunlandi")}</Btn>
              )}
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={t("Interview taklifi")}>
        <div className="space-y-4">
          <Field label={t("Kandidat") + " *"}><select className="field" value={f.studentId} onChange={e => setF({ ...f, studentId: e.target.value })}><option value="">{t("Tanlang...")}</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} · {t("readiness")} {readiness(db, s.id).score}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("Sana")}><input type="date" className="field" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></Field>
            <Field label={t("Vaqt")}><input type="time" className="field" value={f.time} onChange={e => setF({ ...f, time: e.target.value })} /></Field>
          </div>
          <Field label="Meeting URL"><input className="field" value={f.url} onChange={e => setF({ ...f, url: e.target.value })} /></Field>
          <Btn variant="lime" className="w-full" onClick={invite}>{t("Taklif yuborish")} →</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- TASKS ---------- */
function TasksTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const cid = me!.id;
  const mine = db.employerTasks.filter(x => x.companyId === cid);
  const [open, setOpen] = useState(false); const [grade, setGrade] = useState<string | null>(null);
  const [f, setF] = useState({ studentId: "", title: "", description: "", deadline: daysAhead(5), criteria: "" });
  const [g, setG] = useState({ score: 80, feedback: "", pass: true });
  const students = db.users.filter(u => u.role === "STUDENT");
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="lbl">{t("Employer topshiriqlari")} ({mine.length})</span>
        <Btn variant="lime" small onClick={() => setOpen(true)}><Icon d={I.plus} size={14} /> {t("Create Employer Task")}</Btn>
      </div>
      {mine.length === 0 && <Empty title={t("Topshiriqlar yo'q")} body={t("Interview'dan keyin kandidatlarga kichik real task bering — natijani shu yerda baholaysiz.")} />}
      <div className="space-y-3">
        {mine.map(x => {
          const st = db.users.find(u => u.id === x.studentId);
          return (
            <div key={x.id} className="card-soft p-5 hover:border-pine transition-colors">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="font-display font-bold text-[14px]">{x.title} — <span className="text-pine">{st?.name}</span></div>
                <StatusPill s={x.status} />
              </div>
              {x.status === "SUBMITTED" && x.submission && (
                <div className="rounded-lg bg-cream border border-line px-3.5 py-2.5 mb-3">
                  <p className="text-[12.5px] leading-relaxed">{x.submission}</p>
                  {x.liveUrl && <div className="font-mono text-[12px] text-pine mt-1">Live: {x.liveUrl}</div>}
                </div>
              )}
              {x.status === "SUBMITTED" && <Btn variant="lime" small onClick={() => { setGrade(x.id); setG({ score: 80, feedback: "", pass: true }); }}>{t("Baholash")} →</Btn>}
              {(x.status === "PASSED" || x.status === "FAILED") && <p className="text-[12.5px]"><b className={x.status === "PASSED" ? "text-pine" : "text-coral"}>{x.score}/100</b> — {x.feedback}</p>}
              {x.status === "ASSIGNED" && <p className="font-mono text-[12px] text-ink-soft">{t("Kandidat topshirig'ini kutmoqda...")}</p>}
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={t("Yangi employer task")}>
        <div className="space-y-4">
          <Field label={t("Kandidat") + " *"}><select className="field" value={f.studentId} onChange={e => setF({ ...f, studentId: e.target.value })}><option value="">{t("Tanlang...")}</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label={t("Sarlavha") + " *"}><input className="field" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} placeholder="Bug-fix: responsive menyu" /></Field>
          <Field label={t("Tavsif")}><textarea className="field min-h-[80px]" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></Field>
          <Btn variant="lime" className="w-full" onClick={() => {
            if (!f.studentId || f.title.trim().length < 3) { toast(t("Kandidat va sarlavha kiriting"), "err"); return; }
            dispatch({ type: "CREATE_ETASK", task: { id: uid(), companyId: cid, studentId: f.studentId, title: f.title.trim(), description: f.description.trim(), deadline: f.deadline, criteria: f.criteria.trim(), status: "ASSIGNED", date: now() } });
            toast(t("Employer task yuborildi"), "ok");
            setOpen(false); setF({ studentId: "", title: "", description: "", deadline: daysAhead(5), criteria: "" });
          }}>{t("Yuborish")} →</Btn>
        </div>
      </Modal>
      <Modal open={!!grade} onClose={() => setGrade(null)} title={t("Submission baholash")}>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[12.5px] mb-1"><span className="font-bold">Score</span><span className="font-mono font-bold text-pine">{g.score}/100</span></div>
            <input type="range" min={0} max={100} aria-label="Score" value={g.score} onChange={e => setG({ ...g, score: +e.target.value })} className="w-full" />
          </div>
          <Field label="Feedback *"><textarea className="field min-h-[80px]" value={g.feedback} onChange={e => setG({ ...g, feedback: e.target.value })} /></Field>
          <Btn variant="lime" className="w-full" onClick={() => {
            if (!grade || g.feedback.trim().length < 5) { toast(t("Feedback yozing"), "err"); return; }
            dispatch({ type: "ETASK_GRADE", id: grade, score: g.score, feedback: g.feedback.trim(), pass: g.pass });
            toast(t("Baho yuborildi"), "ok"); setGrade(null);
          }}>{t("Baholash")} ✓</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- OFFERS ---------- */
function OffersTab() {
  const { db, me, dispatch, toast } = useStore();
  const { t } = useI18n();
  const cid = me!.id;
  const mine = db.offers.filter(o => o.companyId === cid);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ studentId: "", role: "Junior Frontend Developer", salary: "4 000 000 so'm / oy", message: "" });
  const passed = db.employerTasks.filter(x => x.companyId === cid && x.status === "PASSED").map(x => x.studentId);
  const eligible = db.users.filter(u => u.role === "STUDENT" && (passed.includes(u.id) || db.interviews.some(i => i.companyId === cid && i.studentId === u.id && i.status === "COMPLETED")));
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="lbl">{t("Offerlar")} ({mine.length})</span>
        <Btn variant="lime" small onClick={() => setOpen(true)}><Icon d={I.star} size={14} /> {t("Offer yuborish")}</Btn>
      </div>
      {mine.length === 0 && <Empty title={t("Offerlar yo'q")} body={t("Task yoki interview o'tgan kandidatlarga offer yuboring.")} />}
      <div className="space-y-3">
        {mine.map(o => {
          const st = db.users.find(u => u.id === o.studentId);
          return (
            <div key={o.id} className="card-soft p-5 border-l-4 !border-l-pine">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                <div className="font-display font-bold text-[14.5px]">{o.role} — {st?.name}</div>
                <StatusPill s={o.status === "ACCEPTED" ? "HIRED" : o.status} />
              </div>
              <div className="font-mono text-[12px] text-pine font-bold">{o.salary}</div>
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={t("Offer yuborish")}>
        <div className="space-y-4">
          <Field label={t("Kandidat") + " *"}><select className="field" value={f.studentId} onChange={e => setF({ ...f, studentId: e.target.value })}><option value="">{t("Tanlang...")}</option>{eligible.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label={t("Pozitsiya")}><input className="field" value={f.role} onChange={e => setF({ ...f, role: e.target.value })} /></Field>
          <Field label={t("Oylik")}><input className="field" value={f.salary} onChange={e => setF({ ...f, salary: e.target.value })} /></Field>
          <Btn variant="lime" className="w-full" onClick={() => {
            if (!f.studentId) { toast(t("Kandidatni tanlang"), "err"); return; }
            dispatch({ type: "OFFER", offer: { id: uid(), companyId: cid, status: "OFFERED", date: now(), ...f } });
            toast(t("Offer yuborildi!"), "ok"); setOpen(false);
          }}>{t("Offer yuborish")} ✓</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- PAGE ---------- */
export default function EmployerArea({ tab }: { tab: string }) {
  const { db, me } = useStore();
  const { t } = useI18n();
  const TABS = EMPLOYER_TABS.map(x => x.id);
  const active = TABS.includes(tab) ? tab : "dashboard";
  const go = (g: string) => { window.location.hash = "#/employer/" + g; };
  return (
    <div>
      {!me?.verified && (
        <div className="card-soft p-4 mb-5 border-l-4 !border-l-amber flex items-center gap-3 flex-wrap">
          <Icon d={I.shield} size={18} className="text-amber" />
          <div className="text-[12.5px] flex-1 min-w-[220px]"><b>{t("Kompaniya verifikatsiyasi kutilmoqda.")}</b> {t("ver_note")}</div>
          <Pill tone="amber">{db.projects.filter(p => p.companyId === me?.id && p.status === "DRAFT").length} draft</Pill>
        </div>
      )}
      {active === "dashboard" && <AiDashboard go={go} />}
      {active === "projects" && <ProjectsTab />}
      {active === "candidates" && <CandidatesTab />}
      {active === "blind" && <BlindReviewTab />}
      {active === "interviews" && <InterviewsTab />}
      {active === "tasks" && <TasksTab />}
      {active === "offers" && <OffersTab />}
    </div>
  );
}
