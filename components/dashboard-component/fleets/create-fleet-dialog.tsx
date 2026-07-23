import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVehicleSchema } from "@/lib/validations/fleet-validations";
import { getAllBrands, getModelsByBrandName } from "@/db/vehicle-brands";
import { fleetService } from "@/services/fleet.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Loader2, Rocket, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useState } from "react";

interface CreateFleetDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateFleetDialog = ({
  open,
  setOpen,
  onSuccess,
}: CreateFleetDialogProps) => {
  const router = useRouter();
  const brandList = getAllBrands();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof createVehicleSchema>>({
    resolver: zodResolver(createVehicleSchema) as any,
    defaultValues: {
      brand: "",
      licensePlate: "",
      model: "",
      year: 1999,
      capacityKg: "",
      fuelType: "DIESEL",
      status: "AVAILABLE",
    },
  });

  const selectedBrand = useWatch({
    control: form.control,
    name: "brand",
  });
  const availableModels = getModelsByBrandName(selectedBrand);

  async function onSubmit(data: z.infer<typeof createVehicleSchema>) {
    try {
      setLoading(true);

      const result = await fleetService.create(data as any);

      toast.success(result?.message || "Thêm mới thành công");

      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Lỗi khi đăng ký xe:", error);

      toast.error(error.message || "Thêm mới thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Create new fleets
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket
              className="w-4 h-4 shrink-0 text-orange-500"
              strokeWidth={2.5}
            />
            <span>Create a new fleet to get started with your trip.</span>
          </DialogDescription>
        </DialogHeader>
        {/*Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/*Brand */}
            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Vehicle brand</FieldLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("model", "");
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Chọn hãng xe (VD: Hyundai, Isuzu...)" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandList.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/*Model */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
              <Controller
                name="model"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-9">
                    <FieldLabel>Vehicle model</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={!selectedBrand || availableModels.length === 0}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue
                          placeholder={
                            !selectedBrand
                              ? "Vui lòng chọn hãng xe trước"
                              : "Chọn dòng / mẫu xe"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-3">
                    <FieldLabel>Vehicle year</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="ex:199x,...."
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
              <Controller
                name="licensePlate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-7">
                    <FieldLabel>Vehicle license plate</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="ex:29H-123.45,...."
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="capacityKg"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-5">
                    <FieldLabel>Vehicle weight (kg)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="ex:1.000,...."
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
              <Controller
                name="fuelType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-7">
                    <FieldLabel>Vehicle license plate</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={!selectedBrand || availableModels.length === 0}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Vui lòng chọn loại nhiên liệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PETROL">Xăng (Petrol)</SelectItem>
                        <SelectItem value="DIESEL">Dầu Diesel</SelectItem>
                        <SelectItem value="ELECTRIC">
                          Điện (Electric)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-5">
                    <FieldLabel>Vehicle weight (tons)</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={!selectedBrand || availableModels.length === 0}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Vui lòng chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                        <SelectItem value="IN_TRANSIT">IN TRANSIT</SelectItem>
                        <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              <Button
                type="submit"
                className="lg:col-span-8"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>
              <Button className="lg:col-span-4" onClick={() => form.reset()}>
                <Delete className="mr-2 w-4 h-4" />
                Clear
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFleetDialog;
