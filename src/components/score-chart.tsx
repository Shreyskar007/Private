"use client";

import type { Friend } from "@/lib/types";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";

interface ScoreChartProps {
  friends: Friend[];
}

export default function ScoreChart({ friends }: ScoreChartProps) {
  const { chartData, chartConfig } = useMemo(() => {
    if (!friends || friends.length === 0) {
      return { chartData: [], chartConfig: {} };
    }

    const config: ChartConfig = {};
    friends.forEach((friend) => {
      config[friend.name] = {
        label: friend.name,
        color: friend.color,
      };
    });

    const data = friends.map(friend => ({
      name: friend.name,
      score: friend.score,
      fill: `var(--color-${friend.name})`
    }));

    return { chartData: data, chartConfig: config };
  }, [friends]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <CardTitle>Current Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
                dataKey="score"
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="score" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
