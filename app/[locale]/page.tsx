"use client";

import {
  Footer,
  Hero,
  NavbarLandingPage,
  WhyChooise,
  TrustedCompanies,
  Features,
  Pricing,
  Solutions,
  CtaBanner,
} from "@/components/landing-component";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-500/20 selection:text-amber-600">
      <NavbarLandingPage />

      <main className="pt-20 lg:pt-24 space-y-20 lg:space-y-32 mb-20">
        <div className="min-h-[80vh] flex flex-col justify-center">
          <Hero />
        </div>

        <TrustedCompanies />

        <Features />

        <WhyChooise />

        <Solutions />

        <Pricing />

        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
