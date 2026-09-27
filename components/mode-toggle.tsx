"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Dùng flushSync để ép React render DOM ngay lập tức, không delay
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = isDark
        ? [
            `circle(${endRadius}px at ${x}px ${y}px)`,
            `circle(0px at ${x}px ${y}px)`,
          ]
        : [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

      document.documentElement.animate(
        {
          clipPath,
        },
        {
          duration: 300, // Giảm nhẹ duration xuống 450ms để cảm giác phản hồi nhanh & mượt hơn
          easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Bezier curve chuẩn của Material Design cho chuyển cảnh
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle Theme"
      className={cn(
        "relative flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        isDark
          ? "bg-slate-800 border border-slate-700"
          : "bg-slate-200 border border-slate-300",
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-md transform transition-transform duration-300 ease-spring",
          isDark
            ? "translate-x-6 text-amber-400"
            : "translate-x-0 text-amber-600",
        )}
      >
        {isDark ? (
          <Moon className="size-4 animate-in zoom-in duration-200" />
        ) : (
          <Sun className="size-4 animate-in zoom-in duration-200" />
        )}
      </span>
    </button>
  );
}
