import React, { useState } from "react";
import { Link, navigate } from "../lib/router";
import { useStore } from "../state/store";
import { useI18n } from "../lib/i18n";
import { Btn, Pill, Icon, I, Avatar, Field } from "../components/ui";
import { KasboraLogo } from "../components/Logo";
import { User, uid, now } from "../data/seed";

const AREA: Record<string, string> = { STUDENT: "student", EMPLOYER: "employer", MENTOR: "mentor", UNIVERSITY: "university", ADMIN: "admin" };

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const { db, dispatch, login, toast } = useStore();
  const { t, theme } = useI18n();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [regRole, setRegRole] = useState<"STUDENT" | "EMPLOYER" | "UNIVERSITY">("STUDENT");
  const [org, setOrg] = useState("");
  const [f, setF] = useState({ first: "", last: "", email2: "", password: "", city: "", university: "TATU", faculty: "", specialization: "Frontend dasturlash", gradYear: "2026" });

  const doLogin = () => {
    const u = db.users.find(x => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === pass);
    if (!u) { setErr(t("err_creds")); return; }
    login(u.id);
    navigate(`/${AREA[u.role]}`);
  };

  const quick = (id: string) => {
    const u = db.users.find(x => x.id === id)!;
    login(id);
    navigate(`/${AREA[u.role]}`);
    toast(`${u.name} — ${u.role}`, "info");
  };

  const register = () => {
    if (!f.first.trim() || !f.last.trim() || !f.email2.trim() || f.password.length < 6) { setErr(t("err_fields")); return; }
    if (regRole !== "STUDENT" && !org.trim()) { setErr(t("err_org")); return; }
    if (db.users.some(u => u.email.toLowerCase() === f.email2.trim().toLowerCase())) { setErr(t("err_email")); return; }
    const user: User = {
      id: uid(), role: regRole, name: `${f.first.trim()} ${f.last.trim()}`,
      username: (f.first + f.last).toLowerCase().replace(/[^a-z]/g, "") + Math.floor(Math.random() * 90 + 10),
      email: f.email2.trim(), password: f.password, city: f.city,
      color: regRole === "EMPLOYER" ? "#2A7F9E" : regRole === "UNIVERSITY" ? "#4C5B2A" : "#0B5D43",
      ...(regRole !== "STUDENT" ? { org: org.trim(), verified: regRole === "UNIVERSITY" } : {}),
    };
    dispatch({
      type: "REGISTER", user,
      profile: { userId: user.id, university: f.university, faculty: f.faculty, specialization: f.specialization, gradYear: Number(f.gradYear), city: f.city, about: "", visibility: "PUBLIC", joined: now() },
    });
    if (regRole === "STUDENT") { toast(t("reg_ok"), "ok"); navigate("/student"); }
    else if (regRole === "EMPLOYER") { toast(t("reg_employer_ok"), "info"); navigate("/employer"); }
    else { toast(t("reg_uni_ok"), "ok"); navigate("/university"); }
  };

  const demos: { id: string; role: string }[] = [
    { id: "u_ali", role: "STUDENT" }, { id: "u_abc", role: "EMPLOYER" }, { id: "u_mentor", role: "MENTOR" },
    { id: "u_tatu", role: "UNIVERSITY" }, { id: "u_admin", role: "ADMIN" },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      {/* left brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-doc text-docink p-10 doc-stripes relative overflow-hidden">
        <svg className="absolute -right-16 -bottom-16 opacity-[0.07] anim-spin-slow" width="420" height="420" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M13 8v48M13 32L44 8M13 32l31 24" stroke="#D9F24F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link to="/" className="transition-transform hover:scale-[1.02] w-fit"><KasboraLogo height={30} light /></Link>
        <div className="relative max-w-md">
          <Pill tone="lime" className="mb-5">{t("PILOT · TATU × 10 KOMPANIYA")}</Pill>
          <h2 className="font-display font-extrabold text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-4">{t("auth_side_h")}</h2>
          <p className="text-docink/75 text-[14px] leading-relaxed mb-8">{t("auth_side_p")}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["6", "skill"], ["3", "loyiha"], ["84", "readiness"]].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-docline py-3">
                <div className="font-display font-extrabold text-xl text-lime">{v}</div>
                <div className="font-mono text-[12px] text-docink/60 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="font-mono text-[12px] tracking-[0.25em] text-lime">LEARN · PROVE · EXPERIENCE · GET HIRED</div>
      </aside>

      {/* right form */}
      <main className="flex items-center justify-center p-5 md:p-10 dotgrid-bg">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6"><Link to="/" className="inline-block"><KasboraLogo height={26} light={theme === "dark"} /></Link></div>
          <div className="card-soft p-6 md:p-7 shadow-[6px_6px_0_0_rgba(20,32,26,0.85)]">
            <div className="flex gap-2 mb-6">
              {(["login", "register"] as const).map(m => (
                <Link key={m} to={`/${m}`} className="flex-1">
                  <span className={`block text-center py-2.5 rounded-lg border-[1.5px] font-display font-bold text-[13px] transition-all ${mode === m ? "bg-pine text-cream border-pine" : "bg-cream border-line text-ink-soft hover:border-ink"}`}>
                    {m === "login" ? t("Kirish") : t("Ro'yxatdan o'tish")}
                  </span>
                </Link>
              ))}
            </div>

            {mode === "login" ? (
              <div className="space-y-4">
                <div className="font-display font-bold text-lg">{t("Xush kelibsiz")}</div>
                {err && <div className="anim-pop rounded-lg border-[1.5px] border-coral bg-coral-soft px-3.5 py-2.5 text-[12.5px] font-semibold text-coral">{err}</div>}
                <Field label={t("Email")}><input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ali@student.uz" /></Field>
                <Field label={t("Parol")}><input className="field" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="kasbora123" onKeyDown={e => e.key === "Enter" && doLogin()} /></Field>
                <Btn variant="lime" className="w-full" onClick={doLogin}>{t("Kirish")} →</Btn>

                <div className="pt-4 border-t border-dashed border-line">
                  <div className="lbl mb-2.5">{t("demo_h")}</div>
                  <div className="grid grid-cols-1 gap-2">
                    {demos.map(d => {
                      const u = db.users.find(x => x.id === d.id)!;
                      return (
                        <button key={d.id} onClick={() => quick(d.id)}
                          className="flex items-center gap-3 rounded-lg border-[1.5px] border-line bg-paper px-3 py-2 text-left btn-press hover:border-pine hover:bg-lime-soft/50 transition-all">
                          <Avatar name={u.name} color={u.color} size={32} />
                          <span className="min-w-0 flex-1">
                            <span className="block font-display font-bold text-[12.5px] truncate">{u.org || u.name}</span>
                            <span className="block font-mono text-[12px] text-ink-soft">{u.email}</span>
                          </span>
                          <Pill tone={d.role === "STUDENT" ? "sky" : d.role === "EMPLOYER" ? "moss" : d.role === "MENTOR" ? "violet" : "ink"}>{d.role}</Pill>
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-mono text-[12px] text-ink-soft mt-2.5">{t("demo_pass")} <code className="bg-cream px-1.5 py-0.5 rounded border border-line font-bold">kasbora123</code></p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="font-display font-bold text-lg">{t("Akkaunt yaratish")}</div>
                <div className="flex gap-2">
                  {([["STUDENT", t("Talaba")], ["EMPLOYER", t("Ish beruvchi")], ["UNIVERSITY", t("Universitet")]] as const).map(([r, l]) => (
                    <button key={r} onClick={() => setRegRole(r)}
                      className={`flex-1 py-2 rounded-lg border-[1.5px] font-display font-bold text-[12px] transition-all btn-press ${regRole === r ? "bg-pine text-cream border-pine" : "bg-cream border-line text-ink-soft hover:border-ink hover:text-ink"}`}>{l}</button>
                  ))}
                </div>
                {err && <div className="anim-pop rounded-lg border-[1.5px] border-coral bg-coral-soft px-3.5 py-2.5 text-[12.5px] font-semibold text-coral">{err}</div>}
                {regRole !== "STUDENT" && (
                  <Field label={regRole === "EMPLOYER" ? t("Kompaniya nomi") : t("Universitet")}>
                    <input className="field" value={org} onChange={e => setOrg(e.target.value)} placeholder={regRole === "EMPLOYER" ? "ABC Digital" : "TATU"} />
                  </Field>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("Ism")}><input className="field" value={f.first} onChange={e => setF({ ...f, first: e.target.value })} placeholder="Ali" /></Field>
                  <Field label={t("Familiya")}><input className="field" value={f.last} onChange={e => setF({ ...f, last: e.target.value })} placeholder="Karimov" /></Field>
                </div>
                <Field label={t("Email")}><input className="field" type="email" value={f.email2} onChange={e => setF({ ...f, email2: e.target.value })} placeholder="siz@student.uz" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("Parol")}><input className="field" type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="••••••••" /></Field>
                  <Field label={t("Shahar")}><input className="field" value={f.city} onChange={e => setF({ ...f, city: e.target.value })} placeholder="Toshkent" /></Field>
                </div>
                {regRole === "STUDENT" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("Universitet")}>
                      <select className="field" value={f.university} onChange={e => setF({ ...f, university: e.target.value })}>
                        <option>TATU</option><option>Inha University</option><option>WIUT</option><option>NUUz</option>
                      </select>
                    </Field>
                    <Field label={t("Bitiruv yili")}><input className="field" type="number" value={f.gradYear} onChange={e => setF({ ...f, gradYear: e.target.value })} /></Field>
                    <div className="col-span-2"><Field label={t("Yo'nalish")}><input className="field" value={f.specialization} onChange={e => setF({ ...f, specialization: e.target.value })} /></Field></div>
                  </div>
                )}
                <Btn variant="lime" className="w-full" onClick={register}>{t("Ro'yxatdan o'tish")} →</Btn>
              </div>
            )}
          </div>
          <p className="text-center text-[12.5px] text-ink-soft mt-4 font-mono">
            {mode === "login" ? t("Akkauntingiz yo'qmi?") : t("Allaqachon akkauntingiz bormi?")}{" "}
            <Link to={mode === "login" ? "/register" : "/login"} className="font-bold text-pine hover:underline">
              {mode === "login" ? t("Ro'yxatdan o'tish") : t("Kirish")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
