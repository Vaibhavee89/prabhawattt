"use client";

import {
  EnergySourceChart,
  SavingsProjectionChart,
  SolarGrowthChart,
} from "@/components/learn-more/learn-more-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Battery,
  CloudSun,
  DollarSign,
  Leaf,
  Wind,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LearnMore() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Learn More About Solar Energy and PrabhaWatt
            </h1>
            <p className="text-xl text-gray-600">
              Discover how solar energy and PrabhaWatt can revolutionize your
              energy consumption and savings.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">What is Solar Energy?</h2>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="mb-4">
                  Solar energy is the radiant light and heat from the Sun that
                  is harnessed using a range of technologies such as solar
                  heating, photovoltaics, solar thermal energy, solar
                  architecture, molten salt power plants and artificial
                  photosynthesis.
                </p>
                <p>
                  It is an important source of renewable energy and its
                  technologies are broadly characterized as either passive solar
                  or active solar depending on how they capture and distribute
                  solar energy or convert it into solar power.
                </p>
              </div>
              <div className="relative h-64 md:h-full">
                <Image
                  src="/solar2.jpg"
                  alt="Solar panels on a roof"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              The Growth of Solar Energy
            </h2>
            <p className="mb-4">
              Solar energy has seen tremendous growth over the past decade,
              becoming one of the fastest-growing sources of electricity
              worldwide.
            </p>
            <div className="flex items-center justify-center">
              <SolarGrowthChart />
            </div>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.statista.com/outlook/io/energy/renewable-energy/solar-energy/worldwide#production`}
              className="mt-4 text-sm text-gray-600 hover:underline"
            >
              Source: Statista Solar Energy - Worldwide
            </Link>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              Benefits of Solar Energy
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Leaf className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Environmentally Friendly</CardTitle>
                </CardHeader>
                <CardContent>
                  Solar energy is clean, renewable, and produces no harmful
                  emissions, helping to reduce our carbon footprint.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Cost Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  After initial installation costs, solar energy can
                  significantly reduce or eliminate your electricity bills.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Battery className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Energy Independence</CardTitle>
                </CardHeader>
                <CardContent>
                  Solar panels allow you to generate your own electricity,
                  reducing reliance on the grid and energy companies.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CloudSun className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Low Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  Solar panels require minimal maintenance and have a long
                  lifespan, often lasting 25-30 years or more.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Wind className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Versatility</CardTitle>
                </CardHeader>
                <CardContent>
                  Solar energy can be used in diverse applications, from
                  powering homes to charging electric vehicles.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Increasing Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  Solar panel technology is continuously improving, with newer
                  models offering higher efficiency and better performance.
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              Current Energy Landscape
            </h2>
            <p className="mb-4">
              While solar energy is growing rapidly, it still represents a small
              portion of overall electricity generation. Here&apos;s a breakdown
              of India&apos;s electricity generation by source:
            </p>
            <div className="flex items-center justify-center mb-2">
              <EnergySourceChart />
            </div>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.investindia.gov.in/sector/renewable-energy#:~:text=This%20is%20the%20world's%20largest,(as%20of%20Sep%202024).`}
              className="mt-4 text-sm text-gray-600 hover:underline"
            >
              Source: Renewable Energy Information, Invest India, 2024 data
            </Link>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Why Choose PrabhaWatt?</h2>
            <p className="mb-6">
              PrabhaWatt is not just another solar energy solution – it&apos;s a
              comprehensive platform designed to maximize your solar investment
              and energy savings. Here&apos;s why PrabhaWatt stands out:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Advanced Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  Our AI-driven algorithms continuously analyze your energy
                  production and consumption patterns to optimize energy usage
                  and storage, ensuring you get the most out of your solar
                  system.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Real-time Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  With PrabhaWatt, you get access to real-time data and insights
                  about your energy production, consumption, and savings,
                  allowing you to make informed decisions.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Battery className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Smart Storage Management</CardTitle>
                </CardHeader>
                <CardContent>
                  If you have a battery storage system, PrabhaWatt optimizes
                  when to store excess energy and when to use it, maximizing
                  your savings and reducing reliance on the grid.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Increased Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  By optimizing your energy usage and taking advantage of
                  time-of-use rates, PrabhaWatt helps you save more money
                  compared to a standard solar setup.
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              Projected Savings with PrabhaWatt
            </h2>
            <p className="mb-4">
              See how much you could potentially save over time by using
              PrabhaWatt to optimize your solar energy system:
            </p>
            <div className="flex items-center justify-center">
              <SavingsProjectionChart />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Note: Actual savings may vary based on individual energy
              consumption, local electricity rates, and solar system
              specifications.
            </p>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Optimize Your Solar Energy?
            </h2>
            <p className="mb-6">
              Join thousands of satisfied customers who are maximizing their
              solar investment with PrabhaWatt. Start your journey to greater
              energy efficiency and savings today!
            </p>
            <Link href="/sign-in">
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Get Started with PrabhaWatt
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-6 mt-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            © 2024 PrabhaWatt. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            For more information about solar energy, visit the{" "}
            <a
              href="https://mnre.gov.in/solar-overview/"
              className="text-green-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ministry Of New And Renewable Energy (MNRE) website
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
