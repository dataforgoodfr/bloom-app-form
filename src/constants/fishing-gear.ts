import fishingGear from '@/public/data/fishing_gear.json';

export const FISHING_GEAR = fishingGear as Record<string, {
  name: string;
  description: string;
  // Add other fields based on your Excel columns
}>; 