import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { DICT_RU } from "./dicts-ru";
import { DICT_TR, DICT_KK, DICT_KAA } from "./dicts-trkk";

export type Lang = "uz" | "kaa" | "kk" | "tr" | "en" | "ru";
export type Theme = "light" | "dark";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "uz", label: "O'zbekcha", short: "UZ" },
  { code: "kaa", label: "Qaraqalpaqsha", short: "QQ" },
  { code: "kk", label: "Қазақша", short: "KZ" },
  { code: "tr", label: "Türkçe", short: "TR" },
  { code: "en", label: "English", short: "EN" },
  { code: "ru", label: "Русский", short: "RU" },
];

/* O'zbek qatlami: qisqa kalitlarning o'zbekcha qiymatlari */
const DICT_UZ: Record<string, string> = {
  "Skill Passport": "Malaka pasporti",
  "Verify — Skill Passport": "05 · Verify — Malaka pasporti",
  // hero & audience
  "hero_sub": "KASBORA talabalarni real loyihalar, verified skill'lar va ish beruvchilar bilan bog'lab, universitetdan ishgacha bo'lgan yo'lni qisqartiradi. CV'dagi va'da emas — isbotlangan tajriba.",
  "aud_st_t": "Diplom emas — isbotlangan tajriba",
  "aud_st_d": "Assessment topshiring · loyiha toping · passport quring",
  "aud_st_d2": "Baseline assessment bilan boshlaysiz, mentor tekshirgan tasklar va real kompaniya loyihalari orqali Malaka pasporti qurasiz. Employer sizni CV bo'yicha emas, isbot bo'yicha ko'radi.",
  "aud_em_t": "300 ta CV o'rniga — 12 tasdiqlangan passport",
  "aud_em_d": "Verified talent · real loyihalar · hiring pipeline",
  "aud_em_d2": "Skill bo'yicha filtrlangan kandidatlar, blind review (ism yashirilgan, faqat kod baholanadi), interview va employer task pipeline'ingiz bitta dashboard'da. Time-to-hire qisqaradi.",
  "aud_un_t": "Har bir talaba qayerda — real raqamlarda",
  "aud_un_d": "Talabalar readiness'ini real vaqtda kuzating",
  "aud_un_d2": "Assessment natijalari, loyiha ishtiroki, employment rate — hammasi jonli dashboard'da. CSV import orqali SIS'dan talabalarni bir necha daqiqada qo'shasiz (EduOS integratsiyasi yo'lda).",
  // problem
  "problem_p": "Bitiruvchilar «tajriba yo'q» degani uchun ishga olina olmaydi, ish beruvchilar esa «tajribali candidate yo'q» deb oylab qidiradi. KASBORA aynan shu oraliqni — isbotlangan tajriba yetishmovchiligini yopadi.",
  "s1": "ish beruvchilar bitiruvchilarda amaliy ko'nikma yetishmasligini aytadi",
  "s2": "o'rtacha birinchi ish qidirish muddati (tajribasiz bitiruvchi)",
  "s3": "tezroq interview'gacha — CV saralash o'rniga verified passport",
  "s4": "pilot maqsadi: Verified-to-Hired Rate — shimoliy yulduz metrikasi",
  "pilot_note": "* 2025-yil Toshkent pilot tadqiqoti, n=40 ish beruvchi",
  // steps
  "st1_t": "01 · Learn — O'rganing",
  "st1_d": "Universitetdagi bilim KASBORA'da yo'nalishga aylanadi: Junior Frontend yo'li uchun HTML, CSS, JavaScript, React, Git va REST API.",
  "st2_t": "02 · Prove — Isbotlang",
  "st2_d": "Har bir skill uchun timed assessment: tasodifiy tartibda savollar, tab-switch kuzatuvi, maksimal urinishlar. O'tdingizmi — skill VERIFIED.",
  "st3_t": "03 · Practice — Mashq qiling",
  "st3_d": "Mentor tekshiradigan real topshiriqlar: landing page, dashboard, API integratsiya. Har biriga 0–100 ball va yozma feedback.",
  "st4_t": "04 · Build — Real loyiha",
  "st4_d": "Haqiqiy kompaniyaning haqiqiy topshirig'i: brief, deadline, to'lov, code review. Loyiha yakuni — employer rating bilan.",
  "st5_t": "05 · Verify — Malaka pasporti",
  "st5_d": "Barcha isbotlar bitta hujjatga jam bo'ladi: verified skill'lar, loyihalar, reytinglar va ochiq formula bilan hisoblangan Work Readiness Score.",
  "st6_t": "06 · Get Hired — Ishga joylashing",
  "st6_d": "Employer passport'ni ko'radi → shortlist → blind review → interview → employer task → offer. Rasmiy shartnomani employer davlat tizimida rasmiylashtiradi.",
  // skills & passport
  "skills_p": "Junior Frontend yo'li uchun 6 ta skill. Har biri timed assessment bilan tekshiriladi — o'tdingizmi, badge'ingiz VERIFIED bo'ladi va Malaka passport'ga muhrlanadi. Skill'ni bosing — namuna savolni ko'ring.",
  "passport_p": "Har bir skill uchun kamida bitta isbot manbai: assessment, task, loyiha, mentor yoki employer bahosi. Passport'da hech narsa yashirilmaydi — Work Readiness Score ham ochiq formula bilan hisoblanadi. Talabani tanlang — passport jonli yangilanadi.",
  "qr_d": "Employer kodni skanerlab passport'ni KASBORA bazasidan tekshiradi",
  "ac_d": "Timed rejim, tasodifiy savollar, tab-switch va paste kuzatuvi",
  "mt_d": "Har bir practice natija jonli mentor tomonidan imzolanadi",
  // calculator
  "c_assessment": "Assessment o'rtacha balli", "c_practice": "Practice topshiriqlar balli", "c_project": "Real loyihalar balli",
  "c_mentor": "Mentor feedback balli", "c_employer": "Employer feedback balli",
  "calc_note": "Polzunlarni suring — KASBORA'da score aynan shu shaffof formula bilan hisoblanadi. Hech qanday yashirin algoritm yo'q.",
  "calc_bands": "0–49 Boshlang'ich · 50–69 Rivojlanmoqda · 70–84 Ishga tayyor · 85–100 Yuqori tayyor",
  // testimonials
  "t1": "CV yuborishdan to'xtadim. Assessment topshirdim, bitta real loyiha qildim — passport'imni ko'rgan employer o'zi yozdi. Hozir ABC Digital'da ishlayman.",
  "t2": "Avval Telegram'da 300 ta CV saralardim. Endi blind review'da faqat kodni baholaymiz — ism ham ko'rinmaydi. Time-to-hire 3 haftadan 6 kunga tushdi.",
  "t3": "KASBORA mentorlikni o'lchanadigan qildi: har submission'ga 5 mezon bo'yicha ball beraman, student o'sishini real raqamlarda ko'radi.",
  // ecosystem teaser
  "e1_t": "Telegram Mini App", "e1_d": "Progress, assessment va loyihalar — Telegram ichida, bir bosishda. Mobil ilova yo'lda.",
  "e2_t": "Open API", "e2_d": "Passport verifikatsiya, kandidat qidiruv va readiness endpoint'lari — HRIS va EduOS uchun.",
  "e3_t": "To'lov integratsiyalari", "e3_d": "Click va Payme orqali loyiha to'lovlari va employer tariflari. Davlat tizimlari o'rganilmoqda.",
  // FAQ
  "f1q": "KASBORA oddiy ish topish saytidan nimasi bilan farq qiladi?",
  "f1a": "Ish topish saytlari faqat vakansiya e'lon qiladi. KASBORA esa talabani ishga tayyorlaydi: skill'lar assessment orqali tasdiqlanadi, real kompaniya loyihalarida tajriba to'planadi va barchasi Malaka passport'da isboti bilan ko'rsatiladi. Employer CV emas, isbot ko'radi.",
  "f2q": "Skill qanday tasdiqlanadi (VERIFIED)?",
  "f2a": "Olti manba bor: o'zi bildirgan (SELF_DECLARED), assessment, practice task, real loyiha, mentor va employer bahosi. Faqat kamida bitta isbot manbai bo'lgan skill VERIFIED belgisini oladi. «Siz skillga egasiz» emas — «siz skillga egasiz, mana isboti».",
  "f3q": "Malaka passport soxtalashtirilishidan qanday himoyalangan?",
  "f3a": "Har bir passport unikal QR kodga ega — employer kodni skanerlab, ma'lumotlarni to'g'ridan-to'g'ri KASBORA bazasidan tekshiradi. Assessmentlar timed rejimda, tasodifiy tartibdagi savollar va tab-switch kuzatuvi bilan o'tadi; natijalar mentor va employer baholari bilan mustahkamlanadi.",
  "f4q": "Work Readiness Score qanday hisoblanadi?",
  "f4a": "To'liq shaffof: Assessment 30% + Practice topshiriqlar 20% + Real loyihalar 30% + Mentor feedback 10% + Employer feedback 10%. Hech qanday black-box AI yo'q — har bir qismni profilingizda ko'rasiz.",
  "f5q": "Blind review nima va nima uchun kerak?",
  "f5a": "Employer topshiriq natijalarini kandidatning ismi, universiteti yoki rasmini ko'rmasdan baholaydi — faqat kod va natija. Bu xolis tanlovni ta'minlaydi: imkoniyat ismga emas, isbotga beriladi.",
  "f6q": "Talabalar uchun bepulmi?",
  "f6a": "MVP davrida talabalar uchun to'liq bepul. Ish beruvchilar loyiha joylash va talentga kirish uchun to'laydi; universitetlar student-head SaaS tarifida ishlaydi. To'lovlar Click va Payme orqali qabul qilinadi.",
  // CTA & footer
  "cta_h": "Karyerangizni bugun isbot bilan boshlang.",
  "cta_p": "Birinchi assessment 10 daqiqa. Birinchi verified skill — bugun. Birinchi real loyiha — shu haftada.",
  "footer_about": "Universitetdagi bilimni real tajribaga, tasdiqlangan skillga va rasmiy ishga aylantiradigan platforma.",
  "footer_rights": "© 2025 KASBORA · O'zbekiston uchun qurilmoqda",
  "footer_mvp": "MVP: 1 kasb · 1 universitet · 10 kompaniya",
  // ticker
  "tk1": "Ali Karimov JavaScript skill'ni tasdiqladi — 82/100",
  "tk2": "ABC Digital yangi real loyiha e'lon qildi: korporativ landing page",
  "tk3": "Madina Yusupova employer task'dan o'tdi — 91/100",
  "tk4": "TATU: bu hafta 12 ta assessment yakunlandi",
  "tk5": "Blind review: 2 ta anonim submission baholandi",
  "tk6": "Ali Karimov interview'ga taklif qilindi",
  "tk7": "Yangi mentor: Dilshod Rahimov (Senior Frontend)",
  // auth
  "demo_h": "Demo hisoblar — bir bosishda kiring",
  "demo_pass": "Barcha demo hisoblar uchun parol:",
  "err_fields": "Ism, familiya, email va kamida 6 belgili parol kiriting.",
  "err_email": "Bu email allaqachon ro'yxatdan o'tgan.",
  "err_creds": "Email yoki parol noto'g'ri.",
  "err_org": "Kompaniya yoki universitet nomini kiriting.",
  "reg_ok": "Akkaunt yaratildi! Birinchi assessment'ga tayyormisiz?",
  "reg_employer_ok": "Employer akkaunti yaratildi. Verifikatsiya admin tomonidan tasdiqlanadi.",
  "reg_uni_ok": "Universitet akkaunti yaratildi.",
  "auth_side_h": "Diplom yetarli emas — tajribani isbotlang.",
  "auth_side_p": "Assessment → practice task → real loyiha → Malaka passport → employer. Har bir bosqich profilingizda isboti bilan qoladi.",
  // passport page
  "pp_rep": "O'ZBEKISTON RESPUBLIKASI", "pp_pub": "Ommaviy malaka pasporti",
  "pp_gen": "Bu passport KASBORA platformasining jonli yozuvlari asosida shakllantirildi.",
  "pp_404": "Bu username uchun passport mavjud emas.", "self-declared": "o'zi bildirgan",
  // student panel
  "cj_t": "Candidate Journey — sizning yo'lingiz", "tasdiqlangan": "tasdiqlangan",
  "dash_empty_b": "Birinchi assessment'ni topshiring — skill darhol VERIFIED bo'ladi.",
  "quick1_d": "Timed · shuffle · anti-cheat", "quick3_d": "QR + PDF eksport",
  "ac_note": "Anti-cheat: timer · tasodifiy savollar · tab-switch kuzatuvi · paste log · maks.",
  "urinish. O'tish balli — 70.": "urinish. O'tish balli — 70.",
  "skill_verified_note": "skill passport'ingizga VERIFIED bo'lib muhrlanadi.",
  "tab_warn": "marta boshqa oynaga o'tdingiz — qoidalar jurnaliga yozildi.",
  "izoh_hint": "Nima qildingiz, yondashuvingiz qanday bo'ldi?",
  "live_hint": "Vercel/Netlify deploy linki — employer ko'radi",
  "cover_hint": "Nega aynan siz? Passport'dagi isbotlarga tayaning.",
  "err_cover": "Cover message kamida 20 belgi bo'lishi kerak",
  "appl_empty_b": "Ochiq loyihalarga ariza bering — status shu yerda ko'rinadi.",
  "ws_note": "brief, tasklar va mentor check-in'lari — employer workspace yaratdi.",
  "int_empty_b": "Employer interview'ga taklif qilganda shu yerda ko'rasiz.",
  "off_empty_t": "Employer jarayoni hali boshlanmagan",
  "off_empty_b": "Interview'dan keyin employer task va offer shu yerda paydo bo'ladi.",
  "legal_employer": "Mehnat shartnomasini elektron davlat tizimida rasmiylashtiring — platforma faqat statusni kuzatadi.",
  // employer panel
  "ver_note": "KASBORA admin akkauntni tasdiqlagach loyihalaringiz e'lon qilinadi.",
  // mentor
  "mentor_d": "5 mezon bo'yicha baho + yozma feedback — natija talaba passport'iga tushadi.",
  "mentor_empty_b": "Talabalar topshiriq yuborishi bilan shu yerda paydo bo'ladi.",
  "fb_placeholder": "Kuchli tomonlari va o'sish nuqtalari...",
  "fb_ok": "Feedback yuborildi — passport'ga tushdi",
  "fb_empty_b": "Navbatdagi topshiriqlarni tekshiring — natijalar shu yerda qoladi.",
  // university & admin
  "north_star_d": "Verified experience olgan talabalarning nechtasi ishga kirdi — startupning haqiqiy qiymati shu metrikada.",
  "edu_note": "EduOS/SIS API integratsiyasi yo'lda — hozircha CSV.",
  "import_ok": "2 ta student account yaratildi",
  "uni_t": "TATU — Universitet paneli", "uni_d": "Talabalar readiness'ini real vaqtda kuzating.",
  "admin_no_projects": "Kutilayotgan loyihalar yo'q.",
  // ecosystem page
  "eco_h": "Platforma — veb-saytdan kattaroq",
  "eco_p": "Telegram Mini App, Open API va to'lov/ta'lim integratsiyalari KASBORAni yagona talent infratuzilmasiga aylantiradi. Pilotda ishlaydigan qismlar jonli, qolganlari roadmap'da.",
  "eco_tg_h": "Telegram Mini App — progress cho'ntagingizda",
  "eco_tg_p": "O'zbekistonda Telegram — asosiy kanal. Talaba assessment natijasini, interview taklifini va loyiha yangiliklarini bot orqali oladi; Mini App ichida esa readiness, tasklar va passport — hammasi bir joyda.",
  "tg1_t": "Bildirishnomalar real vaqtda", "tg1_d": "interview, natija, feedback — bosish o'rniga push",
  "tg2_t": "Assessment Telegram'da", "tg2_d": "MCQ savollar bot ichida, timer bilan",
  "tg3_t": "iOS/Android ilova yo'lda", "tg3_d": "PWA allaqachon ishlaydi, native — Phase 2",
  "eco_bot": "pilot uchun ochiq · /start bilan boshlanadi",
  "i_click": "Loyiha to'lovlari va employer tariflari — pilotda ulangan",
  "i_tg": "Bildirishnoma, assessment va Mini App kanali",
  "i_eduos": "Universitet LMS bilan student sinxronizatsiya (CSV hozircha)",
  "i_hris": "1C:ZUP va boshqa HR dasturlarga hired kandidatlar eksporti",
  "i_gov": "Elektron mehnat shartnomasi — huquqiy ekspertiza bosqichida",
  "i_api": "Passport, kandidat va readiness endpoint'lari",
  "i_mail": "Assessment, offer va feedback xabarlari",
  "i_push": "Mobil ilova bilan birga, Phase 2",
  "rm_d": "Nima qachon keladi",
  "rm1_1": "Auth + 5 rol paneli", "rm1_2": "Assessment engine (anti-cheat)", "rm1_3": "Real loyihalar + Blind Review",
  "rm1_4": "Skill Passport + QR", "rm1_5": "Telegram bot (pilot)",
  "rm2_1": "Native mobil ilova", "rm2_2": "EduOS/SIS API integratsiya", "rm2_3": "AI feedback generator",
  "rm2_4": "Click/Payme to'liq oqim", "rm2_5": "Yangi kasblar (QA, Design)",
  "rm3_1": "Universitet SaaS", "rm3_2": "Digital credentials", "rm3_3": "my.gov.uz tadqiqoti",
  "rm3_4": "API marketplace", "rm3_5": "Mintaqaviy kengayish",
  "demo_login_d": "Demo hisoblar orqali 5 rolning hammasini sinab ko'ring — parol:",
  "wr_phone": "Ishga tayyor · +6 bu hafta",
  "skill_empty": "Hozircha skill'lar yo'q — birinchi assessment bilan boshlang.",
  "int_d": "Bozorga chuqur bog'lanish",
  "rm1_p": "PHASE 1 · Hozir", "rm1_t": "MVP — isbotlash",
  "rm2_p": "PHASE 2 · 3–6 oy", "rm2_t": "Kengaytirish",
  "rm3_p": "PHASE 3 · 6–12 oy", "rm3_t": "Infratuzilma",
};

const DICT_EN: Record<string, string> = {
  "Kirish": "Log in", "Boshlash →": "Get started →", "Ro'yxatdan o'tish": "Sign up", "Jarayon": "Process",
  "Skill Passport": "Skill Passport", "Ekotizim": "Ecosystem", "FAQ": "FAQ", "Til": "Language",
  "Yorug' rejim": "Light mode", "Tun rejimi": "Dark mode", "Bildirishnomalar": "Notifications",
  "Hozircha bildirishnoma yo'q": "No notifications yet", "Hammasini o'qildi deb belgilash": "Mark all as read",
  "Chiqish": "Log out", "Menyu": "Menu", "Passport": "Passport", "Yopish": "Close", "Bekor qilish": "Cancel",
  "Saqlash": "Save", "Tahrirlash": "Edit", "Tasdiqlash": "Approve", "Rad etish": "Decline", "Barchasi": "All",
  "Shahar": "City", "Tozalash": "Clear", "Izoh": "Comment", "Sana": "Date", "Vaqt": "Time", "Turi": "Type",
  "Kandidat": "Candidate", "Tanlang...": "Select...", "Yuborish": "Send", "Baholash": "Grade", "Jami": "Total",
  "Video": "Video", "Ofisda": "At office", "Telefon": "Phone", "kun": "days", "ariza": "applications",
  "navbatda": "in queue", "baho": "ratings", "readiness": "readiness", "savol": "questions", "daqiqa": "min",
  "o'rin": "positions", "Namuna savol": "Sample question", "tez kunda": "coming soon",
  "Yuqori tayyor": "Highly ready", "Ishga tayyor": "Job ready", "Rivojlanmoqda": "Developing", "Boshlang'ich": "Beginner",
  "Talaba paneli": "Student panel", "Employer paneli": "Employer panel", "Mentor paneli": "Mentor panel",
  "Universitet paneli": "University panel", "Admin panel": "Admin panel",
  "Dashboard": "Dashboard", "Assessmentlar": "Assessments", "Practice tasks": "Practice tasks", "Loyihalar": "Projects",
  "Arizalarim": "My applications", "Interviewlar": "Interviews", "Offerlar": "Offers", "AI Dashboard": "AI Dashboard",
  "Kandidatlar": "Candidates", "Blind Review": "Blind Review", "Tasklar": "Tasks",
  "Tekshirish navbati": "Review queue", "Feedbacklar": "Feedback", "Talabalar": "Students", "Analytics": "Analytics",
  "Foydalanuvchilar": "Users", "Skill katalogi": "Skill catalog", "Audit log": "Audit log",
  "PILOT · TATU × 10 KOMPANIYA": "PILOT · TATU × 10 COMPANIES", "1 kasb: Junior Frontend Developer": "1 profession: Junior Frontend Developer",
  "Diplom yetarli emas.": "A diploma is not enough.", "Tajribani isbotlang.": "Prove your experience.",
  "hero_sub": "KASBORA connects students with real projects, verified skills and employers — shortening the path from university to work. Not promises on a CV — proven experience.",
  "Talaba sifatida boshlash": "Start as a student", "aud_st_d": "Take assessments · find a project · build your passport",
  "Ish beruvchi sifatida qo'shilish": "Join as an employer", "aud_em_d": "Verified talent · real projects · hiring pipeline",
  "Universitet sifatida hamkorlik": "Partner as a university", "aud_un_d": "Track student readiness in real time",
  "1 universitet · pilot": "1 university · pilot", "10 kompaniya · real loyihalar": "10 companies · real projects", "100+ talaba · birinchi oqim": "100+ students · first cohort",
  "Talaba yo'li — jonli simulyatsiya": "Student journey — live simulation",
  "O'rganish": "Learn", "Isbotlash": "Prove", "Amaliyot": "Practice", "Real loyiha": "Real project", "Pasport": "Passport",
  "Ish beruvchi": "Employer", "Suhbat": "Interview", "Task": "Task", "Ishga joylashish": "Hiring",
  "OFFER QABUL QILINDI → HIRED": "OFFER ACCEPTED → HIRED",
  "Pilotda ishtirok etayotganlar": "Pilot participants", "10 kompaniya · 1 universitet": "10 companies · 1 university",
  "Muammo": "The problem", "Nazariya bor. Isbot yo'q.": "The theory is there. The proof is not.",
  "problem_p": "Graduates can't get hired because they “lack experience”, while employers search for months because there are “no experienced candidates”. KASBORA closes exactly this gap — the lack of proven experience.",
  "s1": "of employers say graduates lack practical skills", "s2": "average first job search time (inexperienced graduate)",
  "s3": "faster to interview — verified passports instead of CV screening", "s4": "pilot target: Verified-to-Hired Rate — the north-star metric",
  "pilot_note": "* 2025 Tashkent pilot study, n=40 employers",
  "KASBORA jarayoni": "The KASBORA process", "Bilimdan ishga — olti bosqich": "From knowledge to work — six steps",
  "st1_t": "01 · Learn", "st1_d": "University knowledge becomes a track in KASBORA: HTML, CSS, JavaScript, React, Git and REST API for the Junior Frontend path.",
  "st2_t": "02 · Prove", "st2_d": "A timed assessment for every skill: shuffled questions, tab-switch tracking, limited attempts. Pass it — the skill is VERIFIED.",
  "st3_t": "03 · Practice", "st3_d": "Real assignments reviewed by a mentor: landing page, dashboard, API integration. Each gets a 0–100 score and written feedback.",
  "st4_t": "04 · Build", "st4_d": "A real task from a real company: brief, deadline, payment, code review. Finished project — with an employer rating.",
  "st5_t": "05 · Verify — Skill Passport", "st5_d": "All proofs gathered in one document: verified skills, projects, ratings and a Work Readiness Score computed by an open formula.",
  "st6_t": "06 · Get Hired", "st6_d": "Employer sees the passport → shortlist → blind review → interview → employer task → offer. The official contract is formalized by the employer in the state system.",
  "Nazariya": "Theory", "Assessment": "Assessment", "Mentor": "Mentor", "Kompaniya": "Company", "Offer": "Offer",
  "Pilotdagi skill'lar": "Skills in the pilot", "Har badge ortida — real isbot": "Behind every badge — real proof",
  "skills_p": "6 skills for the Junior Frontend path. Each is tested by a timed assessment — pass it and your badge becomes VERIFIED and is stamped into your passport. Click a skill to see a sample question.",
  "verified": "verified",
  "Eng muhim hujjat": "The most important document", "Skill Passport — sizning isbotingiz": "Skill Passport — your proof",
  "passport_p": "At least one proof source for every skill: assessment, task, project, mentor or employer rating. Nothing is hidden in the passport — the Work Readiness Score is computed by an open formula. Pick a student — the passport updates live.",
  "Jonli passport'ni ochish →": "Open the live passport →", "O'zingiznikini quring": "Build your own",
  "QR-verifikatsiya": "QR verification", "qr_d": "The employer scans the code and verifies the passport against the KASBORA database",
  "Anti-cheat monitoring": "Anti-cheat monitoring", "ac_d": "Timed mode, shuffled questions, tab-switch and paste tracking",
  "Mentor tasdig'i": "Mentor sign-off", "mt_d": "Every practice result is signed off by a live mentor",
  "Interaktiv kalkulyator": "Interactive calculator", "Yangi talaba": "New student", "O'rtacha bitiruvchi": "Average graduate", "KASBORA bitiruvchisi": "KASBORA graduate",
  "c_assessment": "Average assessment score", "c_practice": "Practice task score", "c_project": "Real project score", "c_mentor": "Mentor feedback score", "c_employer": "Employer feedback score",
  "calc_note": "Drag the sliders — KASBORA computes the score with exactly this transparent formula. No hidden algorithm.",
  "calc_bands": "0–49 Beginner · 50–69 Developing · 70–84 Job ready · 85–100 Highly ready",
  "Haqiqiy ovozlar": "Real voices", "Pilot ishtirokchilari nima deydi": "What pilot participants say",
  "t1": "I stopped sending CVs. I passed assessments, completed one real project — and an employer who saw my passport wrote to me first. I now work at ABC Digital.",
  "t2": "I used to sort 300 CVs in Telegram. Now we grade only code in blind review — no names visible. Time-to-hire dropped from 3 weeks to 6 days.",
  "t3": "KASBORA made mentoring measurable: I score every submission on 5 criteria, and students see their growth in real numbers.",
  "EKOTIZIM": "ECOSYSTEM", "Platforma — veb-saytdan kattaroq": "The platform is bigger than a website", "Ekotizimni ko'rish →": "See the ecosystem →",
  "e1_t": "Telegram Mini App", "e1_d": "Progress, assessments and projects — inside Telegram, one tap away. Mobile app on the way.",
  "e2_t": "Open API", "e2_d": "Passport verification, candidate search and readiness endpoints — for HRIS and EduOS.",
  "e3_t": "Payment integrations", "e3_d": "Project payments and employer tariffs via Click and Payme. State systems under research.",
  "Savol-javob": "Q&A", "Ko'p beriladigan savollar": "Frequently asked questions",
  "f1q": "How is KASBORA different from a job board?", "f1a": "Job boards only publish vacancies. KASBORA prepares students for work: skills are verified by assessments, experience is built in real company projects, and everything is shown in a Skill Passport with proof. Employers see proof, not a CV.",
  "f2q": "How is a skill verified (VERIFIED)?", "f2a": "Six sources: self-declared, assessment, practice task, real project, mentor and employer rating. Only a skill with at least one proof source gets the VERIFIED mark. Not “you have a skill” — “you have a skill, here's the proof”.",
  "f3q": "How is the Skill Passport protected from forgery?", "f3a": "Every passport has a unique QR code — the employer scans it and checks the data directly in the KASBORA database. Assessments run in timed mode with shuffled questions and tab-switch tracking; results are reinforced by mentor and employer ratings.",
  "f4q": "How is the Work Readiness Score calculated?", "f4a": "Fully transparent: Assessment 30% + Practice tasks 20% + Real projects 30% + Mentor feedback 10% + Employer feedback 10%. No black-box AI — you see every part in your profile.",
  "f5q": "What is blind review and why is it needed?", "f5a": "The employer grades a submission without seeing the candidate's name, university or photo — only code and result. This guarantees fair selection: opportunity goes to proof, not to a name.",
  "f6q": "Is it free for students?", "f6a": "Completely free for students during the MVP. Employers pay for project placement and talent access; universities pay a per-student SaaS tariff. Payments via Click and Payme.",
  "PILOT OCHIQ · TATU TALABALARI UCHUN": "PILOT OPEN · FOR TATU STUDENTS",
  "cta_h": "Start your career today with proof.", "cta_p": "The first assessment takes 10 minutes. The first verified skill — today. The first real project — this week.",
  "Start Your Career →": "Start Your Career →", "Demo hisoblarni sinash": "Try the demo accounts",
  "Platforma": "Platform", "Ishtirokchilar": "Participants", "Huquqiy": "Legal", "Ish beruvchilar": "Employers",
  "Universitetlar": "Universities", "Mentorlar": "Mentors", "Demo kirish": "Demo login", "Maxfiylik siyosati": "Privacy policy",
  "Shartlar": "Terms", "Shaxsiy ma'lumotlar": "Personal data",
  "footer_about": "A platform that turns university knowledge into real experience, verified skills and a formal job.",
  "footer_rights": "© 2025 KASBORA · Built for Uzbekistan", "footer_mvp": "MVP: 1 profession · 1 university · 10 companies",
  "Tajribani isbotlang": "Prove your experience", "bepul · 10 daqiqada boshlanadi": "free · starts in 10 minutes",
  "Talabaman": "I'm a student", "Ish beruvchiman": "I'm an employer", "Universitetman": "I'm a university",
  "aud_st_t": "Not a diploma — proven experience", "aud_st_d2": "You start with a baseline assessment, build a Skill Passport through mentor-reviewed tasks and real company projects. Employers see you by proof, not by CV.",
  "aud_em_t": "Instead of 300 CVs — 12 verified passports", "aud_em_d2": "Candidates filtered by skill, blind review (names hidden, only code graded), interview and employer task pipeline in one dashboard. Time-to-hire drops.",
  "aud_un_t": "Every student's level — in real numbers", "aud_un_d2": "Assessment results, project participation, employment rate — all in a live dashboard. Add students from your SIS in minutes via CSV import (EduOS integration on the way).",
  "Kandidatlar bazasini ko'rish →": "See the candidate base →", "Track Student Readiness →": "Track Student Readiness →",
  "tk1": "Ali Karimov verified his JavaScript skill — 82/100", "tk2": "ABC Digital published a new real project: corporate landing page",
  "tk3": "Madina Yusupova passed the employer task — 91/100", "tk4": "TATU: 12 assessments completed this week",
  "tk5": "Blind review: 2 anonymous submissions graded", "tk6": "Ali Karimov was invited to an interview", "tk7": "New mentor: Dilshod Rahimov (Senior Frontend)",
  "Xush kelibsiz": "Welcome back", "Akkaunt yaratish": "Create account", "demo_h": "Demo accounts — log in with one click",
  "demo_pass": "Password for all demo accounts:", "Email": "Email", "Parol": "Password", "Ism": "First name", "Familiya": "Last name",
  "Universitet": "University", "Fakultet": "Faculty", "Yo'nalish": "Specialization", "Bitiruv yili": "Graduation year",
  "Kompaniya nomi": "Company name", "Talaba": "Student", "Akkauntingiz yo'qmi?": "No account?", "Allaqachon akkauntingiz bormi?": "Already have an account?",
  "err_fields": "Enter first name, last name, email and a password of at least 6 characters.", "err_email": "This email is already registered.",
  "err_creds": "Email or password is incorrect.", "reg_ok": "Account created! Ready for your first assessment?",
  "reg_employer_ok": "Employer account created. Verification is approved by an admin.", "reg_uni_ok": "University account created.",
  "auth_side_h": "A diploma is not enough — prove your experience.", "auth_side_p": "Assessment → practice task → real project → Skill Passport → employer. Every stage stays on your profile, with proof.",
  "err_org": "Enter the company or university name.",
  "pp_rep": "REPUBLIC OF UZBEKISTAN", "pp_pub": "Public skill passport", "PDF eksport": "PDF export", "Link nusxalandi": "Link copied",
  "Tasdiqlangan skill'lar": "Verified skills", "Real loyihalar": "Real projects", "employer ★": "employer ★",
  "real loyiha": "real projects", "Mentor reytingi": "Mentor rating", "pp_gen": "This passport was generated from live records of the KASBORA platform.",
  "Topilmadi": "Not found", "pp_404": "No passport exists for this username.", "self-declared": "self-declared",
  "cj_t": "Candidate Journey — your path", "Baseline": "Baseline", "Birinchi assessment": "First assessment", "Verified skills": "Verified skills",
  "tasdiqlangan": "verified", "Hiring tracks": "Hiring tracks", "topshiriq o'tdi": "tasks passed", "Readiness": "Readiness", "Interview": "Interview",
  "Jarayonda": "In progress", "Kutilmoqda": "Pending", "Hired": "Hired", "Tabriklaymiz! 🎉": "Congratulations! 🎉", "Maqsad": "Goal",
  "Work Readiness Score": "Work Readiness Score", "Ochiq formula: 30/20/30/10/10": "Open formula: 30/20/30/10/10", "Batafsil →": "Details →",
  "Verified skill'larim": "My verified skills", "Hali verified skill yo'q": "No verified skills yet",
  "dash_empty_b": "Take your first assessment — the skill becomes VERIFIED instantly.", "Assessment topshirish": "Take an assessment",
  "So'nggi bildirishnomalar": "Recent notifications", "quick1_d": "Timed · shuffled · anti-cheat", "Loyiha topish": "Find a project",
  "ta ochiq loyiha": "open projects", "Passport qurish": "Build passport", "quick3_d": "QR + PDF export",
  "ac_note": "Anti-cheat: timer · shuffled questions · tab-switch tracking · paste log · max", "urinish. O'tish balli — 70.": "attempts. Passing score — 70.",
  "O'tish balli": "Passing score", "skill_verified_note": "skill is stamped VERIFIED into your passport.", "Urinishlar": "Attempts", "eng yaxshi": "best",
  "Urinishlar tugadi": "Attempts exhausted", "Qayta topshirish": "Retake", "Yana urinish": "Try again",
  "Savol": "Question", "Oldingi": "Back", "Keyingi": "Next", "Yakunlash ✓": "Finish ✓", "Assessment yakunlandi": "Assessment completed",
  "Tabriklaymiz — o'tdingiz!": "Congratulations — you passed!", "Bu safar o'ta olmadingiz": "You didn't pass this time",
  "skill VERIFIED bo'ldi": "skill became VERIFIED", "Qayta tayyorlanib, yana urinib ko'ring": "Prepare and try again",
  "tab_warn": "times you switched to another window — recorded in the rule log.", "Dashboard'ga qaytish": "Back to dashboard",
  "Vaqt tugadi — javoblar yuborildi": "Time's up — answers submitted",
  "hiring track": "hiring track", "Submission yuborish →": "Send submission →", "izoh_hint": "What did you do, what was your approach?",
  "Live preview URL": "Live preview URL", "live_hint": "Vercel/Netlify deploy link — the employer will see it",
  "Topshiriq yuborildi — mentor tekshiradi": "Submitted — the mentor will review", "Kamida 10 belgi izoh yozing": "Write at least 10 characters",
  "Topshirildi": "Submitted", "mentor tekshiruvida": "under mentor review", "deadline": "deadline",
  "Apply →": "Apply →", "Ariza berilgan ✓": "Applied ✓", "Cover message *": "Cover message *", "cover_hint": "Why you? Rely on the proof in your passport.",
  "Ariza yuborish ✓": "Send application ✓", "Ariza yuborildi! Employer ko'rib chiqadi": "Application sent! The employer will review it",
  "err_cover": "The cover message must be at least 20 characters", "Ochiq loyihalar yo'q": "No open projects",
  "Arizalar yo'q": "No applications", "appl_empty_b": "Apply to open projects — the status shows here.", "Loyihalarni ko'rish": "View projects",
  "Loyiha progressi": "Project progress", "Workspace": "Workspace", "ws_note": "brief, tasks and mentor check-ins — the employer created a workspace.",
  "Interview yo'q": "No interviews", "int_empty_b": "You'll see it here when an employer invites you to an interview.",
  "Qabul qilish ✓": "Accept ✓", "Interview tasdiqlandi": "Interview confirmed", "Rad etildi": "Declined",
  "Employer topshiriqlari": "Employer tasks", "Ish takliflari": "Job offers", "off_empty_t": "The employer process hasn't started yet",
  "off_empty_b": "After the interview, the employer task and offer appear here.", "Offerni qabul qilish 🎉": "Accept offer 🎉",
  "hired_toast": "Congratulations — you've been hired! 🎉", "legal_note": "Official process: the employer formalizes the employment contract in the electronic state system. KASBORA only tracks the status.",
  "Yechim tavsifi / PR linki": "Solution description / PR link", "Kamida 10 belgi yozing": "Write at least 10 characters",
  "Employer task yuborildi": "Employer task submitted", "Kandidat topshirig'ini kutmoqda...": "Waiting for the candidate's submission...",
  "Baholash mezonlari": "Evaluation criteria",
  "Score qanday hisoblandi — shaffof formula": "How the score was calculated — transparent formula",
  "Practice topshiriqlar": "Practice tasks", "Mentor feedback": "Mentor feedback", "Employer feedback": "Employer feedback",
  "Ommaviy passport": "Public passport", "Ko'rinishni o'zgartirish": "Change visibility", "Skill'larim": "My skills",
  "Passport'ni ochish →": "Open passport →", "skill_empty": "No skills yet — take an assessment.", "Ko'rinish": "Visibility",
  "Employer AI Dashboard": "Employer AI Dashboard", "ai_d": "Funnel, time and cost — live calculation. Not 300 CVs in Telegram, only proven passports.",
  "Kandidatlar bazasi": "Candidate base", "Time-to-hire": "Time-to-hire", "6 kun": "6 days", "cv_note": "was 21 days with CV screening",
  "Tejalgan xarajat": "Cost saved", "1.8 mln": "1.8 m", "fee_note": "UZS — without agency fees", "Verified kandidat": "Verified candidates",
  "passport_filter": "filtered by passport", "Hired (pilot)": "Hired (pilot)", "contract_soon": "official contract on the way",
  "Hiring voronkasi — Applied → Hired": "Hiring funnel — Applied → Hired", "Tezkor amallar": "Quick actions",
  "Yangi loyiha yaratish": "Create a new project", "brief_skills": "brief + skill requirements", "Blind review navbati": "Blind review queue",
  "ta anonim submission": "anonymous submissions", "Interview belgilash": "Schedule interview", "kandidat_tanlang": "select a candidate",
  "Offer yuborish": "Send offer", "task_passed": "to candidates who passed a task",
  "Loyihalaringiz": "Your projects", "Loyiha yaratish": "Create project", "Loyihalar yo'q": "No projects",
  "pr_empty_b": "Create your first real project — students will apply.", "Admin tasdig'ida": "Awaiting admin approval",
  "Loyiha yopildi": "Project closed", "Yangi loyiha": "New project", "Sarlavha": "Title", "Tavsif": "Description",
  "Kerakli skill'lar": "Required skills", "Daraja": "Level", "Davomiylik (kun)": "Duration (days)", "To'lov (so'm)": "Payment (UZS)",
  "O'rinlar soni": "Number of positions", "Yaratish (admin tasdig'iga yuboriladi)": "Create (sent for admin approval)",
  "err_project": "Pick a title (5+ characters) and at least 1 skill", "created_ok": "Project created — it will be published after admin approval",
  "Skill (verified)": "Skill (verified)", "Min readiness": "Min readiness", "ta kandidat topildi": "candidates found",
  "verified_only": "by verified skills only", "Passport'ni ko'rish": "View passport",
  "empty_cand_t": "No candidates match the filters", "empty_cand_b": "Loosen the filters or lower the minimum readiness.",
  "Blind Review Panel": "Blind Review Panel", "blind_d": "Fair selection: name, university and photo hidden. Only code and result are graded.",
  "Anonim submission": "Anonymous submission", "shaxs yashirilgan": "identity hidden", "O'rtacha": "Average", "Shaxs ochildi": "Identity revealed",
  "anonim": "anonymous", "Bahoingiz": "Your rating", "Bahoni yozish": "Save rating", "Shaxsni ochish": "Reveal identity",
  "blind_tip": "Tip: reveal only after at least 2 ratings — that's what fairness is.",
  "reveal_t": "Ratings must be saved before revealing the identity — that's the fairness guarantee.",
  "Hozir yozilgan baholar": "Ratings saved so far", "Baribir ochish": "Reveal anyway", "shaxs_ochildi_d": "Identity revealed — go to the passport",
  "empty_blind_t": "No submissions", "empty_blind_b": "When candidates submit an employer task, they appear here anonymously.",
  "Kamida 5 belgili izoh yozing": "Write at least 5 characters", "Baho yozildi — shaxs hali yashirin": "Rating saved — identity still hidden",
  "Interview'ga taklif": "Invite to interview", "Invite to Interview": "Invite to interview", "Interviewlar yo'q": "No interviews",
  "int_empty_e": "Invite candidates to an interview — a Meet/Zoom link is enough.", "Interview taklifi": "Interview invitation",
  "Taklif yuborish": "Send invitation", "Interview taklifi yuborildi": "Interview invitation sent", "Yakunlandi": "Completed",
  "Interview yakunlandi": "Interview completed", "Kandidatni tanlang": "Select a candidate",
  "Create Employer Task": "Create employer task", "Topshiriqlar yo'q": "No tasks",
  "et_empty_b": "After the interview, give candidates a small real task — grade the result here.",
  "Yangi employer task": "New employer task", "Kandidat va sarlavha kiriting": "Enter a candidate and a title",
  "Submission baholash": "Grade submission", "Feedback yozing": "Write feedback", "Baho yuborildi": "Rating sent", "Submission": "Submission",
  "Offerlar yo'q": "No offers", "of_empty_b": "Send an offer to candidates who passed a task or interview.", "Pozitsiya": "Position",
  "Oylik": "Salary", "Xabar": "Message", "Interview/task o'tganlar ro'yxati": "List of those who passed interview/task",
  "Avval interview yoki task o'tkazing": "Run an interview or task first", "Offer yuborildi!": "Offer sent!",
  "legal_employer": "Formalize the employment contract in the electronic state system — the platform only tracks the status.",
  "Kompaniya verifikatsiyasi kutilmoqda.": "Company verification pending.", "ver_note": "Your projects will be published once a KASBORA admin approves the account.",
  "Mentor tekshiruv paneli": "Mentor review panel", "mentor_d": "Rating on 5 criteria + written feedback — the result lands in the student's passport.",
  "Navbat bo'sh": "Queue is empty", "mentor_empty_b": "It appears here as soon as students submit tasks.",
  "Tekshirish va feedback": "Review and give feedback", "Feedback berish": "Give feedback", "Texnik sifat": "Technical quality",
  "Kommunikatsiya": "Communication", "Muammoni yechish": "Problem solving", "Deadline'ga rioya": "Meeting deadlines",
  "Jamoa bilan ishlash": "Teamwork", "Umumiy": "Overall", "PASSED bo'ladi": "becomes PASSED", "FAILED bo'ladi": "becomes FAILED",
  "fb_placeholder": "Strengths and growth points...", "Feedback yuborish": "Send feedback",
  "fb_ok": "Feedback sent — added to the passport", "Yakunlangan feedbacklar": "Completed feedback", "Hozircha feedback yo'q": "No feedback yet",
  "fb_empty_b": "Review the queued tasks — results stay here.",
  "Jami talabalar": "Total students", "Assessment yakunlagan": "Completed assessments", "Real loyiha qatnashchisi": "Real project participants",
  "Ishga joylashgan": "Hired", "O'rtacha Work Readiness": "Average Work Readiness", "Employment rate": "Employment rate",
  "Import qilish": "Import", "import_ok": "2 student accounts created", "edu_note": "EduOS/SIS API integration on the way — CSV for now.",
  "Skill bo'yicha o'rtacha ball": "Average score by skill", "Employment voronkasi": "Employment funnel",
  "North Star: Verified-to-Hired Rate": "North Star: Verified-to-Hired Rate",
  "north_star_d": "How many students with verified experience got hired — the true value of the startup is in this metric.",
  "uni_t": "TATU — University panel", "uni_d": "Track student readiness in real time.",
  "Tasdiqlash kutilmoqda": "Awaiting approval", "admin_no_projects": "No projects waiting.", "E'lon qilingan": "Published",
  "Loyiha tasdiqlandi va e'lon qilindi": "Project approved and published", "Loyiha rad etildi": "Project rejected",
  "Verifikatsiya kutilmoqda": "Awaiting verification", "verifikatsiya qilindi": "verified", "BLOKLANGAN": "SUSPENDED",
  "Bloklash": "Suspend", "Blokdan chiqarish": "Unsuspend", "Bloklandi": "Suspended", "Blokdan chiqarildi": "Unsuspended",
  "Skill tahrirlash": "Edit skill", "Nomi": "Name", "Skill saqlandi": "Skill saved",
  "KASBORA ekotizimi": "The KASBORA ecosystem", "← Bosh sahifa": "← Home", "eco_h": "The platform is bigger than a website",
  "eco_p": "Telegram Mini App, Open API and payment/education integrations turn KASBORA into a single talent infrastructure. Parts live in the pilot are working now, the rest are on the roadmap.",
  "PILOTDA JONLI": "LIVE IN PILOT", "MOBIL": "MOBILE", "eco_tg_h": "Telegram Mini App — progress in your pocket",
  "eco_tg_p": "In Uzbekistan Telegram is the main channel. Students get assessment results, interview invites and project news via the bot; inside the Mini App — readiness, tasks and passport in one place.",
  "tg1_t": "Real-time notifications", "tg1_d": "interview, result, feedback — push instead of checking", "tg2_t": "Assessment in Telegram", "tg2_d": "MCQ questions inside the bot, with a timer",
  "tg3_t": "iOS/Android app on the way", "tg3_d": "PWA already works, native — Phase 2", "eco_bot": "open for the pilot · starts with /start",
  "API key": "API key", "Misol — passport verifikatsiya kodi": "Example — passport verification code",
  "Integratsiyalar": "Integrations", "int_d": "Deep connection to the market", "JONLI": "LIVE", "YO'LDA": "ON THE WAY", "REJA": "PLANNED", "PILOT": "PILOT",
  "i_click": "Project payments and employer tariffs — connected in the pilot", "i_tg": "Notification, assessment and Mini App channel",
  "i_eduos": "Student sync with university LMS (CSV for now)", "i_hris": "Export of hired candidates to 1C:ZUP and other HR systems",
  "i_gov": "Electronic employment contract — legal review stage", "i_api": "Passport, candidate and readiness endpoints",
  "i_mail": "Assessment, offer and feedback messages", "i_push": "Together with the mobile app, Phase 2",
  "Roadmap": "Roadmap", "rm_d": "What comes when", "rm1_p": "PHASE 1 · Now", "rm1_t": "MVP — prove it", "rm2_p": "PHASE 2 · 3–6 months",
  "rm2_t": "Expansion", "rm3_p": "PHASE 3 · 6–12 months", "rm3_t": "Infrastructure",
  "rm1_1": "Auth + 5 role panels", "rm1_2": "Assessment engine (anti-cheat)", "rm1_3": "Real projects + Blind Review", "rm1_4": "Skill Passport + QR", "rm1_5": "Telegram bot (pilot)",
  "rm2_1": "Native mobile app", "rm2_2": "EduOS/SIS API integration", "rm2_3": "AI feedback generator", "rm2_4": "Full Click/Payme flow", "rm2_5": "New professions (QA, Design)",
  "rm3_1": "University SaaS", "rm3_2": "Digital credentials", "rm3_3": "my.gov.uz research", "rm3_4": "API marketplace", "rm3_5": "Regional expansion",
  "Demo kirish →": "Demo login →", "demo_login_d": "Try all 5 roles with the demo accounts — password:", "Bosh sahifa": "Home",
  "Bugungi progress": "Today's progress", "Keyingi assessment →": "Next assessment →", "wr_phone": "Job ready · +6 this week",
  "Loyiha": "Project", "review'da": "in review",
};

const DICTS: Partial<Record<Lang, Record<string, string>>> = {
  uz: DICT_UZ, en: DICT_EN, ru: DICT_RU, tr: DICT_TR, kk: DICT_KK, kaa: DICT_KAA,
};

const LOCALES: Record<Lang, string> = {
  uz: "uz-UZ", kaa: "uz-UZ", kk: "kk-KZ", tr: "tr-TR", en: "en-GB", ru: "ru-RU",
};
const TIME_WORDS: Record<Lang, [string, string, string, string]> = {
  uz: ["hozirgina", "daqiqa oldin", "soat oldin", "kun oldin"],
  kaa: ["házirgina", "minut aldın", "saat aldın", "kún aldın"],
  kk: ["жаңа ғана", "минут бұрын", "сағат бұрын", "күн бұрын"],
  tr: ["az önce", "dakika önce", "saat önce", "gün önce"],
  en: ["just now", "min ago", "h ago", "d ago"],
  ru: ["только что", "минут назад", "часов назад", "дней назад"],
};

interface I18nCtx {
  lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string;
  theme: Theme; setTheme: (t: Theme) => void; fmtDate: (iso: string) => string; fmtAgo: (iso: string) => string;
}
const Ctx = createContext<I18nCtx | null>(null);

function initTheme(): Theme {
  try {
    const saved = localStorage.getItem("kasbora_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch { return "light"; }
}
function initLang(): Lang {
  try {
    const saved = localStorage.getItem("kasbora_lang") as Lang;
    if (saved && LANGS.some(l => l.code === saved)) return saved;
  } catch { /* ignore */ }
  return "uz";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initLang);
  const [theme, setThemeState] = useState<Theme>(initTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem("kasbora_theme", theme); } catch { /* ignore */ }
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = lang === "kaa" ? "kaa" : lang;
    try { localStorage.setItem("kasbora_lang", lang); } catch { /* ignore */ }
  }, [lang]);

  const value = useMemo<I18nCtx>(() => {
    const dict = DICTS[lang];
    const t = (key: string) => (dict && dict[key]) || (DICT_UZ[key]) || key;
    const fmtDate = (iso: string) => {
      try { return new Date(iso).toLocaleDateString(LOCALES[lang], { day: "numeric", month: "short", year: "numeric" }); }
      catch { return new Date(iso).toLocaleDateString(); }
    };
    const fmtAgo = (iso: string) => {
      const [wNow, wMin, wHour, wDay] = TIME_WORDS[lang];
      const diff = Date.now() - new Date(iso).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1) return wNow;
      if (m < 60) return `${m} ${wMin}`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h} ${wHour}`;
      const d = Math.floor(h / 24);
      if (d < 30) return `${d} ${wDay}`;
      return fmtDate(iso);
    };
    return { lang, setLang: setLangState, t, theme, setTheme: setThemeState, fmtDate, fmtAgo };
  }, [lang, theme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const cur = LANGS.find(l => l.code === lang)!;
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button onClick={() => setOpen(!open)} aria-label={t("Til")}
        className="h-9 px-2.5 rounded-lg border-[1.5px] border-ink bg-cream hover:bg-lime-soft flex items-center gap-1.5 btn-press transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 2.6 4 5.7 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.7-4-9s1.2-6.4 4-9z" />
        </svg>
        <span className="font-mono text-[12px] font-bold tracking-wider">{cur.short}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="anim-pop absolute right-0 mt-2 w-44 card shadow-[5px_5px_0_0_rgba(20,32,26,0.8)] overflow-hidden z-[80]">
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left text-[12.5px] font-semibold transition-colors ${lang === l.code ? "bg-lime-soft text-pine-deep" : "hover:bg-cream"}`}>
              {l.label}
              <span className="font-mono text-[12px] text-ink-soft">{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, t } = useI18n();
  const dark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? t("Yorug' rejim") : t("Tun rejimi")}
      title={dark ? t("Yorug' rejim") : t("Tun rejimi")}
      className={`relative h-9 w-[62px] rounded-full border-[1.5px] border-ink btn-press transition-colors overflow-hidden ${className}`}
      style={{ background: dark ? "linear-gradient(135deg,#101B2E,#1A2440)" : "linear-gradient(135deg,#BFE3F2,#E8F4FA)" }}
    >
      {dark ? (
        <>
          <span className="absolute w-[3px] h-[3px] rounded-full bg-cream/80" style={{ left: 10, top: 9 }} />
          <span className="absolute w-[2px] h-[2px] rounded-full bg-cream/60" style={{ left: 18, top: 22 }} />
          <span className="absolute w-[2px] h-[2px] rounded-full bg-cream/70" style={{ left: 24, top: 12 }} />
        </>
      ) : (
        <>
          <span className="absolute rounded-full bg-white/80" style={{ left: 8, top: 18, width: 14, height: 6 }} />
          <span className="absolute rounded-full bg-white/60" style={{ left: 22, top: 9, width: 10, height: 5 }} />
        </>
      )}
      <span
        className="absolute top-[3px] w-[26px] h-[26px] rounded-full border-[1.5px] border-ink flex items-center justify-center transition-all duration-300 ease-out"
        style={{ left: dark ? 30 : 3, background: dark ? "#F2EAD3" : "#FFD34D" }}
      >
        {dark ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#5C6660" stroke="none"><path d="M20 13.5A8.5 8.5 0 0 1 10.5 4a8.5 8.5 0 1 0 9.5 9.5z" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A5F08" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" fill="#FFD34D" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
          </svg>
        )}
      </span>
    </button>
  );
}

export function LocaleControls({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ThemeToggle />
      <LangSwitcher />
    </div>
  );
}
