import { navigate } from 'astro:transitions/client';
import { languages } from '@/i18n/ui';

interface LanguageSwitcherProps {
  currentLang: keyof typeof languages;
  currentPath: string;
}

export default function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
  const handleLanguageChange = (newLang: string) => {
    // 检测浏览器是否支持 View Transitions
    const supportsViewTransitions = 'startViewTransition' in document;

    let targetPath: string;

    if (newLang === 'zh-cn') {
      // 切换到中文：移除 /en 前缀
      targetPath = currentPath.replace(/^\/en(\/|$)/, '/') || '/';
    } else {
      // 切换到英文：添加 /en 前缀
      if (currentPath.startsWith('/en')) {
        targetPath = currentPath;
      } else {
        targetPath = currentPath === '/' ? '/en' : `/en${currentPath}`;
      }
    }

    if (supportsViewTransitions) {
      // 使用 View Transitions API 进行平滑过渡
      (document as any).startViewTransition(() => {
        navigate(targetPath);
      });
    } else {
      // 降级到客户端路由导航
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
      <ul className="dropdown-content menu bg-base-100 w-32 p-2 shadow border border-base-300 mt-2">
        {Object.entries(languages).map(([code, name]) => (
          <li key={code}>
            <button
              onClick={() => handleLanguageChange(code)}
              className={currentLang === code ? 'menu-active' : ''}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
