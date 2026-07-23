"use client";

import React, { useState } from "react";
import { Truck, UserCheck, Wrench, MapPin, Phone, User } from "lucide-react";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FleetVehicle } from "@/lib/types/fleet-type";

interface FleetItem {
  vehicle: FleetVehicle;
  owner: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface FleetsContainerProps {
  stats: {
    total: number;
    inTransit: number;
    available: number;
    maintenance: number;
  };
  fleets: FleetItem[];
}

const renderStatusBadge = (status: FleetVehicle["status"]) => {
  switch (status) {
    case "IN_TRANSIT":
      return (
        <Badge className="bg-blue-500/15 text-blue-500 hover:bg-blue-500/20 border-blue-500/30">
          Đang chạy
        </Badge>
      );
    case "AVAILABLE":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30">
          Sẵn sàng
        </Badge>
      );
    case "MAINTENANCE":
      return (
        <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/30">
          Bảo dưỡng
        </Badge>
      );
    default:
      return <Badge variant="secondary">Ngừng chạy</Badge>;
  }
};

const FleetsContainer = ({ stats, fleets }: FleetsContainerProps) => {
  // 💡 Lưu cả object { vehicle, owner } thay vì chỉ lưu mỗi vehicle
  const [selectedFleet, setSelectedFleet] = useState<FleetItem | null>(
    fleets?.[0] || null
  );

  const selectedVehicle = selectedFleet?.vehicle;
  const selectedOwner = selectedFleet?.owner;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Tổng số xe
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-blue-500">
                Đang chạy
              </CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {stats.inTransit}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-emerald-500">
                Sẵn sàng
              </CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {stats.available}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-amber-500">
                Bảo dưỡng
              </CardTitle>
              <Wrench className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {stats.maintenance}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-base font-semibold">
              Danh sách phương tiện ({fleets.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biển số / Mẫu</TableHead>
                  <TableHead>Tải trọng</TableHead>
                  <TableHead>Tài xế phụ trách</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleets.map((item) => {
                  const vehicle = item.vehicle;

                  return (
                    <TableRow
                      key={vehicle.id}
                      onClick={() => setSelectedFleet(item)}
                      className={`cursor-pointer ${
                        selectedVehicle?.id === vehicle.id ? "bg-muted/60" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="font-bold">{vehicle.licensePlate}</div>
                        <div className="text-xs text-muted-foreground">
                          {vehicle.brand} {vehicle.model}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle.capacityKg != null
                          ? `${(Number(vehicle.capacityKg) / 1000).toFixed(1)} Tấn`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {vehicle.driver ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={vehicle.driver.avatar}
                                alt={vehicle.driver.name}
                              />
                              <AvatarFallback>
                                {vehicle.driver.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">
                              {vehicle.driver.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Chưa gán
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{renderStatusBadge(vehicle.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4 border-b">
            <div>
              <p className="text-xs text-muted-foreground">
                Chi tiết phương tiện
              </p>
              <CardTitle className="text-xl font-bold text-primary mt-1">
                {selectedVehicle?.licensePlate || "N/A"}
              </CardTitle>
            </div>
            {selectedVehicle && renderStatusBadge(selectedVehicle.status)}
          </CardHeader>

          <CardContent className="space-y-4 pt-4 text-sm">
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hãng & Mẫu:</span>
                <span className="font-medium">
                  {selectedVehicle?.brand} {selectedVehicle?.model}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tải trọng:</span>
                <span className="font-medium">
                  {selectedVehicle?.capacityKg != null
                    ? `${(Number(selectedVehicle.capacityKg) / 1000).toFixed(1)} Tấn`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Nhiên liệu:</span>
                <span className="font-medium">{selectedVehicle?.fuelType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Bảo dưỡng gần nhất:
                </span>
                <span className="font-medium">
                  {selectedVehicle?.lastMaintenanceDate || "Chưa có dữ liệu"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Vị trí hiện tại
              </span>
              <p className="text-xs font-medium mt-1">
                {selectedVehicle?.currentLocation || "Chưa cập nhật vị trí"}
              </p>
            </div>

            <div className="pt-3 border-t space-y-2">
              <span className="text-xs text-muted-foreground">
                Tài xế phụ trách
              </span>
              {selectedVehicle?.driver ? (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={selectedVehicle.driver.avatar}
                        alt={selectedVehicle.driver.name}
                      />
                      <AvatarFallback>
                        {selectedVehicle.driver.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold">
                        {selectedVehicle.driver.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" />{" "}
                        {selectedVehicle.driver.phone}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Đổi
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed text-xs h-9"
                >
                  + Phân công tài xế
                </Button>
              )}
            </div>

            {/* 💡 CHỦ SỞ HỮU: Lấy trực tiếp từ selectedOwner */}
            <div className="pt-3 border-t">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Chủ sở hữu
              </span>
              <p className="text-xs font-medium mt-1">
                {selectedOwner?.name || selectedOwner?.email || "Chưa cập nhật chủ sở hữu"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FleetsContainer;