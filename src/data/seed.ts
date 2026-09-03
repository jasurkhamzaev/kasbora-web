/* ============ KASBORA — data model + pilot seed (1 kasb · 1 universitet · 10 kompaniya) ============ */

export type Role = "STUDENT" | "EMPLOYER" | "MENTOR" | "UNIVERSITY" | "ADMIN";
export type SkillLevel = "BEGINNER" | "JUNIOR" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type VerifySource = "SELF_DECLARED" | "ASSESSMENT" | "TASK" | "PROJECT" | "MENTOR" | "EMPLOYER";

export interface User {
  id: string; role: Role; name: string; username: string; email: string; password: string;
  org?: string; title?: string; city?: string; verified?: boolean; suspended?: boolean; color: string;
}
export interface StudentProfile {
  userId: string; university: string; faculty: string; specialization: string; gradYear: number;
  city: string; about: string; visibility: "PUBLIC" | "EMPLOYER_ONLY" | "PRIVATE";
  telegram?: string; github?: string; portfolio?: string; linkedin?: string; joined: string;
}
export interface Skill { id: string; name: string; category: string }
export interface StudentSkill {
  skillId: string; level: SkillLevel; status: "SELF_DECLARED" | "VERIFIED";
  score?: number; source: VerifySource; date?: string;
}
export interface Question { id: string; text: string; code?: string; options: string[]; answer: number }
export interface Assessment {
  id: string; skillId: string; title: string; difficulty: "Junior" | "Intermediate";
  durationSec: number; passing: number; questions: Question[];
}
export interface Attempt {
  id: string; studentId: string; assessmentId: string; pct: number; passed: boolean;
  level: SkillLevel; attemptNo: number; date: string; tabSwitches: number; pastes: number;
}
export interface PracticeTask {
  id: string; title: string; skillId: string; difficulty: string; deadlineDays: number;
  description: string; criteria: string[];
}
export interface Feedback {
  technical: number; communication: number; problemSolving: number; deadline: number; teamwork: number;
  overall: number; comment: string; authorId: string; authorName: string;
}
export interface TaskSubmission {
  id: string; taskId: string; studentId: string; status: "SUBMITTED" | "UNDER_REVIEW" | "PASSED" | "FAILED";
  text: string; url: string; liveUrl?: string; date: string; feedback?: Feedback;
}
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "APPLICATIONS_OPEN" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
export interface Project {
  id: string; title: string; companyId: string; category: string; skillIds: string[];
  durationDays: number; payment: number; positions: number; difficulty: string; deadline: string;
  description: string; status: ProjectStatus; employerRating?: number; mentorRating?: number;
}
export type AppStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
export interface Application {
  id: string; projectId: string; studentId: string; cover: string; portfolio: string;
  status: AppStatus; date: string; progress: number;
}
export interface Interview {
  id: string; studentId: string; companyId: string; date: string; time: string;
  type: "VIDEO" | "OFFICE" | "PHONE"; url: string; notes: string;
  status: "INVITED" | "CONFIRMED" | "DECLINED" | "COMPLETED";
}
export interface EmployerTask {
  id: string; studentId: string; companyId: string; title: string; description: string;
  deadline: string; criteria: string; status: "ASSIGNED" | "SUBMITTED" | "PASSED" | "FAILED";
  submission?: string; submittedAt?: string; liveUrl?: string; score?: number; feedback?: string; date: string;
}
export interface Offer {
  id: string; studentId: string; companyId: string; role: string; salary: string;
  message: string; status: "OFFERED" | "ACCEPTED" | "DECLINED"; date: string;
}
export interface Notif { id: string; userId: string; kind: string; title: string; body: string; date: string; read: boolean }
export interface AuditEntry { id: string; actor: string; action: string; date: string }
export interface BlindReview {
  id: string; companyId: string; candidateId: string; taskTitle: string; code: string;
  githubUrl: string; liveUrl: string; submittedAt: string; status: "PENDING" | "REVEALED";
  scores: { score: number; comment: string; reviewer: string }[];
}

export interface DB {
  users: User[];
  profiles: Record<string, StudentProfile>;
  skills: Skill[];
  studentSkills: Record<string, StudentSkill[]>;
  assessments: Assessment[];
  attempts: Attempt[];
  tasks: PracticeTask[];
  submissions: TaskSubmission[];
  projects: Project[];
  applications: Application[];
  interviews: Interview[];
  employerTasks: EmployerTask[];
  offers: Offer[];
  notifs: Notif[];
  audit: AuditEntry[];
  blindReviews: BlindReview[];
  session: string | null;
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const now = () => new Date().toISOString();
export const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString();
export const daysAhead = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

const q = (id: string, text: string, options: string[], answer: number, code?: string): Question =>
  ({ id, text, options, answer, code });

export const skills: Skill[] = [
  { id: "sk_html", name: "HTML", category: "Frontend" },
  { id: "sk_css", name: "CSS", category: "Frontend" },
  { id: "sk_js", name: "JavaScript", category: "Frontend" },
  { id: "sk_react", name: "React", category: "Frontend" },
  { id: "sk_git", name: "Git", category: "Vositalar" },
  { id: "sk_rest", name: "REST API", category: "Integratsiya" },
  /* Phase 2: yangi kasblar */
  { id: "sk_qa", name: "QA Testing", category: "Sifat" },
  { id: "sk_figma", name: "Figma", category: "UI/Design" },
];

const assessments: Assessment[] = [
  {
    id: "as_js", skillId: "sk_js", title: "JavaScript Assessment", difficulty: "Junior", durationSec: 480, passing: 70,
    questions: [
      q("j1", "typeof null ning qiymati nima?", ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""], 1, "console.log(typeof null);"),
      q("j2", "Qaysi metod massivning har bir elementini o'zgartirib, YANGI massiv qaytaradi?", ["forEach()", "map()", "push()", "splice()"], 1),
      q("j3", "Nima uchun bu ifoda false qaytaradi?", ["JavaScript xatosi", "Ikkilik sanoqda aniqlik yo'qotilishi", "=== noto'g'ri operator", "0.3 mavjud emas"], 1, "0.1 + 0.2 === 0.3  // false"),
      q("j4", "Closure (yopiq funksiya) nimani saqlab qoladi?", ["Faqat o'z lokal o'zgaruvchilarini", "Tashqi funksiya o'zgaruvchilariga havolani", "Global obyektlarni", "DOM elementlarini"], 1),
      q("j5", "Promise nechta holatga (state) ega?", ["2", "3", "4", "5"], 1),
      q("j6", "=== operatori nimani solishtiradi?", ["Faqat qiymatni", "Qiymat va turni (konversiyasiz)", "Faqat turni", "Xotira manzilini"], 1),
    ],
  },
  {
    id: "as_react", skillId: "sk_react", title: "React Assessment", difficulty: "Intermediate", durationSec: 480, passing: 70,
    questions: [
      q("r1", "Qaysi hook komponentda side-effectlarni bajarish uchun ishlatiladi?", ["useState", "useEffect", "useMemo", "useRef"], 1),
      q("r2", "Ro'yxatlarda key prop nima uchun kerak?", ["CSS styling uchun", "Element identifikatsiyasi va samarali re-render uchun", "SEO uchun", "Serverga yuborish uchun"], 1),
      q("r3", "useState nimani qaytaradi?", ["Faqat qiymatni", "[qiymat, setter] juftligini", "Obyekt va funksiya", "Promise"], 1, "const [count, setCount] = useState(0);"),
      q("r4", "Virtual DOM ning asosiy vazifasi nima?", ["CSS ni tezlashtirish", "Real DOM'dagi o'zgarishlarni minimumga tushirish", "Server yukini kamaytirish", "Xotirani tozalash"], 1),
      q("r5", "Komponent qachon qayta render bo'ladi?", ["Har soniyada", "State yoki props o'zgarganda", "Faqat sahifa yangilanganda", "Hech qachon"], 1),
    ],
  },
  {
    id: "as_git", skillId: "sk_git", title: "Git Assessment", difficulty: "Junior", durationSec: 360, passing: 70,
    questions: [
      q("g1", "Yangi branch yaratib, unga o'tish uchun qaysi buyruq ishlatiladi?", ["git branch new", "git checkout -b new", "git switch main", "git merge new"], 1),
      q("g2", "git stash nima qiladi?", ["O'zgarishlarni o'chiradi", "Commit qilinmagan o'zgarishlarni vaqtincha saqlaydi", "Branchni o'chiradi", "Remote'ga push qiladi"], 1),
      q("g3", "git rebase ning merge dan asosiy farqi nima?", ["Sekinroq ishlaydi", "Commit tarixini qayta yozadi (chiziqli qiladi)", "Faqat main branchda ishlaydi", "Farqi yo'q"], 1),
      q("g4", "HEAD nimani bildiradi?", ["Eng birinchi commitni", "Joriy aktiv commit/branch pozitsiyasini", "Remote serverni", "Staging areani"], 1),
    ],
  },
  {
    id: "as_html", skillId: "sk_html", title: "HTML Assessment", difficulty: "Junior", durationSec: 360, passing: 70,
    questions: [
      q("h1", "Navigatsiya bloklari uchun semantik teg qaysi?", ["<div>", "<nav>", "<section>", "<span>"], 1),
      q("h2", "img tegidagi alt atributining asosiy maqsadi?", ["Rasm sifatini oshirish", "Accessibility va rasm yuklanmaganda matn ko'rsatish", "Rasm hajmini belgilash", "SEO'ga ta'sir qilmaydi"], 1),
      q("h3", "Quyidagilardan qaysi biri inline element?", ["<div>", "<p>", "<span>", "<h1>"], 2),
      q("h4", "Email kiritish uchun input turi qaysi?", ["type=\"text\"", "type=\"mail\"", "type=\"email\"", "type=\"address\""], 2),
    ],
  },
  {
    id: "as_css", skillId: "sk_css", title: "CSS Assessment", difficulty: "Junior", durationSec: 360, passing: 70,
    questions: [
      q("c1", "Flexbox'da main-axis ning standart yo'nalishi?", ["Vertikal", "Gorizontal (qator bo'ylab)", "Diagonal", "Markazdan tashqariga"], 1),
      q("c2", "Quyidagilardan qaysi selector spesifikatsiyasi eng yuqori?", [".class", "#id", "element", "inline style"], 3),
      q("c3", "position: sticky qanday ishlaydi?", ["Doimiy fixed bo'ladi", "Scroll'da chegara qiymatigacha oddiy, keyin yopishqoq", "Elementni yashiradi", "Faqat mobile'da ishlaydi"], 1),
      q("c4", "box-sizing: border-box nimani anglatadi?", ["Padding width'ga qo'shilmaydi", "Padding va border width ichiga kiradi", "Margin width'ga kiradi", "Border o'chadi"], 1),
    ],
  },
  {
    id: "as_rest", skillId: "sk_rest", title: "REST API Assessment", difficulty: "Intermediate", durationSec: 360, passing: 70,
    questions: [
      q("a1", "Resursni to'liq yangilash uchun qaysi HTTP metod ishlatiladi?", ["POST", "PUT", "PATCH", "GET"], 1),
      q("a2", "404 status kodi nimani bildiradi?", ["Server xatosi", "Resurs topilmadi", "Avtorizatsiya kerak", "So'rov muvaffaqiyatli"], 1),
      q("a3", "JSON qisqartmasi nimani anglatadi?", ["Java Source Object Notation", "JavaScript Object Notation", "JavaScript Oriented Network", "Java Standard Output Node"], 1),
      q("a4", "Quyidagilardan qaysi metod idempotent hisoblanadi?", ["POST", "GET", "PATCH (har doim)", "CONNECT"], 1),
    ],
  },
  /* Phase 2: yangi kasblar — QA va UI/Design */
  {
    id: "as_qa", skillId: "sk_qa", title: "QA Testing Assessment", difficulty: "Junior", durationSec: 360, passing: 70,
    questions: [
      q("qa1", "Butun tizimni oxirigacha tekshiradigan test turi qaysi?", ["Unit test", "Integration test", "End-to-end test", "Smoke test"], 2),
      q("qa2", "Bug report'dagi eng muhim element nima?", ["Screenshot", "Qadam-baqadam takrorlash yo'li", "Muhit versiyasi", "Prioritet"], 1),
      q("qa3", "Regression test nima uchun o'tkaziladi?", ["Yangi funksiyani tekshirish uchun", "Eski funksiyalar buzilmaganini tekshirish uchun", "Performance o'lchash uchun", "UI chiroyini baholash uchun"], 1),
      q("qa4", "Test coverage 100% bo'lishi nimani bildiradi?", ["Dasturda bug yo'q", "Barcha kod qatorlari testdan o'tgan", "Barcha user ssenariylari tekshirilgan", "Testlar sifatli"], 1),
    ],
  },
  {
    id: "as_figma", skillId: "sk_figma", title: "UI/Design Assessment", difficulty: "Junior", durationSec: 360, passing: 70,
    questions: [
      q("fg1", "Figma'da Auto Layout nimani avtomatlashtiradi?", ["Ranglarni", "Elementlar orasidagi joylashuv va padding'larni", "Eksportni", "Kommentariyalarni"], 1),
      q("fg2", "8px grid tizimi nima uchun ishlatiladi?", ["Fayl hajmini kamaytirish uchun", "Izchil va mos ritmik dizayn uchun", "Tez chizish uchun", "SEO uchun"], 1),
      q("fg3", "Komponent variantlari (variants) qanday foyda beradi?", ["Faqat nomlashni osonlashtiradi", "Bir komponentning holatlarini (hover, disabled) bitta joyda boshqarish", "Faylni kichraytiradi", "Eksport sifatini oshiradi"], 1),
      q("fg4", "Matn va fon kontrast nisbati accessibility uchun kamida qancha bo'lishi kerak?", ["1.5:1", "2:1", "4.5:1", "10:1"], 2),
    ],
  },
];

const users: User[] = [
  { id: "u_ali", role: "STUDENT", name: "Ali Karimov", username: "alikarimov", email: "ali@student.uz", password: "kasbora123", city: "Toshkent", color: "#0B5D43" },
  { id: "u_madina", role: "STUDENT", name: "Madina Yusupova", username: "madinayusupova", email: "madina@student.uz", password: "kasbora123", city: "Samarqand", color: "#2A7F9E" },
  { id: "u_javlon", role: "STUDENT", name: "Javlon Toshpo'latov", username: "javlon", email: "javlon@student.uz", password: "kasbora123", city: "Toshkent", color: "#B25A12" },
  { id: "u_nilufar", role: "STUDENT", name: "Nilufar Sodiqova", username: "nilufar", email: "nilufar@student.uz", password: "kasbora123", city: "Buxoro", color: "#8A3E5C" },
  { id: "u_bekzod", role: "STUDENT", name: "Bekzod Ergashev", username: "bekzod", email: "bekzod@student.uz", password: "kasbora123", city: "Farg'ona", color: "#4C5B2A" },
  { id: "u_abc", role: "EMPLOYER", name: "Zamira Aliyeva", username: "abcdigital", email: "hr@abc.uz", password: "kasbora123", org: "ABC Digital", title: "HR Lead", city: "Toshkent", verified: true, color: "#0B5D43" },
  { id: "u_sarbon", role: "EMPLOYER", name: "Timur G'aniyev", username: "sarbonlabs", email: "jobs@sarbon.uz", password: "kasbora123", org: "Sarbon Labs", title: "CTO", city: "Toshkent", verified: false, color: "#2A7F9E" },
  { id: "u_mentor", role: "MENTOR", name: "Dilshod Rahimov", username: "dilshod", email: "mentor@kasbora.uz", password: "kasbora123", title: "Senior Frontend Mentor", verified: true, color: "#8A3E5C" },
  { id: "u_tatu", role: "UNIVERSITY", name: "Bekzod Karimov", username: "tatu", email: "admin@tatu.uz", password: "kasbora123", org: "TATU — Toshkent Axborot Texnologiyalari Universiteti", title: "Karyera markazi rahbari", verified: true, color: "#4C5B2A" },
  { id: "u_admin", role: "ADMIN", name: "KASBORA Admin", username: "admin", email: "admin@kasbora.uz", password: "kasbora123", title: "Platforma administratori", color: "#14201A" },
];

const profiles: Record<string, StudentProfile> = {
  u_ali: {
    userId: "u_ali", university: "TATU", faculty: "Kompyuter injiniringi", specialization: "Frontend dasturlash",
    gradYear: 2026, city: "Toshkent", visibility: "PUBLIC",
    about: "3-kurs talabasi. Frontend yo'nalishida o'zini sinab ko'rmoqda — real loyihalarda ishlash orqali tajriba to'plamoqchi.",
    telegram: "@alikarimov", github: "github.com/alikarimov", portfolio: "alikarimov.dev", linkedin: "linkedin.com/in/alikarimov",
    joined: daysAgo(64),
  },
  u_madina: {
    userId: "u_madina", university: "TATU", faculty: "Kompyuter injiniringi", specialization: "Frontend dasturlash",
    gradYear: 2025, city: "Samarqand", visibility: "PUBLIC",
    about: "Bitiruvchi kurs. React'da kuchli, jamoada ishlashni yaxshi ko'radi.",
    telegram: "@madinayus", github: "github.com/madinayus", joined: daysAgo(120),
  },
  u_javlon: { userId: "u_javlon", university: "TATU", faculty: "Kompyuter injiniringi", specialization: "Frontend dasturlash", gradYear: 2027, city: "Toshkent", visibility: "EMPLOYER_ONLY", about: "Boshlang'ich bosqich talabasi.", joined: daysAgo(30) },
  u_nilufar: { userId: "u_nilufar", university: "TATU", faculty: "Axborot tizimlari", specialization: "Frontend dasturlash", gradYear: 2026, city: "Buxoro", visibility: "PUBLIC", about: "", joined: daysAgo(45) },
  u_bekzod: { userId: "u_bekzod", university: "TATU", faculty: "Kompyuter injiniringi", specialization: "Frontend dasturlash", gradYear: 2025, city: "Farg'ona", visibility: "PUBLIC", about: "", joined: daysAgo(90) },
};

const studentSkills: Record<string, StudentSkill[]> = {
  u_ali: [
    { skillId: "sk_git", level: "ADVANCED", status: "VERIFIED", score: 91, source: "ASSESSMENT", date: daysAgo(20) },
    { skillId: "sk_js", level: "INTERMEDIATE", status: "VERIFIED", score: 82, source: "ASSESSMENT", date: daysAgo(14) },
    { skillId: "sk_react", level: "ADVANCED", status: "SELF_DECLARED", source: "SELF_DECLARED", date: daysAgo(12) },
    { skillId: "sk_html", level: "INTERMEDIATE", status: "VERIFIED", score: 88, source: "TASK", date: daysAgo(9) },
    { skillId: "sk_css", level: "JUNIOR", status: "SELF_DECLARED", source: "SELF_DECLARED", date: daysAgo(8) },
  ],
  u_madina: [
    { skillId: "sk_react", level: "ADVANCED", status: "VERIFIED", score: 86, source: "ASSESSMENT", date: daysAgo(30) },
    { skillId: "sk_js", level: "INTERMEDIATE", status: "VERIFIED", score: 80, source: "ASSESSMENT", date: daysAgo(28) },
    { skillId: "sk_git", level: "INTERMEDIATE", status: "VERIFIED", score: 78, source: "ASSESSMENT", date: daysAgo(25) },
    { skillId: "sk_rest", level: "INTERMEDIATE", status: "VERIFIED", score: 74, source: "ASSESSMENT", date: daysAgo(18) },
  ],
  u_javlon: [
    { skillId: "sk_html", level: "JUNIOR", status: "VERIFIED", score: 72, source: "ASSESSMENT", date: daysAgo(6) },
    { skillId: "sk_js", level: "BEGINNER", status: "SELF_DECLARED", source: "SELF_DECLARED", date: daysAgo(5) },
  ],
  u_nilufar: [
    { skillId: "sk_html", level: "JUNIOR", status: "VERIFIED", score: 76, source: "ASSESSMENT", date: daysAgo(11) },
    { skillId: "sk_css", level: "JUNIOR", status: "VERIFIED", score: 71, source: "ASSESSMENT", date: daysAgo(7) },
  ],
  u_bekzod: [
    { skillId: "sk_js", level: "INTERMEDIATE", status: "VERIFIED", score: 79, source: "ASSESSMENT", date: daysAgo(40) },
    { skillId: "sk_git", level: "INTERMEDIATE", status: "VERIFIED", score: 75, source: "ASSESSMENT", date: daysAgo(33) },
    { skillId: "sk_react", level: "INTERMEDIATE", status: "VERIFIED", score: 73, source: "PROJECT", date: daysAgo(21) },
  ],
};

const attempts: Attempt[] = [
  { id: "at1", studentId: "u_ali", assessmentId: "as_git", pct: 91, passed: true, level: "ADVANCED", attemptNo: 1, date: daysAgo(20), tabSwitches: 0, pastes: 0 },
  { id: "at2", studentId: "u_ali", assessmentId: "as_js", pct: 64, passed: false, level: "JUNIOR", attemptNo: 1, date: daysAgo(17), tabSwitches: 1, pastes: 0 },
  { id: "at3", studentId: "u_ali", assessmentId: "as_js", pct: 82, passed: true, level: "INTERMEDIATE", attemptNo: 2, date: daysAgo(14), tabSwitches: 0, pastes: 0 },
  { id: "at4", studentId: "u_madina", assessmentId: "as_react", pct: 86, passed: true, level: "ADVANCED", attemptNo: 1, date: daysAgo(30), tabSwitches: 0, pastes: 0 },
  { id: "at5", studentId: "u_madina", assessmentId: "as_js", pct: 80, passed: true, level: "INTERMEDIATE", attemptNo: 1, date: daysAgo(28), tabSwitches: 0, pastes: 1 },
  { id: "at6", studentId: "u_madina", assessmentId: "as_git", pct: 78, passed: true, level: "INTERMEDIATE", attemptNo: 1, date: daysAgo(25), tabSwitches: 0, pastes: 0 },
  { id: "at7", studentId: "u_madina", assessmentId: "as_rest", pct: 74, passed: true, level: "INTERMEDIATE", attemptNo: 1, date: daysAgo(18), tabSwitches: 0, pastes: 0 },
  { id: "at8", studentId: "u_javlon", assessmentId: "as_html", pct: 72, passed: true, level: "JUNIOR", attemptNo: 1, date: daysAgo(6), tabSwitches: 0, pastes: 0 },
  { id: "at9", studentId: "u_nilufar", assessmentId: "as_html", pct: 76, passed: true, level: "JUNIOR", attemptNo: 1, date: daysAgo(11), tabSwitches: 0, pastes: 0 },
  { id: "at10", studentId: "u_nilufar", assessmentId: "as_css", pct: 71, passed: true, level: "JUNIOR", attemptNo: 1, date: daysAgo(7), tabSwitches: 1, pastes: 0 },
  { id: "at11", studentId: "u_bekzod", assessmentId: "as_js", pct: 79, passed: true, level: "INTERMEDIATE", attemptNo: 1, date: daysAgo(40), tabSwitches: 0, pastes: 0 },
  { id: "at12", studentId: "u_bekzod", assessmentId: "as_git", pct: 75, passed: true, level: "INTERMEDIATE", attemptNo: 1, date: daysAgo(33), tabSwitches: 0, pastes: 0 },
];

const tasks: PracticeTask[] = [
  {
    id: "t_landing", title: "Landing page yasash", skillId: "sk_html", difficulty: "Junior", deadlineDays: 7,
    description: "Kichik biznes uchun bir sahifalik landing page yarating: hero, xizmatlar, narxlar, aloqa bo'limlari. Semantik HTML + responsive CSS talab qilinadi.",
    criteria: ["Semantik HTML strukturasi", "Responsive dizayn (mobile-first)", "CSS tartibi va nomlash", "Accessibility asoslari"],
  },
  {
    id: "t_dashboard", title: "Dashboard UI komponentlari", skillId: "sk_react", difficulty: "Intermediate", deadlineDays: 10,
    description: "React'da statik dashboard: sidebar, KPI kartalar, jadval va oddiy grafik. State'lar useState bilan boshqarilsin.",
    criteria: ["Komponentlarga ajratish", "Props oqimi", "State'dan foydalanish", "UI sifati"],
  },
  {
    id: "t_api", title: "API integratsiya", skillId: "sk_rest", difficulty: "Intermediate", deadlineDays: 7,
    description: "Ochiq REST API (masalan, JSONPlaceholder) dan fetch orqali ma'lumot olib, ro'yxat va detal sahifasini yarating. Loading/error holatlari bo'lsin.",
    criteria: ["Fetch/async-await to'g'ri ishlatilishi", "Loading va error state", "URL parametrlar", "Kod sifati"],
  },
  {
    id: "t_portfolio", title: "Shaxsiy portfolio sahifasi", skillId: "sk_css", difficulty: "Junior", deadlineDays: 5,
    description: "O'zingiz haqingizda portfolio sahifasi: flexbox/grid, hover effektlar, smooth scroll.",
    criteria: ["Grid/Flexbox mahorati", "Hover/mikro-animatsiyalar", "Tipografiya", "Umumiy taassurot"],
  },
];

const submissions: TaskSubmission[] = [
  {
    id: "sub1", taskId: "t_portfolio", studentId: "u_ali", status: "PASSED", url: "github.com/alikarimov/portfolio", liveUrl: "alikarimov-portfolio.vercel.app",
    text: "Portfolio sahifamni yakunladim. Grid layout, 4 ta hover effekt va dark mode qo'shdim.", date: daysAgo(9),
    feedback: { technical: 86, communication: 90, problemSolving: 82, deadline: 95, teamwork: 88, overall: 88, comment: "Juda yaxshi strukturaviy yondashuv. CSS nomlashda BEM ishlatilgani ko'rinib turibdi. Keyingi safar animatsiyalarni performance uchun optimallashtiring.", authorId: "u_mentor", authorName: "Dilshod Rahimov" },
  },
  {
    id: "sub2", taskId: "t_landing", studentId: "u_ali", status: "UNDER_REVIEW", url: "github.com/alikarimov/bakery-landing", liveUrl: "bakery-landing.vercel.app",
    text: "Pekarnya uchun landing: hero, menyu, narxlar, aloqa. Mobile-first yondashdim, Lighthouse 96 ball.", date: daysAgo(1),
  },
  {
    id: "sub3", taskId: "t_api", studentId: "u_madina", status: "PASSED", url: "github.com/madinayus/api-demo", liveUrl: "api-demo.vercel.app",
    text: "Posts ro'yxati + detal sahifa, loading skeleton va error fallback bilan.", date: daysAgo(16),
    feedback: { technical: 90, communication: 85, problemSolving: 88, deadline: 100, teamwork: 90, overall: 91, comment: "API qatlami toza yozilgan. AbortController ishlatgani plus.", authorId: "u_mentor", authorName: "Dilshod Rahimov" },
  },
];

const projects: Project[] = [
  {
    id: "p_abc_landing", title: "ABC Digital — korporativ landing page", companyId: "u_abc", category: "Frontend",
    skillIds: ["sk_html", "sk_css", "sk_js", "sk_react"], durationDays: 14, payment: 500000, positions: 2,
    difficulty: "Junior", deadline: daysAhead(10), status: "APPLICATIONS_OPEN",
    description: "Kompaniyamiz uchun zamonaviy korporativ landing page kerak: xizmatlar, jamoa, blog preview va kontakt forma. Figma maket taqdim etiladi. Haftalik mentor check-in bo'ladi.",
  },
  {
    id: "p_sarbon_dash", title: "Sarbon Labs — admin dashboard", companyId: "u_sarbon", category: "Frontend",
    skillIds: ["sk_react", "sk_rest"], durationDays: 21, payment: 900000, positions: 1,
    difficulty: "Intermediate", deadline: daysAhead(16), status: "APPLICATIONS_OPEN",
    description: "Ichki CRM uchun admin dashboard: foydalanuvchilar jadvali, statistika kartalari, REST API bilan CRUD. Code review mentor va CTO tomonidan.",
  },
  {
    id: "p_buxoro", title: "Buxoro Travel — sayyohlik sayti", companyId: "u_abc", category: "Frontend",
    skillIds: ["sk_html", "sk_css", "sk_js"], durationDays: 10, payment: 400000, positions: 3,
    difficulty: "Junior", deadline: daysAhead(20), status: "PUBLISHED",
    description: "Sayyohlik agentligi uchun 5 sahifalik sayt: turlar katalogi, galereya, bron forma. SEO asoslari talab qilinadi.",
  },
  {
    id: "p_fintech", title: "FinPay — fintech landing (yakunlangan)", companyId: "u_abc", category: "Frontend",
    skillIds: ["sk_html", "sk_css", "sk_js", "sk_react"], durationDays: 14, payment: 500000, positions: 1,
    difficulty: "Junior", deadline: daysAgo(12), status: "COMPLETED", employerRating: 4.7, mentorRating: 4.8,
    description: "To'lov platformasi uchun landing page. Muvaffaqiyatli yakunlangan, production'ga chiqarilgan.",
  },
  {
    id: "p_draft", title: "ABC Digital — yangi mahsulot promo sahifasi", companyId: "u_abc", category: "Frontend",
    skillIds: ["sk_react", "sk_css"], durationDays: 12, payment: 600000, positions: 1,
    difficulty: "Intermediate", deadline: daysAhead(30), status: "DRAFT",
    description: "Yangi mahsulot chiqishi uchun promo sahifa (draft — admin tasdig'ini kutmoqda).",
  },
];

const applications: Application[] = [
  { id: "ap1", projectId: "p_abc_landing", studentId: "u_ali", status: "SHORTLISTED", progress: 0, date: daysAgo(3), portfolio: "alikarimov.dev", cover: "FinPay landingida React + responsive layout bo'yicha tajriba to'pladim (employer rating 4.7). Figma'dan aniq pixel-ga yaqin o'tkazish men uchun odatiy hol." },
  { id: "ap2", projectId: "p_abc_landing", studentId: "u_madina", status: "IN_PROGRESS", progress: 50, date: daysAgo(15), portfolio: "madina.dev", cover: "React'da 4 ta loyiha qilganman, API integratsiyasi kuchli tomonim." },
  { id: "ap3", projectId: "p_fintech", studentId: "u_ali", status: "COMPLETED", progress: 100, date: daysAgo(40), portfolio: "alikarimov.dev", cover: "Fintech sohasi qiziqtiradi, landing page'lar mening asosiy yo'nalishim." },
  { id: "ap4", projectId: "p_sarbon_dash", studentId: "u_madina", status: "APPLIED", progress: 0, date: daysAgo(2), portfolio: "madina.dev", cover: "Dashboard UI practice task'im 91 ball olgan. CRUD tajribam bor." },
  { id: "ap5", projectId: "p_abc_landing", studentId: "u_bekzod", status: "APPLIED", progress: 0, date: daysAgo(1), portfolio: "", cover: "JavaScript assessment 79 ball, o'rganishga tayyorman." },
];

const interviews: Interview[] = [
  { id: "iv1", studentId: "u_ali", companyId: "u_abc", date: daysAhead(3), time: "15:00", type: "VIDEO", url: "meet.google.com/abc-frontend-ali", notes: "FinPay loyihasi haqida gaplashamiz. Portfolio review bo'ladi.", status: "INVITED" },
  { id: "iv2", studentId: "u_madina", companyId: "u_abc", date: daysAgo(6), time: "11:00", type: "OFFICE", url: "Toshkent, Amir Temur 108A", notes: "Texnik suhbat + jamoa bilan tanishuv.", status: "COMPLETED" },
  { id: "iv3", studentId: "u_bekzod", companyId: "u_sarbon", date: daysAhead(5), time: "17:30", type: "PHONE", url: "+998 90 123 45 67", notes: "Qisqa tanishuv qo'ng'irog'i.", status: "CONFIRMED" },
];

const employerTasks: EmployerTask[] = [
  {
    id: "et1", studentId: "u_madina", companyId: "u_abc", title: "Bug-fix: responsive menyu",
    description: "Staging'dagi landing pageda mobile menyu ikki marta ochilyapti. Sababini toping va PR yuboring.",
    deadline: daysAhead(4), criteria: "Sabab tahlili, minimal diff, test qo'lda tekshirilgan", status: "SUBMITTED",
    submission: "Sababi: useEffect dependency'siz har renderda event listener qo'shilayapti. Cleanup qo'shdim. PR: github.com/abc/landing/pull/41",
    submittedAt: daysAgo(1), liveUrl: "staging.abc.uz", date: daysAgo(4),
  },
  {
    id: "et2", studentId: "u_ali", companyId: "u_abc", title: "Komponent: PricingCard",
    description: "Figma'dagi pricing kartasini React komponenti sifatida qurib bering: 3 prop (title, price, features), hover holati, responsive.",
    deadline: daysAhead(6), criteria: "Props API tozaligi, responsive, Figma'ga moslik", status: "ASSIGNED", date: daysAgo(1),
  },
];

const offers: Offer[] = [
  { id: "of1", studentId: "u_madina", companyId: "u_abc", role: "Junior Frontend Developer", salary: "4 500 000 so'm / oy", message: "Interview va employer task natijangiz jamoani qoyil qoldirdi. 3 oylik sinov muddati bilan ishga taklif qilamiz.", status: "OFFERED", date: daysAgo(1) },
];

const notifs: Notif[] = [
  { id: "n1", userId: "u_ali", kind: "interview", title: "Interview taklifi", body: "ABC Digital sizni 15:00 da video interview'ga taklif qildi.", date: daysAgo(1), read: false },
  { id: "n2", userId: "u_ali", kind: "task", title: "Employer topshirig'i", body: "ABC Digital: \"Komponent: PricingCard\" topshirig'i yuborildi.", date: daysAgo(1), read: false },
  { id: "n3", userId: "u_ali", kind: "shortlist", title: "Shortlist'dasiz!", body: "ABC Digital landing page loyihasi uchun shortlist'ga o'tdingiz.", date: daysAgo(2), read: true },
  { id: "n4", userId: "u_ali", kind: "result", title: "Assessment natijasi", body: "JavaScript Assessment: 82/100 — VERIFIED (Intermediate).", date: daysAgo(14), read: true },
  { id: "n5", userId: "u_abc", kind: "application", title: "Yangi ariza", body: "Madina Yusupova \"Admin dashboard\" loyihasiga ariza berdi.", date: daysAgo(2), read: false },
  { id: "n6", userId: "u_abc", kind: "submission", title: "Employer task topshirildi", body: "Madina Yusupova bug-fix topshirig'ini topshirdi — baholash kerak.", date: daysAgo(1), read: false },
  { id: "n7", userId: "u_mentor", kind: "review", title: "Tekshirish kutilmoqda", body: "Ali Karimov \"Landing page yasash\" topshirig'ini topshirdi.", date: daysAgo(1), read: false },
  { id: "n8", userId: "u_madina", kind: "offer", title: "Ish taklifi!", body: "ABC Digital sizga Junior Frontend Developer pozitsiyasiga offer yubordi.", date: daysAgo(1), read: false },
  { id: "n9", userId: "u_tatu", kind: "system", title: "Pilot davom etmoqda", body: "TATU talabalari 12 ta assessment yakunladi (bu hafta).", date: daysAgo(2), read: false },
  { id: "n10", userId: "u_admin", kind: "system", title: "Tasdiqlash kutmoqda", body: "Sarbon Labs verification va 1 ta draft loyiha tasdig'ingizni kutmoqda.", date: daysAgo(2), read: false },
];

const audit: AuditEntry[] = [
  { id: "au1", actor: "KASBORA Admin", action: "ABC Digital employer sifatida verifikatsiya qilindi", date: daysAgo(45) },
  { id: "au2", actor: "KASBORA Admin", action: "\"ABC Digital — korporativ landing page\" loyihasi tasdiqlandi", date: daysAgo(20) },
  { id: "au3", actor: "Dilshod Rahimov", action: "Ali Karimov portfolio topshirig'iga 88 ball qo'ydi", date: daysAgo(8) },
  { id: "au4", actor: "KASBORA Admin", action: "JavaScript Assessment yaratildi (6 savol)", date: daysAgo(50) },
];

const blindReviews: BlindReview[] = [
  {
    id: "br1", companyId: "u_abc", candidateId: "u_madina", taskTitle: "Bug-fix: responsive menyu",
    code: `// MobileNav.tsx
useEffect(() => {
  const toggle = () => setOpen(o => !o);
  burger.addEventListener("click", toggle);
  return () => burger.removeEventListener("click", toggle);
}, [burger]); // cleanup qo'shildi → dublikat listener yo'q`,
    githubUrl: "github.com/abc/landing/pull/41", liveUrl: "staging.abc.uz", submittedAt: daysAgo(1), status: "PENDING", scores: [],
  },
  {
    id: "br2", companyId: "u_abc", candidateId: "u_bekzod", taskTitle: "Hero animatsiya komponenti",
    code: `// Hero.tsx — scroll-triggered fade
const ref = useRef(null);
useEffect(() => {
  const io = new IntersectionObserver(([e]) =>
    e.isIntersecting && ref.current?.classList.add("in"));
  io.observe(ref.current);
  return () => io.disconnect();
}, []);`,
    githubUrl: "github.com/abc/landing/pull/44", liveUrl: "staging.abc.uz/hero", submittedAt: daysAgo(2), status: "PENDING",
    scores: [{ score: 78, comment: "IntersectionObserver toza ishlatilgan, lekin threshold ko'rsatilmagan.", reviewer: "ABC Digital" }],
  },
];

export const seedDB: DB = {
  users, profiles, skills, studentSkills, assessments, attempts, tasks, submissions,
  projects, applications, interviews, employerTasks, offers, notifs, audit, blindReviews, session: null,
};

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  BEGINNER: "Beginner", JUNIOR: "Junior", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced", EXPERT: "Expert",
};
export const levelFromPct = (pct: number): SkillLevel =>
  pct >= 85 ? "ADVANCED" : pct >= 70 ? "INTERMEDIATE" : pct >= 50 ? "JUNIOR" : "BEGINNER";
export const fmtUZS = (n: number) => n.toLocaleString("ru-RU").replace(/\u00a0/g, " ") + " so'm";
