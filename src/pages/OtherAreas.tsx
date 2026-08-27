import React, { useState } from "react";
import { Link } from "../lib/router";
import { useStore, readiness, skillName } from "../state/store";
import { useI18n } from "../lib/i18n";
import { Btn, Pill, StatusPill, Modal, Field, Bar, Empty, Icon, I, Avatar, Stamp } from "../components/ui";
import { BarChart, Funnel } from "../components/charts";
import { uid, now } from "../data/seed";

/* ================= MENTOR ================= */
export function MentorArea({ tab }: { tab: string }) {
  const { db, me, dispatch, toast } = useStore();
  const { t, fmtAgo } = useI18n();
  const [fb, setFb] = useState<string | null>(null);
  const [v, setV] = useState({ technical: 80, communication: 80, problemSolving: 80, deadline: 90, teamwork: 85 });
  const [comment, setComment] = useState("");
  const queue = db.submissions.filter(s => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW");
  const done = db.submissions.filter(s => s.feedback);
  const active = fb ? db.submissions.find(s => s.id === fb) : null;
  const activeTask = active ? db.tasks.find(x => x.id === active.taskId) : null;
  const activeStudent = active ? db.users.find(u => u.id === active.studentId) : null;
  const overall = Math.round((v.technical + v.communication + v.problemSolving + v.deadline + v.teamwork) / 5);
  const save = () => {
    if (!active || comment.trim().length < 5) { toast(t("Kamida 5 belgili izoh yozing"), "err"); return; }
    dispatch({ type: "TASK_REVIEW", id: active.id, feedback: { ...v, overall, comment: comment.trim(), authorId: me!.id, authorName: me!.name } });
    toast(t("fb_ok"), "ok"); setFb(null); setComment("");
  };

  if (tab === "done") {
    return (
      <div className="space-y-3">
        <span className="lbl block mb-1">{t("Yakunlangan feedbacklar")} ({done.length})</span>
        {done.length === 0 && <Empty title={t("Hozircha feedback yo'q")} body={t("fb_empty_b")} />}
        {done.map(s => {
          const task = db.tasks.find(x => x.id === s.taskId);
          const st = db.users.find(u => u.id === s.studentId);
          return (
            <div key={s.id} className="card-soft p-4">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <Avatar name={st?.name || "?"} color={st?.color} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-[13.5px]">{st?.name} — {task?.title}</div>
                  <div className="font-mono text-[12px] text-ink-soft">{fmtAgo(s.date)}</div>
                </div>
                <Stamp tone={s.status === "PASSED" ? "pine" : "coral"}>{s.status}</Stamp>
                <span className="font-display font-extrabold text-xl text-pine">{s.feedback!.overall}/100</span>
              </div>
              <p className="text-[12.5px] text-ink-soft leading-relaxed">{s.feedback!.comment}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className="card-soft p-4 mb-4 flex items-center gap-3 flex-wrap border-l-4 !border-l-moss">
        <span className="w-10 h-10 rounded-lg bg-moss text-cream border-[1.5px] border-ink flex items-center justify-center"><Icon d={I.tasks} size={17} /></span>
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-[14px]">{t("Mentor tekshiruv paneli")}</div>
          <div className="text-[12px] text-ink-soft">{t("mentor_d")}</div>
        </div>
        <Pill tone="moss">{queue.length} {t("navbatda")}</Pill>
      </div>
      {queue.length === 0 && <Empty title={t("Navbat bo'sh")} body={t("mentor_empty_b")} />}
      <div className="space-y-3">
        {queue.map(s => {
          const task = db.tasks.find(x => x.id === s.taskId);
          const st = db.users.find(u => u.id === s.studentId);
          return (
            <div key={s.id} className="card-soft p-5 hover:border-moss transition-colors">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <Avatar name={st?.name || "?"} color={st?.color} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-[14px]">{st?.name} — {task?.title}</div>
                  <div className="font-mono text-[12px] text-ink-soft">{skillName(db, task?.skillId || "")} · {fmtAgo(s.date)}</div>
                </div>
                <StatusPill s={s.status} />
              </div>
              <p className="text-[12.5px] text-ink-soft leading-relaxed mb-2">{s.text}</p>
              <div className="font-mono text-[12px] text-pine mb-3">GitHub: {s.url || "—"}{s.liveUrl ? " · Live: " + s.liveUrl : ""}</div>
              <Btn variant="lime" small onClick={() => { setFb(s.id); setComment(""); }}>{t("Tekshirish va feedback")} →</Btn>
            </div>
          );
        })}
      </div>
      <Modal open={!!active} onClose={() => setFb(null)} title={t("Feedback berish")} wide>
        {active && activeTask && (
          <div>
            <div className="font-mono text-[12px] text-ink-soft mb-4">{activeStudent?.name} · {activeTask.title}</div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["technical", t("Texnik sifat")], ["communication", t("Kommunikatsiya")],
                ["problemSolving", t("Muammoni yechish")], ["deadline", t("Deadline'ga rioya")], ["teamwork", t("Jamoa bilan ishlash")],
              ].map(([k, label]) => (
                <div key={k}>
                  <div className="flex justify-between text-[12.5px] mb-1"><span className="font-semibold">{label}</span><span className="font-mono font-bold text-pine">{v[k as keyof typeof v]}</span></div>
                  <input type="range" min={0} max={100} aria-label={label as string} value={v[k as keyof typeof v]} onChange={e => setV({ ...v, [k]: +e.target.value })} className="w-full" />
                </div>
              ))}
              <div className="rounded-lg bg-lime-soft border-[1.5px] border-pine px-4 py-3 flex flex-col justify-center">
                <span className="lbl">{t("Umumiy")}</span>
                <span className="font-display font-extrabold text-2xl text-pine">{overall}/100</span>
                <span className="font-mono text-[12px] text-ink-soft">{overall >= 70 ? t("PASSED bo'ladi") : t("FAILED bo'ladi")}</span>
              </div>
            </div>
            <div className="mt-4">
              <Field label={t("Izoh") + " *"}><textarea className="field min-h-[90px]" value={comment} onChange={e => setComment(e.target.value)} placeholder={t("fb_placeholder")} /></Field>
            </div>
            <Btn variant="lime" className="w-full mt-4" onClick={save}>{t("Feedback yuborish")} ✓</Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= UNIVERSITY ================= */
export function UniversityArea({ tab }: { tab: string }) {
  const { db, dispatch, toast } = useStore();
  const { t } = useI18n();
  const students = db.users.filter(u => u.role === "STUDENT");
  const hired = db.offers.filter(o => o.status === "ACCEPTED").length;
  const verifiedExp = students.filter(s => (db.studentSkills[s.id] || []).some(x => x.status === "VERIFIED")).length;
  const avgR = students.length ? Math.round(students.reduce((s, u) => s + readiness(db, u.id).score, 0) / students.length) : 0;
  const stats = [
    { l: t("Jami talabalar"), v: String(students.length), c: "text-pine" },
    { l: t("Assessment yakunlagan"), v: String(new Set(db.attempts.map(a => a.studentId)).size), c: "text-sky" },
    { l: t("Real loyiha qatnashchisi"), v: String(new Set(db.applications.filter(a => a.status !== "APPLIED" && a.status !== "REJECTED").map(a => a.studentId)).size), c: "text-amber" },
    { l: t("Ishga joylashgan"), v: String(hired), c: "text-coral" },
  ];

  if (tab === "students") {
    return (
      <div>
        <span className="lbl block mb-3">{t("Talabalar")} ({students.length})</span>
        <div className="space-y-2.5">
          {students.map(s => {
            const r = readiness(db, s.id);
            const prof = db.profiles[s.id];
            const verified = (db.studentSkills[s.id] || []).filter(x => x.status === "VERIFIED").length;
            return (
              <div key={s.id} className="card-soft p-4 flex items-center gap-4 flex-wrap hover:border-pine transition-colors">
                <Avatar name={s.name} color={s.color} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-[13.5px]">{s.name}</div>
                  <div className="font-mono text-[12px] text-ink-soft">{prof?.specialization || "—"} · {verified} ✓ skill</div>
                </div>
                <div className="w-32 hidden sm:block"><Bar value={r.score} color={r.bandColor} /></div>
                <span className="font-display font-extrabold text-lg w-10 text-right" style={{ color: r.bandColor }}>{r.score}</span>
                <Link to={`/p/${s.username}`}><Btn variant="outline" small>{t("Passport")} →</Btn></Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (tab === "analytics") {
    return (
      <div className="space-y-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card-soft p-5">
            <span className="lbl block mb-4">{t("Skill bo'yicha o'rtacha ball")}</span>
            <BarChart items={db.skills.map(sk => {
              const scores = Object.values(db.studentSkills).flat().filter(x => x.skillId === sk.id && x.score).map(x => x.score!) as number[];
              return { label: sk.name, value: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0 };
            })} />
          </div>
          <div className="card-soft p-5">
            <span className="lbl block mb-4">{t("Employment voronkasi")}</span>
            <Funnel steps={[
              { label: t("Talabalar"), value: students.length },
              { label: "Assessment", value: new Set(db.attempts.map(a => a.studentId)).size },
              { label: t("Loyiha"), value: new Set(db.applications.map(a => a.studentId)).size },
              { label: "Interview", value: new Set(db.interviews.map(i => i.studentId)).size },
              { label: "Hired", value: hired },
            ]} />
          </div>
        </div>
        <div className="card-soft p-5">
          <span className="lbl block mb-3">{t("North Star: Verified-to-Hired Rate")}</span>
          <div className="flex items-center gap-5 flex-wrap">
            <span className="font-display font-extrabold text-4xl text-pine">{verifiedExp ? Math.round(hired / verifiedExp * 100) : 0}%</span>
            <p className="text-[12.5px] text-ink-soft max-w-md leading-relaxed">{t("north_star_d")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card-soft p-4 flex items-center gap-3 flex-wrap border-l-4 !border-l-moss">
        <span className="w-10 h-10 rounded-lg bg-moss text-cream border-[1.5px] border-ink flex items-center justify-center"><Icon d={I.build} size={17} /></span>
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-[14px]">{t("uni_t")}</div>
          <div className="text-[12px] text-ink-soft">{t("uni_d")}</div>
        </div>
        <Pill tone="moss">PILOT</Pill>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.l} className="card-soft p-4 hover:-translate-y-0.5 transition-all">
            <div className={`font-display font-extrabold text-[1.7rem] ${s.c}`}>{s.v}</div>
            <div className="font-bold text-[12px] mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-soft p-5">
          <span className="lbl block mb-3">{t("O'rtacha Work Readiness")}</span>
          <div className="flex items-center gap-4">
            <span className="font-display font-extrabold text-4xl text-pine">{avgR}</span>
            <div className="flex-1"><Bar value={avgR} color="var(--color-pine)" h={12} /></div>
          </div>
          <p className="text-[12px] text-ink-soft font-mono mt-3">{t("Employment rate")}: {students.length ? Math.round(hired / students.length * 1000) / 10 : 0}%</p>
        </div>
        <div className="card-soft p-5">
          <span className="lbl block mb-3">CSV import (SIS)</span>
          <textarea className="field min-h-[90px] font-mono text-[12px]" defaultValue={"first_name,last_name,email\nSarvar,Yusupov,sarvar@tatu.uz\nGulnora,Ismoilova,gulnora@tatu.uz"} aria-label="CSV" />
          <Btn variant="solid" small className="mt-3" onClick={() => {
            dispatch({ type: "CSV_IMPORT", students: [{ name: "Sarvar Yusupov", email: "sarvar@tatu.uz" }, { name: "Gulnora Ismoilova", email: "gulnora@tatu.uz" }], university: "TATU" });
            toast(t("import_ok"), "ok");
          }}><Icon d={I.csv} size={14} /> {t("Import qilish")}</Btn>
          <p className="text-[12px] text-ink-soft mt-2">{t("edu_note")}</p>
        </div>
      </div>
    </div>
  );
}

/* ================= ADMIN ================= */
export function AdminArea({ tab }: { tab: string }) {
  const { db, dispatch, toast } = useStore();
  const { t, fmtAgo } = useI18n();
  const [editSkill, setEditSkill] = useState<string | null>(null);
  const [skillNameVal, setSkillNameVal] = useState("");

  if (tab === "projects") {
    const waiting = db.projects.filter(p => p.status === "DRAFT");
    const published = db.projects.filter(p => p.status !== "DRAFT");
    return (
      <div className="space-y-5">
        <span className="lbl block">{t("Tasdiqlash kutilmoqda")} ({waiting.length})</span>
        {waiting.length === 0 && <p className="text-[13px] text-ink-soft">{t("admin_no_projects")}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          {waiting.map(p => {
            const company = db.users.find(u => u.id === p.companyId);
            return (
              <div key={p.id} className="card-soft p-5 border-l-4 !border-l-amber">
                <div className="font-display font-bold text-[14px] mb-1">{p.title}</div>
                <div className="font-mono text-[12px] text-ink-soft mb-2">{company?.org}</div>
                <p className="text-[12.5px] text-ink-soft mb-3">{p.description}</p>
                <div className="flex gap-2">
                  <Btn variant="lime" small onClick={() => { dispatch({ type: "PROJECT_STATUS", id: p.id, status: "APPLICATIONS_OPEN" }); toast(t("Loyiha tasdiqlandi va e'lon qilindi"), "ok"); }}>{t("Tasdiqlash")} ✓</Btn>
                  <Btn variant="outline" small onClick={() => { dispatch({ type: "PROJECT_STATUS", id: p.id, status: "CLOSED" }); toast(t("Loyiha rad etildi"), "info"); }}>{t("Rad etish")}</Btn>
                </div>
              </div>
            );
          })}
        </div>
        <span className="lbl block pt-2">{t("E'lon qilingan")} ({published.length})</span>
        <div className="space-y-2">
          {published.map(p => (
            <div key={p.id} className="card-soft px-4 py-3 flex items-center gap-3 flex-wrap">
              <span className="font-display font-bold text-[13px] flex-1 min-w-[200px]">{p.title}</span>
              <StatusPill s={p.status} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "skills") {
    return (
      <div>
        <span className="lbl block mb-3">{t("Skill katalogi")} ({db.skills.length})</span>
        <div className="grid md:grid-cols-2 gap-3">
          {db.skills.map(s => (
            <div key={s.id} className="card-soft p-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-lime-soft border-[1.5px] border-ink flex items-center justify-center font-display font-bold text-[13px]">{s.name.slice(0, 2)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-[13.5px]">{s.name}</div>
                <div className="font-mono text-[12px] text-ink-soft">{s.category} · {Object.values(db.studentSkills).flat().filter(x => x.skillId === s.id && x.status === "VERIFIED").length} ✓</div>
              </div>
              <Btn variant="outline" small onClick={() => { setEditSkill(s.id); setSkillNameVal(s.name); }}>{t("Tahrirlash")}</Btn>
            </div>
          ))}
        </div>
        <Modal open={!!editSkill} onClose={() => setEditSkill(null)} title={t("Skill tahrirlash")}>
          <Field label={t("Nomi")}><input className="field" value={skillNameVal} onChange={e => setSkillNameVal(e.target.value)} /></Field>
          <Btn variant="lime" className="w-full mt-4" onClick={() => {
            const sk = db.skills.find(x => x.id === editSkill);
            if (sk && skillNameVal.trim()) { dispatch({ type: "SKILL_SAVE", skill: { ...sk, name: skillNameVal.trim() } }); toast(t("Skill saqlandi"), "ok"); }
            setEditSkill(null);
          }}>{t("Saqlash")}</Btn>
        </Modal>
      </div>
    );
  }

  if (tab === "audit") {
    return (
      <div>
        <span className="lbl block mb-3">{t("Audit log")} ({db.audit.length})</span>
        <div className="space-y-2">
          {db.audit.map(a => (
            <div key={a.id} className="card-soft px-4 py-3 flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[12px] text-ink-soft w-28 shrink-0">{fmtAgo(a.date)}</span>
              <span className="font-bold text-[12.5px]">{a.actor}</span>
              <span className="text-[12.5px] text-ink-soft flex-1">{a.action}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pendingEmployers = db.users.filter(u => u.role === "EMPLOYER" && !u.verified && !u.suspended);
  return (
    <div className="space-y-5">
      {pendingEmployers.length > 0 && (
        <div className="card-soft p-4 border-l-4 !border-l-amber">
          <span className="lbl block mb-2">{t("Verifikatsiya kutilmoqda")}</span>
          {pendingEmployers.map(u => (
            <div key={u.id} className="flex items-center gap-3 flex-wrap py-1.5">
              <Avatar name={u.name} color={u.color} size={34} />
              <span className="font-bold text-[13px]">{u.org}</span>
              <span className="font-mono text-[12px] text-ink-soft">{u.email}</span>
              <Btn variant="lime" small className="ml-auto" onClick={() => { dispatch({ type: "USER_VERIFY", id: u.id, verified: true }); toast(`${u.org} ${t("verifikatsiya qilindi")}`, "ok"); }}>{t("Tasdiqlash")} ✓</Btn>
            </div>
          ))}
        </div>
      )}
      <span className="lbl block">{t("Foydalanuvchilar")} ({db.users.length})</span>
      <div className="space-y-2">
        {db.users.map(u => (
          <div key={u.id} className="card-soft px-4 py-3 flex items-center gap-3 flex-wrap">
            <Avatar name={u.name} color={u.color} size={34} />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[13px]">{u.org || u.name}</span>
              <span className="font-mono text-[12px] text-ink-soft ml-2">{u.email}</span>
            </div>
            <Pill tone={u.role === "STUDENT" ? "sky" : u.role === "EMPLOYER" ? "moss" : u.role === "MENTOR" ? "violet" : "ink"}>{u.role}</Pill>
            {u.verified && <Stamp tone="pine">✓</Stamp>}
            {u.suspended && <Pill tone="coral">{t("BLOKLANGAN")}</Pill>}
            {u.role !== "ADMIN" && (
              <Btn variant="outline" small onClick={() => { dispatch({ type: "USER_SUSPEND", id: u.id, suspended: !u.suspended }); toast(u.suspended ? t("Blokdan chiqarildi") : t("Bloklandi"), "info"); }}>
                {u.suspended ? t("Blokdan chiqarish") : t("Bloklash")}
              </Btn>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
