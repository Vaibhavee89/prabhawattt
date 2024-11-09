import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserData } from "@/types/user";
import { Battery, MapPinHouse, Sun, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface StatsCardsProps {
  userData: UserData;
  totalSolarPower: number;
  uniqueDays: number;
  weatherData: any;
}

const LocationWeatherDetails = ({ weatherData }: { weatherData: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex absolute top-[-10px] right-[-10px] items-center text-sm justify-end text-muted-foreground hover:text-foreground">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white p-2 shadow-md cursor-pointer">
            <MapPinHouse />
            <p>{weatherData ? weatherData.name : ""}</p>
          </div>
        </div>
      </DialogTrigger>

      {weatherData && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weather Details</DialogTitle>
          </DialogHeader>
          <DialogDescription className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-foreground">Temperature</p>
              <p>{weatherData.main.temp}°C</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Feels Like</p>
              <p>{weatherData.main.feels_like}°C</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Humidity</p>
              <p>{weatherData.main.humidity}%</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Wind Speed</p>
              <p>{weatherData.wind.speed} m/s</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Visibility</p>
              <p>{weatherData.visibility} m</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Weather</p>
              <p>{weatherData.weather[0].description}</p>
            </div>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default function StatsCards({
  userData,
  totalSolarPower,
  uniqueDays,
  weatherData,
}: StatsCardsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Current Battery Power
          </CardTitle>
          <Zap className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl flex items-center justify-start">
            <p className="font-bold">
              {userData.currentBatteryPower !== undefined
                ? userData.currentBatteryPower.toFixed(1)
                : 0}{" "}
              kW
            </p>
            <p className="text-xs text-muted-foreground ml-2">
              {userData.currentBatteryPower !== undefined &&
              userData.currentBatteryPower.toFixed(1) ===
                userData.storageCapacity
                ? "(Full)"
                : ""}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalSolarPower.toFixed(2)} kW produced in the past {uniqueDays}{" "}
            days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
          <Battery className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userData.hasBatteryStorage
              ? `${userData.storageCapacity} kW`
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {userData.hasBatteryStorage
              ? "Total Battery Capacity"
              : "No battery storage"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Solar System Capacity
          </CardTitle>
          <Sun className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userData.hasSolarPanels ? `${userData.solarCapacity} kW` : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            Capacity of Solar Panels
          </p>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{userData.monthlyBill}</div>
          <p className="text-xs text-muted-foreground">
            Average monthly electricity bill
          </p>
          <LocationWeatherDetails weatherData={weatherData} />
        </CardContent>
      </Card>
    </div>
  );
}
