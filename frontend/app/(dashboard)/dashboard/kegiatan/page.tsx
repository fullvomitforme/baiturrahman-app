"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { EventFormDialog } from "@/components/dashboard/event-form-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  category: string;
  event_date: string;
  status: string;
  slug: string;
}

export default function KegiatanPage() {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/admin/events");
      return response.data?.data || response.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event berhasil dihapus");
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error("Gagal menghapus event");
    },
  });

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("category")}</Badge>
      ),
    },
    {
      accessorKey: "event_date",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = new Date(row.getValue("event_date"));
        return format(date, "dd MMM yyyy", { locale: idLocale });
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, string> = {
          upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          ongoing: "bg-primary/10 text-primary",
          completed: "bg-muted text-muted-foreground",
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
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/kegiatan/${event.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingEvent(event);
                setIsDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteConfirm(event.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Kegiatan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola kegiatan dan event masjid
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kegiatan
        </Button>
      </div>

      {events && (
        <DataTable
          columns={columns}
          data={events}
          searchKey="title"
          searchPlaceholder="Cari kegiatan..."
        />
      )}

      <EventFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
        event={editingEvent}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
        title="Hapus Kegiatan"
        description="Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan."
        variant="destructive"
        confirmText="Hapus"
      />
    </div>
  );
}
