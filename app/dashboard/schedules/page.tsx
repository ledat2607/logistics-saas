"use client";

import { MaintenanceCard } from "@/components/dashboard-component/schedule/maintaince-card";
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
import { useSchedules } from "@/hooks/use-schedule";
import {
  CalendarDays,
  Clock,
  Loader2,
  Plus,
  Wrench,
  Inbox,
} from "lucide-react";

const SchedulePage = () => {
  const { normalSchedules, maintenanceSchedules, loading, error, refetch } =
    useSchedules();

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
  console.log(maintenanceSchedules);
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Page Header */}
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
        <div className="flex items-center gap-2">
          <Button className="shadow-sm gap-2">
            <Plus className="size-4" />
            <span>Tạo lịch trình</span>
          </Button>
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

        {/* Tab 1: Operational Schedule */}
        <TabsContent
          value="schedule"
          className="space-y-4 focus-visible:outline-none"
        >
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-base font-semibold">
                Lịch trình vận hành
              </CardTitle>
              <CardDescription>
                Tổng cộng có {normalSchedules.length} lịch trình đang hoạt động
                trong hệ thống.
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
                normalSchedules.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-foreground">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>Mã lịch: #{item.id}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="capitalize text-xs font-normal"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Maintenance Schedule */}
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
    </div>
  );
};

export default SchedulePage;
