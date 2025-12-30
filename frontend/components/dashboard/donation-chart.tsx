"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function DonationChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "donation-chart"],
    queryFn: async () => {
      const response = await api.get("/admin/donations/stats");
      const stats = response.data?.data || response.data;
      
      // Transform data for chart
      if (stats?.by_month) {
        return Object.entries(stats.by_month).map(([month, data]: [string, any]) => ({
          month,
          total: data.total || 0,
        }));
      }
      return [];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "currentColor" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "currentColor" }}
          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: number) => [
            `Rp ${value.toLocaleString("id-ID")}`,
            "Total",
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", r: 4 }}
          name="Total Donasi"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
