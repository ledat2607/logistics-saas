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
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isPending)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!session) return <div>Bạn chưa đăng nhập</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside
        className={`${isCollapsed ? "w-20 lg:w-64" : "lg:w-64 w-20"} transition-all duration-300 ease-in-out border-r h-full shrink-0 z-20`}
      >
        <SidebarDashboard
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <HeaderDashboard />

        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
