"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const options: { value: "light" | "dark" | "system"; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = options.find((o) => o.value === theme)?.label ?? "Sistema";

  return (
    <div className="relative z-20" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-sm cursor-pointer"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Selecionar tema"
      >
        <span className="material-icons text-xl">
          {theme === "light" ? "light_mode" : theme === "dark" ? "dark_mode" : "settings_brightness"}
        </span>
        <span className="text-sm font-medium hidden sm:inline">{currentLabel}</span>
        <span className="material-icons text-lg text-slate-500">expand_more</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-30"
          aria-label="Opções de tema"
        >
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={theme === opt.value}>
              <button
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                  theme === opt.value
                    ? "bg-primary/15 text-green-800 dark:text-green-300 font-medium"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span className="material-icons text-lg">
                  {opt.value === "light"
                    ? "light_mode"
                    : opt.value === "dark"
                      ? "dark_mode"
                      : "settings_brightness"}
                </span>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
