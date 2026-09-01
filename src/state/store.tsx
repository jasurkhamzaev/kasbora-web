import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  DB, User, StudentProfile, StudentSkill, Attempt, TaskSubmission, Feedback, Project, ProjectStatus,
  Application, Interview, EmployerTask, Offer, BlindReview, Skill, seedDB, uid, now, levelFromPct,
} from "../data/seed";

/* ---------------- actions ---------------- */
export type Action =
  | { type: "LOGIN"; userId: string } | { type: "LOGOUT" }
  | { type: "REGISTER"; user: User; profile: StudentProfile }
  | { type: "ATTEMPT"; attempt: Attempt; verify: { skillId: string; level: Attempt["level"]; score: number } | null }
  | { type: "TASK_SUBMIT"; sub: TaskSubmission }
  | { type: "TASK_REVIEW"; id: string; feedback: Feedback }
  | { type: "APPLY"; app: Application }
  | { type: "APP_STATUS"; id: string; status: Application["status"]; progress?: number }
  | { type: "PROJECT_STATUS"; id: string; status: ProjectStatus }
  | { type: "CREATE_PROJECT"; project: Project }
  | { type: "INVITE_INTERVIEW"; iv: Interview }
  | { type: "INTERVIEW_RESPOND"; id: string; status: Interview["status"] }
  | { type: "CREATE_ETASK"; task: EmployerTask }
  | { type: "ETASK_SUBMIT"; id: string; submission: string; liveUrl?: string }
  | { type: "ETASK_GRADE"; id: string; score: number; feedback: string; pass: boolean }
  | { type: "OFFER"; offer: Offer }
  | { type: "OFFER_RESPOND"; id: string; status: Offer["status"] }
  | { type: "BLIND_SCORE"; id: string; score: number; comment: string; reviewer: string }
  | { type: "BLIND_REVEAL"; id: string; reviewer: string }
  | { type: "MARK_READ"; userId: string }
  | { type: "UPDATE_PROFILE"; profile: StudentProfile }
  | { type: "USER_VERIFY"; id: string; verified: boolean }
  | { type: "USER_SUSPEND"; id: string; suspended: boolean }
  | { type: "SKILL_SAVE"; skill: Skill }
  | { type: "CREATE_ASSESSMENT"; assessment: import("../data/seed").Assessment }
  | { type: "CSV_IMPORT"; students: { name: string; email: string }[]; university: string };

const KEY = "kasbora_db_v4";

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users) && parsed.blindReviews) return parsed as DB;
    }
  } catch { /* ignore */ }
  return seedDB;
}

function withNotif(db: DB, userId: string, kind: string, title: string, body: string): DB {
  return { ...db, notifs: [{ id: uid(), userId, kind, title, body, date: now(), read: false }, ...db.notifs] };
}
function withAudit(db: DB, actor: string, action: string): DB {
  return { ...db, audit: [{ id: uid(), actor, action, date: now() }, ...db.audit] };
}

function reducer(db: DB, a: Action): DB {
  switch (a.type) {
    case "LOGIN": return { ...db, session: a.userId };
    case "LOGOUT": return { ...db, session: null };
    case "REGISTER":
      return { ...db, users: [...db.users, a.user], profiles: { ...db.profiles, [a.user.id]: a.profile }, session: a.user.id };
    case "ATTEMPT": {
      let d: DB = { ...db, attempts: [...db.attempts, a.attempt] };
      const asmt = db.assessments.find(x => x.id === a.attempt.assessmentId);
      if (a.verify && asmt) {
        const list = [...(d.studentSkills[a.attempt.studentId] || [])];
        const i = list.findIndex(s => s.skillId === a.verify!.skillId);
        const entry: StudentSkill = { skillId: a.verify.skillId, level: a.verify.level, status: "VERIFIED", score: a.verify.score, source: "ASSESSMENT", date: now() };
        if (i >= 0) list[i] = entry; else list.push(entry);
        d = { ...d, studentSkills: { ...d.studentSkills, [a.attempt.studentId]: list } };
        d = withNotif(d, a.attempt.studentId, "result", "Assessment natijasi",
          `${asmt.title}: ${a.attempt.pct}/100 — ${a.attempt.passed ? "VERIFIED" : "o'tmadi"}.`);
      }
      return d;
    }
    case "TASK_SUBMIT": {
      let d: DB = { ...db, submissions: [...db.submissions, a.sub] };
      d = withNotif(d, "u_mentor", "review", "Tekshirish kutilmoqda", "Yangi practice submission keldi.");
      return d;
    }
    case "TASK_REVIEW": {
      const sub = db.submissions.find(s => s.id === a.id);
      if (!sub) return db;
      const passed = a.feedback.overall >= 70;
      let d: DB = {
        ...db,
        submissions: db.submissions.map(s => s.id === a.id ? { ...s, status: passed ? "PASSED" : "FAILED", feedback: a.feedback } : s),
      };
      const task = db.tasks.find(t => t.id === sub.taskId);
      if (task && passed) {
        const list = [...(d.studentSkills[sub.studentId] || [])];
        const i = list.findIndex(s => s.skillId === task.skillId);
        const entry: StudentSkill = { skillId: task.skillId, level: levelFromPct(a.feedback.overall), status: "VERIFIED", score: a.feedback.overall, source: "TASK", date: now() };
        if (i >= 0 && list[i].source === "SELF_DECLARED") list[i] = entry; else if (i < 0) list.push(entry);
        d = { ...d, studentSkills: { ...d.studentSkills, [sub.studentId]: list } };
      }
      d = withNotif(d, sub.studentId, "feedback", "Feedback keldi",
        `"${task?.title || "Topshiriq"}" — ${a.feedback.overall}/100 (${passed ? "PASSED" : "FAILED"}).`);
      d = withAudit(d, a.feedback.authorName, `${db.users.find(u => u.id === sub.studentId)?.name} topshirig'iga ${a.feedback.overall} ball qo'ydi`);
      return d;
    }
    case "APPLY": {
      let d: DB = { ...db, applications: [...db.applications, a.app] };
      const proj = db.projects.find(p => p.id === a.app.projectId);
      if (proj) d = withNotif(d, proj.companyId, "application", "Yangi ariza", `${db.users.find(u => u.id === a.app.studentId)?.name} "${proj.title}" loyihasiga ariza berdi.`);
      return d;
    }
    case "APP_STATUS": {
      const app = db.applications.find(x => x.id === a.id);
      if (!app) return db;
      let d: DB = { ...db, applications: db.applications.map(x => x.id === a.id ? { ...x, status: a.status, progress: a.progress ?? x.progress } : x) };
      if (a.status === "SHORTLISTED") d = withNotif(d, app.studentId, "shortlist", "Shortlist'dasiz!", "Loyiha uchun shortlist'ga o'tdingiz.");
      if (a.status === "ACCEPTED" || a.status === "IN_PROGRESS") d = withNotif(d, app.studentId, "accepted", "Ariza qabul qilindi", "Loyihaga qabul qilindingiz — workspace ochildi.");
      if (a.status === "REJECTED") d = withNotif(d, app.studentId, "rejected", "Ariza natijasi", "Afsuski, bu safar tanlanmadingiz.");
      return d;
    }
    case "PROJECT_STATUS": {
      let d: DB = { ...db, projects: db.projects.map(p => p.id === a.id ? { ...p, status: a.status } : p) };
      if (a.status === "APPLICATIONS_OPEN") d = withAudit(d, "KASBORA Admin", `"${db.projects.find(p => p.id === a.id)?.title}" loyihasini tasdiqladi`);
      return d;
    }
    case "CREATE_PROJECT": return withAudit({ ...db, projects: [a.project, ...db.projects] }, db.users.find(u => u.id === a.project.companyId)?.org || "Employer", `"${a.project.title}" loyihasini yaratdi`);
    case "INVITE_INTERVIEW": {
      let d: DB = { ...db, interviews: [...db.interviews, a.iv] };
      d = withNotif(d, a.iv.studentId, "interview", "Interview taklifi", `${db.users.find(u => u.id === a.iv.companyId)?.org} sizni ${a.iv.date} ${a.iv.time} da interview'ga taklif qildi.`);
      return d;
    }
    case "INTERVIEW_RESPOND": {
      const iv = db.interviews.find(x => x.id === a.id);
      if (!iv) return db;
      let d: DB = { ...db, interviews: db.interviews.map(x => x.id === a.id ? { ...x, status: a.status } : x) };
      if (a.status === "CONFIRMED") d = withNotif(d, iv.companyId, "interview", "Interview tasdiqlandi", `${db.users.find(u => u.id === iv.studentId)?.name} interview'ni tasdiqladi.`);
      return d;
    }
    case "CREATE_ETASK": {
      let d: DB = { ...db, employerTasks: [a.task, ...db.employerTasks] };
      d = withNotif(d, a.task.studentId, "task", "Employer topshirig'i", `"${a.task.title}" topshirig'i yuborildi. Deadline: ${a.task.deadline}.`);
      return d;
    }
    case "ETASK_SUBMIT": {
      const t = db.employerTasks.find(x => x.id === a.id);
      if (!t) return db;
      let d: DB = {
        ...db,
        employerTasks: db.employerTasks.map(x => x.id === a.id ? { ...x, status: "SUBMITTED", submission: a.submission, liveUrl: a.liveUrl, submittedAt: now() } : x),
        blindReviews: [...db.blindReviews, {
          id: uid(), companyId: t.companyId, candidateId: t.studentId, taskTitle: t.title,
          code: a.submission.length > 320 ? a.submission.slice(0, 320) + "…" : a.submission,
          githubUrl: "github.com/…/pull/" + Math.floor(Math.random() * 90 + 10), liveUrl: a.liveUrl || "staging.kasbora.uz",
          submittedAt: now(), status: "PENDING", scores: [],
        }],
      };
      d = withNotif(d, t.companyId, "submission", "Employer task topshirildi", `${db.users.find(u => u.id === t.studentId)?.name} "${t.title}" topshirig'ini topshirdi.`);
      return d;
    }
    case "ETASK_GRADE": {
      const t = db.employerTasks.find(x => x.id === a.id);
      if (!t) return db;
      let d: DB = {
        ...db,
        employerTasks: db.employerTasks.map(x => x.id === a.id ? { ...x, status: a.pass ? "PASSED" : "FAILED", score: a.score, feedback: a.feedback } : x),
      };
      if (a.pass) {
        const list = [...(d.studentSkills[t.studentId] || [])];
        const i = list.findIndex(s => s.skillId === "sk_react");
        const entry: StudentSkill = { skillId: "sk_react", level: levelFromPct(a.score), status: "VERIFIED", score: a.score, source: "EMPLOYER", date: now() };
        if (i >= 0 && list[i].source === "SELF_DECLARED") list[i] = entry; else if (i < 0) list.push(entry);
        d = { ...d, studentSkills: { ...d.studentSkills, [t.studentId]: list } };
      }
      d = withNotif(d, t.studentId, "result", "Employer task natijasi", `"${t.title}" — ${a.score}/100 (${a.pass ? "PASSED" : "FAILED"}).`);
      return d;
    }
    case "OFFER": {
      let d: DB = { ...db, offers: [a.offer, ...db.offers] };
      d = withNotif(d, a.offer.studentId, "offer", "Ish taklifi!", `${db.users.find(u => u.id === a.offer.companyId)?.org} sizga ${a.offer.role} pozitsiyasiga offer yubordi.`);
      return d;
    }
    case "OFFER_RESPOND": {
      const o = db.offers.find(x => x.id === a.id);
      if (!o) return db;
      let d: DB = { ...db, offers: db.offers.map(x => x.id === a.id ? { ...x, status: a.status } : x) };
      if (a.status === "ACCEPTED") {
        d = withNotif(d, o.companyId, "hired", "Offer qabul qilindi", `${db.users.find(u => u.id === o.studentId)?.name} offer'ni qabul qildi — rasmiy jarayonni boshlang.`);
        d = withAudit(d, "KASBORA Admin", `${db.users.find(u => u.id === o.studentId)?.name} ${db.users.find(u => u.id === o.companyId)?.org}'ga ishga joylashdi`);
      }
      return d;
    }
    case "BLIND_SCORE":
      return { ...db, blindReviews: db.blindReviews.map(b => b.id === a.id ? { ...b, scores: [...b.scores, { score: a.score, comment: a.comment, reviewer: a.reviewer }] } : b) };
    case "BLIND_REVEAL":
      return withAudit({ ...db, blindReviews: db.blindReviews.map(b => b.id === a.id ? { ...b, status: "REVEALED" } : b) }, a.reviewer, "Blind review'da kandidat shaxsini ochdi");
    case "MARK_READ": return { ...db, notifs: db.notifs.map(n => n.userId === a.userId ? { ...n, read: true } : n) };
    case "UPDATE_PROFILE": return { ...db, profiles: { ...db.profiles, [a.profile.userId]: a.profile } };
    case "USER_VERIFY": {
      let d: DB = { ...db, users: db.users.map(u => u.id === a.id ? { ...u, verified: a.verified } : u) };
      d = withAudit(d, "KASBORA Admin", `${db.users.find(u => u.id === a.id)?.org || "Foydalanuvchi"} verifikatsiya qilindi`);
      return d;
    }
    case "USER_SUSPEND": {
      let d: DB = { ...db, users: db.users.map(u => u.id === a.id ? { ...u, suspended: a.suspended } : u) };
      d = withAudit(d, "KASBORA Admin", `${db.users.find(u => u.id === a.id)?.name} ${a.suspended ? "bloklandi" : "blokdan chiqarildi"}`);
      return d;
    }
    case "SKILL_SAVE":
      return { ...db, skills: db.skills.map(s => s.id === a.skill.id ? a.skill : s) };
    case "CREATE_ASSESSMENT":
      return withAudit({ ...db, assessments: [...db.assessments, a.assessment] }, "USTOZ AI", `"${a.assessment.title}" assessment'ini generatsiya qildi (${a.assessment.questions.length} savol)`);
    case "CSV_IMPORT": {
      const newUsers: User[] = a.students.map(s => ({
        id: uid(), role: "STUDENT", name: s.name, username: s.email.split("@")[0], email: s.email,
        password: "kasbora123", color: "#2A5E77",
      }));
      const newProfiles: Record<string, StudentProfile> = {};
      newUsers.forEach(u => { newProfiles[u.id] = { userId: u.id, university: a.university, faculty: "", specialization: "Frontend dasturlash", gradYear: 2026, city: "", about: "", visibility: "PUBLIC", joined: now() }; });
      let d: DB = { ...db, users: [...db.users, ...newUsers], profiles: { ...db.profiles, ...newProfiles } };
      d = withAudit(d, "KASBORA Admin", `${a.university}: CSV orqali ${newUsers.length} ta student import qilindi`);
      return d;
    }
    default: return db;
  }
}

/* ---------------- readiness (shaffof formula) ---------------- */
export interface Readiness {
  score: number; band: string; bandColor: string;
  parts: { key: string; label: string; weight: number; value: number }[];
}
export function readiness(db: DB, studentId: string): Readiness {
  const myAttempts = db.attempts.filter(a => a.studentId === studentId);
  const avg = (ns: number[]) => (ns.length ? Math.min(100, Math.round(ns.reduce((s, n) => s + n, 0) / ns.length)) : 0);
  const assessment = avg(myAttempts.map(a => a.pct));
  const fbs = db.submissions.filter(s => s.studentId === studentId && s.feedback).map(s => s.feedback!.overall);
  const practice = avg(fbs.filter((_, i) => db.submissions.filter(s => s.studentId === studentId && s.feedback)[i]?.status === "PASSED"));
  const mentor = avg(fbs);
  const apps = db.applications.filter(a => a.studentId === studentId);
  const project = avg(apps.map(a => a.status === "COMPLETED" ? 92 : a.status === "IN_PROGRESS" ? Math.round(a.progress * 0.85) : 0).filter(n => n > 0));
  const et = db.employerTasks.filter(t => t.studentId === studentId && t.status === "PASSED").map(t => t.score || 0);
  const completedRatings = apps.filter(a => a.status === "COMPLETED").map(a => {
    const p = db.projects.find(x => x.id === a.projectId); return p?.employerRating ? p.employerRating * 20 : 0;
  }).filter(n => n > 0);
  const employer = avg([...et, ...completedRatings]);
  const parts = [
    { key: "assessment", label: "Assessment", weight: 30, value: assessment },
    { key: "practice", label: "Practice topshiriqlar", weight: 20, value: practice },
    { key: "project", label: "Real loyihalar", weight: 30, value: project },
    { key: "mentor", label: "Mentor feedback", weight: 10, value: mentor },
    { key: "employer", label: "Employer feedback", weight: 10, value: employer },
  ];
  const score = Math.round(parts.reduce((s, p) => s + p.value * p.weight / 100, 0));
  const band = score >= 85 ? "Yuqori tayyor" : score >= 70 ? "Ishga tayyor" : score >= 50 ? "Rivojlanmoqda" : "Boshlang'ich";
  const bandColor = score >= 85 ? "var(--color-pine)" : score >= 70 ? "var(--color-sky)" : score >= 50 ? "var(--color-amber)" : "var(--color-coral)";
  return { score, band, bandColor, parts };
}

export function skillName(db: DB, id: string): string {
  return db.skills.find(s => s.id === id)?.name || "";
}
export function unreadCount(db: DB, userId: string): number {
  return db.notifs.filter(n => n.userId === userId && !n.read).length;
}

/* ---------------- context ---------------- */
interface Toast { id: string; msg: string; kind: "ok" | "err" | "info" }
interface StoreCtx {
  db: DB; me: User | null; dispatch: React.Dispatch<Action>;
  toast: (msg: string, kind?: Toast["kind"]) => void; toasts: Toast[];
  login: (userId: string) => void; logout: () => void;
}
const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, dispatch] = useReducer(reducer, undefined, load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ignore */ }
  }, [db]);

  const value = useMemo<StoreCtx>(() => {
    const me = db.users.find(u => u.id === db.session) || null;
    const toast = (msg: string, kind: Toast["kind"] = "ok") => {
      const id = uid();
      setToasts(ts => [...ts.slice(-2), { id, msg, kind }]);
      window.setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3800);
    };
    return {
      db, me, dispatch, toast, toasts,
      login: (userId: string) => dispatch({ type: "LOGIN", userId }),
      logout: () => dispatch({ type: "LOGOUT" }),
    };
  }, [db, toasts]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
