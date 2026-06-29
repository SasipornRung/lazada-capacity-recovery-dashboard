import type { HubFlow } from "../lib/calculations";

export const flows: HubFlow[] = [
  { originHubId: "BKK_EAST", destinationName: "Chonburi coastal zone", lat: 13.36, lng: 100.98, volume: 84000, slaRisk: "High" },
  { originHubId: "BKK_EAST", destinationName: "Nakhon Ratchasima corridor", lat: 14.98, lng: 102.1, volume: 72000, slaRisk: "High" },
  { originHubId: "BKK_WEST", destinationName: "Ayutthaya consolidation", lat: 14.35, lng: 100.57, volume: 52000, slaRisk: "Medium" },
  { originHubId: "CHONBURI", destinationName: "Rayong industrial belt", lat: 12.68, lng: 101.28, volume: 46000, slaRisk: "Medium" },
  { originHubId: "NAKHON_RATCHASIMA", destinationName: "Khon Kaen northeast lane", lat: 16.44, lng: 102.84, volume: 58000, slaRisk: "High" },
  { originHubId: "CHIANG_MAI", destinationName: "Chiang Rai northern route", lat: 19.91, lng: 99.83, volume: 27000, slaRisk: "Medium" },
  { originHubId: "SURAT_THANI", destinationName: "Hat Yai southern spine", lat: 7.01, lng: 100.47, volume: 42000, slaRisk: "High" },
  { originHubId: "HAT_YAI", destinationName: "Trang partner reach", lat: 7.56, lng: 99.61, volume: 18000, slaRisk: "Low" },
];
