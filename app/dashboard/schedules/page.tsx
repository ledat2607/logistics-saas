"use client";

import { MaintenanceCard } from "@/components/dashboard-component/schedule/maintaince-card";
import ScheduleCard from "@/components/dashboard-component/schedule/schedule-card";
import CreateTripDialog from "@/components/dashboard-component/schedule/schedule-create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFleets } from "@/hooks/use-fleet";
import { useSchedules } from "@/hooks/use-schedule";
import {
  CalendarDays,
  Clock,
  Filter,
  Inbox,
  Loader2,
  Plus,
  Search,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

const SchedulePage = () => {
  const { normalSchedules, maintenanceSchedules, loading, error, refetch } =
    useSchedules();
  const { fleets } = useFleets();

  const vehicleOptions = useMemo(() => {
    return (fleets || []).map((item) => ({
      id: item.vehicle.id,
      label: `${item.vehicle.licensePlate}`,
      defaultDriverId: item.driver?.id || null,
    }));
  }, [fleets]);

  // File: SchedulePage.tsx
  const driverOptions = useMemo(() => {
    return Array.from(
      new Map(
        (fleets || [])
          .filter((item) => item.driver !== null)
          .map((item) => {
            const driverId = item.driver.id || item.driver.userId;
            return [driverId, { id: driverId, name: item.driver.name }];
          }),
      ).values(),
    );
  }, [fleets]);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const filteredSchedules = useMemo(() => {
    return (normalSchedules || [])
      .filter((schedule) => {
        const matchTerm = schedule.details?.tripCode
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchStatus =
          selectedStatus === "ALL" || schedule.status === selectedStatus;

        return matchTerm && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (sortBy === "oldest")
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        if (sortBy === "name")
          return (a.title || a.name || "").localeCompare(
            b.title || b.name || "",
          );
        return 0;
      });
  }, [normalSchedules, searchTerm, selectedStatus, sortBy]);

  if (loading)
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Đang tải dữ liệu lịch trình...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium">
        Lỗi kết nối: {error}
      </div>
    );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản lý lịch trình
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi danh sách lịch trình vận hành và kế hoạch đăng kiểm, sửa
            chữa.
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground shadow-inner">
          <TabsTrigger
            value="schedule"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <CalendarDays className="size-4" />
            <span>Lịch trình</span>
            <Badge
              variant="secondary"
              className="px-1.5 py-0.5 text-xs font-mono"
            >
              {normalSchedules.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Wrench className="size-4" />
            <span>Đăng kiểm / Sửa chữa</span>
            <Badge
              variant="secondary"
              className="px-1.5 py-0.5 text-xs font-mono"
            >
              {maintenanceSchedules.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="schedule"
          className="space-y-4 focus-visible:outline-none"
        >
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-base font-semibold">
                Lịch trình vận hành
              </CardTitle>
              <CardDescription className="flex justify-between lg:flex-row flex-col">
                Tổng cộng có {normalSchedules.length} lịch trình đang hoạt động
                trong hệ thống.
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setOpen(true)}
                    className="shadow-sm gap-2"
                  >
                    <Plus className="size-4" />
                    <span>Tạo lịch trình</span>
                  </Button>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {normalSchedules.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Inbox className="size-8 opacity-40" />
                  <p className="text-sm">
                    Chưa có lịch trình nào được ghi nhận.
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-full bg-white rounded-xl border border-slate-400 overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-3 border">
                      {/* Search Input */}
                      <div className="relative flex-1 min-w-50">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Tìm kiếm lịch trình..."
                          className="w-full pl-9 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                      </div>

                      {/* Status Filter */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Filter className="size-4 text-slate-400" />
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-600 font-medium cursor-pointer"
                          >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PLANNED">Đã lên kế hoạch</option>
                            <option value="IN_PROGRESS">Đang tiến hành</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                            <option value="DELAYED">Bị trì hoãn</option>
                          </select>
                        </div>

                        {/* Sort By Time*/}
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Clock className="size-4 text-slate-400" />
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-600 font-medium cursor-pointer"
                          >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="name">Tên (A-Z)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {filteredSchedules.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                        {filteredSchedules.map((item) => (
                          <ScheduleCard
                            data={item}
                            key={item.id}
                            refetch={refetch}
                            vehicles={vehicleOptions}
                            drivers={driverOptions}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-slate-400">
                        Không tìm thấy lịch trình phù hợp.
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="focus-visible:outline-none">
          {maintenanceSchedules.length === 0 ? (
            <Card className="border-border/60 shadow-xs">
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Inbox className="size-8 opacity-40" />
                <p className="text-sm">
                  Không có dữ liệu đăng kiểm hoặc sửa chữa.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {maintenanceSchedules.map((item) => (
                <MaintenanceCard
                  key={item.id}
                  data={item}
                  onSuccess={refetch}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateTripDialog
        open={open}
        setOpen={setOpen}
        vehicles={vehicleOptions}
        drivers={driverOptions}
        refetch={refetch}
      />
    </div>
  );
};

export default SchedulePage;
