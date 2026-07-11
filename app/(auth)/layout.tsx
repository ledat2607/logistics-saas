import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 relative flex-col justify-between p-12 overflow-hidden bg-zinc-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay"
          style={{ backgroundImage: `url('./login-image.jpg')` }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center font-bold text-sm text-white">
            L
          </div>
          <span className="font-bold text-lg tracking-tight">
            LOGISTICS CORE
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md mt-auto mb-auto">
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            Precision in Every Parcel.{" "}
            <span className="text-orange-500">Powering Global Trade.</span>
          </h1>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Access the industry's most advanced mission control for fleet
            management and shipment tracking. Real-time data, predictive
            routing, and seamless integration.
          </p>

          <div className="flex gap-8 pt-4 border-t border-zinc-700/50">
            <div>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-zinc-400">System uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold">2.4M</p>
              <p className="text-xs text-zinc-400">Shipments tracked</p>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="relative z-10 text-xs text-zinc-500">
          © 2026 Logistics Core Systems. All rights reserved.
        </div>
      </div>

      {/* KHỐI PHẢI: Chứa phần Form động thay đổi theo từng trang */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-150 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200/60 dark:border-zinc-800">
          {children}
        </div>
        <span className="flex items-center justify-between gap-4 mt-6 text-xs font-bold text-muted-foreground">
          <p>Help Center</p>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </span>
      </div>
    </div>
  );
}
