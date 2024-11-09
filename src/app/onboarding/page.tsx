"use client";

import { AutoCompleteInput } from "@/components/onboarding/autocomplete-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthContext } from "@/context/auth-context";
import discomData from "@/data/electricity-providers.json";
import { db } from "@/lib/firebase";
import autoAnimate from "@formkit/auto-animate";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { doc, setDoc } from "firebase/firestore";
import { ChevronLeft, ChevronRight, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [discoms, setDiscoms] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    electricityProvider: "",
    monthlyBill: "",
    hasSolarPanels: false,
    solarCapacity: "",
    installationDate: "",
    hasBatteryStorage: false,
    storageCapacity: "",
    smartDevices: {
      thermostat: false,
      washingMachine: false,
      dishwasher: false,
      evCharger: false,
      other: "",
    },
    primaryGoal: "",
    notificationMethod: "",
    reportFrequency: "",
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user } = useAuthContext(); // Get the current user
  const router = useRouter();
  const step1Parent = useRef(null);

  useEffect(() => {
    step1Parent.current && autoAnimate(step1Parent.current);
  }, [step1Parent]);

  useEffect(() => {
    discomData.DISCOMs.forEach((discom) => {
      setDiscoms((prevDiscoms) => [...prevDiscoms, discom?.DISCOM!]);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Handle nested state for smartDevices.other
    if (name === "smartDevices.other") {
      setFormData((prevData) => ({
        ...prevData,
        smartDevices: {
          ...prevData.smartDevices,
          other: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSmartDeviceChange = (
    device: keyof typeof formData.smartDevices,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      smartDevices: {
        ...prevData.smartDevices,
        [device]: !prevData.smartDevices[device],
      },
    }));
  };

  const prevStep = () => setStep(step - 1);

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.electricityProvider) {
          toast.error("Please select your electricity provider");
          return false;
        }
        if (!formData.monthlyBill) {
          toast.error("Please enter your average monthly electricity bill");
          return false;
        }
        if (formData.hasSolarPanels) {
          if (!formData.solarCapacity) {
            toast.error("Please enter your solar system capacity");
            return false;
          }
          if (!formData.installationDate) {
            toast.error(
              "Please enter the installation date of your solar panels",
            );
            return false;
          }
          if (formData.hasBatteryStorage && !formData.storageCapacity) {
            toast.error("Please enter your battery storage capacity");
            return false;
          }
        }
        break;
      case 2:
        break;
      case 3:
        if (!formData.primaryGoal) {
          toast.error("Please select your primary energy goal");
          return false;
        }
        break;
      case 4:
        if (!formData.notificationMethod) {
          toast.error("Please select your preferred notification method");
          return false;
        }
        if (!formData.reportFrequency) {
          toast.error("Please select your preferred report frequency");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleFormSubmit = async () => {
    if (validateStep()) {
      setShowConfirmDialog(true);
    }
  };

  const confirmAndSubmit = async () => {
    setShowConfirmDialog(false);
    try {
      if (!user) throw new Error("User not authenticated");

      setLoading(true);
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        createdAt: new Date(),
      });

      toast.success("Setup completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      setLoading(false);
      toast.error(
        "An error occurred while saving your data. Please try again.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gray-100">
      <TooltipProvider>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Welcome to PrabhaWatt</CardTitle>
            <CardDescription>
              {"Let's set up your energy profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-4" ref={step1Parent}>
                  <h2 className="text-xl font-semibold">Energy Profile</h2>
                  <div className="flex w-full items-center justify-start">
                    <Label htmlFor="electricityProvider">
                      * Current electricity provider
                    </Label>
                    <AutoCompleteInput
                      data={discoms}
                      className="w-full"
                      value={formData.electricityProvider}
                      setValue={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          electricityProvider: value,
                        }))
                      }
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircledIcon className="ml-2" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-background text-foreground rounded-md shadow-lg max-w-xs">
                        <p>
                          Provided in Indid Climate and Energy Dashboard by NITI
                          Aayog
                        </p>
                        <Link
                          target="_blank"
                          className="text-primary underline"
                          rel="noreferrer"
                          href={`https://iced.niti.gov.in/energy/electricity/distribution`}
                        >
                          https://iced.niti.gov.in/energy/electricity/distribution
                        </Link>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>
                    <Label htmlFor="monthlyBill">
                      * Average monthly electricity bill (₹)
                    </Label>
                    <Input
                      id="monthlyBill"
                      name="monthlyBill"
                      type="number"
                      placeholder="Around ₹1200 - ₹1500 per person"
                      value={formData.monthlyBill}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Do you have solar panels?</Label>
                    <RadioGroup
                      name="hasSolarPanels"
                      value={formData.hasSolarPanels.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasSolarPanels: value === "true",
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="solar-yes" />
                        <Label htmlFor="solar-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="solar-no" />
                        <Label htmlFor="solar-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {formData.hasSolarPanels && (
                    <>
                      <div>
                        <Label htmlFor="solarCapacity">
                          * Solar system capacity (kW)
                        </Label>
                        <Input
                          id="solarCapacity"
                          name="solarCapacity"
                          type="number"
                          placeholder="Around 1 - 4kW"
                          value={formData.solarCapacity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="installationDate">
                          * Installation date
                        </Label>
                        <Input
                          id="installationDate"
                          name="installationDate"
                          type="date"
                          value={formData.installationDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Do you have battery storage?</Label>
                        <RadioGroup
                          name="hasBatteryStorage"
                          value={formData.hasBatteryStorage.toString()}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              hasBatteryStorage: value === "true",
                            }))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="battery-yes" />
                            <Label htmlFor="battery-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="battery-no" />
                            <Label htmlFor="battery-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {formData.hasBatteryStorage && (
                        <div>
                          <Label htmlFor="storageCapacity">
                            Storage capacity (kWh)
                          </Label>
                          <Input
                            id="storageCapacity"
                            name="storageCapacity"
                            placeholder="Around 10kWh"
                            type="number"
                            value={formData.storageCapacity}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Smart Home Integration
                  </h2>
                  <p>Select the smart devices you own:</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thermostat"
                        checked={formData.smartDevices.thermostat}
                        onCheckedChange={() =>
                          handleSmartDeviceChange("thermostat")
                        }
                      />
                      <Label htmlFor="thermostat">Smart thermostat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="washingMachine"
                        checked={formData.smartDevices.washingMachine}
                        onCheckedChange={() =>
                          handleSmartDeviceChange("washingMachine")
                        }
                      />
                      <Label htmlFor="washingMachine">
                        Smart washing machine
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dishwasher"
                        checked={formData.smartDevices.dishwasher}
                        onCheckedChange={() =>
                          handleSmartDeviceChange("dishwasher")
                        }
                      />
                      <Label htmlFor="dishwasher">Smart dishwasher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="evCharger"
                        checked={formData.smartDevices.evCharger}
                        onCheckedChange={() =>
                          handleSmartDeviceChange("evCharger")
                        }
                      />
                      <Label htmlFor="evCharger">EV charger</Label>
                    </div>
                    <div>
                      <Label htmlFor="otherDevices">
                        Other devices (please specify)
                      </Label>
                      <Input
                        id="otherDevices"
                        name="smartDevices.other"
                        value={formData.smartDevices.other}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Energy Goals</h2>
                  <div>
                    <Label>* Select your primary energy goal:</Label>
                    <RadioGroup
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, primaryGoal: value }))
                      }
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reduceBills" id="reduce-bills" />
                        <Label htmlFor="reduce-bills">
                          Reduce energy bills
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="maximizeSolar"
                          id="maximize-solar"
                        />
                        <Label htmlFor="maximize-solar">
                          Maximize use of solar energy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="reduceCarbon"
                          id="reduce-carbon"
                        />
                        <Label htmlFor="reduce-carbon">
                          Reduce carbon footprint
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="gridStability"
                          id="grid-stability"
                        />
                        <Label htmlFor="grid-stability">
                          Optimize for grid stability
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Preferences</h2>
                  <div>
                    <Label htmlFor="notificationMethod">
                      * Preferred notification method
                    </Label>
                    <Select
                      name="notificationMethod"
                      value={formData.notificationMethod}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          notificationMethod: value,
                        }));

                        // Request notification permission if "push" is selected
                        if (value === "push") {
                          Notification.requestPermission().then(
                            (permission) => {
                              if (permission === "granted") {
                                toast.success(
                                  "Notification permission granted!",
                                );
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  notificationMethod: "none",
                                }));
                                toast.error("Notification permission denied.");
                              }
                            },
                          );
                        }
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="push">Push notification</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reportFrequency">
                      * Frequency of reports
                    </Label>
                    <Select
                      name="reportFrequency"
                      value={formData.reportFrequency}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          reportFrequency: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select report frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button onClick={prevStep} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={nextStep} className="ml-auto">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFormSubmit}
                disabled={loading}
                className="ml-auto bg-green-600 hover:bg-green-700"
              >
                {loading ? "Loading..." : "Complete Setup"}{" "}
                <Sun className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </TooltipProvider>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Setup</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete the setup with the provided
              information?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmAndSubmit}>Confirm and Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
