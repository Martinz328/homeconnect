export const ROOM_TYPES = [
  "Single Room",
  "Room-Kitchen-Toilet",
  "Studio",
  "Apartment",
  "Shared Room",
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

export const QUARTERS = [
  "Molyko",
  "Bonduma",
  "Sandpit",
  "Mile 17",
  "Clerks Quarter",
  "Santa Barbara",
  "Buea Town",
  "Bokwango",
  "Other",
] as const;

export type Quarter = (typeof QUARTERS)[number];

export const AMENITIES = [
  { key: "water", label: "Running water", icon: "Droplets" },
  { key: "power", label: "Stable electricity", icon: "Zap" },
  { key: "gen", label: "Generator backup", icon: "BatteryCharging" },
  { key: "wifi", label: "WiFi", icon: "Wifi" },
  { key: "kitchen", label: "Kitchen access", icon: "Utensils" },
  { key: "privbath", label: "Private bathroom", icon: "Lock" },
  { key: "sharbath", label: "Shared bathroom", icon: "Users" },
  { key: "furnished", label: "Furnished", icon: "Sofa" },
  { key: "fan", label: "Fan", icon: "Wind" },
  { key: "ac", label: "A/C", icon: "Thermometer" },
] as const;

export type AmenityKey = (typeof AMENITIES)[number]["key"];
export type AmenityIcon = (typeof AMENITIES)[number]["icon"];

export const HOUSE_RULES = [
  { key: "no_cooking", label: "No cooking" },
  { key: "no_noise", label: "No loud noise" },
  { key: "male_only", label: "Male only" },
  { key: "female_only", label: "Female only" },
  { key: "any_gender", label: "Any gender" },
  { key: "couples", label: "Couples allowed" },
  { key: "no_visitors", label: "No visitors" },
] as const;

export type HouseRuleKey = (typeof HOUSE_RULES)[number]["key"];

export const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP ?? "";
