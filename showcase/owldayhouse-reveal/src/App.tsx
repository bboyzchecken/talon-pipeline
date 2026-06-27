import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

// On-brand reveal assets (authored SVGs in /public).
// BG_IMAGE_1 = the polished "surface" (a finished website).
// BG_IMAGE_2 = the engineering "system blueprint" revealed beneath the spotlight.
const BASE = import.meta.env.BASE_URL;
const BG_IMAGE_1 = `${BASE}surface.svg`;
const BG_IMAGE_2 = `${BASE}blueprint.svg`;

const SPOTLIGHT_R = 260;

// Owl Day House registered owl mark (from @odh/ui · OwlMark) — never alter the shape.
function OwlMark({ className }: { className?: string }) {
  return (
    <svg width="26" height="31" viewBox="0 0 56 66" fill="currentColor" role="img" aria-label="Owl Day House" className={className}>
      <path d="M44.3453 28.9961L40.7451 29.7864C42.691 35.6924 42.3156 42.1285 39.6968 47.7627C35.3147 57.1503 24.9695 57.9492 17.116 56.1603C9.26261 54.3714 5.40463 44.1414 5.40463 44.1414C5.79129 55.6566 9.06498 60.3548 9.06498 60.3548L13.0604 58.4356C17.9065 61.145 31.2591 63.594 40.7451 53.225C50.2311 42.8561 44.3453 28.9961 44.3453 28.9961Z" />
      <path d="M9.3829 32.4016C8.24137 35.1904 7.94332 38.2587 8.52642 41.2187C9.10951 44.1787 10.5476 46.8976 12.6589 49.0319C14.7703 51.1662 17.4602 52.6202 20.3888 53.2101C23.3174 53.7999 26.3533 53.4992 29.1129 52.346C31.8725 51.1928 34.2319 49.2388 35.8932 46.7308C37.5545 44.2229 38.443 41.2735 38.4464 38.2554C38.4499 35.2373 37.5682 32.2859 35.9127 29.774C34.2573 27.2622 31.9023 25.3026 29.1454 24.1429L28.6126 23.9518L43.4087 20.1481L38.9664 7.99023L8.70411 24.4902L5.40463 29.8744L11.952 28.1897C10.8765 29.4444 10.0089 30.8667 9.3829 32.4016ZM18.044 38.2113C18.044 37.3525 18.296 36.513 18.7681 35.7989C19.2401 35.0849 19.9111 34.5283 20.6961 34.1997C21.4811 33.8711 22.345 33.7851 23.1784 33.9526C24.0117 34.1202 24.7772 34.5337 25.3781 35.141C25.9789 35.7482 26.3881 36.5219 26.5538 37.3642C26.7196 38.2065 26.6345 39.0795 26.3094 39.8729C25.9842 40.6664 25.4335 41.3445 24.727 41.8216C24.0205 42.2987 23.1899 42.5534 22.3402 42.5534C21.2008 42.5534 20.108 42.0959 19.3023 41.2816C18.4966 40.4673 18.044 39.3629 18.044 38.2113ZM33.8712 38.2113C33.8757 39.5424 33.6201 40.8613 33.1189 42.0923C32.6178 43.3233 31.881 44.4421 30.9509 45.3846C30.0209 46.327 28.9157 47.0745 27.6991 47.5842C26.4824 48.0938 25.1781 48.3556 23.8611 48.3544C23.2059 48.3547 22.5524 48.2877 21.9106 48.1547C24.1814 47.7019 26.2262 46.4664 27.6959 44.6592C29.1656 42.8521 29.969 40.5853 29.969 38.246C29.969 35.9067 29.1656 33.64 27.6959 31.8328C26.2262 30.0257 24.1814 28.7902 21.9106 28.3373C22.5533 28.2115 23.2064 28.1475 23.8611 28.1463C26.5062 28.1463 29.0436 29.2053 30.9181 31.0916C32.7925 32.9779 33.8512 35.5379 33.8626 38.2113H33.8712Z" />
      <path d="M23.7063 8.88436L18.2931 11.8283L21.1887 7.46015L17.2104 5.21094L8.70398 20.8686L27.1088 10.8036L23.7063 8.88436Z" />
    </svg>
  );
}

// RevealLayer ไม่รับ cursor prop — อ่าน CSS var (--mx/--my) จาก parent โดยตรง
function RevealLayer({ image }: { image: string }) {
  const mask = `radial-gradient(
    circle ${SPOTLIGHT_R}px at var(--mx, -999px) var(--my, -999px),
    rgba(255,255,255,1.0)  0%,
    rgba(255,255,255,1.0)  40%,
    rgba(255,255,255,0.75) 60%,
    rgba(255,255,255,0.4)  75%,
    rgba(255,255,255,0.12) 88%,
    rgba(255,255,255,0.0)  100%
  )`;
  return (
    <div
      className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
      style={{
        backgroundImage: `url(${image})`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}

const NAV_LINKS = [
  { label: 'เราคือใคร', href: 'https://owldayhouse.com/about', active: false },
  { label: 'เราทำอะไร', href: 'https://owldayhouse.com/services', active: false },
  { label: 'ผลงาน', href: 'https://owldayhouse.com/work', active: true },
  { label: 'แพ็กเกจ', href: 'https://owldayhouse.com/packages', active: false },
  { label: 'Talon', href: 'https://owldayhouse.com/talon', active: false },
];

export default function App() {
  // CSS custom property แทน React state → ไม่ trigger re-render ทุก frame
  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | undefined>(undefined);
  const runningRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const apply = (x: number, y: number) => {
      section.style.setProperty('--mx', `${x}px`);
      section.style.setProperty('--my', `${y}px`);
    };

    const tick = () => {
      const s = smooth.current;
      const m = mouse.current;
      s.x += (m.x - s.x) * 0.1;
      s.y += (m.y - s.y) * 0.1;
      apply(s.x, s.y);

      // หยุด loop เมื่อ spotlight ตามทันเคอร์เซอร์แล้ว → ปล่อย main thread ว่าง
      // (ไม่ต้องรัน rAF ตลอดเวลาเหมือน prompt เดิม) — restart ตอน mousemove
      if ((m.x - s.x) ** 2 + (m.y - s.y) ** 2 > 0.25) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        s.x = m.x;
        s.y = m.y;
        apply(s.x, s.y);
        runningRef.current = false;
      }
    };

    const startLoop = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      startLoop();
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper tracking-[-0.01em]" style={{ fontFamily: "'IBM Plex Sans Thai', sans-serif" }}>
      {/* Navigation (fixed, over hero) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Left: owl mark + wordmark */}
        <a href="https://owldayhouse.com/" className="flex items-center gap-2.5" style={{ color: '#ffffff' }}>
          <OwlMark />
          <span className="text-xl sm:text-2xl font-display font-bold tracking-tight">
            Owl Day House
          </span>
        </a>

        {/* Center pill */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                'px-4 py-1.5 rounded-full text-sm font-display font-medium transition-colors ' +
                (link.active
                  ? 'bg-white/15 text-gold'
                  : 'text-paper/80 hover:bg-white/10 hover:text-gold')
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right (desktop) */}
        <a
          href="https://m.me/owldayhouse"
          className="hidden md:block bg-paper text-navy text-sm font-display font-semibold px-6 py-2.5 rounded-full hover:bg-white transition-colors"
        >
          ติดต่อเรา
        </a>
      </nav>

      {/* Hero */}
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden h-screen bg-navy-deep"
        style={{ height: '100dvh' }}
      >
        {/* 1. Base image — the polished surface */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* 2. Reveal layer — the system blueprint beneath */}
        <RevealLayer image={BG_IMAGE_2} />

        {/* Legibility scrim — มืดเฉพาะโซนบน/ล่าง กันตัวอักษรจมภาพ ส่วนกลางใส reveal ยังคมชัด */}
        <div
          className="absolute inset-0 z-40 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(9,7,22,0.62) 0%, rgba(9,7,22,0.18) 24%, rgba(9,7,22,0) 42%, rgba(9,7,22,0) 60%, rgba(9,7,22,0.55) 100%)',
          }}
        />

        {/* 3. Heading */}
        <div className="absolute top-[13%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="leading-[1.04]">
            <span
              className="hero-anim hero-reveal block font-display font-light text-5xl sm:text-7xl md:text-8xl"
              style={{ color: '#ffffff', letterSpacing: '-0.01em', animationDelay: '0.25s', textShadow: '0 2px 10px rgba(9,7,22,0.55)' }}
            >
              ใต้ดีไซน์สวย ๆ
            </span>
            <span
              className="hero-anim hero-reveal block font-display font-bold text-5xl sm:text-7xl md:text-8xl"
              style={{ color: '#ffc233', letterSpacing: '-0.02em', animationDelay: '0.42s', textShadow: '0 2px 10px rgba(9,7,22,0.6)' }}
            >
              คือระบบที่โตได้
            </span>
          </h1>
        </div>

        {/* 4. Bottom-left paragraph */}
        <div
          className="hero-anim hero-fade hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[280px] z-50"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-paper/90 leading-relaxed" style={{ textShadow: '0 1px 14px rgba(9,7,22,0.75)' }}>
            ทุกเว็บที่เราส่งมอบ ออกแบบให้เติบโตต่อได้ — จากเว็บแรก ฿3,900
            สู่ระบบระดับองค์กร ดูแลต่อโดยทีมงานคนไทยที่เชียงใหม่
          </p>
        </div>

        {/* 5. Bottom-right block */}
        <div
          className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[280px] flex flex-col items-start gap-4 sm:gap-5 z-50"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-paper/90 leading-relaxed" style={{ textShadow: '0 1px 14px rgba(9,7,22,0.75)' }}>
            ลองเลื่อนเคอร์เซอร์ไปบนภาพ แล้วส่องดูโครงสร้างระบบที่อยู่เบื้องหลังงานออกแบบของเรา
          </p>
          <a
            href="https://owldayhouse.com/talon"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy text-sm font-display font-semibold px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-glow whitespace-nowrap"
          >
            เริ่มเลย ฿3,900
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </section>
    </div>
  );
}
