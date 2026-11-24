import { useState, useRef, useEffect } from 'react';
import { useLanguage, languageNames, Language } from '../contexts/LanguageContext';

function TranslateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" />
      <path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost text-xs flex items-center gap-1.5 px-2"
        title="Language / Idioma"
      >
        <TranslateIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-ink-700 rounded-xl shadow-xl py-1 z-50 min-w-[160px] animate-fade-in">
          {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => (
            <button
              key={code}
              type="button"
              onClick={() => { setLanguage(code); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                language === code
                  ? 'text-amber-500 bg-amber-500/5'
                  : 'text-ink-300 hover:text-ink-100 hover:bg-ink-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
