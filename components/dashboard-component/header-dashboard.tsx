import { authClient } from "@/lib/auth-clients";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { LogOut, Search } from "lucide-react";
import { Badge } from "../ui/badge";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

const HeaderDashboard = () => {
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
    <header className="h-16 border-b dark:bg-background/20 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center relative">
        <Search className="w-4 h-4 absolute top-2 left-3" />
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
        />
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
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
