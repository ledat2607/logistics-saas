import { authClient } from "@/lib/auth-clients";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { LogOut, Search, Menu } from "lucide-react"; // Import thêm Menu icon
import { Badge } from "../ui/badge";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

interface HeaderDashboardProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const HeaderDashboard = ({
  isCollapsed,
  setIsCollapsed,
}: HeaderDashboardProps) => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });
  };

  return (
    <header className="h-16 border-b dark:bg-background/20 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Khối bên trái: Nút Hamburger trên Mobile & Thanh Tìm Kiếm */}
      <div className="flex items-center gap-3">
        {/* Nút Hamburger Icon - Bật/Tắt Sidebar (chỉ hiển thị trên Mobile) */}
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
        <div className="flex items-center relative min-w-[180px] sm:min-w-[260px]">
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
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-100 truncate max-w-[150px]">
              {session?.user?.name || "Người dùng"}
            </p>
          </div>

          <Button
            variant={"default"}
            onClick={handleSignOut}
            className="px-3 py-1.5 text-xs font-medium hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
