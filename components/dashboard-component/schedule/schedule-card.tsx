import { TripCodeCopyButton } from "@/components/copy";
import { ScheduleEvent } from "@/lib/types/schedule-type";
import {
  ArrowRight,
  Calendar,
  Clock,

  FileText,
  MapPin,
  Truck,
} from "lucide-react";

interface ScheduleCardProps {
  data: ScheduleEvent;
}

const ScheduleCard = ({ data }: ScheduleCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return { time, dateFormatted: `${day} Tháng ${month}, ${year}` };
  };

  const start = formatDate(data.startDate);
  const end = formatDate(data.endDate);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden font-sans">
      {/* 1. Header: Status & Trip Code */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
            data.status,
          )}`}
        >
          {data.status}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span>{data.details.tripCode ?? "N/A"}</span>

          <TripCodeCopyButton tripCode={data.details.tripCode} />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 2. Route Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <span>{data.details.startLocation}</span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <span>{data.details.endLocation}</span>
          </div>
        </div>

        {/* 3. Assets Section (Vehicle & Driver) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Vehicle */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="p-2 bg-white rounded-md border border-slate-200 shadow-2xs">
              <Truck className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {data.vehicle.licensePlate}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {data.vehicle.brand} {data.vehicle.model}
              </p>
            </div>
          </div>

          {/* Driver */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            {data.driver?.image ? (
              <img
                src={data.driver.image}
                alt={data.driver.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-600 shrink-0 text-sm">
                {data.driver?.name?.charAt(0) ?? "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {data.driver?.name ?? "Chưa phân công"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {data.driver?.email ?? "--"}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Timing Section */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Thời gian dự kiến
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-900">
                {start.time}, {start.dateFormatted}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-900">
                {end.time}, {end.dateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Notes Section */}
        {data.details.notes && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <span>Ghi chú</span>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100">
              {data.details.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
