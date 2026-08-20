import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Cập nhật thông tin bảo dưỡng
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Thông tin phương tiện & tài xế (Read-only) */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phương tiện:</span>
              <span className="font-medium">
                {data.vehicle?.brand} {data.vehicle?.model} (
                {data.vehicle?.licensePlate})
              </span>
            </div>
            {data.driver && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tài xế phụ trách:</span>
                <span className="font-medium">
                  {data.driver.name}{" "}
                  {data.driver.email ? `(${data.driver.email})` : ""}
                </span>
              </div>
            )}
          </div>

          {/* Tiêu đề & Trạng thái */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                name="title"
                disabled
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status || ""}
                onValueChange={(val: string | null) => {
                  if (val) {
                    setFormData((prev) => ({
                      ...prev,
                      status: val as MaintenanceSchedule["status"],
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PROGRESS">Đang tiến hành</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chi phí & Địa điểm garage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cost">Chi phí (VNĐ)</Label>
              <Input
                id="cost"
                name="cost"
                type="text"
                value={formatCurrency(formData.details?.cost) || ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      cost: rawValue ? Number(rawValue) : "",
                    },
                  }));
                }}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="garageLocation">Địa điểm Garage</Label>
              <Input
                id="garageLocation"
                name="garageLocation"
                value={formData.details?.garageLocation || ""}
                onChange={handleDetailsChange}
                placeholder="Tên hoặc địa chỉ garage..."
              />
            </div>
          </div>

          {/* Ngày bắt đầu, Ngày kết thúc*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.details?.description || ""}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  description: val,
                  details: {
                    ...prev.details,
                    description: val,
                  },
                }));
              }}
              placeholder="Nhập mô tả bảo dưỡng..."
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu cập nhật</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintainceUpdate;
