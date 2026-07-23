import { fleetService } from "@/services/fleet.services";
import { useState, useEffect, useCallback } from "react";

export function useFleets() {
  const [fleets, setFleets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFleets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fleetService.getAllFleets();
      setFleets(res.data || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách phương tiện");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleets();
  }, [fetchFleets]);

  return {
    fleets,
    loading,
    error,
    refetch: fetchFleets, 
  };
}