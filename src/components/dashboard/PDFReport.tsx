import {
  ConsumptionAnalytics,
  ExecutiveSummary,
  SolarAnalysis,
  TariffAnalysis,
} from "@/types/user";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { User } from "firebase/auth";

// Enhanced styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#1a365d",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#2d3748",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 5,
  },
  subSectionTitle: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 8,
    color: "#4a5568",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  gridItem: {
    width: "50%",
    padding: 10,
  },
  label: {
    fontSize: 12,
    color: "#4a5568",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#1a202c",
    fontWeight: "bold",
  },
  list: {
    marginLeft: 15,
    marginTop: 5,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    color: "#4a5568",
  },
  priorityHigh: {
    color: "#e53e3e",
  },
  priorityMedium: {
    color: "#d69e2e",
  },
  priorityLow: {
    color: "#38a169",
  },
  smallText: {
    fontSize: 10,
    color: "#718096",
    marginTop: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginVertical: 10,
  },
  dateGenerated: {
    fontSize: 10,
    color: "#718096",
    marginTop: 20,
    textAlign: "right",
  },
});

interface PDFReportProps {
  user: User;
  executiveSummary: ExecutiveSummary;
  tariffAnalysis: TariffAnalysis;
  consumptionAnalytics: ConsumptionAnalytics;
  solarAnalysis: SolarAnalysis | null;
}

const PDFReport = ({
  user,
  executiveSummary,
  tariffAnalysis,
  consumptionAnalytics,
  solarAnalysis,
}: PDFReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.title}>Energy Report for {user.displayName}</Text>

      {/* Executive Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Current Month's Cost</Text>
            <Text style={styles.value}>
              ₹{executiveSummary.currentMonthCost.toLocaleString()}
            </Text>
            <Text style={styles.smallText}>
              {executiveSummary.costTrend === "up" ? "↑" : "↓"}{" "}
              {Math.abs(executiveSummary.costComparisonPercentage)}% vs last
              month
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Total Energy Savings</Text>
            <Text style={styles.value}>
              ₹{executiveSummary.totalEnergySavings.toLocaleString()}
            </Text>
          </View>
          {executiveSummary.solarGeneration && (
            <View style={styles.gridItem}>
              <Text style={styles.label}>Solar Generation</Text>
              <Text style={styles.value}>
                {executiveSummary.solarGeneration} kWh
              </Text>
            </View>
          )}
          {executiveSummary.batteryUsage && (
            <View style={styles.gridItem}>
              <Text style={styles.label}>Battery Usage</Text>
              <Text style={styles.value}>
                {executiveSummary.batteryUsage} kWh
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.subSectionTitle}>Key Recommendations</Text>
        <View style={styles.list}>
          {executiveSummary.keyRecommendations.map((rec, index) => (
            <View key={index}>
              <Text
                style={[
                  styles.listItem,
                  rec.priority === "high"
                    ? styles.priorityHigh
                    : rec.priority === "medium"
                      ? styles.priorityMedium
                      : styles.priorityLow,
                ]}
              >
                • {rec.text}
                {"\n"} Priority: {rec.priority.toUpperCase()}
                {"\n"} Impact: {rec.estimatedImpact}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tariff Analysis Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tariff Analysis</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Current Rate</Text>
            <Text style={styles.value}>₹{tariffAnalysis.currentRate}/kWh</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Average Rate</Text>
            <Text style={styles.value}>₹{tariffAnalysis.averageRate}/kWh</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Peak Rate</Text>
            <Text style={styles.value}>₹{tariffAnalysis.peakRate}/kWh</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Off-Peak Rate</Text>
            <Text style={styles.value}>₹{tariffAnalysis.offPeakRate}/kWh</Text>
          </View>
        </View>

        <Text style={styles.subSectionTitle}>Pattern Analysis</Text>
        <Text style={styles.listItem}>{tariffAnalysis.pattern_analysis}</Text>

        <Text style={styles.subSectionTitle}>Forecasted Rates</Text>
        <View style={styles.list}>
          {tariffAnalysis.forecastedRates.map((rate, index) => (
            <Text key={index} style={styles.listItem}>
              • {rate.time}: ₹{rate.rate}/kWh
            </Text>
          ))}
        </View>

        <Text style={styles.subSectionTitle}>Savings Opportunities</Text>
        <View style={styles.list}>
          {tariffAnalysis.savingsOpportunities.map((opportunity, index) => (
            <Text key={index} style={styles.listItem}>
              • {opportunity}
            </Text>
          ))}
        </View>
      </View>

      {/* Consumption Analytics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consumption Analytics</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Total Consumption</Text>
            <Text style={styles.value}>
              {consumptionAnalytics.totalConsumption} kWh
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Daily Average</Text>
            <Text style={styles.value}>
              {consumptionAnalytics.averageDailyConsumption} kWh
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Peak Consumption</Text>
            <Text style={styles.value}>
              {consumptionAnalytics.peakConsumptionValue} kW
            </Text>
            <Text style={styles.smallText}>
              at{" "}
              {new Date(
                consumptionAnalytics.peakConsumptionTime,
              ).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <Text style={styles.subSectionTitle}>Consumption by Time of Day</Text>
        <View style={styles.list}>
          {consumptionAnalytics.consumptionByTimeOfDay.map((data, index) => (
            <Text key={index} style={styles.listItem}>
              • {data.hour}:00 - Average: {data.average} kW
            </Text>
          ))}
        </View>

        {consumptionAnalytics.unusualPatterns && (
          <>
            <Text style={styles.subSectionTitle}>Unusual Patterns</Text>
            <View style={styles.list}>
              {consumptionAnalytics.unusualPatterns.map((pattern, index) => (
                <Text key={index} style={styles.listItem}>
                  • {pattern}
                </Text>
              ))}
            </View>
          </>
        )}

        {consumptionAnalytics.weatherImpact && (
          <>
            <Text style={styles.subSectionTitle}>Weather Impact</Text>
            <Text style={styles.listItem}>
              {consumptionAnalytics.weatherImpact}
            </Text>
          </>
        )}

        {consumptionAnalytics.timeOfDayRecommendations && (
          <>
            <Text style={styles.subSectionTitle}>
              Time-of-Day Recommendations
            </Text>
            <View style={styles.list}>
              {consumptionAnalytics.timeOfDayRecommendations.map(
                (rec, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {rec}
                  </Text>
                ),
              )}
            </View>
          </>
        )}
      </View>

      {/* Solar Analysis Section */}
      {solarAnalysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solar Analysis</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Daily Generation</Text>
              <Text style={styles.value}>
                {solarAnalysis.dailyGeneration} kWh
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Monthly Generation</Text>
              <Text style={styles.value}>
                {solarAnalysis.monthlyGeneration} kWh
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>System Efficiency</Text>
              <Text style={styles.value}>{solarAnalysis.efficiency}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Monthly Savings</Text>
              <Text style={styles.value}>
                ₹{solarAnalysis.savingsFromSolar}
              </Text>
            </View>
          </View>

          <Text style={styles.subSectionTitle}>System Optimizations</Text>
          <View style={styles.list}>
            {solarAnalysis.optimizations.map((optimization, index) => (
              <Text key={index} style={styles.listItem}>
                • {optimization}
              </Text>
            ))}
          </View>

          <Text style={styles.subSectionTitle}>Maintenance Tasks</Text>
          <View style={styles.list}>
            {solarAnalysis.maintenance_tasks.map((task, index) => (
              <Text key={index} style={styles.listItem}>
                • {task}
              </Text>
            ))}
          </View>

          <Text style={styles.subSectionTitle}>Weather Impact</Text>
          <Text style={styles.listItem}>{solarAnalysis.weather_impact}</Text>

          <Text style={styles.subSectionTitle}>Storage Tips</Text>
          <View style={styles.list}>
            {solarAnalysis.storage_tips.map((tip, index) => (
              <Text key={index} style={styles.listItem}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.dateGenerated}>
        Generated on: {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);

export default PDFReport;
