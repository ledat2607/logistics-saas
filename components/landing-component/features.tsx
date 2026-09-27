"use client";

import { useTranslations } from "next-intl";
import {
  Truck,
  ShieldCheck,
  BarChart3,
  Clock,
  MapPin,
  Cpu,
} from "lucide-react";

export function Features() {
  const t = useTranslations("Features");

  const features = [
    {
      icon: MapPin,
      title: t("items.tracking.title"),
      description: t("items.tracking.description"),
    },
    {
      icon: BarChart3,
      title: t("items.analytics.title"),
      description: t("items.analytics.description"),
    },
    {
      icon: ShieldCheck,
      title: t("items.security.title"),
      description: t("items.security.description"),
    },
    {
      icon: Clock,
      title: t("items.dispatch.title"),
      description: t("items.dispatch.description"),
    },
    {
      icon: Cpu,
      title: t("items.warehouse.title"),
      description: t("items.warehouse.description"),
    },
    {
      icon: Truck,
      title: t("items.fleet.title"),
      description: t("items.fleet.description"),
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-amber-500 font-semibold tracking-wide uppercase text-sm">
          {t("badge")}
        </h2>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
          {t("title")}
        </p>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="group relative p-8 rounded-2xl border border-border/50 bg-card hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300"
          >
            <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
