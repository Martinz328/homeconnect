export const ROOM_TYPES = [
  "Single Room",
  "Room-Kitchen-Toilet",
  "Studio",
  "Apartment",
//  "Shared Room",
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

export const QUARTERS = [
 "Auberge",
  "Bakweri Town",
  "Betingi",
  "Biaka",
  "Biaka Residence",
  "Bokwango",
  "Bomaka",
  "Bongo Square",
  "Bonduma",
  "Buea Town",
  "Buea Town Stadium",
  "Campaign Street",
  "Checkpoint",
  "Clerks Quarter",
  "Congelcam",
  "Court Junction",
  "Federal Quarter",
  "GRA",
  "Great Soppo",
  "John Chi",
  "Koke",
  "Landmark/HIMS Area",
  "Limbe Quarter",
  "Long Street",
  "Malingo",
  "Mayor Street",
  "Menyoli Estate",
  "Mermoz",
  "Mile 16",
  "Mile 17",
  "Mile 18",
  "Molyko",
  "Mt Mary",
  "Nextel",
  "Ngapi Entrance",
  "Njieforbbi/St Claire",
  "OIC",
  "Razel",
  "Sandpit",
  "Santa Barbara",
  "Small Soppo",
  "St Luke",
  "Synod Office",
  "Total Molyko",
  "Tuborg Junction",
  "UB Junction",
  "UB South",
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
