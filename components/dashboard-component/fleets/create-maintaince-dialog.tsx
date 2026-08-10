import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FleetVehicle } from "@/lib/types/fleet-type";
import { maintenanceSchema } from "@/lib/validations/fleet-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { CalendarIcon, LocationEditIcon, RefreshCw, Send } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { maintenanceService } from "@/services/maintaince.services";
import { toast } from "sonner";

interface CreateMaintainceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicle?: FleetVehicle | null;
  initialData?: z.infer<typeof maintenanceSchema> | null;
}
const CreateMaintainceDialog = ({
  open,
  setOpen,
  vehicle,
  initialData,
}: CreateMaintainceDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema) as any,
    defaultValues: {
      vehicleId: "",
      description: "",
      vehicleLicensePlate: "",
      cost: 0,
      maintenanceDate: new Date(),
      nextDueDate: null,
      garageLocation: "",
    },
  });

  useEffect(() => {
    if (open && vehicle) {
      form.reset({
        vehicleId: vehicle.id,
        vehicleLicensePlate: vehicle.licensePlate,
        description: "",
        cost: 0,
        maintenanceDate: new Date(),
        nextDueDate: null,
        garageLocation: "",
      });
    }
  }, [vehicle?.id, open, form]);

  const formatVehicleId = (id: string) => {
    if (!id) return "";
    const clean = id.replace(/-/g, "");
    if (clean.length < 11) return id;
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 11)}`.toUpperCase();
  };
  const handleSubmit = async (data: z.infer<typeof maintenanceSchema>) => {
    if (!data.vehicleId) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await maintenanceService.createMaintenanceRecord(data);

      toast.success(result.message || "Tạo bản ghi bảo dưỡng thành công!");

      // Reset form về trạng thái ban đầu
      form.reset({
        vehicleId: "",
        vehicleLicensePlate: "",
        description: "",
        cost: 0,
        maintenanceDate: new Date(),
        nextDueDate: null,
        garageLocation: "",
      });
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(
        error.message || "Không thể tạo bản ghi bảo dưỡng. Vui lòng thử lại!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm mới dữ liệu bảo dưỡng</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 overflow-y-auto p-1"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4 items-center">
              <Controller
                name="vehicleId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Vehicle ID</FieldLabel>
                    <Input
                      {...field}
                      value={formatVehicleId(field.value ?? "")}
                      disabled
                      aria-describedby="vehicleId-error"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="vehicleLicensePlate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Biển số xe</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled
                      aria-describedby="vehicleLicensePlate-error"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="col-span-5">
                  <FieldLabel>Mô tả bảo dưỡng</FieldLabel>
                  <div
                    className={`custom-quill-wrapper rounded-md border transition-colors ${
                      fieldState.invalid ? "border-red-500" : "border-input"
                    }`}
                  >
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={(content) => field.onChange(content)}
                      onBlur={field.onBlur}
                      placeholder="Nhập mô tả chi tiết bảo dưỡng..."
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["clean"],
                        ],
                      }}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex items-center gap-4 lg:flex-row flex-col">
              <Controller
                name="cost"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Chi phí</FieldLabel>
                    <Input
                      {...field}
                      value={formatCurrency(field?.value) ?? ""}
                      aria-describedby="vehicleLicensePlate-error"
                      placeholder="Nhập chi phí bảo dưỡng"
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        field.onChange(rawValue ? Number(rawValue) : "");
                      }}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />{" "}
              <Controller
                name="garageLocation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Địa điểm garage</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Chọn địa điểm garage"
                        aria-describedby="vehicleLicensePlate-error"
                        aria-invalid={fieldState.invalid}
                      />
                      <Button
                        variant="outline"
                        className={"absolute right-2 top-0.5 border-none"}
                        size="icon-sm"
                        onClick={() => {}}
                      >
                        <LocationEditIcon />
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="flex items-center gap-4 lg:flex-row flex-col w-full">
              {/* 1. Ngày bảo dưỡng */}
              <Controller
                name="maintenanceDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full lg:w-1/2">
                    <FieldLabel>Ngày bảo dưỡng</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        }
                      ></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="nextDueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full lg:w-1/2">
                    <FieldLabel>Ngày kết thúc bảo dưỡng</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        }
                      ></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const maintenanceDate =
                              form.watch("maintenanceDate");
                            return maintenanceDate
                              ? date <= maintenanceDate
                              : false;
                          }}
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <div className="space-x-5">
            <Button type="submit">
              <Send /> Gửi
            </Button>
            <Button
              variant="destructive"
              type="reset"
              onClick={() => form.reset()}
            >
              <RefreshCw /> Xóa dữ liệu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintainceDialog;
