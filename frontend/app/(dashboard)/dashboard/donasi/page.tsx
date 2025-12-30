"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DollarSign, CheckCircle, Clock, Download } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ConfirmDonationDialog } from "@/components/dashboard/confirm-donation-dialog";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  category: string;
  payment_method: string;
  status: string;
  created_at: string;
  donation_code: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "#F59E0B",
  "#10B981",
];

export default function DonasiPage() {
  const [confirmingDonation, setConfirmingDonation] = useState<Donation | null>(null);
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["donations", "stats"],
    queryFn: async () => {
      const response = await api.get("/admin/donations/stats");
      return response.data?.data || response.data;
    },
  });

  const { data: donations } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const response = await api.get("/admin/donations");
      return response.data?.data || response.data || [];
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/admin/donations/${id}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["donations", "stats"] });
      toast.success("Donasi berhasil dikonfirmasi");
      setConfirmingDonation(null);
    },
    onError: () => {
      toast.error("Gagal mengonfirmasi donasi");
    },
  });

  const columns: ColumnDef<Donation>[] = [
    {
      accessorKey: "donation_code",
      header: "Kode",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("donation_code")}</div>
      ),
    },
    {
      accessorKey: "donor_name",
      header: "Donatur",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("donor_name")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Jumlah",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return `Rp ${amount.toLocaleString("id-ID")}`;
      },
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("category")}</Badge>
      ),
    },
    {
      accessorKey: "payment_method",
      header: "Metode",
      cell: ({ row }) => row.getValue("payment_method"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, string> = {
          pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
          confirmed: "bg-primary/10 text-primary",
          cancelled: "bg-destructive/10 text-destructive",
        };
        return (
          <Badge
            variant="secondary"
            className={variants[status] || "bg-muted"}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return format(date, "dd MMM yyyy", { locale: idLocale });
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const donation = row.original;
        if (donation.status === "pending") {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmingDonation(donation)}
            >
              Konfirmasi
            </Button>
          );
        }
        return null;
      },
    },
  ];

  const chartData = stats?.by_category
    ? Object.entries(stats.by_category).map(([name, value]: [string, any]) => ({
        name,
        value: value.total || 0,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Donasi</h1>
        <p className="text-muted-foreground mt-1">
          Kelola donasi masjid
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Donasi"
          value={`Rp ${(stats?.total_amount || 0).toLocaleString("id-ID")}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Pending"
          value={(stats?.pending_count || 0).toString()}
          icon={Clock}
        />
        <StatsCard
          title="Terkonfirmasi"
          value={(stats?.confirmed_count || 0).toString()}
          icon={CheckCircle}
        />
        <StatsCard
          title="Total Transaksi"
          value={(stats?.total_count || 0).toString()}
          icon={DollarSign}
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Donasi per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
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
                  outerRadius={80}
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
                  formatter={(value: number) =>
                    `Rp ${value.toLocaleString("id-ID")}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Daftar Donasi</h2>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {donations && (
        <DataTable
          columns={columns}
          data={donations}
          searchKey="donor_name"
          searchPlaceholder="Cari donatur..."
        />
      )}

      <ConfirmDonationDialog
        open={!!confirmingDonation}
        onOpenChange={(open) => !open && setConfirmingDonation(null)}
        donation={confirmingDonation}
        onConfirm={() =>
          confirmingDonation && confirmMutation.mutate(confirmingDonation.id)
        }
      />
    </div>
  );
}
