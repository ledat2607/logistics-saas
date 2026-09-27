"use client";

import { useTranslations } from "next-intl";
import { Check, Zap } from "lucide-react";

export function Pricing() {
  const t = useTranslations("Pricing");

  const plans = [
    {
      name: t("plans.starter.name"),
      price: t("plans.starter.price"),
      description: t("plans.starter.description"),
      cta: t("plans.starter.cta"),
      features: [
        t("plans.starter.features.0"),
        t("plans.starter.features.1"),
        t("plans.starter.features.2"),
        t("plans.starter.features.3"),
      ],
      popular: false,
    },
    {
      name: t("plans.growth.name"),
      price: t("plans.growth.price"),
      description: t("plans.growth.description"),
      cta: t("plans.growth.cta"),
      popularBadge: t("plans.growth.popularBadge"),
      features: [
        t("plans.growth.features.0"),
        t("plans.growth.features.1"),
        t("plans.growth.features.2"),
        t("plans.growth.features.3"),
        t("plans.growth.features.4"),
      ],
      popular: true,
    },
    {
      name: t("plans.enterprise.name"),
      price: t("plans.enterprise.price"),
      description: t("plans.enterprise.description"),
      cta: t("plans.enterprise.cta"),
      features: [
        t("plans.enterprise.features.0"),
        t("plans.enterprise.features.1"),
        t("plans.enterprise.features.2"),
        t("plans.enterprise.features.3"),
        t("plans.enterprise.features.4"),
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-amber-500 font-semibold tracking-wide uppercase text-sm">
          {t("badge")}
        </h2>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
          {t("title")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col justify-between p-8 rounded-2xl border hover:scale-105 transition-all duration-300 ${
              plan.popular
                ? "bg-card border-amber-500 shadow-xl shadow-amber-500/10 scale-105 hover:scale-110 z-10"
                : "bg-card/50 border-border/60 hover:border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Zap className="size-3 fill-current" /> {plan.popularBadge}
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 min-h-10">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.price !== "Custom" && plan.price !== "Liên hệ" && (
                  <span className="text-muted-foreground text-sm">
                    {" "}
                    {t("perMonth")}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-amber-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                plan.popular
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Pricing;
