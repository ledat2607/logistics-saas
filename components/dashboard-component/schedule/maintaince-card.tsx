import React, { useState } from "react";
import parse from "html-react-parser";
import {
  Wrench,
  Calendar,
  Clock,
  Truck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreVertical,
  User,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { maintenanceService } from "@/services/maintaince.services";
import { toast } from "sonner";

export interface MaintenanceSchedule {
  id: string;
  originalId: string;
  title: string;
  eventType: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  startDate: string;
  endDate: string;
  details?: {
    description?: string;
  };
  driver?: {
    name?: string;
    avatar?: string;
  } | null;
  vehicle?: {
    id: string;
    licensePlate?: string;
    model?: string;
  } | null;
}

interface MaintenanceCardProps {
  data: MaintenanceSchedule;
  onEdit?: (id: string) => void;
  onSuccess?: () => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  data,
  onEdit,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200 gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200 gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5" /> Đang xử lý
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200 gap-1.5 font-medium">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-200 gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> Chờ xử lý
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "--/--/----";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const rawDescription =
    data.details?.description?.replace(/&nbsp;/g, " ") || "";

  const handleDeleteMaintaince = async (id: string) => {
    try {
      setIsDeleting(true);
      const result = await maintenanceService.deleteMaintaince(id);
      toast.success(result?.message || "Xóa phương tiện thành công");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Lỗi khi xóa xe:", error);
      toast.error(error.message || "Xóa phương tiện thất bại");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 relative ${
        isDeleting ? "opacity-60 pointer-events-none select-none" : ""
      }`}
    >
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200 gap-1"
            >
              <Wrench className="w-3 h-3" /> Bảo dưỡng
            </Badge>
            {getStatusBadge(data.status)}
          </div>
          <h3 className="font-semibold text-base leading-snug text-slate-900 line-clamp-2">
            {data.title}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                className="h-8 w-8 text-slate-500"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                ) : (
                  <MoreVertical className="w-4 h-4" />
                )}
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit?.(data.id)}
              disabled={isDeleting}
            >
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteMaintaince(data.originalId)}
              disabled={isDeleting}
              className="text-rose-600 focus:text-rose-600 flex items-center justify-between gap-2"
            >
              <span>Xóa lịch</span>
              {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3 pb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg text-xs font-medium">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {formatDate(data.startDate)} — {formatDate(data.endDate)}
          </span>
        </div>

        {data.vehicle && (
          <div className="flex items-center gap-2 text-slate-700">
            <Truck className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-900 dark:text-zinc-100">
              {data.vehicle.licensePlate || "Chưa có biển số"}
            </span>
            {data.vehicle.model && (
              <span className="text-slate-400 text-xs">
                ({data.vehicle.model})
              </span>
            )}
          </div>
        )}

        {rawDescription && (
          <div className="text-slate-600 bg-slate-50/50 dark:bg-zinc-200 p-3 rounded-lg border border-slate-100 text-xs line-clamp-3 prose prose-xs max-w-none">
            {parse(rawDescription)}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={data.driver?.avatar} alt={data.driver?.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600">
              <User className="w-3.5 h-3.5" />
            </AvatarFallback>
          </Avatar>
          <span>{data.driver?.name || "Chưa phân công tài xế"}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
