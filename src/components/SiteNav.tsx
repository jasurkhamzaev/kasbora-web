import React, { useState } from "react";
import { Link } from "../lib/router";
import { useI18n, LangSwitcher, ThemeToggle } from "../lib/i18n";
import { Btn, Icon, I } from "./ui";
import { KasboraLogo } from "./Logo";

/**
 * Markaziy Navbar — barcha ochiq sahifalar (Landing, InfoPages, Ecosystem) shu komponentni ishlatadi.
 * Yorliqlar `src/locales/translations.json` dan olinadi: bir joyda o'zgartirsangiz, hamma joyda o'zgaradi.
 */
export default function SiteNav() {
  const { t, theme } = useI18n();
  const [menu, setMenu] = useState(false);

  const links: [string, string][] = [
    ["Jarayon", "/jarayon"],
    ["Skill'lar", "/skilllar"],
    ["Malaka pasporti", "/malaka-pasporti"],
    ["Ekotizim", "/ekotizim"],
    ["FAQ", "/faq"],
  ];

  return (
    <header className="sticky top-0 z-[70] border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03] active:scale-[0.97]" aria-label="KASBORA">
          <KasboraLogo height={27} light={theme === "dark"} />
        </Link>

        {/* desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-semibold" aria-label={t("Menyu")}>
          {links.map(([label, to]) => (
            <Link key={to} to={to} className="hover:text-pine transition-colors">{t(label)}</Link>
          ))}
          <Link to="/login" className="text-ink-soft hover:text-ink transition-colors">{t("Kirish")}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <span className="hidden md:block"><ThemeToggle /></span>
          <Link to="/register" className="hidden sm:block"><Btn variant="lime" small>{t("Boshlash →")}</Btn></Link>
          <button
            className="lg:hidden w-10 h-10 rounded-lg border-[1.5px] border-ink bg-cream flex items-center justify-center btn-press"
            onClick={() => setMenu(!menu)} aria-label={t("Menyu")} aria-expanded={menu}
          >
            <Icon d={menu ? I.x : <path d="M4 7h16M4 12h16M4 17h16" />} size={17} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menu && (
        <div className="lg:hidden border-t border-line bg-paper px-4 py-4 anim-pop">
          <nav className="flex flex-col gap-1 text-[14px] font-semibold" aria-label={t("Menyu")}>
            {links.map(([label, to]) => (
              <Link key={to} to={to} onClick={() => setMenu(false)}
                className="py-2.5 border-b border-line/60 hover:text-pine transition-colors">{t(label)}</Link>
            ))}
            <Link to="/login" onClick={() => setMenu(false)} className="py-2.5 hover:text-pine transition-colors">{t("Kirish")}</Link>
          </nav>
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-line">
            <ThemeToggle />
            <Link to="/register" onClick={() => setMenu(false)}><Btn variant="lime" small>{t("Boshlash →")}</Btn></Link>
          </div>
        </div>
      )}
    </header>
  );
}
