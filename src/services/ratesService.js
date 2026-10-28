/**
 * Indicative Scrap Material Rates & Environmental Impact Service for ScrapX
 */

export const SCRAP_MATERIAL_RATES = [
  {
    id: "iron",
    name: "Cast Iron & Light Scrap",
    category: "Metals",
    pricePerKg: 38,
    unit: "kg",
    co2PerKg: 1.6, // kg CO2 saved per kg recycled
    waterPerKg: 4.2, // liters of water saved
    description: "Engine blocks, brake drums, iron brackets, exhaust manifolds.",
    icon: "Anchor",
  },
  {
    id: "steel",
    name: "Heavy Structural Steel & Chassis",
    category: "Metals",
    pricePerKg: 46,
    unit: "kg",
    co2PerKg: 1.8,
    waterPerKg: 5.0,
    description: "Vehicle chassis frames, body subframes, leaf springs, axle shafts.",
    icon: "Shield",
  },
  {
    id: "aluminium",
    name: "Aluminium & Alloy Components",
    category: "Light Alloys",
    pricePerKg: 175,
    unit: "kg",
    co2PerKg: 8.2, // massive energy saving recycling aluminium
    waterPerKg: 12.0,
    description: "Alloy wheels, cylinder heads, transmission housings, heat shields.",
    icon: "Layers",
  },
  {
    id: "copper",
    name: "Copper Wiring Harnesses & Cables",
    category: "Precious Metals",
    pricePerKg: 720,
    unit: "kg",
    co2PerKg: 4.5,
    waterPerKg: 8.5,
    description: "Complete vehicle wiring looms, alternator windings, starter cables.",
    icon: "Zap",
  },
  {
    id: "battery",
    name: "Lead-Acid Car Batteries",
    category: "Batteries",
    pricePerKg: 105,
    unit: "kg",
    co2PerKg: 2.4,
    waterPerKg: 6.0,
    description: "12V starter batteries from cars, trucks, motorcycles, and inverters.",
    icon: "BatteryCharging",
  },
  {
    id: "brass",
    name: "Brass Radiators & Fittings",
    category: "Precious Metals",
    pricePerKg: 490,
    unit: "kg",
    co2PerKg: 3.8,
    waterPerKg: 7.0,
    description: "Vintage brass radiators, thermostat housings, valve fittings.",
    icon: "Flame",
  },
  {
    id: "car_shell",
    name: "Total Loss Scrap Car Shell",
    category: "Vehicle Shell",
    pricePerKg: 32,
    unit: "kg",
    co2PerKg: 1.5,
    waterPerKg: 4.0,
    description: "Complete de-registered stripped vehicle bodies, doors, hoods, and roofs.",
    icon: "Car",
  },
  {
    id: "tires",
    name: "End-of-Life Vehicle Tires",
    category: "Rubber",
    pricePerKg: 15, // or ~₹150-₹300 per tire
    unit: "kg",
    co2PerKg: 1.1,
    waterPerKg: 2.5,
    description: "Worn or punctured radial tires for pyrolysis and rubber crumb recycling.",
    icon: "Disc",
  },
];

/**
 * Calculates estimated scrap value and ecological impact based on material and weight
 */
export function calculateScrapValue(materialId, weightKg) {
  const material = SCRAP_MATERIAL_RATES.find((m) => m.id === materialId) || SCRAP_MATERIAL_RATES[0];
  const weight = Math.max(0, Number(weightKg) || 0);
  const estimatedPrice = Math.round(weight * material.pricePerKg);
  const co2SavedKg = Math.round(weight * material.co2PerKg * 10) / 10;
  const waterSavedLiters = Math.round(weight * material.waterPerKg * 10) / 10;

  return {
    material,
    weight,
    estimatedPrice,
    co2SavedKg,
    waterSavedLiters,
  };
}
