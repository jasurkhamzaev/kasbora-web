import React, { useEffect, useState } from "react";
import { useRoute, navigate, Link } from "./lib/router";
import { StoreProvider, useStore, unreadCount } from "./state/store";
import { I18nProvider, useI18n, LocaleControls } from "./lib/i18n";
import { Btn, Icon, I, Avatar, Pill } from "./components/ui";
import { KasboraLogo } from "./components/Logo";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import PassportPage from "./pages/Passport";
import Ecosystem from "./pages/Ecosystem";
import StudentArea from "./pages/StudentArea";
import EmployerArea, { EMPLOYER_TABS } from "./pages/EmployerArea";
import { MentorArea, UniversityArea, AdminArea } from "./pages/OtherAreas";

/* ---------- navigation per role ---------- */
const NAV: Record<string, { id: string; l: string; ic: React.ReactNode }[]> = {
  STUDENT: [
    { id: "dashboard", l: "Dashboard", ic: I.home },
    { id: "assessments", l: "Assessmentlar", ic: I.shield },
    { id: "tasks", l: "Practice tasks", ic: I.tasks },
    { id: "projects", l: "Loyihalar", ic: I.brief },
    { id: "applications", l: "Arizalarim", ic: I.doc },
    { id: "interviews", l: "Interviewlar", ic: I.cal },
    { id: "offers", l: "Offerlar", ic: I.star },
    { id: "passport", l: "Skill Passport", ic: I.passport },
  ],
  EMPLOYER: EMPLOYER_TABS,
  MENTOR: [
    { id: "queue", l: "Tekshirish navbati", ic: I.tasks },
    { id: "done", l: "Feedbacklar", ic: I.check },
  ],
  UNIVERSITY: [
    { id: "dashboard", l: "Dashboard", ic: I.home },
    { id: "students", l: "Talabalar", ic: I.users },
    { id: "analytics", l: "Analytics", ic: I.chart },
  ],
  ADMIN: [
    { id: "users", l: "Foydalanuvchilar", ic: I.users },
    { id: "projects", l: "Loyihalar", ic: I.brief },
    { id: "skills", l: "Skill katalogi", ic: I.spark },
    { id: "audit", l: "Audit log", ic: I.doc },
  ],
};
const AREA_BY_ROLE: Record<string, string> = { STUDENT: "student", EMPLOYER: "employer", MENTOR: "mentor", UNIVERSITY: "university", ADMIN: "admin" };
const ROLE_BY_AREA: Record<string, string> = { student: "STUDENT", employer: "EMPLOYER", mentor: "MENTOR", university: "UNIVERSITY", admin: "ADMIN" };
const AREA_TITLE: Record<string, string> = { student: "Talaba paneli", employer: "Employer paneli", mentor: "Mentor paneli", university: "Universitet paneli", admin: "Admin panel" };

/* ---------- toasts ---------- */
function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-5 right-5 z-[120] space-y-2 w-[min(320px,90vw)]">
      {toasts.map(t => (
        <div key={t.id} className={`anim-pop card-soft px-4 py-3 text-[12.5px] font-semibold flex items-start gap-2.5 shadow-[4px_4px_0_0_rgba(20,32,26,0.85)] border-l-4 ${t.kind === "err" ? "!border-l-coral" : t.kind === "info" ? "!border-l-sky" : "!border-l-pine"}`}>
          <span className={`mt-0.5 ${t.kind === "err" ? "text-coral" : t.kind === "info" ? "text-sky" : "text-pine"}`}>
            <Icon d={t.kind === "err" ? I.x : t.kind === "info" ? I.spark : I.check} size={14} />
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- notifications drawer ---------- */
function NotifDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { db, me, dispatch } = useStore();
  const { t, fmtAgo } = useI18n();
  if (!open || !me) return null;
  const mine = db.notifs.filter(n => n.userId === me.id);
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[min(380px,92vw)] bg-paper border-l-[1.5px] border-ink flex flex-col anim-drawer">
        <div className="px-5 py-4 border-b-[1.5px] border-ink flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-[15px]">{t("Bildirishnomalar")}</div>
            <div className="font-mono text-[12px] text-ink-soft">{mine.length} {t("ta")} · email + in-app</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border-[1.5px] border-ink bg-cream hover:bg-coral-soft flex items-center justify-center btn-press" aria-label={t("Yopish")}>
            <Icon d={I.x} size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {mine.length === 0 && <p className="text-[13px] text-ink-soft text-center py-10">{t("Hozircha bildirishnoma yo'q")}</p>}
          {mine.map(n => (
            <div key={n.id} className={`card-soft p-3.5 ${!n.read ? "border-l-4 !border-l-coral" : ""}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-display font-bold text-[12.5px]">{n.title}</span>
                {!n.read && <span className="live-dot w-2 h-2 rounded-full bg-coral shrink-0" />}
              </div>
              <p className="text-[12px] text-ink-soft leading-relaxed">{n.body}</p>
              <div className="font-mono text-[12px] text-ink-soft mt-1.5">{fmtAgo(n.date)}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t-[1.5px] border-ink">
          <Btn variant="outline" small className="w-full" onClick={() => dispatch({ type: "MARK_READ", userId: me.id })}>
            {t("Hammasini o'qildi deb belgilash")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- role shell ---------- */
function RoleShell({ area, tab }: { area: string; tab: string }) {
  const { db, me, logout } = useStore();
  const { t, theme } = useI18n();
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const role = me!.role;
  const nav = NAV[role] || [];
  const activeTab = nav.some(n => n.id === tab) ? tab : nav[0]?.id || "dashboard";
  const activeNav = nav.find(n => n.id === activeTab);
  const unread = unreadCount(db, me!.id);
  const logoLight = theme === "dark";

  useEffect(() => { window.scrollTo({ top: 0 }); }, [activeTab, area]);
  const go = (id: string) => { window.location.hash = `#/${area}/${id}`; setMenu(false); };

  return (
    <div className="min-h-screen dotgrid-bg lg:pl-[240px]">
      {/* sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] border-r-[1.5px] border-ink bg-paper flex-col z-40">
        <div className="px-5 h-16 flex items-center border-b-[1.5px] border-ink">
          <Link to="/" className="transition-transform hover:scale-[1.03]" aria-label="KASBORA"><KasboraLogo height={23} light={logoLight} /></Link>
        </div>
        <div className="px-4 py-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <Avatar name={me!.name} color={me!.color} size={36} />
            <div className="min-w-0">
              <div className="font-display font-bold text-[12.5px] truncate">{me!.name}</div>
              <div className="font-mono text-[12px] text-ink-soft uppercase tracking-wider truncate">{role === "EMPLOYER" ? me!.org : t(AREA_TITLE[area])}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Asosiy menyu">
          {nav.map(n => (
            <button key={n.id} onClick={() => go(n.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left font-semibold text-[13px] transition-all btn-press ${activeTab === n.id ? "bg-pine text-cream shadow-[2px_2px_0_0_#14201A]" : "text-ink-soft hover:bg-lime-soft hover:text-ink"}`}>
              <Icon d={n.ic} size={16} />
              {t(n.l)}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t-[1.5px] border-ink space-y-1">
          <Link to="/ekotizim" className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-[12.5px] text-ink-soft hover:bg-cream transition-colors">
            <Icon d={I.api} size={15} /> {t("Ekotizim")}
          </Link>
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-[12.5px] text-coral hover:bg-coral-soft transition-colors">
            <Icon d={I.out} size={15} /> {t("Chiqish")}
          </button>
        </div>
      </aside>

      {/* topbar */}
      <header className="sticky top-0 z-[60] bg-paper/90 backdrop-blur-md border-b-[1.5px] border-ink">
        <div className="h-14 px-4 flex items-center gap-3">
          <button className="lg:hidden w-9 h-9 rounded-lg border-[1.5px] border-ink bg-cream flex items-center justify-center" onClick={() => setMenu(!menu)} aria-label={t("Menyu")}>
            <Icon d={menu ? I.x : <path d="M4 7h16M4 12h16M4 17h16" />} size={16} />
          </button>
          <Link to="/" className="lg:hidden transition-transform hover:scale-[1.03]" aria-label="KASBORA"><KasboraLogo height={21} light={logoLight} /></Link>
          <div className="hidden lg:flex items-center gap-2 min-w-0">
            <span className="font-display font-bold text-[14px] truncate">{t(activeNav?.l || AREA_TITLE[area])}</span>
            <Pill tone="ink">{role}</Pill>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {role === "STUDENT" && (
              <Link to={`/p/${me!.username}`} className="hidden md:block"><Btn variant="outline" small><Icon d={I.passport} size={13} /> {t("Passport")}</Btn></Link>
            )}
            <LocaleControls />
            <button onClick={() => setDrawer(true)} className="relative w-9 h-9 rounded-lg border-[1.5px] border-ink bg-cream flex items-center justify-center hover:bg-lime-soft transition-colors" aria-label={t("Bildirishnomalar")}>
              <Icon d={I.bell} size={16} />
              {unread > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-coral text-cream text-[12px] font-bold flex items-center justify-center px-1 border border-paper live-dot">{unread}</span>}
            </button>
            <span className="lg:hidden"><Avatar name={me!.name} color={me!.color} size={34} /></span>
          </div>
        </div>
        {menu && (
          <div className="lg:hidden border-t border-line bg-paper px-3 py-3 anim-pop">
            <div className="grid grid-cols-2 gap-1.5">
              {nav.map(n => (
                <button key={n.id} onClick={() => go(n.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-[12.5px] text-left transition-all ${activeTab === n.id ? "bg-pine text-cream" : "bg-cream border border-line"}`}>
                  <Icon d={n.ic} size={15} />{t(n.l)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Link to="/ekotizim" className="flex-1"><Btn variant="outline" small className="w-full">{t("Ekotizim")}</Btn></Link>
              <Btn variant="outline" small className="!text-coral flex-1" onClick={() => { logout(); navigate("/"); }}>{t("Chiqish")}</Btn>
            </div>
          </div>
        )}
      </header>

      {/* content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 lg:pb-10">
        {area === "student" && <StudentArea tab={activeTab} />}
        {area === "employer" && <EmployerArea tab={activeTab} />}
        {area === "mentor" && <MentorArea tab={activeTab} />}
        {area === "university" && <UniversityArea tab={activeTab} />}
        {area === "admin" && <AdminArea tab={activeTab} />}
      </main>

      {/* mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[55] bg-paper border-t-[1.5px] border-ink flex" aria-label="Pastki menyu">
        {nav.slice(0, 5).map(n => (
          <button key={n.id} onClick={() => go(n.id)}
            className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[12px] font-mono font-bold tracking-wide transition-colors ${activeTab === n.id ? "text-pine" : "text-ink-soft"}`}>
            <Icon d={n.ic} size={17} />
            {t(n.l).split(" ")[0]}
            {activeTab === n.id && <span className="w-1 h-1 rounded-full bg-pine" />}
          </button>
        ))}
      </nav>

      <NotifDrawer open={drawer} onClose={() => setDrawer(false)} />
    </div>
  );
}

/* ---------- router ---------- */
function Router() {
  const route = useRoute();
  const { me } = useStore();
  const [seg0, seg1] = route.split("/").filter(Boolean);
  const area = seg0 && ROLE_BY_AREA[seg0] ? seg0 : null;

  useEffect(() => {
    if (area && (!me || me.role !== ROLE_BY_AREA[area])) navigate("/login");
  }, [area, me]);

  if (!seg0) return <Landing />;
  if (seg0 === "login" || seg0 === "register") {
    if (me) { navigate(`/${AREA_BY_ROLE[me.role]}`); return null; }
    return <Auth mode={seg0 === "login" ? "login" : "register"} />;
  }
  if (seg0 === "p" && seg1) return <PassportPage username={seg1} />;
  if (seg0 === "ekotizim") return <Ecosystem />;
  if (area) {
    if (!me || me.role !== ROLE_BY_AREA[area]) return null;
    return <RoleShell area={area} tab={seg1 || ""} />;
  }
  return <Landing />;
}

export default function App() {
  return (
    <I18nProvider>
      <StoreProvider>
        <Router />
        <Toasts />
      </StoreProvider>
    </I18nProvider>
  );
}
