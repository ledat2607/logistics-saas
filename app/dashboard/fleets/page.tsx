"use client";

import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FleetsContainer from "@/components/dashboard-component/fleets/fleet-card";
import { useState } from "react";
import CreateFleetDialog from "@/components/dashboard-component/fleets/create-fleet-dialog";
import { useFleets } from "@/hooks/use-fleet";

export default function FleetPage() {
  const { fleets, loading, error, refetch } = useFleets();

  const stats = {
    total: fleets.length,
    inTransit: fleets.filter(
      (item) => (item.vehicle?.status || item.status) === "IN_TRANSIT",
    ).length,
    available: fleets.filter(
      (item) => (item.vehicle?.status || item.status) === "AVAILABLE",
    ).length,
    maintenance: fleets.filter(
      (item) => (item.vehicle?.status || item.status) === "MAINTENANCE",
    ).length,
  };

  const [open, setOpen] = useState(false);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 lg:gap-0">
        <div>
          <h1 className="lg:text-2xl text-md font-bold tracking-tight">
            Quản lý đội xe
          </h1>
          <p className="lg:text-sm text-xs text-muted-foreground text-justify">
            Theo dõi danh sách phương tiện và trạng thái vận hành.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Thêm xe mới
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">Lỗi: {error}</div>
      ) : (
        <FleetsContainer stats={stats} fleets={fleets} onSuccess={refetch} />
      )}

      <CreateFleetDialog open={open} setOpen={setOpen} onSuccess={refetch} />
    </div>
  );
}
