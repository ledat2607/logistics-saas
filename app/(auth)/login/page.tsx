"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Controller, useForm } from "react-hook-form";

import { loginSchema } from "@/lib/schemas";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Key,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { authClient } from "@/lib/auth-clients";
import { authService } from "@/services/auth.services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [view, setView] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      // Gọi thẳng client của Better-Auth để nó tự xử lý ghi Cookie lên trình duyệt
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Lỗi đăng nhập:", error.message);
        return;
      }

      console.log("Đăng nhập thành công:", data);

      // Refresh để middleware nhận cookie mới và chuyển hướng
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      console.error("Lỗi hệ thống:", err);
    }
  };
  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard", // Chuyển hướng về trang này sau khi đăng nhập thành công
    });
  };

  return (
    <Card className="space-y-6 rounded-md">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold">Welcome Back</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Please enter your credentials to access mission control.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form id="sign-in-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    <User className="w-4 h-4" />
                    Email
                  </FieldLabel>
                  <div className="relative flex items-center w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />

                    <Input
                      {...field}
                      placeholder="email@example.com"
                      className="rounded-md pl-10 pr-4 bg-zinc-50 border-zinc-200 focus-visible:ring-orange-500"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Password
                    </span>
                    <Link
                      href={"/forgot-password"}
                      className="text-amber-600 cursor-pointer font-bold text-xs"
                    >
                      Forgot password ?
                    </Link>
                  </FieldLabel>
                  <div className="relative flex items-center w-full">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />

                    <Input
                      {...field}
                      type={view ? "text" : "password"}
                      placeholder="**********"
                      autoComplete="off"
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
          </FieldGroup>
          <div className="flex items-center gap-4 mt-3">
            <Checkbox />
            Remeber this device in 30 days
          </div>

          <Button className="w-full py-6 mt-6" type="submit">
            Sign in to Dashboard <ArrowRight />
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          <span className="relative z-10 bg-white dark:bg-zinc-900 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Or continue with
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            className="py-6"
            size={"lg"}
            variant={"outline"}
          >
            {loadingGoogle ? "Đang kết nối..." : "Google"}
          </Button>
          <Button className="py-6" size={"lg"} variant={"outline"}>
            SSO
          </Button>
        </div>
        <CardFooter className="text-center">
          <span className="flex gap-3 items-center font-bold justify-center w-full">
            Don't have account ?{" "}
            <Link href={"/sign-up"}>
              <p className="text-amber-600 text-sm hover:underline">Sign up</p>
            </Link>
          </span>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
