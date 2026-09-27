"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Computer,
  GamepadDirectional,
  Gauge,
  Package,
  Waypoints,
} from "lucide-react";

const COMPANY_LOGOS = [
  { name: "GLOBAL_LOG", icon: GamepadDirectional },
  { name: "CARGO_WAY", icon: Computer },
  { name: "TECH_TRANS", icon: Package },
  { name: "RAPID_FLOW", icon: Gauge },
  { name: "CORE_NETWORK", icon: Waypoints },
] as const;

export const TrustedCompanies = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          // 1. Khi cuộn VÀO màn hình -> Chạy animation hiện lên
          gsap.to(".heading-text", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(".company-card", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.1,
          });
        } else {
          // 2. Khi cuộn RA XONG khỏi màn hình -> Reset về lại vị trí ẩn ban đầu
          gsap.to(".heading-text", {
            opacity: 0,
            y: 30,
            duration: 0.3,
            ease: "power1.in",
          });

          gsap.to(".company-card", {
            opacity: 0,
            y: 40,
            duration: 0.3,
            ease: "power1.in",
          });
        }
      },
      { threshold: 0.15 }, // Kích hoạt khi thấy ít nhất 15% diện tích section
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-16 bg-slate-50/80 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 space-y-8 text-center">
        <p className="heading-text opacity-0 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          Được tin dùng bởi hơn 10,000+ doanh nghiệp trên toàn thế giới
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 justify-center items-center">
          {COMPANY_LOGOS.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="company-card opacity-0 group flex items-center justify-center gap-3 p-4 
                bg-white/80 dark:bg-slate-950/60 
                border border-slate-200/80 dark:border-slate-800 
                rounded-xl shadow-xs 
                hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-1
                transition-all duration-300 ease-out cursor-pointer"
            >
              <Icon className="size-5 text-slate-500 group-hover:text-amber-600 transition-colors duration-300 shrink-0" />
              <span className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
