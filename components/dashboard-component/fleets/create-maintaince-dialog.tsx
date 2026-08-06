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
import { Textarea } from "@/components/ui/textarea";
import { FleetVehicle } from "@/lib/types/fleet-type";
import {
  MaintenanceFormValues,
  maintenanceSchema,
} from "@/lib/validations/fleet-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

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
  const form = useForm<z.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema) as any,
    defaultValues: {
      vehicleId: "",
      description: "",
      vehicleLicensePlate: "",
      cost: null,
      maintenanceDate: new Date(),
      nextDueDate: null,
    },
  });

  useEffect(() => {
    if (open && vehicle) {
      form.reset({
        vehicleId: vehicle.id,
        vehicleLicensePlate: vehicle.licensePlate,
        description: "",
        cost: null,
        maintenanceDate: new Date(),
        nextDueDate: null,
      });
    }
  }, [vehicle?.id, open, form]);

  const formatVehicleId = (id: string) => {
    if (!id) return "";
    const clean = id.replace(/-/g, "");
    if (clean.length < 11) return id;
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 11)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>Thêm mới dữ liệu bảo dưỡng</DialogTitle>
        </DialogHeader>
        <form>
          <FieldGroup>
            <div className="flex gap-4 items-center">
              <Controller
                name="vehicleId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-5">
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
                  <Field className="col-span-5">
                    <FieldLabel>Biển số xe</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
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
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="col-span-5">
                  <FieldLabel>Mô tả bảo dưỡng</FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    aria-describedby="description-error"
                    aria-invalid={fieldState.invalid}
                    rows={6}
                    className="rounded-lg"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintainceDialog;
