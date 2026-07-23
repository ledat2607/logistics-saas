"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle2Icon,
  InfoIcon,
  AlertTriangleIcon,
  XCircleIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right" // Đưa lên góc trên bên phải cho dễ chú ý
      richColors // Bật hiệu ứng màu sắc tương ứng với trạng thái
      closeButton // Bật nút X tắt nhanh
      expand={true} // Di chuột vào sẽ mở rộng danh sách toast
      icons={{
        success: <CheckCircle2Icon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-sky-500" />,
        warning: <AlertTriangleIcon className="size-4 text-amber-500" />,
        error: <XCircleIcon className="size-4 text-rose-500" />,
        loading: <Loader2Icon className="size-4 text-primary animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl p-4 text-xs font-medium backdrop-blur-md",
          description:
            "group-[.toast]:text-muted-foreground text-[11px] mt-0.5",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs font-semibold rounded-lg px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs rounded-lg px-3 py-1.5",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:text-foreground transition-all",
          success:
            "group-[.toaster]:border-emerald-500/30 group-[.toaster]:bg-emerald-500/5 dark:group-[.toaster]:bg-emerald-950/20",
          error:
            "group-[.toaster]:border-rose-500/30 group-[.toaster]:bg-rose-500/5 dark:group-[.toaster]:bg-rose-950/20",
          warning:
            "group-[.toaster]:border-amber-500/30 group-[.toaster]:bg-amber-500/5 dark:group-[.toaster]:bg-amber-950/20",
          info: "group-[.toaster]:border-sky-500/30 group-[.toaster]:bg-sky-500/5 dark:group-[.toaster]:bg-sky-950/20",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
