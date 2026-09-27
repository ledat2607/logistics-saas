"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function Solutions() {
  const t = useTranslations("Solutions");

  const solutions = [
    {
      badge: t("ecommerce.badge"),
      title: t("ecommerce.title"),
      description: t("ecommerce.description"),
      highlights: [
        t("ecommerce.highlights.0"),
        t("ecommerce.highlights.1"),
        t("ecommerce.highlights.2"),
      ],
      imgPath: "/dashboard-screen.png",
    },
    {
      badge: t("fleetOwners.badge"),
      title: t("fleetOwners.title"),
      description: t("fleetOwners.description"),
      highlights: [
        t("fleetOwners.highlights.0"),
        t("fleetOwners.highlights.1"),
        t("fleetOwners.highlights.2"),
      ],
      imgPath: "/dashboard-card.png",
    },
  ];

  return (
    <section id="solutions" className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-amber-500 font-semibold tracking-wide uppercase text-sm">
          {t("badge")}
        </h2>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
          {t("title")}
        </p>
      </div>

      <div className="space-y-16 lg:space-y-24">
        {solutions.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col lg:flex-row gap-12 items-center ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Nội dung bên trái/phải */}
            <div className="flex-1 space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {item.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {item.description}
              </p>
              <ul className="space-y-3">
                {item.highlights.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-amber-500 shrink-0" />
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Khung chứa hình ảnh */}
            <div className="flex-1 w-full relative group">
              {/* Hiệu ứng Glow mờ phía sau hình ảnh */}
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-amber-500/20 to-amber-600/10 blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />

              {/* Container chứa ảnh */}
              <div className="relative aspect-video w-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl">
                <Image
                  src={item.imgPath}
                  alt={item.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={idx === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Solutions;
