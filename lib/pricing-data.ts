export interface PricingTier {
  category: string
  locations: string[]
  directSolarPeak: number // percentage cheaper
  storageSolarPeak: number
  gridPeak: number // percentage higher
  directSolarNormal: number // base rate
  storageSolarNormal: number
  gridNormal: number
  directSolarOffPeak: number // percentage higher
  storageSolarOffPeak: number
  gridOffPeak: number
}

export interface TimeWindow {
  name: string
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

export interface VehicleCategory {
  id: string
  name: string
  batteryCapacity: number // kWh
  maxChargingPower: number // kW
  consumptionRate: number // Wh/km
  chargingMultiplier: number // price adjustment factor
}

export interface VehicleModel {
  id: string
  make: string
  model: string
  category: string
  batteryCapacity: number // kWh
  maxACPower: number // kW
  maxDCPower: number // kW
  realWorldRange: number // km
  consumptionRate: number // Wh/km
  chargingCurve: "slow" | "normal" | "fast"
}

export interface ChargerPricing {
  chargerId: string
  type: string // FC-SP, FC-DP, L2, L1
  baseRate: number // Rs/kWh at normal hours
  peakMultiplier: number
  offPeakMultiplier: number
  minimumSessionFee: number
  idleFeePerMinute: number
}

// Station Categories based on infrastructure
export const stationCategories: Record<string, PricingTier> = {
  "Major Hub": {
    category: "A – Major Hub",
    locations: ["Colombo", "Galle"],
    directSolarPeak: 28,
    storageSolarPeak: 18,
    gridPeak: 22,
    directSolarNormal: 0,
    storageSolarNormal: 0,
    gridNormal: 0,
    directSolarOffPeak: -10,
    storageSolarOffPeak: -10,
    gridOffPeak: -8,
  },
  "Regional Hub": {
    category: "B – Regional Hub",
    locations: ["Negombo", "Kandy", "Matara"],
    directSolarPeak: 30,
    storageSolarPeak: 20,
    gridPeak: 25,
    directSolarNormal: 0,
    storageSolarNormal: 0,
    gridNormal: 0,
    directSolarOffPeak: -12,
    storageSolarOffPeak: -12,
    gridOffPeak: -10,
  },
  "City Network": {
    category: "C – City Network",
    locations: ["Anuradhapura", "Jaffna"],
    directSolarPeak: 32,
    storageSolarPeak: 22,
    gridPeak: 28,
    directSolarNormal: 0,
    storageSolarNormal: 0,
    gridNormal: 0,
    directSolarOffPeak: -14,
    storageSolarOffPeak: -14,
    gridOffPeak: -12,
  },
  "Small Network": {
    category: "D – Small Network",
    locations: ["Kurunegala"],
    directSolarPeak: 35,
    storageSolarPeak: 25,
    gridPeak: 30,
    directSolarNormal: 0,
    storageSolarNormal: 0,
    gridNormal: 0,
    directSolarOffPeak: -15,
    storageSolarOffPeak: -15,
    gridOffPeak: -13,
  },
  "Micro Station": {
    category: "E – Micro Station",
    locations: ["Ratnapura", "Badulla"],
    directSolarPeak: 38,
    storageSolarPeak: 28,
    gridPeak: 35,
    directSolarNormal: 0,
    storageSolarNormal: 0,
    gridNormal: 0,
    directSolarOffPeak: -18,
    storageSolarOffPeak: -18,
    gridOffPeak: -15,
  },
}

// Time-based pricing windows
export const pricingTimeWindows: Record<string, Record<string, TimeWindow>> = {
  "Direct Solar": {
    peak: { name: "Peak Hours", startHour: 10, startMinute: 30, endHour: 14, endMinute: 30 },
    normal: { name: "Normal Hours", startHour: 7, startMinute: 0, endHour: 10, endMinute: 30 },
    offPeak: { name: "Off-Peak Hours", startHour: 17, startMinute: 0, endHour: 7, endMinute: 0 },
  },
  "Storage Solar Power": {
    peak: { name: "Peak Hours", startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    normal: { name: "Normal Hours", startHour: 22, startMinute: 0, endHour: 9, endMinute: 0 },
    offPeak: { name: "Off-Peak Hours", startHour: 17, startMinute: 0, endHour: 22, endMinute: 0 },
  },
  Grid: {
    peak: { name: "Peak Hours", startHour: 18, startMinute: 0, endHour: 22, endMinute: 0 },
    normal: { name: "Normal Hours", startHour: 5, startMinute: 0, endHour: 18, endMinute: 0 },
    offPeak: { name: "Off-Peak Hours", startHour: 22, startMinute: 0, endHour: 5, endMinute: 0 },
  },
}

// Vehicle categories for pricing
export const vehicleCategories: VehicleCategory[] = [
  {
    id: "CAR",
    name: "Electric Car",
    batteryCapacity: 60,
    maxChargingPower: 150,
    consumptionRate: 180,
    chargingMultiplier: 1.0,
  },
  {
    id: "VAN",
    name: "Electric Van",
    batteryCapacity: 100,
    maxChargingPower: 200,
    consumptionRate: 250,
    chargingMultiplier: 1.2,
  },
  {
    id: "BUS",
    name: "Electric Bus",
    batteryCapacity: 200,
    maxChargingPower: 350,
    consumptionRate: 400,
    chargingMultiplier: 1.5,
  },
  {
    id: "TUK",
    name: "Electric Tuk",
    batteryCapacity: 20,
    maxChargingPower: 30,
    consumptionRate: 100,
    chargingMultiplier: 0.7,
  },
  {
    id: "BIKE",
    name: "Electric Bike",
    batteryCapacity: 15,
    maxChargingPower: 20,
    consumptionRate: 80,
    chargingMultiplier: 0.5,
  },
  {
    id: "FLEET",
    name: "Electric Fleet Vehicle",
    batteryCapacity: 80,
    maxChargingPower: 120,
    consumptionRate: 200,
    chargingMultiplier: 0.85,
  },
]

// Popular EV models with specifications
export const vehicleModels: VehicleModel[] = [
  {
    id: "BYD_DOLPHIN",
    make: "BYD",
    model: "Dolphin",
    category: "CAR",
    batteryCapacity: 44,
    maxACPower: 7,
    maxDCPower: 50,
    realWorldRange: 300,
    consumptionRate: 150,
    chargingCurve: "normal",
  },
  {
    id: "MG_ZS_EV",
    make: "MG",
    model: "ZS EV",
    category: "CAR",
    batteryCapacity: 52,
    maxACPower: 11,
    maxDCPower: 105,
    realWorldRange: 420,
    consumptionRate: 130,
    chargingCurve: "fast",
  },
  {
    id: "NISSAN_LEAF",
    make: "Nissan",
    model: "Leaf",
    category: "CAR",
    batteryCapacity: 62,
    maxACPower: 6.6,
    maxDCPower: 100,
    realWorldRange: 400,
    consumptionRate: 160,
    chargingCurve: "normal",
  },
  {
    id: "TATA_NEXON",
    make: "Tata",
    model: "Nexon EV",
    category: "CAR",
    batteryCapacity: 40,
    maxACPower: 6.6,
    maxDCPower: 40,
    realWorldRange: 320,
    consumptionRate: 130,
    chargingCurve: "slow",
  },
  {
    id: "TESLA_MODEL3",
    make: "Tesla",
    model: "Model 3",
    category: "CAR",
    batteryCapacity: 82,
    maxACPower: 11,
    maxDCPower: 250,
    realWorldRange: 560,
    consumptionRate: 145,
    chargingCurve: "fast",
  },
]

// Charger-specific pricing
export const chargerPricing: ChargerPricing[] = [
  {
    chargerId: "FC-SP",
    type: "Fast Charger - Single Phase",
    baseRate: 28.5,
    peakMultiplier: 1.25,
    offPeakMultiplier: 0.85,
    minimumSessionFee: 50,
    idleFeePerMinute: 2,
  },
  {
    chargerId: "FC-DP",
    type: "Fast Charger - Double Phase",
    baseRate: 32.0,
    peakMultiplier: 1.3,
    offPeakMultiplier: 0.8,
    minimumSessionFee: 75,
    idleFeePerMinute: 3,
  },
  {
    chargerId: "L2",
    type: "Level 2 - 22kW",
    baseRate: 18.5,
    peakMultiplier: 1.2,
    offPeakMultiplier: 0.9,
    minimumSessionFee: 30,
    idleFeePerMinute: 1,
  },
  {
    chargerId: "L1",
    type: "Level 1 - 7kW",
    baseRate: 12.0,
    peakMultiplier: 1.15,
    offPeakMultiplier: 0.95,
    minimumSessionFee: 15,
    idleFeePerMinute: 0.5,
  },
]

// Fleet and registered user discounts
export const discountRules = {
  registeredUser: 5, // percentage discount
  fleetAccount: 12, // percentage discount
  deliveryPartner: 15, // percentage discount
  earlyBird: 8, // booking before 7 AM
  nightCharger: 20, // booking between 22:00 - 05:00
}

// Demand-based surge pricing
export const surgeMultipliers = {
  stationUtilization: {
    normal: 1.0, // below 50%
    elevated: 1.1, // 50-80%
    peak: 1.25, // above 80%
  },
  solarOutput: {
    high: 0.85, // above 10kW
    medium: 1.0, // 5-10kW
    low: 1.15, // below 5kW
  },
}

// Solar-based dynamic discounts
export const solarDiscounts = {
  high: 20, // 20% discount when solar > 10kW
  medium: 12, // 12% discount when solar > 5kW
  low: 5, // 5% discount when solar > 0kW
}
