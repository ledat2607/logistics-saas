"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "vi" ? "en" : "vi";
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 px-3 text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <Globe className="size-3.5 text-amber-600" />
      <span>{locale === "vi" ? "EN" : "VI"}</span>
    </Button>
  );
}
