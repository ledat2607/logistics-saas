"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Tránh lỗi Mismatch Hydration khi Render SSR
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

    // Kiểm tra xem trình duyệt có hỗ trợ View Transitions API không
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Lấy tọa độ tâm nút bấm để tạo tâm đường tròn cho hiệu ứng loang màu
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Tính bán kính tối đa để vòng tròn phủ kín 4 góc màn hình
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      // Hiệu ứng loang đường tròn phóng to tràn màn hình
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: "ease-in-out",
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
        "relative flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        isDark
          ? "bg-slate-800 border border-slate-700"
          : "bg-slate-200 border border-slate-300",
      )}
    >
      {/* Nút tròn trượt */}
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-md transform transition-transform duration-500 ease-spring",
          isDark
            ? "translate-x-6 text-amber-400"
            : "translate-x-0 text-amber-600",
        )}
      >
        {isDark ? (
          <Moon className="size-4 animate-in zoom-in duration-300" />
        ) : (
          <Sun className="size-4 animate-in zoom-in duration-300" />
        )}
      </span>
    </button>
  );
}
