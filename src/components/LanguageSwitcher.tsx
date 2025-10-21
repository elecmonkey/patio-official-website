import type { MouseEvent } from 'react';
import { useMemo } from 'react';
import { navigate } from 'astro:transitions/client';
import { languages } from '@/i18n/ui';

interface LanguageSwitcherProps {
  currentLang: keyof typeof languages;
  currentPath: string;
}

function buildTargetPath(currentPath: string, lang: string) {
  if (lang === 'zh-cn') {
    const normalized = currentPath.replace(/^\/en(\/|$)/, '/') || '/';
    return normalized === '' ? '/' : normalized;
  }

  if (currentPath.startsWith('/en')) {
    return currentPath;
  }

  if (currentPath === '/') {
    return '/en';
  }

  return `/en${currentPath}`;
}

export default function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
  const targets = useMemo(() => {
    return Object.fromEntries(
      Object.keys(languages).map((code) => [code, buildTargetPath(currentPath, code)])
    ) as Record<keyof typeof languages, string>;
  }, [currentPath]);

  const handleLanguageChange = (event: MouseEvent<HTMLAnchorElement>, newLang: keyof typeof languages) => {
    if (typeof window === 'undefined') return;

    event.preventDefault();

    if (newLang === currentLang) {
      return;
    }

    const targetPath = targets[newLang];
    const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;

    if (supportsViewTransitions) {
      (document as any).startViewTransition(() => {
        navigate(targetPath);
      });
    } else {
      navigate(targetPath);
    }
  };

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-ghost gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
        </svg>
        <span className="hidden sm:inline">{languages[currentLang]}</span>
      </summary>
      <ul className="dropdown-content menu bg-blue-900 text-white w-32 p-2 shadow border border-blue-800 mt-2">
        {Object.entries(languages).map(([code, name]) => {
          const typedCode = code as keyof typeof languages;
          return (
            <li key={code}>
              <a
                href={targets[typedCode]}
                onClick={(event) => handleLanguageChange(event, typedCode)}
                className={`${
                  currentLang === typedCode ? 'bg-white text-blue-900 font-semibold' : 'text-white hover:bg-blue-800'
                }`}
              >
                {name}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
