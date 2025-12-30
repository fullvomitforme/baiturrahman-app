"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "#8B5CF6",
  "#F59E0B",
];

export function DonationsByCategoryChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["donations", "stats"],
    queryFn: async () => {
      const response = await api.get("/admin/donations/stats");
      return response.data?.data || response.data;
    },
  });

  const chartData = stats?.by_category
    ? Object.entries(stats.by_category).map(([name, data]: [string, any]) => ({
        name,
        value: data.total || 0,
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Donasi per Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Tidak ada data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  `Rp ${new Intl.NumberFormat("id-ID").format(value)}`,
                  "Total",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

