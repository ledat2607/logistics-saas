import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatToDatetimeLocal } from "@/lib/format";
import { ScheduleEvent } from "@/lib/types/schedule-type";
import {
  tripFormSchema,
  TripFormValues,
} from "@/lib/validations/trip-validations";
import { scheduleService } from "@/services/schedule.services";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  PlusCircle,
  Sparkles,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export interface VehicleOption {
  id: string;
  label: string;
  defaultDriverId?: string | null;
}

export interface DriverOption {
  id: string;
  name: string;
}

interface CreateTripDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicles?: VehicleOption[];
  drivers?: DriverOption[];
  onSubmitSuccess?: (data: TripFormValues) => void;
  refetch: () => void;
  editData?: ScheduleEvent;
}

const statusOptions = [
  { value: "PLANNED", label: "Đang lên kế hoạch" },
  { value: "IN_PROGRESS", label: "Đang thực hiện" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "DELAYED", label: "Đang trì hoãn" },
];

const CreateTripDialog = ({
  open,
  refetch,
  setOpen,
  vehicles = [],
  drivers = [],
  editData,
}: CreateTripDialogProps) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema as any),
    defaultValues: {
      tripCode: "",
      vehicleId: "",
      driverId: "",
      startLocation: "",
      endLocation: "",
      estimatedStartTime: "",
      estimatedEndTime: "",
      status: "PLANNED",
      notes: "",
      originalId: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        const matchedVehicle = vehicles.find(
          (v) => v.id === editData.vehicle?.id,
        );
        const matchedDriver = drivers.find((d) => d.id === editData.driver?.id);

        reset({
          tripCode: editData.details?.tripCode || "",
          vehicleId: matchedVehicle
            ? matchedVehicle.id
            : editData.vehicle?.id || "",
          driverId: matchedDriver
            ? matchedDriver.id
            : editData.driver?.id || "",
          startLocation: editData.details?.startLocation || "",
          endLocation: editData.details?.endLocation || "",
          estimatedStartTime: formatToDatetimeLocal(editData.startDate),
          estimatedEndTime: formatToDatetimeLocal(editData.endDate),
          status: (editData.status as TripFormValues["status"]) || "PLANNED",
          notes: editData.details?.notes || "",
          originalId: editData.originalId || "",
        });
      } else {
        reset({
          tripCode: "",
          vehicleId: "",
          driverId: "",
          startLocation: "",
          endLocation: "",
          estimatedStartTime: "",
          estimatedEndTime: "",
          status: "PLANNED",
          notes: "",
          originalId: "",
        });
      }
    }
  }, [editData, open, vehicles, drivers, reset]);

  // Xử lý khi người dùng chọn xe
  const handleSelectVehicle = (selectedVehicleId: string) => {
    setValue("vehicleId", selectedVehicleId, { shouldValidate: true });

    // Tự gợi ý tài xế mặc định của xe (nếu có)
    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (selectedVehicle?.defaultDriverId) {
      setValue("driverId", selectedVehicle.defaultDriverId, {
        shouldValidate: true,
      });
    }
  };

  const generateTripCode = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TRIP-${dateStr}-${randomStr}`;
  };

  const onSubmit = async (data: TripFormValues) => {
    try {
      setLoading(true);
      await scheduleService.createSchedule(data);
      toast.success("Tạo chuyến đi mới thành công!");
      setOpen(false);
      reset();
      refetch();
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      toast.error(error.message || "Tạo lịch trình thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrip = async (id: string, data: TripFormValues) => {
    try {
      setLoading(true);
      await scheduleService.updateSchedule(id, data);
      toast.success("Cập nhật chuyến đi thành công!");
      setOpen(false);
      reset();
      refetch();
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      toast.error(error.message || "Cập nhật lịch trình thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const targetId = editData?.originalId;

  const onSave = async (tripValues: TripFormValues) => {
    if (targetId && editData) {
      await handleUpdateTrip(targetId, tripValues);
    } else {
      await onSubmit(tripValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary">
            <div className="p-2 bg-primary/10 rounded-lg">
              {editData ? (
                <Pencil className="size-5 text-primary" />
              ) : (
                <PlusCircle className="size-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {editData
                  ? "Cập nhật thông tin lịch trình"
                  : "Tạo chuyến đi mới"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Điền thông tin chi tiết để điều xe và lên lịch trình chuyến đi.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSave, (errors) =>
            console.log("Lỗi validation:", errors),
          )}
          className="p-6 space-y-5"
        >
          {/* PHẦN 1: XE & TÀI XẾ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Truck className="size-3.5" /> Thông tin xe & Tài xế
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 1. XE PHÂN CÔNG */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Xe phân công *</label>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => {
                    // Tìm xe được chọn dựa trên ID
                    const selectedVehicle = vehicles.find(
                      (v) => String(v.id) === String(field.value),
                    );

                    return (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          // Tự động chọn tài xế mặc định nếu xe đó có gán tài xế
                          const vObj = vehicles.find(
                            (item) => String(item.id) === String(val),
                          );
                          if (vObj?.defaultDriverId) {
                            setValue("driverId", vObj.defaultDriverId);
                          }
                        }}
                        value={field.value ? String(field.value) : ""}
                      >
                        <SelectTrigger className="h-9">
                          {/* 💡 HIỂN THỊ TRỰC TIẾP BIỂN SỐ XE */}
                          <SelectValue placeholder="Chọn xe">
                            {selectedVehicle
                              ? selectedVehicle.label
                              : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={String(v.id)}>
                              {v.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>

              {/* 2. TÀI XẾ PHỤ TRÁCH */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tài xế phụ trách</label>
                <Controller
                  name="driverId"
                  control={control}
                  render={({ field }) => {
                    // Tìm tài xế được chọn dựa trên ID
                    const selectedDriver = drivers.find(
                      (d) => String(d.id) === String(field.value),
                    );

                    return (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? String(field.value) : ""}
                      >
                        <SelectTrigger className="h-9">
                          {/* 💡 HIỂN THỊ TRỰC TIẾP TÊN TÀI XẾ */}
                          <SelectValue placeholder="Chọn tài xế">
                            {selectedDriver ? selectedDriver.name : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
            </div>

            {/* Mã chuyến đi */}
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="tripCode" className="text-xs font-medium">
                Mã chuyến đi
              </Label>
              <Controller
                name="tripCode"
                control={control}
                render={({ field }) => (
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      id="tripCode"
                      placeholder="Nhập hoặc tạo tự động..."
                      className="pr-24 h-9 font-mono text-xs"
                      disabled={!!editData?.details?.tripCode}
                    />
                    {!editData && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute right-1 h-7 text-xs gap-1 px-2 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                        onClick={() =>
                          setValue("tripCode", generateTripCode(), {
                            shouldValidate: true,
                          })
                        }
                      >
                        <Sparkles className="size-3.5 text-amber-500" />
                        Tạo mã
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* PHẦN 2: LỘ TRÌNH */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5" /> Lộ trình di chuyển
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="startLocation" className="text-xs font-medium">
                  Điểm xuất phát <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="startLocation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="startLocation"
                      placeholder="Kho / Địa điểm đi..."
                      className="h-9"
                    />
                  )}
                />
                {errors.startLocation && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.startLocation.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endLocation" className="text-xs font-medium">
                  Điểm đến <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="endLocation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="endLocation"
                      placeholder="Địa chỉ giao hàng..."
                      className="h-9"
                    />
                  )}
                />
                {errors.endLocation && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.endLocation.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* PHẦN 3: THỜI GIAN & GHI CHÚ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5" /> Thời gian & Ghi chú
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="estimatedStartTime"
                  className="text-xs font-medium"
                >
                  Khởi hành dự kiến <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="estimatedStartTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="estimatedStartTime"
                      type="datetime-local"
                      className="h-9 text-xs"
                    />
                  )}
                />
                {errors.estimatedStartTime && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.estimatedStartTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="estimatedEndTime"
                  className="text-xs font-medium"
                >
                  Đến dự kiến
                </Label>
                <Controller
                  name="estimatedEndTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="estimatedEndTime"
                      type="datetime-local"
                      className="h-9 text-xs"
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label
                htmlFor="notes"
                className="text-xs font-medium flex items-center gap-1"
              >
                <FileText className="size-3" /> Ghi chú thêm
              </Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="notes"
                    placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
                    className="min-h-17.5 resize-none text-xs"
                  />
                )}
              />
            </div>
          </div>

          {/* TRẠNG THÁI */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5" /> Trạng thái chuyến đi
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-medium">
                Trạng thái <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "PLANNED"}
                  >
                    <SelectTrigger id="status" className="h-9">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-xs font-medium text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* FOOTER NÚT BẤM */}
          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 -mx-6 -mb-6 p-4 bg-slate-50/50 dark:bg-slate-900/50">
            {!editData && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => reset()}
              >
                Xóa dữ liệu
              </Button>
            )}
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editData ? "Đang cập nhật..." : "Đang tạo..."}
                </>
              ) : (
                <>{editData ? "Cập nhật chuyến đi" : "Tạo chuyến đi mới"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripDialog;
