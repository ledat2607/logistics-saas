"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserCheck, Loader2, UserX } from "lucide-react";
import { toast } from "sonner";
import { fleetService } from "@/services/fleet.services";

interface Driver {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface AddDriversProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleId: string | null;
  currentDriverId?: string | null;
  onSuccess?: () => void;
}

const AddDrivers = ({
  open,
  setOpen,
  vehicleId,
  currentDriverId,
  onSuccess,
}: AddDriversProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  console.log(currentDriverId);

  useEffect(() => {
    if (open) {
      fetchDrivers();
    }
  }, [open]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      if (!vehicleId) return;

      const resData = await fleetService.getDrivers();

      setDrivers(resData.data || []);
    } catch (error: any) {
      console.error("Lỗi fetch drivers:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async (driverId: string | null) => {
    if (!vehicleId) return;

    try {
      setSubmittingId(driverId ?? "unassign");

      const result = await fleetService.assignDriver({
        vehicleId,
        driverId: driverId ?? "",
      });

      toast.success(result.message || "Cập nhật tài xế thành công!");
      onSuccess?.();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-120 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Phân công tài xế
          </DialogTitle>
          <DialogDescription>
            Chọn tài xế phụ trách cho phương tiện này.
          </DialogDescription>
        </DialogHeader>

        {/* Ô Tìm kiếm */}
        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Tìm theo tên hoặc email tài xế..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-zinc-700 text-zinc-100 focus:border-orange-500 placeholder:text-zinc-500"
          />
        </div>

        {/* Bỏ phân công nếu đang có driver */}
        {currentDriverId && (
          <div className="flex justify-between items-center p-3 rounded-lg border border-red-900/50 mb-2">
            <span className="text-sm text-red-300 font-medium">
              Bỏ phân công tài xế hiện tại
            </span>
            <Button
              size="sm"
              variant="destructive"
              disabled={submittingId === "unassign"}
              onClick={() => handleAssignDriver(null)}
              className="bg-red-600 hover:bg-red-700 h-8"
            >
              {submittingId === "unassign" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-1" /> Hủy phân công
                </>
              )}
            </Button>
          </div>
        )}

        {/* Danh sách Driver */}
        <div className="max-h-150 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8 text-zinc-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Đang tải danh
              sách...
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Không tìm thấy tài xế phù hợp
            </div>
          ) : (
            filteredDrivers.map((driver) => {
              const isSelected = driver.id === currentDriverId;
              const isSubmitting = submittingId === driver.id;

              return (
                <div
                  key={driver.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isSelected
                      ? " border-orange-500/50"
                      : "hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 border border-zinc-700">
                      <AvatarImage src={driver?.image || ""} />
                      <AvatarFallback className="bg-zinc-800 font-medium">
                        {driver.name
                          ? driver.name.substring(0, 2).toUpperCase()
                          : "TX"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {driver.name || "Tài xế chưa đặt tên"}
                      </p>
                      <p className="text-xs text-zinc-500">{driver.email}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={isSelected || isSubmitting}
                    onClick={() => handleAssignDriver(driver.id)}
                    className={
                      isSelected
                        ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/30 cursor-default"
                        : "bg-orange-600 hover:bg-orange-500 text-white"
                    }
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isSelected ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" /> Đang chọn
                      </>
                    ) : (
                      "Phân công"
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDrivers;
