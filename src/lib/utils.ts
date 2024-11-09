import { EnergyData, UserData } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCurrentBatteryPower(
  energyData: EnergyData[] | null,
  userData: UserData | null,
) {
  if (!energyData || !userData) return 0;
  let currentBatteryPower = 0;

  for (let i = 0; i < energyData.length; i++) {
    const current = energyData[i];
    currentBatteryPower += current.SolarEnergy || 0;
    currentBatteryPower -= current.Consumption;
    currentBatteryPower = Math.max(currentBatteryPower, 0);
    currentBatteryPower = Math.min(
      currentBatteryPower,
      userData ? parseFloat(userData.storageCapacity) : 0,
    );
  }

  return currentBatteryPower;
}

export function groupDataByDay(
  energyData: EnergyData[],
): Map<string, EnergyData[]> {
  const dataByDay = new Map<string, EnergyData[]>();

  energyData.forEach((data) => {
    const date = new Date(data.SendDate).toLocaleDateString();
    if (!dataByDay.has(date)) {
      dataByDay.set(date, []);
    }
    dataByDay.get(date)?.push(data);
  });

  return dataByDay;
}
