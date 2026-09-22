"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

import { ROLE, signUpSchema } from "@/lib/schemas";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  User,
  Building2,
  Mail,
  Lock,
  RotateCcw,
  ShieldCheck,
  Route,
  Truck,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.services";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [view, setView] = useState(false);
  const [confirm, setComfirm] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      role: ROLE.MANAGER,
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      licenseNumber: "",
      fleetSize: "",
    },
  });

  const currentRole = form.watch("role");

  const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result = await authService.register(values);
      toast.success((result?.response?.message as any) || "Đăng ký thành công");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto p-6 space-y-6 rounded-xl border border-zinc-200 bg-white shadow-sm">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-3xl font-extrabold">Get Started</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Create your mission control account to begin operations.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-0">
        <form
          id="sign-up-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            {/* FULL NAME */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-zinc-700">
                      Full Name
                    </FieldLabel>
                    <div className="relative flex items-center w-full">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                      <Input
                        {...field}
                        placeholder="John Doe"
                        autoComplete="off"
                        className="rounded-md pl-10 pr-4 bg-zinc-50 border-zinc-200 focus-visible:ring-orange-500"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* COMPANY NAME */}
              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-zinc-700">
                      Company Name
                    </FieldLabel>
                    <div className="relative flex items-center w-full">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                      <Input
                        {...field}
                        placeholder="Logistics Corp."
                        autoComplete="off"
                        className="rounded-md pl-10 pr-4 bg-zinc-50 border-zinc-200 focus-visible:ring-orange-500"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* WORK EMAIL */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="text-xs font-semibold text-zinc-700">
                    Work Email
                  </FieldLabel>
                  <div className="relative flex items-center w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="j.doe@company.com"
                      autoComplete="off"
                      className="rounded-md pl-10 pr-4 bg-zinc-50 border-zinc-200 focus-visible:ring-orange-500"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* USER ROLE (CUSTOM RADIO GROUP TAB) */}
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-semibold text-zinc-700">
                    User Role
                  </FieldLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-2 w-full"
                  >
                    {/* Fleet Manager */}
                    <label
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer text-center space-y-1 transition-all ${field.value === ROLE.MANAGER ? "border-orange-500 bg-orange-50 text-orange-600" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
                    >
                      <RadioGroupItem
                        value={ROLE.MANAGER}
                        className="sr-only"
                      />
                      <ShieldCheck className="size-4" />
                      <span className="text-[11px] font-bold leading-none">
                        Fleet Manager
                      </span>
                    </label>

                    {/* Dispatcher */}
                    <label
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer text-center space-y-1 transition-all ${field.value === ROLE.DISPATCHER ? "border-orange-500 bg-orange-50 text-orange-600" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
                    >
                      <RadioGroupItem
                        value={ROLE.DISPATCHER}
                        className="sr-only"
                      />
                      <Route className="size-4" />
                      <span className="text-[11px] font-bold leading-none">
                        Dispatcher
                      </span>
                    </label>

                    {/* Driver */}
                    <label
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer text-center space-y-1 transition-all ${field.value === ROLE.DRIVER ? "border-orange-500 bg-orange-50 text-orange-600" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
                    >
                      <RadioGroupItem value={ROLE.DRIVER} className="sr-only" />
                      <Truck className="size-4" />
                      <span className="text-[11px] font-bold leading-none">
                        Driver
                      </span>
                    </label>
                  </RadioGroup>
                </Field>
              )}
            />

            {/* FORM ĐỘNG HIỂN THỊ THEO ROLE */}
            {currentRole === ROLE.DRIVER && (
              <Controller
                name="licenseNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="animate-in fade-in-50 duration-200">
                    <FieldLabel className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Driver License
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="Driver License Number"
                      className="bg-zinc-50 border-zinc-200 text-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {currentRole === ROLE.MANAGER && (
              <Controller
                name="fleetSize"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="animate-in fade-in-50 duration-200">
                    <FieldLabel className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Fleet Details
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="Estimated Fleet Size"
                      className="bg-zinc-50 border-zinc-200 text-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* PASSWORD & CONFIRM PASSWORD CHIA 2 CỘT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              {/* PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-zinc-700">
                      Password
                    </FieldLabel>
                    <div className="relative flex items-center w-full">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                      <Input
                        {...field}
                        type={view ? "text" : "password"}
                        placeholder="••••••••"
                        className="rounded-md pl-10 pr-4 bg-zinc-50 border-zinc-200 focus-visible:ring-orange-500"
                      />
                      {view ? (
                        <Button
                          variant={"ghost"}
                          onClick={() => setView(!view)}
                          className={
                            "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400"
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant={"ghost"}
                          onClick={() => setView(!view)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-zinc-700">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative flex items-center w-full">
                      <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                      <Input
                        {...field}
                        type={confirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="rounded-md pl-10 pr-4 bg-zinc-50 border-zinc-200 focus-visible:ring-orange-500"
                      />
                      {confirm ? (
                        <Button
                          variant={"ghost"}
                          onClick={() => setComfirm(!confirm)}
                          className={
                            "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400"
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant={"ghost"}
                          onClick={() => setComfirm(!confirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {/* CHECKBOX TERMS */}
          <Controller
            name="acceptTerms"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-2 space-y-0 pt-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="terms"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-xs text-zinc-500 font-medium cursor-pointer selection:bg-transparent"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-orange-600 font-semibold hover:underline"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-orange-600 font-semibold hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Button
            className="w-full py-6 bg-orange-500 hover:bg-orange-600 font-bold mt-2"
            type="submit"
          >
            Create Account →
          </Button>
        </form>

        {/* BOTTOM REDIRECT */}
        <CardFooter className="text-center pt-4 border-t border-zinc-100 flex flex-col gap-3">
          <span className="flex gap-2 items-center font-bold justify-center w-full text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:underline">
              Sign in
            </Link>
          </span>
          <div className="flex justify-center">
            <a
              href="#"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <HelpCircle className="size-3.5" />
              Contact Support
            </a>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
