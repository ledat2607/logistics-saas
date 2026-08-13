"use client";

import { authClient } from "@/lib/auth-clients";
import SidebarDashboard from "../../components/dashboard-component/sidebar";
import { useState } from "react";
import HeaderDashboard from "@/components/dashboard-component/header-dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  if (isPending)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!session) return <div>Bạn chưa đăng nhập</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`h-full bg-[#031525] border-r z-50 transition-all duration-300 ease-in-out shrink-0 fixed top-0 left-0 ${isCollapsed ? "-translate-x-full md:translate-x-0 w-20" : "translate-x-0 lg:w-64 w-20"} md:static md:z-20 ${isCollapsed ? "md:w-20" : "md:w-64"}
  `}
      >
        <SidebarDashboard
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <HeaderDashboard
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
