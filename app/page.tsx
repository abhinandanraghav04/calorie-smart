import Link from "next/link";
import { ArrowRight, Activity, Goal, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Dynamic goal tracking",
    description:
      "Set personalized calorie and macro goals that adapt with your progress.",
    icon: Goal,
  },
  {
    title: "AI-powered insights",
    description:
      "Understand trends, celebrate wins, and discover actionable next steps.",
    icon: Sparkles,
  },
  {
    title: "Connected fitness",
    description:
      "Sync data from your favorite wearables and health apps instantly.",
    icon: Activity,
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-30">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
              Smarter nutrition, less guesswork
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Fuel your goals with an intelligent calorie companion
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
              CalorieSmart helps you stay consistent. Visualize meals, track
              macros, and get gentle nudges powered by a modern, adaptive
              dashboard designed for everyday momentum.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/dashboard" className="flex items-center gap-2">
                  View dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/design-system">Explore components</Link>
              </Button>
            </div>
          </div>
          <Card className="border-primary/30 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Daily snapshot</CardTitle>
              <CardDescription>
                A quick glance at what CalorieSmart helps you stay on top of.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="border-primary/30 bg-primary/5 rounded-lg border border-dashed p-4">
                <p className="text-muted-foreground text-xs uppercase">
                  Remaining calories
                </p>
                <p className="mt-2 text-3xl font-semibold">645 kcal</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  You are on track to hit your goal today. Keep it up!
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Protein" value="82g" />
                <Metric label="Carbs" value="135g" />
                <Metric label="Fats" value="52g" />
              </div>
              <div className="bg-muted/40 text-muted-foreground rounded-lg p-4 text-sm">
                “CalorieSmart has helped me stay consistent for 3 months
                straight without feeling overwhelmed.”
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-border/60 bg-muted/40 border-t border-dashed">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Why people love CalorieSmart
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Designed for sustainability, progress, and a little extra delight.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/60 h-full">
                <CardHeader className="space-y-3">
                  <div className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center rounded-full">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 bg-background rounded-lg border p-4 text-center">
      <p className="text-muted-foreground text-xs uppercase">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
