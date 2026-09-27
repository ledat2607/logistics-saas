"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { AtSign, Car, Globe, MessageSquare, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Footer");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          gsap.fromTo(
            ".footer-cta-card",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          );
        } else {
          gsap.to(".footer-cta-card", { opacity: 0, y: 30, duration: 0.3 });
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full text-white py-12 lg:space-y-16 space-y-12"
    >
      {/* Main Footer Section */}
      <footer className="w-full border-t border-gray-200 bg-white px-4 py-8 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
            <div className="space-y-4">
              <span className="flex items-center gap-2">
                <Car className="size-8 text-amber-600 animate-pulse font-bold" />
                <h2 className="text-xl text-zinc-900 dark:text-zinc-100 font-bold tracking-tight">
                  Logistics Core
                </h2>
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                {t("brandDesc")}
              </p>
              <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 pt-2">
                <Globe className="size-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" />
                <AtSign className="size-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" />
                <MessageSquare className="size-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                {t("product.title")}
              </h3>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="#" className="hover:underline">
                    {t("product.aboutUs")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t("product.careers")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t("product.pricing")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                {t("support.title")}
              </h3>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="#" className="hover:underline">
                    {t("support.contact")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t("support.terms")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t("support.privacy")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                {t("newsletter.title")}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("newsletter.desc")}
              </p>
              <form
                className="flex items-center gap-2 max-w-sm"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="w-full rounded bg-zinc-100 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 px-3 py-2 text-xs border border-transparent focus:outline-none focus:border-zinc-400"
                />
                <button
                  type="submit"
                  className="rounded bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
                >
                  {t("newsletter.btnJoin")}
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <p>{t("copyright")}</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <Globe className="size-3.5" />
                {t("language")}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-zinc-500" />
                {t("systemStatus")}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
