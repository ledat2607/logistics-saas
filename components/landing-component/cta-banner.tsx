"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  const t = useTranslations("CtaBanner");

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-linear-to-r from-amber-600 to-amber-500 p-8 sm:p-12 lg:p-16 text-slate-950 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-slate-900/90 text-lg sm:text-xl font-medium">
            {t("description")}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              type="button"
              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 shadow-xl transition-all"
            >
              {t("btnStarted")} <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
