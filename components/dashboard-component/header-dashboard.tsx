import { authClient } from "@/lib/auth-clients";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { LogOut, Search, Menu, Loader } from "lucide-react"; // Import thêm Menu icon
import { Badge } from "../ui/badge";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface HeaderDashboardProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const HeaderDashboard = ({
  isCollapsed,
  setIsCollapsed,
}: HeaderDashboardProps) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(!loading);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/login"),
        },
      });
      setLoading(true);
      toast.success("Đăng xuất thành công");
    } catch (error: any) {
      console.error("Lỗi hệ thống:", error);
      toast.error("Đã xảy ra lỗi hệ thống!");
    }
  };

  return (
    <header className="h-16 border-b dark:bg-background/20 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden shrink-0"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center relative min-w-45 sm:min-w-65">
          <Search className="w-4 h-4 absolute top-2.5 left-3 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
          />
        </div>
      </div>

      {/* Khối bên phải: Mode Toggle & Profile & Sign Out */}
      <div className="flex items-center gap-3">
        <ModeToggle />
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-100 truncate max-w-37.5">
              {session?.user?.name || "Người dùng"}
            </p>
          </div>

          <Button
            title="Đăng xuất hệ thống"
            variant={"default"}
            onClick={handleSignOut}
            className="px-3 py-1.5 text-xs font-medium hover:text-white transition-colors"
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
