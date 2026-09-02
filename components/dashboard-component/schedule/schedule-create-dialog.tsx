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
  PlusCircle,
  Sparkles,
  Truck,
} from "lucide-react";
import { useState } from "react";
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
}

const CreateTripDialog = ({
  open,
  refetch,
  setOpen,
  vehicles = [],
  drivers = [],
}: CreateTripDialogProps) => {
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
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSelectVehicle = (selectedVehicleId: string) => {
    setValue("vehicleId", selectedVehicleId);

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
    setValue("driverId", selectedVehicle?.defaultDriverId || "");
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
      const result = await scheduleService.createSchedule(data);

      toast.success("Tạo chuyến đi mới thành công!");
      setOpen(false);
      reset();
      refetch();
      setLoading(false);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      toast.error(error.message || "Tạo lịch trình thất bại.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PlusCircle className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Tạo chuyến đi mới
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Điền thông tin chi tiết để điều xe và lên lịch trình chuyến đi.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Truck className="size-3.5" /> Thông tin xe & Tài xế
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="vehicleId" className="text-xs font-medium">
                  Xe phân công <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => {
                    const currentValue = field.value || "";
                    return (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleSelectVehicle(val || "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger id="vehicleId" className="h-9">
                          <SelectValue placeholder="Chọn xe">
                            {vehicles.find((d) => d.id === currentValue)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors.vehicleId && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>

              {/* Tài xế */}
              <div className="space-y-1.5">
                <Label htmlFor="driverId" className="text-xs font-medium">
                  Tài xế phụ trách
                </Label>
                <Controller
                  name="driverId"
                  control={control}
                  render={({ field }) => {
                    const currentValue = field.value || "";
                    return (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger id="driverId" className="h-9">
                          <SelectValue
                            placeholder="Chọn tài xế"
                            className={"w-full"}
                          >
                            {drivers.find((d) => d.id === currentValue)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
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
                    />
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
              {/* Điểm đi */}
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

              {/* Điểm đến */}
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

          {/* FOOTER NÚT BẤM */}
          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 -mx-6 -mb-6 p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => reset()}
            >
              Xóa dữ liệu
            </Button>
            <Button type="submit" size="sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
                </>
              ) : (
                "Tạo chuyến đi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripDialog;
