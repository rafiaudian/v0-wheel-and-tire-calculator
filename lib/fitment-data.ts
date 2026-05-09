// Tire & Wheel Fitment Types and Data

export interface TireSpec {
  width: number // mm (e.g., 225)
  profile: number // aspect ratio (e.g., 45)
  diameter: number // inches (e.g., 18)
}

export interface WheelSpec {
  width: number // inches (e.g., 8.5)
  diameter: number // inches (e.g., 18)
  offset: number // mm (e.g., +35)
  pcd: string // e.g., "5x114.3"
  centerBore: number // mm (e.g., 67.1)
}

export interface FitmentResult {
  tireWidth: number // actual tire section width in mm
  tireHeight: number // sidewall height in mm
  overallDiameter: number // total tire diameter in mm
  circumference: number // tire circumference in mm
  revPerKm: number // revolutions per kilometer
  speedometerDiff?: number // percentage difference from stock
  wheelFitment: 'narrow' | 'ideal' | 'wide' | 'stretch'
  warnings: string[]
}

export interface TireBrand {
  name: string
  country: string
  regions: string[]
  priceRange: 'budget' | 'midrange' | 'premium'
  specialties: string[]
  popularLines: string[]
}

// Common PCD patterns
export const commonPCDs = [
  "4x100",
  "4x108",
  "4x114.3",
  "5x100",
  "5x108",
  "5x112",
  "5x114.3",
  "5x120",
  "5x127",
  "5x130",
  "6x139.7",
]

// Tire brand database with regional availability
export const tireBrands: TireBrand[] = [
  // Premium brands
  {
    name: "Michelin",
    country: "France",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "premium",
    specialties: ["Performance", "Comfort", "Longevity"],
    popularLines: ["Pilot Sport 5", "Primacy 4", "CrossClimate 2"]
  },
  {
    name: "Bridgestone",
    country: "Japan",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "premium",
    specialties: ["Performance", "Durability", "OEM"],
    popularLines: ["Potenza Sport", "Turanza T005", "Ecopia"]
  },
  {
    name: "Continental",
    country: "Germany",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "premium",
    specialties: ["Performance", "Safety", "Technology"],
    popularLines: ["PremiumContact 7", "SportContact 7", "EcoContact 6"]
  },
  {
    name: "Pirelli",
    country: "Italy",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "premium",
    specialties: ["Performance", "Luxury", "Motorsport"],
    popularLines: ["P Zero", "Cinturato P7", "Scorpion Verde"]
  },
  {
    name: "Goodyear",
    country: "USA",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "premium",
    specialties: ["All-season", "Performance", "Durability"],
    popularLines: ["Eagle F1", "Assurance", "EfficientGrip"]
  },
  
  // Mid-range brands
  {
    name: "Yokohama",
    country: "Japan",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "midrange",
    specialties: ["Performance", "Value", "Motorsport"],
    popularLines: ["Advan Sport", "BluEarth", "Geolandar"]
  },
  {
    name: "Toyo Tires",
    country: "Japan",
    regions: ["Global", "Indonesia", "Asia", "Americas"],
    priceRange: "midrange",
    specialties: ["Performance", "Off-road", "Value"],
    popularLines: ["Proxes Sport", "Open Country", "NanoEnergy"]
  },
  {
    name: "Hankook",
    country: "South Korea",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "midrange",
    specialties: ["Performance", "Value", "Technology"],
    popularLines: ["Ventus S1 evo3", "Kinergy", "Dynapro"]
  },
  {
    name: "Kumho",
    country: "South Korea",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "midrange",
    specialties: ["Value", "Performance", "Variety"],
    popularLines: ["Ecsta PS71", "Solus", "Road Venture"]
  },
  {
    name: "Falken",
    country: "Japan",
    regions: ["Global", "Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "midrange",
    specialties: ["Performance", "Motorsport", "Value"],
    popularLines: ["Azenis FK510", "Ziex", "Wildpeak"]
  },
  {
    name: "Dunlop",
    country: "UK/Japan",
    regions: ["Global", "Indonesia", "Asia", "Europe"],
    priceRange: "midrange",
    specialties: ["Performance", "Comfort", "Motorsport"],
    popularLines: ["Sport Maxx", "SP Sport", "Grandtrek"]
  },
  
  // Budget-friendly brands popular in Indonesia & Asia
  {
    name: "GT Radial",
    country: "Indonesia",
    regions: ["Indonesia", "Asia", "Global"],
    priceRange: "budget",
    specialties: ["Value", "Durability", "Local"],
    popularLines: ["Champiro", "Savero", "Maxmiler"]
  },
  {
    name: "Accelera",
    country: "Indonesia",
    regions: ["Indonesia", "Asia", "Europe"],
    priceRange: "budget",
    specialties: ["Performance", "Value", "Variety"],
    popularLines: ["651 Sport", "PHI", "Iota"]
  },
  {
    name: "Achilles",
    country: "Indonesia",
    regions: ["Indonesia", "Asia", "Europe", "Americas"],
    priceRange: "budget",
    specialties: ["Performance", "Value", "Drift"],
    popularLines: ["ATR Sport", "122", "Desert Hawk"]
  },
  {
    name: "Forceum",
    country: "Indonesia",
    regions: ["Indonesia", "Asia"],
    priceRange: "budget",
    specialties: ["Value", "Daily Use"],
    popularLines: ["Octa", "Hexa", "Penta"]
  },
  {
    name: "Federal",
    country: "Taiwan",
    regions: ["Indonesia", "Asia", "Americas"],
    priceRange: "budget",
    specialties: ["Performance", "Motorsport", "Value"],
    popularLines: ["595 RS-RR", "Evoluzion", "Super Steel"]
  },
  {
    name: "Nankang",
    country: "Taiwan",
    regions: ["Indonesia", "Asia", "Europe"],
    priceRange: "budget",
    specialties: ["Performance", "Value", "Variety"],
    popularLines: ["NS-2R", "AS-2+", "Sportnex"]
  },
  {
    name: "Westlake",
    country: "China",
    regions: ["Indonesia", "Asia", "Global"],
    priceRange: "budget",
    specialties: ["Value", "Durability"],
    popularLines: ["SA07", "RP18", "SU318"]
  },
  {
    name: "Maxxis",
    country: "Taiwan",
    regions: ["Global", "Indonesia", "Asia", "Americas"],
    priceRange: "budget",
    specialties: ["Value", "Off-road", "Motorcycle"],
    popularLines: ["Victra Sport", "Premitra", "Bravo"]
  },
]

// Regions for selection
export const regions = [
  { value: "indonesia", label: "Indonesia" },
  { value: "asia", label: "Asia (Other)" },
  { value: "europe", label: "Europe" },
  { value: "americas", label: "Americas" },
  { value: "global", label: "Global" },
]

// Popular wheel brands
export const wheelBrands = [
  // Japanese JDM Brands
  "Rays Engineering",
  "Work Wheels",
  "SSR",
  "Enkei",
  "Weds",
  "Advan Racing",
  "Gram Lights",
  "NISMO",
  "Mugen",
  "BBS Japan",
  "Prodrive",
  "Volk Racing",
  "Regamaster",
  // European Brands
  "BBS",
  "OZ Racing",
  "Rotiform",
  "HRE",
  "ADV.1",
  "Vossen",
  "Forgeline",
  // American Brands
  "American Racing",
  "Fuel",
  "Method Race",
  "Fifteen52",
  "Konig",
  // Budget/Regional Brands
  "Rota",
  "XXR",
  "Cosmis Racing",
  "JNC",
  "Avid.1",
  "F1R",
  "MST",
  "Aodhan",
  "ESR",
  "Niche",
  "Vorsteiner",
  "Stance",
]

// Popular tire brand names (for quick selection)
export const tireBrandNames = [
  "Michelin",
  "Bridgestone",
  "Continental",
  "Pirelli",
  "Goodyear",
  "Yokohama",
  "Toyo Tires",
  "Hankook",
  "Kumho",
  "Falken",
  "Dunlop",
  "GT Radial",
  "Accelera",
  "Achilles",
  "Forceum",
  "Federal",
  "Nankang",
  "Westlake",
  "Maxxis",
]

// Alias for tire brand names selection
export { tireBrandNames as tireBrands2 }

// Export tire brand names as simple string array for select inputs
export const tireBrandsSimple = tireBrandNames

// Calculate fitment results
export function calculateFitment(tire: TireSpec, wheel: WheelSpec): FitmentResult {
  const warnings: string[] = []
  
  // Calculate tire dimensions
  const tireWidth = tire.width // Section width in mm
  const tireHeight = (tire.width * tire.profile) / 100 // Sidewall height in mm
  const wheelDiameterMM = wheel.diameter * 25.4 // Convert to mm
  const overallDiameter = wheelDiameterMM + (tireHeight * 2)
  const circumference = Math.PI * overallDiameter
  const revPerKm = 1000000 / circumference
  
  // Determine wheel fitment
  const idealWheelWidth = tireWidth / 25.4 // Convert tire width to inches
  const minWheelWidth = idealWheelWidth - 1.5
  const maxWheelWidth = idealWheelWidth + 0.5
  
  let wheelFitment: 'narrow' | 'ideal' | 'wide' | 'stretch'
  
  if (wheel.width < minWheelWidth - 0.5) {
    wheelFitment = 'narrow'
    warnings.push("Velg terlalu sempit untuk ban ini - kurang presisi handling")
  } else if (wheel.width > maxWheelWidth + 1) {
    wheelFitment = 'stretch'
    warnings.push("Ban akan stretch - hati-hati saat cornering")
  } else if (wheel.width > maxWheelWidth) {
    wheelFitment = 'wide'
    warnings.push("Velg sedikit lebar - acceptable untuk stance setup")
  } else {
    wheelFitment = 'ideal'
  }
  
  // Additional warnings
  if (tire.profile < 35) {
    warnings.push("Profil rendah - perhatikan kondisi jalan")
  }
  
  if (Math.abs(wheel.offset) > 45) {
    warnings.push("Offset ekstrem - pastikan clearance fender")
  }
  
  return {
    tireWidth,
    tireHeight,
    overallDiameter,
    circumference,
    revPerKm,
    wheelFitment,
    warnings
  }
}

// Get recommended tire width range for a wheel width
export function getRecommendedTireWidth(wheelWidth: number): { min: number; ideal: number; max: number } {
  const idealWidth = Math.round(wheelWidth * 25.4)
  return {
    min: idealWidth - 20,
    ideal: idealWidth,
    max: idealWidth + 30
  }
}

// Get tire recommendations based on fitment and region
export function getTireRecommendations(
  tire: TireSpec,
  region: string,
  budget: 'all' | 'budget' | 'midrange' | 'premium' = 'all'
): TireBrand[] {
  const regionMap: { [key: string]: string } = {
    indonesia: "Indonesia",
    asia: "Asia",
    europe: "Europe",
    americas: "Americas",
    global: "Global"
  }
  
  const targetRegion = regionMap[region] || "Global"
  
  return tireBrands.filter(brand => {
    const regionMatch = brand.regions.includes(targetRegion) || brand.regions.includes("Global")
    const budgetMatch = budget === 'all' || brand.priceRange === budget
    return regionMatch && budgetMatch
  })
}
