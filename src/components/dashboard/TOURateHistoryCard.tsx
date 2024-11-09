import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TOUData } from "@/types/user";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Alert } from "../ui/alert";

export default function TOURateHistoryCard({
  touHistory,
}: {
  touHistory: TOUData[];
}) {
  const lastTou = touHistory[touHistory.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>TOU Rate History</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={225}>
          <LineChart data={touHistory}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) =>
                new Date(timestamp).toLocaleTimeString()
              }
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Rate (₹/kWh)",
                angle: -90,
                position: "insideLeft",
                offset: 15,
              }}
            />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value) => [
                `₹${Number(value).toFixed(2)}/kWh`,
                "Rate",
              ]}
            />
            <Line type="stepAfter" dataKey="rate" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        {lastTou &&
          (lastTou.rate < 5 ? (
            <Alert className="mt-4">
              <p className="text-sm">
                <span className="font-bold">Low TOU rates: </span> Consider
                switching to Grid energy if you haven't already.
              </p>
              <p className="text-sm text-muted-foreground">
                {(((5 - lastTou.rate) / 5) * 100).toFixed(2)}% lower than usual.
              </p>
            </Alert>
          ) : lastTou.rate < 10 ? (
            <Alert className="mt-4">
              <p className="text-sm">
                <span className="font-bold">Moderate TOU rates: </span> No
                immediate action required.
              </p>
              <p className="text-sm text-muted-foreground">
                Rates between ₹{(5 + Math.random()).toFixed(2)} and ₹
                {(10 - Math.random()).toFixed(2)} are normal.
              </p>
            </Alert>
          ) : (
            <Alert className="mt-4">
              <p className="text-sm">
                <span className="font-bold">High TOU rates: </span> Consider
                switching to Solar energy if available.
              </p>
              <p className="text-sm text-muted-foreground">
                {(((lastTou.rate - 10) / 5) * 100).toFixed(2)}% higher than
                usual.
              </p>
            </Alert>
          ))}
      </CardContent>
    </Card>
  );
}
