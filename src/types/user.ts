// types/user.ts
export interface UserData {
  hasSolarPanels: boolean;
  hasBatteryStorage: boolean;
  solarCapacity: number;
  storageCapacity: string;
  monthlyBill: number;
  electricityProvider: string;
  currentBatteryPower?: number;
}

export interface TOUData {
  timestamp: string;
  rate: number;
  category: "DOMESTIC" | "NON_DOMESTIC" | "INDUSTRIAL";
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface Discom {
  State: string;
  DISCOM: string;
  "Total Number of consumers (Millions)": string;
  "Total Electricity Sales (MU)": string;
  "Total Revenue (Rs. Crore)": string;
  "AT&C Losses (%)": string;
  "Average power purchase cost (Rs./kWh)": string;
  "Average Cost of Supply (Rs./kWh)": string;
  "Average Billing Rate (Rs./kWh)": string;
  "Profit/(Loss) of the DISCOM (Rs. Crore)": string;
}

export interface EnergyData {
  SendDate: string;
  SolarPower: number;
  SolarEnergy: number;
  Consumption: number;
}

export interface ExecutiveSummary {
  currentMonthCost: number;
  costComparisonPercentage: number;
  costTrend: "up" | "down";
  totalEnergySavings: number;
  solarGeneration: number | null;
  batteryUsage: number | null;
  keyRecommendations: Array<{
    text: string;
    priority: "high" | "medium" | "low";
    estimatedImpact: string;
  }>;
}

export interface TariffAnalysis {
  currentRate: number;
  averageRate: number;
  peakRate: number;
  offPeakRate: number;
  forecastedRates: Array<{
    time: string;
    rate: number;
  }>;
  savingsOpportunities: string[];
  pattern_analysis: string;
}

export interface ConsumptionAnalytics {
  totalConsumption: number;
  averageDailyConsumption: number;
  peakConsumptionTime: string;
  peakConsumptionValue: number;
  consumptionByTimeOfDay: Array<{
    hour: number;
    average: number;
  }>;
  unusualPatterns?: string[];
  weatherImpact?: string;
  optimizationOpportunities?: string[];
  timeOfDayRecommendations?: string[];
}

export interface SolarAnalysis {
  dailyGeneration: number;
  monthlyGeneration: number;
  efficiency: number;
  savingsFromSolar: number;
  optimizations: string[];
  maintenance_tasks: string[];
  weather_impact: string;
  storage_tips: string[];
}
