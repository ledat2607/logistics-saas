"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Car,
  Home,
  MenuIcon,
  Package,
  Paperclip,
  WalletMinimal,
  WandSparkles,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-clients";

// Custom Hook nhận diện Section đang hiển thị trên màn hình
const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string>("#hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`);
          }
        });
      },
      {
        // Kích hoạt khi section nằm ở giữa màn hình (từ 30% đến 70% viewport)
        rootMargin: "-30% 0px -40% 0px",
        threshold: 0,
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id.replace("#", ""));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
};

export const NavbarLandingPage = () => {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const navLanding = [
    { name: t("home"), href: `#hero`, icon: Home },
    { name: t("features"), href: `#features`, icon: Package },
    { name: t("solutions"), href: `#solutions`, icon: WandSparkles },
    { name: t("pricing"), href: `#pricing`, icon: WalletMinimal },
    { name: t("about"), href: `#about`, icon: Paperclip },
  ];

  // Theo dõi danh sách các ID section
  const sectionIds = navLanding.map((item) => item.href);
  const activeSection = useActiveSection(sectionIds);

  // Xử lý cuộn trang mượt (Smooth Scroll) khi click
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="w-full flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Car className="size-10 text-amber-600 animate-pulse" />
          <h2 className="text-xl text-amber-800 dark:text-amber-500 font-bold tracking-tight xl:block hidden">
            Logistics Core
          </h2>
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center gap-1 bg-slate-200/40 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/60 backdrop-blur-2xl shadow-xs">
          {navLanding.map((item) => {
            const isActive = activeSection === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out overflow-hidden",
                  isActive
                    ? "bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold shadow-xs border border-amber-500/30 dark:border-amber-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50",
                )}
              >
                <item.icon
                  className={cn(
                    "size-4 transition-transform duration-300 group-hover:scale-110",
                    isActive
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400",
                  )}
                />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop Actions & Switchers */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ModeToggle />

          {session ? (
            <Link href={`/${locale}/dashboard`}>
              <Button>
                {t("goToDashboard")} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <Link href={`/${locale}/login`}>
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {t("login")}
                </Button>
              </Link>
              <Button className="rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition-all duration-300 hover:scale-[1.02]">
                {t("register")}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <ModeToggle />
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="size-6 animate-in fade-in zoom-in-75 duration-200" />
            ) : (
              <MenuIcon className="size-6 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute top-full left-0 w-full md:hidden border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${
            isOpen
              ? "max-h-125 opacity-100 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-6 flex flex-col gap-2">
            {navLanding.map((item) => {
              const isActive = activeSection === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 rounded-2xl text-base font-medium transition-all duration-300",
                    isActive
                      ? "bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/30 dark:border-amber-500/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-amber-600/80",
                    )}
                  />
                  <span>{item.name}</span>
                </a>
              );
            })}

            {/* Mobile Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <Link href={`/${locale}/login`}>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {t("login")}
                </Button>
              </Link>
              <Button className="rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-600/10">
                {t("register")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
