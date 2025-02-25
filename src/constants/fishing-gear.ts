// Single import with correct path
import fishingGear from '../../public/data/fishing_gear.json';

export interface FishingGear {
  path_image: string;
  name: string;
  EN: string;
  FR: string;
}

export interface FishingGearData {
  [key: string]: FishingGear;
}

// Export the data with proper typing
export const FISHING_GEAR: FishingGearData = fishingGear;

// For components that need to fetch dynamically
export async function getFishingGear(): Promise<FishingGearData> {
  const response = await fetch('/data/fishing_gear.json');
  return response.json();
} 