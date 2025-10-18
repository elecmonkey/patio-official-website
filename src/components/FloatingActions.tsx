import { useEffect, useMemo, useState } from 'react';
import wechatQR from '@/assets/wechat-qrcode.jpg';
import wechatLogo from '@/assets/out/wechat-logo.svg';

type Lang = 'zh-cn' | 'en';
type ActionType = 'back' | 'wechat' | 'phone';

interface FloatingTexts {
  phoneHref: string;
  phoneText: string;
  wechatLabel: string;
  backTopLabel: string;
  screenshotHint: string;
  callHint: string;
}

interface FloatingActionsProps {
  lang: Lang;
  textsByLang: Record<Lang, FloatingTexts>;
}

function resolveLangFromPath(pathname: string): Lang {
  return pathname.startsWith('/en') ? 'en' : 'zh-cn';
}

export default function FloatingActions({ lang, textsByLang }: FloatingActionsProps) {
  const fallbackLang: Lang = 'zh-cn';
  const [active, setActive] = useState<ActionType | null>(null);
  const [currentLang, setCurrentLang] = useState<Lang>(lang);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    const handler = () => {
      const detected = resolveLangFromPath(window.location.pathname);
      setCurrentLang(detected);
    };
    window.addEventListener('astro:after-swap', handler);
    return () => window.removeEventListener('astro:after-swap', handler);
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      const shouldShow = window.scrollY > 100;
      if (shouldShow) {
        setMounted(true);
        requestAnimationFrame(() => setVisible(true));
      } else {
        setMounted(false);
        setVisible(false);
        setActive(null);
      }
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('astro:after-swap', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('astro:after-swap', updateVisibility);
    };
  }, []);

  const texts = useMemo(() => {
    return textsByLang[currentLang] ?? textsByLang[fallbackLang];
  }, [currentLang, textsByLang]);

  const handleToggle = (type: ActionType) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setActive(type);
      return;
    }
    setActive((prev) => (prev === type ? null : type));
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActive(null);
  };

  return (
    <div
      className={`fixed bottom-8 right-6 z-[60] transition-transform duration-300 ease-out ${
        visible ? 'translate-x-0' : 'translate-x-24'
      } ${mounted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex flex-col items-end gap-3">
        {/* Back to Top */}
        <button
          type="button"
          onClick={handleBackToTop}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg text-primary-content hover:bg-primary/80 transition-colors"
          aria-label={texts.backTopLabel}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.8" d="M4 12l8-8 8 8m-8 8V4"></path>
          </svg>
        </button>

        {/* WeChat */}
        <div
          className="relative"
          onMouseEnter={() => setActive('wechat')}
          onMouseLeave={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => handleToggle('wechat')}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg text-primary-content hover:bg-primary/80 transition-colors"
            aria-haspopup="dialog"
            aria-expanded={active === 'wechat'}
            aria-label={texts.wechatLabel}
          >
            <img src={wechatLogo.src} alt="WeChat" className="w-6 h-6" />
          </button>
          {active === 'wechat' && (
            <div className="floating-tooltip">
              <div className="floating-tooltip__content">
                <img src={wechatQR.src} alt="WeChat QR Code" className="floating-tooltip__qrcode" />
                <p className="floating-tooltip__hint">{texts.screenshotHint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Phone */}
        <div
          className="relative"
          onMouseEnter={() => setActive('phone')}
          onMouseLeave={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => handleToggle('phone')}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg text-primary-content hover:bg-primary/80 transition-colors"
            aria-haspopup="dialog"
            aria-expanded={active === 'phone'}
            aria-label={texts.phoneText}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </button>
          {active === 'phone' && (
            <div className="floating-tooltip">
              <div className="floating-tooltip__content">
                <p className="floating-tooltip__label">{texts.phoneText}</p>
                <a href={texts.phoneHref} className="floating-tooltip__action">
                  {texts.callHint}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
