"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ConfirmDialog } from "./confirm-dialog";
import { useState } from "react";

const categoryColors = {
  kajian: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  sosial: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  pendidikan: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const statusColors = {
  upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function EventsDataTable({
  status,
  search,
  onEdit,
}: {
  status?: string;
  search: string;
  onEdit: (event: any) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: events } = useQuery({
    queryKey: ["events", "admin", status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      const response = await api.get(`/admin/events?${params.toString()}`);
      return response.data?.data || response.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Kegiatan berhasil dihapus");
      setDeleteId(null);
    },
  });

  const filteredEvents = events?.filter((event: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return event.title?.toLowerCase().includes(searchLower);
  }) || [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge
          className={
            categoryColors[
              row.original.category as keyof typeof categoryColors
            ] || categoryColors.other
          }
        >
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "event_date",
      header: "Tanggal",
      cell: ({ row }) =>
        format(new Date(row.original.event_date), "dd MMM yyyy", {
          locale: idLocale,
        }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            statusColors[
              row.original.status as keyof typeof statusColors
            ] || statusColors.upcoming
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={filteredEvents} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Hapus Kegiatan"
        description="Apakah Anda yakin ingin menghapus kegiatan ini?"
        variant="destructive"
      />
    </>
  );
}

