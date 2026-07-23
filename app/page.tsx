"use client";

import {
  Footer,
  Hero,
  NavbarLandingPage,
  WhyChooise,
} from "@/components/landing-component"

import {
  Computer,
  GamepadDirectional,
  Gauge,
  Package,
  Waypoints,
} from "lucide-react";

const companyLogos = [
  {
    name: "GLOBAL_LOG",
    icon: GamepadDirectional,
  },
  {
    name: "CARGO_WAY",
    icon: Computer,
  },
  {
    name: "TECH_TRANS",
    icon: Package,
  },
  {
    name: "RAPID_FLOW",
    icon: Gauge,
  },
  {
    name: "CORE_NETWORK",
    icon: Waypoints,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen lg:space-y-36 space-y-14 dark:bg-slate-950/70">
      <NavbarLandingPage />
      <Hero />

      <div className="w-full bg-gray-300 text-center py-12 space-y-6">
        <p className="uppercase font-extrabold text-xl whitespace-nowrap tracking-widest">
          Trusted by thousands of businesses worldwide
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-center items-center max-w-7xl mx-auto">
          {companyLogos.map((company) => (
            <div
              key={company.name}
              className="flex items-center justify-center gap-2 p-4 bg-white/70 dark:bg-slate-950/70 shadow-md transition-all duration-500 cursor-pointer
             rounded-lg hover:rounded-3xl hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-950/30"
              style={{ filter: "url(#liquid-goo)" }}
            >
              <company.icon className="size-6 text-amber-600" />
              <span className="text-sm font-semibold">{company.name}</span>
            </div>
          ))}
        </div>
      </div>

      <WhyChooise />
      <Footer />
    </div>
  );
}
