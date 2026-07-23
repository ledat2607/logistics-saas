"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
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

const navLanding = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Features",
    href: "/features",
    icon: Package,
  },
  {
    name: "Solutions",
    href: "/solutions",
    icon: WandSparkles,
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: WalletMinimal,
  },
  {
    name: "About",
    href: "/about",
    icon: Paperclip,
  },
];

export const NavbarLandingPage = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="w-full flex justify-between items-center px-4 py-2">
        <span className="flex items-center gap-2">
          <Car className="size-10 text-amber-600 animate-pulse" />
          <h2 className="text-xl text-amber-800 dark:text-amber-500 font-bold tracking-tight xl:block hidden">
            Logistics Core
          </h2>
        </span>

        <div className="hidden md:flex items-center gap-1 bg-slate-200/20 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/50 backdrop-blur-2xl shadow">
          {navLanding.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 transition-all duration-500 ease-out hover:text-amber-700 dark:hover:text-amber-400 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-amber-500/10 via-orange-500/20 to-yellow-500/10 blur-sm opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out -z-10 rounded-full border border-white/20" />

              <item.icon
                className={cn(
                  "size-4 group-hover:rotate-6 transition-transform duration-300",
                  pathName === item.href
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-500 group-hover:text-amber-600",
                )}
              />
              <span
                className={cn(
                  "transition-colors duration-300",
                  pathName === item.href
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-500 group-hover:text-amber-600",
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Actions & Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          {session ? (
            <Link href={"/dashboard"}>
              <Button>
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Button className="rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition-all duration-300 hover:scale-[1.02]">
                Đăng ký miễn phí
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Controls (Menu button + Theme Toggle) */}
        <div className="flex md:hidden items-center gap-2">
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
        <div
          className={`absolute top-full left-0 w-full md:hidden border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 ease-in-out overflow-hidden shadow-xl
          ${
            isOpen
              ? "max-h-125 opacity-100 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLanding.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Tự đóng menu sau khi bấm link
                className="group relative flex items-center gap-3 p-3 rounded-2xl text-base font-medium text-slate-700 dark:text-slate-300 overflow-hidden transition-all duration-300"
              >
                {/* Liquid Glass background cho mobile khi tap/hover */}
                <span className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-orange-500/15 to-yellow-500/10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 -z-10" />
                <item.icon className="size-5 text-amber-600 transition-transform duration-300 group-hover:scale-110" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60NAV">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                Đăng nhập
              </Button>
              <Button className="rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-600/10">
                Đăng ký miễn phí
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
