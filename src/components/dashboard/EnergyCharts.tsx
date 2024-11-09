// components/dashboard/EnergyCharts.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EnergyChartsProps {
  energyData: Array<{
    SendDate: string;
    SolarPower: number;
    SolarEnergy: number;
    Consumption: number;
  }>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
}

export default function EnergyCharts({
  energyData,
  handleFileUpload,
  fileName,
}: EnergyChartsProps) {
  return (
    <Tabs defaultValue="power-consumption">
      <TabsList>
        <TabsTrigger value="power-consumption">
          {/* Short form for smaller screens */}
          <span className="hidden md:inline">
            Power Consumption vs. Solar Generation
          </span>
          <span className="inline md:hidden">PC vs. SG</span>
        </TabsTrigger>
        <TabsTrigger value="solar-energy">
          <span className="hidden md:inline">
            Cumulative Solar Energy Generation
          </span>
          <span className="inline md:hidden">Cumulative Solar</span>
        </TabsTrigger>
        <TabsTrigger value="hourly-consumption">
          <span className="hidden md:inline">Hourly Energy Consumption</span>
          <span className="inline md:hidden">Hourly Consumption</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="power-consumption">
        <Card>
          <CardHeader>
            <CardTitle>Power Consumption vs. Solar Generation</CardTitle>
            <CardDescription className="flex items-center justify-between">
              <p>Comparison of consumption and solar generation</p>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-fit"
                id="energy-data-file"
                value={fileName ? undefined : ""}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyData}>
                <XAxis
                  dataKey="SendDate"
                  label={{ value: "Date", angle: 0, position: "bottom" }}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Power (kW)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Solar Power (kW)",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Consumption"
                  stroke="#8884d8"
                  name="Consumption (kW)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="SolarPower"
                  stroke="#82ca9d"
                  name="Solar Power (kW)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="solar-energy">
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Solar Energy Generation</CardTitle>
            <CardDescription>
              Total solar energy generated over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energyData}>
                <XAxis
                  dataKey="SendDate"
                  label={{ value: "Date", angle: 0, position: "bottom" }}
                />
                <YAxis
                  label={{
                    value: "Solar Energy (kWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="SolarEnergy"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Solar Energy (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="hourly-consumption">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Energy Consumption</CardTitle>
            <CardDescription>
              Energy consumption for each time interval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={energyData}>
                <XAxis
                  dataKey="SendDate"
                  label={{ value: "Date", angle: 0, position: "bottom" }}
                />
                <YAxis
                  label={{
                    value: "Consumption (kW)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="Consumption"
                  fill="#8884d8"
                  name="Consumption (kW)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
