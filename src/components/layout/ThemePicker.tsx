"use client";

import { useEffect, useState } from "react";

type ThemeId = "steel" | "earth" | "slate";
type Appearance = "light" | "dark";

const THEMES: Array<{ id: ThemeId; label: string; swatch: string }> = [
  { id: "steel", label: "Steel & Gold", swatch: "linear-gradient(135deg, #1f2937 0%, #2d3748 60%, #d4a24c 100%)" },
  { id: "earth", label: "Earthy Neutrals", swatch: "linear-gradient(135deg, #283745 0%, #4b4a48 55%, #c1b189 100%)" },
  { id: "slate", label: "Blue Green", swatch: "linear-gradient(135deg, #092c4a 0%, #10564f 55%, #ccb875 100%)" },
];

const STORAGE_KEY = "elmat-theme";
const APPEARANCE_KEY = "elmat-appearance";

export function ThemePicker() {
  const [active, setActive] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "steel";
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && THEMES.some((t) => t.id === saved) ? saved : "steel";
  });
  const [appearance, setAppearance] = useState<Appearance>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem(APPEARANCE_KEY) as Appearance | null;
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", active);
    window.localStorage.setItem(STORAGE_KEY, active);
  }, [active]);

  useEffect(() => {
    document.documentElement.setAttribute("data-appearance", appearance);
    window.localStorage.setItem(APPEARANCE_KEY, appearance);
  }, [appearance]);

  const applyTheme = (theme: ThemeId) => {
    setActive(theme);
  };

  const toggleAppearance = () => {
    setAppearance((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex items-center gap-2" aria-label="Palette de couleurs">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          title={theme.label}
          onClick={() => applyTheme(theme.id)}
          className={`h-4 w-4 rounded-full border transition ${active === theme.id ? "scale-110 border-white/90" : "border-white/45 hover:border-white/75"}`}
          style={{ background: theme.swatch }}
          aria-label={theme.label}
          aria-pressed={active === theme.id}
        />
      ))}
      <button
        type="button"
        title={appearance === "dark" ? "Mode clair" : "Mode sombre"}
        aria-label={appearance === "dark" ? "Activer mode clair" : "Activer mode sombre"}
        aria-pressed={appearance === "dark"}
        onClick={toggleAppearance}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/45 text-[10px] leading-none text-white/90 transition hover:border-white/80"
      >
        {appearance === "dark" ? "☾" : "☼"}
      </button>
    </div>
  );
}
