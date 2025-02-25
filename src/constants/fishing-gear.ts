// Use a single import with the correct path
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

// If you need the data synchronously during build time, 
// you can export an async function to fetch it
export async function getFishingGear(): Promise<FishingGearData> {
  const response = await fetch('/data/fishing_gear.json');
  return response.json();
}

// Alternatively, if this is just for types, you can skip the data fetching here
// and just export the type definitions 

// Try the correct path - assuming it's in the public directory
import fishingGear from '../../public/data/fishing_gear.json';
// OR
import fishingGear from '@/app/data/fishing_gear.json';

export const FISHING_GEAR = fishingGear as Record<string, {
  name: string;
  path_image: string;
  EN: string;
  FR: string;
}>; 