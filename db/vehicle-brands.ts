export interface VehicleBrand {
  brand: string;
  country: string;
  category: ("TRUCK" | "TRACTOR" | "VAN" | "PICKUP")[];
  models: string[];
}

export const VEHICLE_BRANDS: VehicleBrand[] = [
  // ==================== NHẬT BẢN ====================
  {
    brand: "Isuzu",
    country: "Nhật Bản",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "QKR 210",
      "QKR 270",
      "NPR 400",
      "NQR 550",
      "FRR 650",
      "FVR 900",
      "FVM 1500",
      "FVZ 1500",
      "Ginga 370",
      "EXR Đầu Kéo",
      "EXZ Đầu Kéo",
    ],
  },
  {
    brand: "Hino",
    country: "Nhật Bản",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "300 Series XZU650",
      "300 Series XZU720",
      "300 Series XZU730",
      "500 Series FC",
      "500 Series FG",
      "500 Series FL",
      "500 Series FM",
      "700 Series SS1A",
      "700 Series SH1E",
    ],
  },
  {
    brand: "Mitsubishi Fuso",
    country: "Nhật Bản",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Canter 4.99",
      "Canter 6.5",
      "FA 1014",
      "FI 170",
      "FJ 285",
      "FZ 4938 (Đầu Kéo)",
      "TV 3340",
    ],
  },
  {
    brand: "Suzuki",
    country: "Nhật Bản",
    category: ["TRUCK", "VAN"],
    models: ["Carry Truck", "Carry Pro", "Blind Van", "Super Carry Pro"],
  },

  // ==================== HÀN QUỐC ====================
  {
    brand: "Hyundai",
    country: "Hàn Quốc",
    category: ["TRUCK", "TRACTOR", "VAN"],
    models: [
      "Porter H150",
      "Mighty N250",
      "Mighty N250SL",
      "Mighty 75S",
      "Mighty 110S",
      "Mighty 110XL",
      "Mighty EX6",
      "Mighty EX8",
      "Mighty EX8 GTL",
      "HD210",
      "HD260",
      "HD320",
      "HD1000 (Đầu Kéo)",
      "Xcient GT",
      "Solati Cargo",
    ],
  },
  {
    brand: "Kia",
    country: "Hàn Quốc",
    category: ["TRUCK"],
    models: [
      "Frontier K200",
      "Frontier K200S",
      "Frontier K200SD",
      "Frontier K250",
      "Frontier K250L",
    ],
  },
  {
    brand: "Daehan (Teraco)",
    country: "Hàn Quốc",
    category: ["TRUCK", "VAN"],
    models: [
      "Tera 100",
      "Tera 100S",
      "Tera 180",
      "Tera 190SL",
      "Tera 245SL",
      "Tera 345SL",
      "Tera 350",
      "Tera V",
      "Tera V6",
    ],
  },
  {
    brand: "Tata Daewoo",
    country: "Hàn Quốc",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Prima 2 Chân",
      "Prima 3 Chân",
      "Novus SE 2 Chân",
      "Novus SE 3 Chân",
      "Novus Đầu Kéo 340HP",
      "Novus Đầu Kéo 420HP",
      "MAXIMUS",
    ],
  },

  // ==================== VIỆT NAM ====================
  {
    brand: "Thaco Auto",
    country: "Việt Nam",
    category: ["TRUCK", "TRACTOR", "VAN"],
    models: [
      "Town 800",
      "Towner 990",
      "Towner Van 2S",
      "Towner Van 5S",
      "Frontier TF2800",
      "Ollin 120",
      "Ollin 500",
      "Ollin 700",
      "Ollin S700",
      "Ollin S950",
      "Auman C160",
      "Auman C240",
      "Auman C300",
      "Auman EST FV400",
      "Forland FD600",
    ],
  },
  {
    brand: "VinFast",
    country: "Việt Nam",
    category: ["VAN"],
    models: ["VF e34 Cargo", "VF 5 Cargo", "EC Van"],
  },
  {
    brand: "Đô Thành (Dothanh)",
    country: "Việt Nam",
    category: ["TRUCK"],
    models: [
      "IZ150",
      "IZ200",
      "IZ250",
      "IZ65",
      "IZ350",
      "IZ500",
      "IZ650",
      "Mighty HD88",
      "Mighty HD99",
    ],
  },

  // ==================== TRUNG QUỐC ====================
  {
    brand: "Howo / Sinotruk",
    country: "Trung Quốc",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Howo V7G",
      "Howo TX 4x2",
      "Howo TX 8x4",
      "Howo SITRAK T7H",
      "Howo MAX 440HP",
      "Howo MAX 460HP",
      "Howo 371",
      "Howo A7 375HP",
      "Howo A7 420HP",
      "Howo NX 440",
    ],
  },
  {
    brand: "Chenglong",
    country: "Trung Quốc",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Chenglong M3 (4x2)",
      "Chenglong H5 (6x2)",
      "Chenglong H7 (8x4)",
      "Chenglong H7 (10x4)",
      "Đầu Kéo H7 385HP",
      "Đầu Kéo H7 420HP",
      "Đầu Kéo H7 445HP",
      "Đầu Kéo H7 Luxury 480HP",
    ],
  },
  {
    brand: "Dongfeng",
    country: "Trung Quốc",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Dongfeng B180",
      "Dongfeng C260",
      "Dongfeng D310",
      "Dongfeng Hoàng Huy 4 chân",
      "Đầu Kéo Dongfeng 420HP",
      "Đầu Kéo Dongfeng GX 450HP",
    ],
  },
  {
    brand: "Faw",
    country: "Trung Quốc",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "FAW Tiger V",
      "FAW J6P 4 chân",
      "FAW J6L",
      "Đầu Kéo FAW J6P 375HP",
      "Đầu Kéo FAW J7 470HP",
    ],
  },
  {
    brand: "JAC",
    country: "Trung Quốc",
    category: ["TRUCK", "TRACTOR", "VAN"],
    models: [
      "JAC N200S",
      "JAC N350S",
      "JAC N650 Plus",
      "JAC N800",
      "JAC N900",
      "JAC A5 (4x2)",
      "JAC A5 (6x2)",
      "JAC X150",
      "JAC Sunray Van",
      "Đầu Kéo JAC K5",
    ],
  },
  {
    brand: "Shacman",
    country: "Trung Quốc",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Shacman H3000",
      "Shacman X3000 (8x4)",
      "Đầu Kéo Shacman X3000 400HP",
      "Đầu Kéo Shacman X3000 460HP",
      "Shacman X5000",
    ],
  },
  {
    brand: "CIMC",
    country: "Trung Quốc",
    category: ["TRACTOR"],
    models: ["Sơ mi rơ moóc Cổ cò", "Sơ mi rơ moóc Lồng", "Sơ mi rơ moóc Sàn"],
  },

  // ==================== CHÂU ÂU & MỸ ====================
  {
    brand: "Volvo Trucks",
    country: "Thụy Điển",
    category: ["TRUCK", "TRACTOR"],
    models: ["Volvo FH16", "Volvo FH", "Volvo FM", "Volvo FMX", "Volvo FE"],
  },
  {
    brand: "Scania",
    country: "Thụy Điển",
    category: ["TRUCK", "TRACTOR"],
    models: [
      "Scania P-Series",
      "Scania G-Series",
      "Scania R-Series",
      "Scania S-Series",
      "Scania R500",
      "Scania R620",
    ],
  },
  {
    brand: "MAN Trucks",
    country: "Đức",
    category: ["TRUCK", "TRACTOR"],
    models: ["MAN TGL", "MAN TGM", "MAN TGS", "MAN TGX 18.440", "MAN TGX 26.540"],
  },
  {
    brand: "Mercedes-Benz Trucks",
    country: "Đức",
    category: ["TRUCK", "TRACTOR", "VAN"],
    models: [
      "Actros 1842",
      "Actros 2645",
      "Arocs 3345",
      "Atego 1221",
      "Sprinter Cargo Van",
    ],
  },
  {
    brand: "DAF Trucks",
    country: "Hà Lan",
    category: ["TRUCK", "TRACTOR"],
    models: ["DAF LF", "DAF CF", "DAF XF 480", "DAF XG+"],
  },
  {
    brand: "Freightliner",
    country: "Mỹ",
    category: ["TRACTOR"],
    models: [
      "Cascadia 116",
      "Cascadia 126",
      "Cascadia Evolution",
      "Century Class",
      "Columbia",
    ],
  },
  {
    brand: "International",
    country: "Mỹ",
    category: ["TRACTOR"],
    models: [
      "ProStar",
      "LT Series",
      "Lonestar",
      "MaxxForce 13",
      "TranStar",
    ],
  },
  {
    brand: "Ford",
    country: "Mỹ",
    category: ["VAN", "PICKUP", "TRUCK"],
    models: [
      "Transit Custom Van",
      "Transit Cargo 16 chỗ hạ tải",
      "Ranger XLS",
      "F-150 Super Duty",
      "F-MAX (Đầu Kéo)",
    ],
  },
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Lấy danh sách tên tất cả các Hãng xe
 */
export const getAllBrands = (): string[] => {
  return VEHICLE_BRANDS.map((item) => item.brand);
};

/**
 * Lấy danh sách Model theo tên Hãng
 */
export const getModelsByBrandName = (brandName: string): string[] => {
  if (!brandName) return [];
  const found = VEHICLE_BRANDS.find(
    (item) => item.brand.toLowerCase() === brandName.trim().toLowerCase()
  );
  return found ? found.models : [];
};

/**
 * Tìm kiếm Hãng xe theo Quốc gia
 */
export const getBrandsByCountry = (countryName: string): VehicleBrand[] => {
  return VEHICLE_BRANDS.filter(
    (item) => item.country.toLowerCase() === countryName.trim().toLowerCase()
  );
};