import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maintenanceService } from "@/services/maintaince.services";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format-currency";
import { BadgeAlert, Calendar, DollarSign, FileText, MapPin, Truck, User, Wrench } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface MaintenanceSchedule {
  id: string;
  originalId: string;
  title: string;
  eventType: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  startDate: string;
  endDate: string;
  details?: {
    cost?: string | number;
    description?: string;
    garageLocation?: string;
    nextDueDate?: string;
  };
  driver?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  } | null;
  vehicle?: {
    id: string;
    brand?: string;
    licensePlate?: string;
    model?: string;
    status?: string;
  } | null;
}

interface MaintainceUpdateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: MaintenanceSchedule | null;
  onSuccess?: () => void;
}

const MaintainceUpdate = ({
  open,
  setOpen,
  data,
  onSuccess,
}: MaintainceUpdateProps) => {
  const [formData, setFormData] = useState<Partial<MaintenanceSchedule>>({});

  const formatDateForInput = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split("T")[0];
  };

  const stripHtml = (html?: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
        details: {
          ...data.details,
          description: stripHtml(data.details?.description),
          nextDueDate: formatDateForInput(data.details?.nextDueDate),
        },
      });
    }
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.originalId) {
      toast.error("Không tìm thấy ID bản ghi bảo dưỡng!");
      return;
    }

    try {
      const result = await maintenanceService.updateMaintaince(
        formData.originalId,
        formData as any,
      );

      toast.success(result.message || "Cập nhật thành công!");
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật!");
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-5 pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <Wrench className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Cập nhật thông tin bảo dưỡng
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Chỉnh sửa trạng thái, chi phí và lịch trình bảo dưỡng phương
                tiện.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* CARDS: THÔNG TIN PHƯƠNG TIỆN & TÀI XẾ (READ-ONLY) */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Truck className="size-3.5 text-slate-500" /> Phương tiện:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {data.vehicle?.brand} {data.vehicle?.model}{" "}
                <span className="text-primary font-mono ml-1">
                  ({data.vehicle?.licensePlate})
                </span>
              </span>
            </div>
            {data.driver && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <User className="size-3.5 text-slate-500" /> Tài xế phụ trách:
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {data.driver.name}{" "}
                  {data.driver.email && (
                    <span className="text-muted-foreground text-[11px]">
                      ({data.driver.email})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium">
                Tiêu đề bảo dưỡng
              </Label>
              <Input
                id="title"
                name="title"
                disabled
                value={formData.title || ""}
                onChange={handleInputChange}
                className="h-9 text-xs bg-slate-100/70 dark:bg-slate-800/50 font-medium cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="status"
                className="text-xs font-medium flex items-center gap-1"
              >
                <BadgeAlert className="size-3 text-amber-500" /> Trạng thái
              </Label>
              <Select
                value={formData.status || ""}
                onValueChange={(val: string | null) => {
                  if (val) {
                    setFormData((prev: any) => ({
                      ...prev,
                      status: val,
                    }));
                  }
                }}
              >
                <SelectTrigger id="status" className="h-9 text-xs">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PROGRESS" className="text-xs">
                    🟡 Đang tiến hành
                  </SelectItem>
                  <SelectItem value="COMPLETED" className="text-xs">
                    🟢 Hoàn thành
                  </SelectItem>
                  <SelectItem value="CANCELLED" className="text-xs">
                    🔴 Đã hủy
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label
                htmlFor="cost"
                className="text-xs font-medium flex items-center gap-1"
              >
                <DollarSign className="size-3 text-emerald-600" /> Chi phí thực
                tế
              </Label>
              <div className="relative">
                <Input
                  id="cost"
                  name="cost"
                  type="text"
                  value={formatCurrency(formData.details?.cost) || ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setFormData((prev: any) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        cost: rawValue ? Number(rawValue) : "",
                      },
                    }));
                  }}
                  placeholder="0"
                  className="h-9 text-xs pr-12 font-mono"
                />
                <span className="absolute right-3 top-2 text-[11px] font-semibold text-muted-foreground select-none">
                  VNĐ
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="garageLocation"
                className="text-xs font-medium flex items-center gap-1"
              >
                <MapPin className="size-3 text-rose-500" /> Địa điểm Garage
              </Label>
              <Input
                id="garageLocation"
                name="garageLocation"
                value={formData.details?.garageLocation || ""}
                onChange={handleDetailsChange}
                placeholder="Tên garage hoặc địa chỉ..."
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label
                htmlFor="startDate"
                className="text-xs font-medium flex items-center gap-1"
              >
                <Calendar className="size-3 text-blue-500" /> Ngày bắt đầu
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={handleInputChange}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="endDate"
                className="text-xs font-medium flex items-center gap-1"
              >
                <Calendar className="size-3 text-blue-500" /> Ngày kết thúc
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-medium flex items-center gap-1"
            >
              <FileText className="size-3" /> Ghi chú & Chi tiết hạng mục
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.details?.description || ""}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev: any) => ({
                  ...prev,
                  description: val,
                  details: {
                    ...prev.details,
                    description: val,
                  },
                }));
              }}
              placeholder="Nhập mô tả các hạng mục đã thay thế, sửa chữa..."
              className="min-h-13.5 text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 -mx-5 -mb-5 p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm">
              Lưu cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintainceUpdate;
