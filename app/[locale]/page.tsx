"use client";

import {
  Footer,
  Hero,
  NavbarLandingPage,
  WhyChooise,
} from "@/components/landing-component";
import { TrustedCompanies } from "@/components/landing-component/trusted-companies";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-500/20 selection:text-amber-600">
      <NavbarLandingPage />

      <main className="pt-20 lg:pt-24 space-y-20 lg:space-y-32">
        <div className="min-h-[80vh] flex flex-col justify-center">
          <Hero />
        </div>

        <TrustedCompanies />

        <WhyChooise />
      </main>

      <Footer />
    </div>
  );
}
