"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// source - https://www.statista.com/outlook/io/energy/renewable-energy/solar-energy/worldwide#production
const solarGrowthData = [
  { year: 2018, capacity: 0.63 },
  { year: 2019, capacity: 0.74 },
  { year: 2020, capacity: 0.87 },
  { year: 2021, capacity: 1.05 },
  { year: 2022, capacity: 1.23 },
  { year: 2023, capacity: 1.05 },
  { year: 2024, capacity: 1.3 },
  { year: 2025, capacity: 1.39 },
  { year: 2026, capacity: 1.5 },
  { year: 2027, capacity: 1.61 },
  { year: 2028, capacity: 1.73 },
  { year: 2029, capacity: 1.85 },
];

// source - https://www.investindia.gov.in/sector/renewable-energy#:~:text=This%20is%20the%20world's%20largest,(as%20of%20Sep%202024)
const energySourceData = [
  { name: "Solar", value: 90.76, fill: "#FFB627" },
  { name: "Wind", value: 47.36, fill: "#89CFF0" },
  { name: "Biomass/Co-generation", value: 10.72, fill: "#0077BE" },
  { name: "Small Hydro", value: 5.07, fill: "#7CB9E8" },
  { name: "Waste To Energy", value: 0.6, fill: "#C4B454" },
  { name: "Large Hydro", value: 46.92, fill: "#4A4A4A" },
  { name: "Other", value: 13.6, fill: "#B4B4B4" },
];

const savingsProjectionData = [
  { year: 1, withoutSolar: 2400, withSolar: 1800 },
  { year: 5, withoutSolar: 13200, withSolar: 9100 },
  { year: 10, withoutSolar: 28800, withSolar: 18720 },
  { year: 15, withoutSolar: 46800, withSolar: 28080 },
  { year: 20, withoutSolar: 67200, withSolar: 37632 },
  { year: 25, withoutSolar: 90000, withSolar: 47700 },
];

export function SolarGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Global Solar Capacity Growth (Current and Projected)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            capacity: {
              label: "Kwh (Trillion)",
              color: "#FFB627",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={solarGrowthData}>
              <XAxis
                dataKey="year"
                label={{ value: "Year", position: "bottom" }}
              />
              <YAxis
                label={{ value: "Trillion Kilo-Watt-Hours", angle: -90 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="#FFB627"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function EnergySourceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>India Electricity Generation by Source (2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Percentage",
              color: "#0077BE",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={energySourceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 rounded-lg shadow-md">
                        <p>{`${payload[0].name}: ${payload[0].value} GW`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function SavingsProjectionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>25-Year Energy Cost Projection</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            withoutSolar: {
              label: "Traditional Energy Costs ($)",
              color: "#E63946",
            },
            withSolar: {
              label: "Costs with Solar ($)",
              color: "#2A9D8F",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={savingsProjectionData}>
              <XAxis
                dataKey="year"
                label={{ value: "Years", position: "bottom" }}
              />
              <YAxis
                label={{ value: "Cost ($)", angle: -90, position: "left" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="withoutSolar"
                fill="#E63946"
                name="Traditional Energy Costs"
              />
              <Bar dataKey="withSolar" fill="#2A9D8F" name="Costs with Solar" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
