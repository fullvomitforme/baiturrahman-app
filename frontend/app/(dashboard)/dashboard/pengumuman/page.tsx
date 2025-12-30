"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Pin, PinOff } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AnnouncementFormDialog } from "@/components/dashboard/announcement-form-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  priority: string;
  category: string;
  published_at: string;
  expires_at: string | null;
  is_pinned: boolean;
}

export default function PengumumanPage() {
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await api.get("/admin/announcements");
      return response.data?.data || response.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Pengumuman berhasil dihapus");
      setDeleteConfirm(null);
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: async ({ id, isPinned }: { id: string; isPinned: boolean }) => {
      await api.put(`/admin/announcements/${id}`, { is_pinned: !isPinned });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Status pin berhasil diupdate");
    },
  });

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "is_pinned",
      header: "",
      cell: ({ row }) => {
        const isPinned = row.getValue("is_pinned") as boolean;
        return isPinned ? (
          <Pin className="h-4 w-4 text-primary" />
        ) : null;
      },
    },
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Prioritas",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        const variants: Record<string, string> = {
          high: "bg-destructive/10 text-destructive",
          medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
          low: "bg-muted text-muted-foreground",
        };
        return (
          <Badge variant="secondary" className={variants[priority] || "bg-muted"}>
            {priority}
          </Badge>
        );
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
      accessorKey: "published_at",
      header: "Dipublikasikan",
      cell: ({ row }) => {
        const date = new Date(row.getValue("published_at"));
        return format(date, "dd MMM yyyy", { locale: idLocale });
      },
    },
    {
      accessorKey: "expires_at",
      header: "Kadaluarsa",
      cell: ({ row }) => {
        const date = row.getValue("expires_at") as string | null;
        return date ? format(new Date(date), "dd MMM yyyy", { locale: idLocale }) : "-";
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const announcement = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                togglePinMutation.mutate({
                  id: announcement.id,
                  isPinned: announcement.is_pinned,
                })
              }
            >
              {announcement.is_pinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingAnnouncement(announcement);
                setIsDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteConfirm(announcement.id)}
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
          <h1 className="font-heading text-3xl font-bold">Pengumuman</h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengumuman masjid
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengumuman
        </Button>
      </div>

      {announcements && (
        <DataTable
          columns={columns}
          data={announcements}
          searchKey="title"
          searchPlaceholder="Cari pengumuman..."
        />
      )}

      <AnnouncementFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingAnnouncement(null);
        }}
        announcement={editingAnnouncement}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
        title="Hapus Pengumuman"
        description="Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan."
        variant="destructive"
        confirmText="Hapus"
      />
    </div>
  );
}
