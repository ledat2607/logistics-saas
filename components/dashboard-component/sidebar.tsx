"use client";

import {
  LayoutDashboard,
  Calendar,
  Truck,
  Container,
  Settings,
  HelpCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function SidebarDashboard({
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      name: "Fleet",
      icon: Container,

      href: "/dashboard/fleets",
    },
    {
      name: "Schedule",
      icon: Calendar,

      href: "/dashboard/schedules",
    },
    {
      name: "Shipments",
      icon: Truck,

      href: "/dashboard/shipments",
    },
  ];

  const bottomItems = [
    { name: "Settings", icon: Settings },
    { name: "Support", icon: HelpCircle },
  ];

  const pathname = usePathname();
  return (
    <div className="h-full bg-[#031525] text-slate-400 p-4 flex flex-col justify-between relative select-none">
      <div className="space-y-8">
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : "px-2"}`}
        >
          <div className="bg-[#FF7A30] p-2 rounded-lg text-white shrink-0">
            <Truck size={24} />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200 hidden lg:block">
              <h2 className="text-white font-bold text-base leading-tight">
                Logistics Core
              </h2>
              <p className="text-xs text-slate-500">Fleet Management</p>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link href={item.href} key={index}>
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all
                  ${
                    active
                      ? "bg-[#FF7A30] text-white"
                      : "hover:bg-slate-800/50 hover:text-slate-200"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && <span className="hidden lg:block">{item.name}</span>}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-6">
        <button
          className={`w-full bg-[#FF7A30] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-[#e06626] transition-colors
            ${isCollapsed ? "p-3" : "py-3 px-4"}`}
        >
          <Plus size={18} className="shrink-0" />
          {!isCollapsed && <span className="hidden lg:block">New Shipment</span>}
        </button>

        <div className="border-t border-slate-800 pt-4 space-y-1">
          {bottomItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-slate-200 transition-all
                  ${isCollapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && <span className="hidden lg:block">{item.name}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-5 -right-3 bg-[#FF7A30] text-white rounded-full p-1 border-2 border-[#031525] hover:scale-105 transition-transform hidden md:block"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );
}
