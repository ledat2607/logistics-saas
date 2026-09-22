"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send, User } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    console.log(data);
  };

  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-justify font-bold text-xs">
          No worries! Enter the email address associated with your account and
          we'll send you a link to reset your password.
        </CardDescription>
        <CardContent className="p-0">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-zinc-700">
                      Email
                    </FieldLabel>
                    <div className="relative flex items-center w-full">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
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
            </FieldGroup>
            <div className="flex items-center justify-between">
              <Button type="submit">
                <Send className="w-4 h-4 mr-4" />
                Send verify
              </Button>
              <Link href="/login">
                <Button variant={"outline"}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default ForgotPassword;
