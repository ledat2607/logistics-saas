"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeCheck,
  Play,
  TrendingUp,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Hero")


  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          gsap.fromTo(
            ".hero-text-item",
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
            },
          );

          gsap.fromTo(
            ".hero-image-box",
            { opacity: 0, scale: 0.95, y: 30 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              delay: 0.2,
            },
          );

          gsap.fromTo(
            ".hero-stat-card",
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.35,
            },
          );
        } else {
          gsap.to(".hero-text-item", {
            opacity: 0,
            y: 35,
            duration: 0.3,
            ease: "power1.in",
          });
          gsap.to(".hero-image-box", {
            opacity: 0,
            scale: 0.95,
            y: 30,
            duration: 0.3,
            ease: "power1.in",
          });
          gsap.to(".hero-stat-card", {
            opacity: 0,
            y: 25,
            duration: 0.3,
            ease: "power1.in",
          });
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] flex flex-col justify-center max-w-7xl mx-auto px-4 py-12 lg:py-20 overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="grid lg:grid-cols-12 grid-cols-1 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="hero-text-item opacity-0 inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold w-fit">
            <BadgeCheck className="size-4 shrink-0 text-amber-600" />
            <span>{t("badge")}</span>
          </div>

          <div className="hero-text-item opacity-0 text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
            {t("titleLine1")}
            <p className="text-amber-600 dark:text-amber-500 font-black mt-1">
              {t("titleLine2")}
            </p>
          </div>

          <p className="hero-text-item opacity-0 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-normal">
            {t("description")}
          </p>

          <div className="hero-text-item opacity-0 flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              className="rounded-xl font-bold gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25"
            >
              {t("btnGetStarted")} <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl font-bold gap-2"
            >
              <Play className="size-4 fill-current" /> {t("btnWatchDemo")}
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-4">
            <div className="hero-stat-card opacity-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                99.8%
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("stats.onTimeDelivery")}
              </p>
            </div>
            <div className="hero-stat-card opacity-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                -25%
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("stats.fuelSavings")}
              </p>
            </div>
            <div className="hero-stat-card opacity-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                24/7
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("stats.gpsTracking")}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="hero-image-box opacity-0 relative w-full max-w-lg">
            <div className="absolute -top-4 -left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <Truck className="size-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  {t("cards.activeVehicles")}
                </p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t("cards.fleetOnline")}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  {t("cards.security")}
                </p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t("cards.isoCertified")}
                </p>
              </div>
            </div>

            <div className="border border-dashed rounded-3xl p-3 border-amber-500/30 bg-amber-500/5 dark:bg-slate-900/40">
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/image-landingpage.png"
                  alt={t("imageAlt")}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
