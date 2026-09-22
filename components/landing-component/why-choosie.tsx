"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Calendar,
  DiamondPlus,
  EvCharger,
  Fuel,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

const DataCard = [
  {
    key: "realtime",
    icon: MapPin,
  },
  {
    key: "scheduling",
    icon: Calendar,
  },
  {
    key: "analytics",
    icon: Fuel,
  },
];

export const WhyChoose = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("WhyUs");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          gsap.fromTo(
            ".why-header",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          );

          gsap.fromTo(
            ".why-card",
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: "power2.out",
              delay: 0.2,
            },
          );

          gsap.fromTo(
            ".why-testimonial",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.3,
            },
          );
        } else {
          gsap.to(".why-header", { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(".why-card", { opacity: 0, y: 40, duration: 0.3 });
          gsap.to(".why-testimonial", { opacity: 0, y: 30, duration: 0.3 });
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DataCard.map((card, index) => (
          <div
            key={index}
            className="why-card opacity-0 h-full flex hover:-translate-y-2 hover:scale-[1.02] transition-transform duration-300 ease-out"
          >
            <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden relative group w-full">
              <div>
                <CardHeader className="flex flex-row items-center gap-4 p-6 pb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    {t(`cards.${card.key}.title`)}
                  </h3>
                </CardHeader>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                <CardContent className="p-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                  {t(`cards.${card.key}.description`)}
                </CardContent>
              </div>

              <div>
                <Separator className="bg-slate-100 dark:bg-slate-800" />
                <CardContent className="p-4 px-6 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                  <span>{t(`cards.${card.key}.subContent`)}</span>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    →
                  </span>
                </CardContent>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="why-testimonial opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center p-4">
        <div className="flex items-center justify-center p-2 relative bg-white dark:bg-slate-950 max-w-[320px] mx-auto group">
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <span className="absolute w-full h-full rounded-full border-2 border-blue-400 dark:border-slate-200 animate-ping opacity-25" />
            <span className="absolute w-[120%] h-[120%] rounded-full border border-blue-400/60 dark:border-slate-200/60 animate-ping opacity-15 [animation-delay:0.5s]" />
          </div>

          <div className="p-3 bg-white dark:bg-slate-950 z-10 w-full structure-img">
            <img
              src="/ceo.jpg"
              alt="CEO Profile"
              className="object-contain rounded-full w-full h-auto mx-auto border-2 border-slate-100 dark:border-slate-800"
            />
          </div>

          <Button
            variant="outline"
            className="absolute bottom-4 -right-4 z-20 rounded-xl shadow-md bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:bg-green-500 hover:text-white hover:border-green-500"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            View profile
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>

          <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight text-justify leading-snug">
            "Switching to Logistics Core was the single best decision we made
            this year. We saved 20% on fuel costs in the first quarter alone,
            and the dispatch interface is so intuitive our drivers actually
            enjoy using it."
          </p>

          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Marcus Thorne
            </p>
            <p className="font-light text-sm text-muted-foreground">
              CEO, Thorne Expedited Freight
            </p>
          </div>

          <div className="flex items-center gap-6 font-bold text-muted-foreground/80 text-xs tracking-wider uppercase pt-2">
            <span>Forbes</span>
            <span>Logistics Day</span>
            <span>Tech Daily</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
