"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Pin } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ConfirmDialog } from "./confirm-dialog";
import { useState } from "react";

const priorityColors = {
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  normal: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

export function AnnouncementsDataTable({
  search,
  onEdit,
}: {
  search: string;
  onEdit: (announcement: any) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: announcements } = useQuery({
    queryKey: ["announcements", "admin"],
    queryFn: async () => {
      const response = await api.get("/admin/announcements");
      return response.data?.data || response.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/admin/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Pengumuman berhasil dihapus");
      setDeleteId(null);
    },
  });

  const filteredAnnouncements = announcements?.filter((announcement: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return announcement.title?.toLowerCase().includes(searchLower);
  }) || [];

  // Sort: pinned first
  const sorted = [...filteredAnnouncements].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return 0;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "is_pinned",
      header: "",
      cell: ({ row }) =>
        row.original.is_pinned ? (
          <Pin className="h-4 w-4 text-primary" />
        ) : null,
    },
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Prioritas",
      cell: ({ row }) => (
        <Badge
          className={
            priorityColors[
              row.original.priority as keyof typeof priorityColors
            ] || priorityColors.normal
          }
        >
          {row.original.priority}
        </Badge>
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
      accessorKey: "published_at",
      header: "Dipublikasikan",
      cell: ({ row }) =>
        row.original.published_at
          ? format(new Date(row.original.published_at), "dd MMM yyyy", {
              locale: idLocale,
            })
          : "-",
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
      <DataTable columns={columns} data={sorted} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Hapus Pengumuman"
        description="Apakah Anda yakin ingin menghapus pengumuman ini?"
        variant="destructive"
      />
    </>
  );
}

