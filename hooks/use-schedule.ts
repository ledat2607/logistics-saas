import { scheduleService } from "@/services/schedule.services";
import { useState, useEffect, useCallback, useMemo } from "react";

export function useSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scheduleService.getAllSchedules();
      setSchedules(res.data || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách lịch trình");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Tách danh sách theo eventType
  const normalSchedules = useMemo(
    () => schedules.filter((item) => item.eventType !== "MAINTENANCE"),
    [schedules],
  );

  const maintenanceSchedules = useMemo(
    () => schedules.filter((item) => item.eventType === "MAINTENANCE"),
    [schedules],
  );

  return {
    schedules, 
    normalSchedules, 
    maintenanceSchedules, 
    loading,
    error,
    refetch: fetchSchedules,
  };
}
