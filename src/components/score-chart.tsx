"use client";

import type { Friend } from "@/lib/types";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

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

    const allDatePoints = new Set<number>();
    friends.forEach((friend) => {
      friend.scoreHistory.forEach((record) => {
        allDatePoints.add(new Date(record.date).setHours(0, 0, 0, 0));
      });
    });

    const today = new Date().setHours(0, 0, 0, 0);
    if (!allDatePoints.has(today)) {
        allDatePoints.add(today);
    }

    const sortedDates = Array.from(allDatePoints).sort((a, b) => a - b);
    
    const data = sortedDates.map((timestamp) => {
      const date = new Date(timestamp);
      const dataPoint: { [key: string]: string | number } = {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };

      friends.forEach((friend) => {
        const historyUptoDate = friend.scoreHistory
          .filter((h) => new Date(h.date).getTime() <= timestamp + 86399999) // End of the day
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        dataPoint[friend.name] = historyUptoDate.length > 0 ? historyUptoDate[0].score : 0;
      });

      return dataPoint;
    });

    return { chartData: data, chartConfig: config };
  }, [friends]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <CardTitle>Score Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                allowDecimals={false}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {friends.map((friend) => (
              <Line
                key={friend.id}
                dataKey={friend.name}
                type="monotone"
                stroke={`var(--color-${friend.name})`}
                strokeWidth={3}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
