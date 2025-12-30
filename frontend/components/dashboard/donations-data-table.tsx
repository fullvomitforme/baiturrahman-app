"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ConfirmDonationDialog } from "./confirm-donation-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function DonationsDataTable({
  donations,
  search,
}: {
  donations: any[];
  search: string;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.put(`/admin/donations/${id}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Donasi berhasil dikonfirmasi");
      setConfirmingId(null);
    },
  });

  const filteredDonations = donations.filter((donation) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      donation.donor_name?.toLowerCase().includes(searchLower) ||
      donation.donation_code?.toLowerCase().includes(searchLower)
    );
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "donation_code",
      header: "Kode",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.donation_code}</span>
      ),
    },
    {
      accessorKey: "donor_name",
      header: "Donatur",
      cell: ({ row }) => <span className="font-medium">{row.original.donor_name}</span>,
    },
    {
      accessorKey: "amount",
      header: "Jumlah",
      cell: ({ row }) => (
        <span className="font-semibold">
          Rp {new Intl.NumberFormat("id-ID").format(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            statusColors[
              row.original.status as keyof typeof statusColors
            ] || statusColors.pending
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) =>
        format(new Date(row.original.created_at), "dd MMM yyyy", {
          locale: idLocale,
        }),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status === "pending" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfirmingId(row.original.id)}
            >
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={filteredDonations} />
      {confirmingId && (
        <ConfirmDonationDialog
          open={!!confirmingId}
          onClose={() => setConfirmingId(null)}
          donationId={confirmingId}
          onConfirm={() => confirmMutation.mutate(confirmingId)}
        />
      )}
    </>
  );
}

