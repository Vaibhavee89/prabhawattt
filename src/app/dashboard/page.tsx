"use client";

import DiscomInfoCard from "@/components/dashboard/DiscomInfoCard";
import EnergyCharts from "@/components/dashboard/EnergyCharts";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton";
import StatsCards from "@/components/dashboard/StatsCards";
import TOURateHistoryCard from "@/components/dashboard/TOURateHistoryCard";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { fetchDISCOMData, fetchTOUHistory, fetchWeatherData } from "@/lib/api";
import { db } from "@/lib/firebase";
import { calculateCurrentBatteryPower } from "@/lib/utils";
import { Discom, EnergyData, TOUData, UserData } from "@/types/user";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { parse } from "papaparse";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [discomInfo, setDiscomInfo] = useState<Discom | null>(null);
  const [touHistory, setTOUHistory] = useState<TOUData[]>([]);

  // Initialize with the current battery power from userData when available
  const lastCalculatedBatteryPower = useRef<number>(0);

  // CSV processing function
  const processCSV = useCallback((str: string) => {
    parse(str, {
      header: true,
      complete: (results) => {
        const processedData = results.data.map((row: any) => ({
          SendDate: row["SendDate"],
          SolarPower: parseFloat(row["Solar Power (kW)"]),
          SolarEnergy: parseFloat(row["Solar energy Generation  (kWh)"]),
          Consumption: parseFloat(row["consumptionValue (kW)"]),
        }));
        setEnergyData(processedData);
        localStorage.setItem("energyData", JSON.stringify(processedData));
      },
    });
  }, []);

  // Initialize dashboard data and set initial battery power
  useEffect(() => {
    const initializeDashboard = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserData;
            setUserData(userData);
            // Initialize the ref with the current battery power from Firestore
            lastCalculatedBatteryPower.current =
              userData.currentBatteryPower || 0;
            const discomData = fetchDISCOMData(userData.electricityProvider);
            if (discomData) {
              setDiscomInfo(discomData);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user]);

  // Update battery power when energy data or user data changes
  useEffect(() => {
    const updateBatteryPower = async () => {
      if (user && userData && energyData.length > 0) {
        const newBatteryPower = calculateCurrentBatteryPower(
          energyData,
          userData,
        );

        // Only update if the value has changed and is different from current
        if (
          newBatteryPower !== lastCalculatedBatteryPower.current &&
          newBatteryPower !== userData.currentBatteryPower
        ) {
          console.log("Updating battery power:", {
            previous: lastCalculatedBatteryPower.current,
            new: newBatteryPower,
            storedInUserData: userData.currentBatteryPower,
          });

          lastCalculatedBatteryPower.current = newBatteryPower;

          try {
            await updateDoc(doc(db, "users", user.uid), {
              currentBatteryPower: newBatteryPower,
            });
            toast.success("Your battery power has been updated successfully");
          } catch (error) {
            console.error("Error updating battery power:", error);
            toast.error("Failed to update battery power");
          }
        }
      }
    };

    updateBatteryPower();
  }, [energyData, userData, user]);

  // Load stored energy data
  useEffect(() => {
    const storedData = localStorage.getItem("energyData");
    if (storedData) {
      setEnergyData(JSON.parse(storedData));
      setFileName("energyData.csv");
    }
  }, []);

  // Fetch geolocation and weather data
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { latitude, longitude } = coords;
        const data = await fetchWeatherData(latitude, longitude);
        if (data) {
          setWeatherData(data);
        }
      });
    }
  }, []);

  // Fetch TOU history
  useEffect(() => {
    let isMounted = true;
    fetchTOUHistory().then((touHistory) => {
      if (isMounted) {
        const latestTou = touHistory[touHistory.length - 1];
        toast.success("Latest TOU rate fetched", {
          description: `Current TOU rate: ₹${latestTou.rate} /kwh`,
          action: (
            <Button
              onClick={() => {
                toast.dismiss();
              }}
              className="ml-auto"
              variant={"outline"}
              size={"sm"}
            >
              Ok
            </Button>
          ),
        });
        setTOUHistory(touHistory);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // File upload handler
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === "string") {
            processCSV(text);
          }
        };
        reader.readAsText(file);
      }
    },
    [processCSV],
  );

  // Calculate dashboard metrics
  const totalSolarPower = energyData.reduce(
    (sum, data) => sum + data.SolarEnergy,
    0,
  );
  const uniqueDays = new Set(
    energyData.map((data) =>
      new Date(data.SendDate.split(" ")[0]).toDateString(),
    ),
  ).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] flex-col text-sm text-muted-foreground">
        <p className="text-center">
          No user data available.
          <br /> Perhaps you havn't completed the{" "}
          <span className="font-bold">onboarding</span> process?
        </p>
        <Link href="/onboarding">
          <Button className="mt-4" variant={"outline"}>
            Go back to onboarding
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <StatsCards
            userData={userData}
            totalSolarPower={totalSolarPower}
            uniqueDays={uniqueDays}
            weatherData={weatherData}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DiscomInfoCard discomInfo={discomInfo} touHistory={touHistory} />
            <TOURateHistoryCard touHistory={touHistory} />
          </div>

          <EnergyCharts
            energyData={energyData}
            handleFileUpload={handleFileUpload}
            fileName={fileName}
          />

          <div className="flex mt-6 justify-between items-center">
            <GenerateReportButton
              user={user}
              userData={userData}
              energyData={energyData}
              weatherData={weatherData}
              discomInfo={discomInfo}
              touHistory={touHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
