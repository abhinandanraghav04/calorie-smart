"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Target, Clock } from "lucide-react";

const stats = [
  {
    title: "Daily Calories",
    value: "1,355 / 2,000",
    change: "+12%",
    icon: Activity,
  },
  {
    title: "Weekly Average",
    value: "1,875 kcal",
    change: "-3%",
    icon: TrendingUp,
  },
  {
    title: "Goal Progress",
    value: "68%",
    change: "on track",
    icon: Target,
  },
  {
    title: "Streak",
    value: "12 days",
    change: "Personal best!",
    icon: Clock,
  },
];

const recentMeals = [
  { name: "Breakfast", calories: 420, time: "8:30 AM" },
  { name: "Morning Snack", calories: 150, time: "10:45 AM" },
  { name: "Lunch", calories: 685, time: "1:00 PM" },
  { name: "Afternoon Snack", calories: 100, time: "3:30 PM" },
];

export default function Dashboard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and stay on top of your nutrition goals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 16,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : index * 0.08,
                duration: shouldReduceMotion ? 0 : 0.3,
              }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              y: shouldReduceMotion ? 0 : 24,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Meals</CardTitle>
                <CardDescription>
                  View and manage your meals for today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMeals.map((meal, index) => (
                    <motion.div
                      key={meal.name}
                      initial={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        x: shouldReduceMotion ? 0 : -20,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : index * 0.07,
                        duration: shouldReduceMotion ? 0 : 0.25,
                      }}
                      className="border-border/60 bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-4 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{meal.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {meal.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {meal.calories} kcal
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button className="mt-6 w-full" variant="outline">
                  Add a new meal
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              y: shouldReduceMotion ? 0 : 24,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.1,
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Macros Breakdown</CardTitle>
                <CardDescription>
                  Today&apos;s macro distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <MacroBar
                  label="Protein"
                  current="82g"
                  target="150g"
                  value={55}
                  color="bg-primary"
                />
                <MacroBar
                  label="Carbs"
                  current="135g"
                  target="200g"
                  value={67}
                  color="bg-accent"
                />
                <MacroBar
                  label="Fat"
                  current="52g"
                  target="70g"
                  value={74}
                  color="bg-destructive"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 20,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary h-5 w-5" />
                Weekly Insights
              </CardTitle>
              <CardDescription>
                Personalized tips to help you stay on track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="border-primary/20 bg-background rounded-lg border p-4">
                <p className="font-medium">Great consistency this week!</p>
                <p className="text-muted-foreground mt-1">
                  You&apos;ve logged meals 6 out of 7 days. Keep up the momentum
                  to reach your goals.
                </p>
              </div>
              <div className="border-primary/20 bg-background rounded-lg border p-4">
                <p className="font-medium">Protein intake trending low</p>
                <p className="text-muted-foreground mt-1">
                  Consider adding more protein-rich foods to hit your 150g daily
                  target. Try Greek yogurt, chicken, or legumes.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function MacroBar({
  label,
  current,
  target,
  value,
  color,
}: {
  label: string;
  current: string;
  target: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {current} / {target}
        </span>
      </div>
      <div className="bg-secondary h-2 overflow-hidden rounded-full">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
