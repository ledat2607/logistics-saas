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
import { Delete, Loader2, Pencil, Rocket, Send } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useEffect, useState } from "react";
import {
  deleteImageFromFirebase,
  useUploadImage,
} from "@/hooks/useUploadImage";

interface CreateFleetDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  data?: any;
}

const CreateFleetDialog = ({
  open,
  setOpen,
  onSuccess,
  data,
}: CreateFleetDialogProps) => {
  const brandList = getAllBrands();
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploading, progress } = useUploadImage();

  const form = useForm<z.infer<typeof createVehicleSchema>>({
    resolver: zodResolver(createVehicleSchema) as any,
    defaultValues: {
      brand: data?.brand || "",
      licensePlate: data?.licensePlate || "",
      model: data?.model || "",
      year: data?.year || 1999,
      capacityKg: data?.capacityKg || "",
      fuelType: data?.fuelType || "DIESEL",
      status: data?.status || "AVAILABLE",
      image: data?.image || "",
    },
  });

  const selectedBrand = useWatch({
    control: form.control,
    name: "brand",
  });
  const availableModels = getModelsByBrandName(selectedBrand);

  useEffect(() => {
    if (open) {
      if (data) {
        form.reset({
          brand: data.brand || "",
          model: data.model || "",
          year: data.year || "",
          licensePlate: data.licensePlate || "",
          capacityKg: data.capacityKg || "",
          fuelType: data.fuelType || "",
          status: data.status || "",
          image: data.image || "",
        });
      } else {
        form.reset();
      }
    }
  }, [open, data, form]);

  async function onSubmit(formData: z.infer<typeof createVehicleSchema>) {
    try {
      setLoading(true);

      const oldImageUrl = data?.image;

      const payload = {
        ...formData,
        image: form.getValues("image") || "",
      };

      let result;
      if (data?.id) {
        result = await fleetService.update(data.id, payload as any);

        if (oldImageUrl && payload.image !== oldImageUrl) {
          deleteImageFromFirebase(oldImageUrl).catch((err) =>
            console.error("Lỗi khi xóa ảnh cũ trên Firebase:", err),
          );
        }

        toast.success(result?.message || "Cập nhật thông tin xe thành công");
      } else {
        result = await fleetService.create(payload as any);
        toast.success(result?.message || "Thêm mới xe thành công");
      }

      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Lỗi khi xử lý xe:", error);
      toast.error(error.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={"overscroll-y-auto"}>
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {data ? "Edit Fleet" : "Create Fleet"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket
              className="w-4 h-4 shrink-0 text-orange-500"
              strokeWidth={2.5}
            />
            <span>
              {data
                ? "Edit an existing fleet"
                : "Create a new fleet to get started with your trip."}
            </span>
          </DialogDescription>
        </DialogHeader>
        {/*Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/*image */}
            {data ? (
              <Controller
                name="image"
                control={form.control}
                render={({
                  field: { onChange, value, ref, name, onBlur },
                  fieldState,
                }) => {
                  const previewUrl =
                    typeof value === "string" && value.trim() !== ""
                      ? value
                      : null;

                  return (
                    <Field>
                      <FieldLabel htmlFor="vehicle-image-input">
                        Vehicle image
                      </FieldLabel>

                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors cursor-pointer relative flex flex-col items-center justify-center min-h-35">
                        {uploading ? (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="text-sm font-medium text-blue-600">
                              Đang tải ảnh lên Firebase... {progress}%
                            </div>
                            <div className="w-48 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : previewUrl ? (
                          <div className="relative w-full h-28 flex items-center justify-center">
                            <img
                              src={previewUrl}
                              alt="Vehicle preview"
                              className="object-contain max-h-28 w-full rounded"
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            <p className="font-medium">Nhấp để tải ảnh lên</p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, WEBP (Tối đa 5MB)
                            </p>
                          </div>
                        )}

                        <input
                          id="vehicle-image-input"
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                          ref={ref}
                          name={name}
                          onBlur={onBlur}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                // Chỉ tải ảnh mới lên và lưu URL vào Form State
                                const newUrl = await uploadImage(
                                  file,
                                  "vehicles",
                                );

                                // Đã BỎ dòng deleteImageFromFirebase ở đây
                                onChange(newUrl);
                                toast.success("Tải ảnh mới thành công!");
                              } catch (err) {
                                toast.error("Tải ảnh thất bại!");
                              } finally {
                                e.target.value = "";
                              }
                            }
                          }}
                        />
                      </div>

                      {value && value !== data?.image && (
                        <button
                          type="button"
                          className="text-xs text-red-500 underline mt-1 cursor-pointer"
                          onClick={() => onChange(data?.image || "")}
                        >
                          Khôi phục ảnh ban đầu
                        </button>
                      )}

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            ) : null}

            {/*Brand */}
            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Vehicle brand</FieldLabel>
                  <Select
                    disabled={data}
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
                      disabled={
                        !selectedBrand || availableModels.length === 0 || data
                      }
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
                      disabled={
                        !selectedBrand || availableModels.length === 0 || data
                      }
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
                    {data ? (
                      <>
                        <Pencil className="mr-2 w-4 h-4" />
                        Update Fleet
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Submit
                      </>
                    )}
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
