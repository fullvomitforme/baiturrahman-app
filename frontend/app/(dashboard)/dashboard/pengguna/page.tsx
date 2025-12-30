"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { UserFormDialog } from "@/components/dashboard/user-form-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
}

export default function PenggunaPage() {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/admin/users");
      return response.data?.data || response.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil dihapus");
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error("Gagal menghapus user");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.put(`/admin/users/${id}`, { is_active: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Status user berhasil diupdate");
    },
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "full_name",
      header: "Nama Lengkap",
      cell: ({ row }) => row.getValue("full_name") || "-",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const variants: Record<string, string> = {
          super_admin: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
          admin: "bg-primary/10 text-primary",
          editor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        };
        return (
          <Badge variant="secondary" className={variants[role] || "bg-muted"}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }
          >
            {isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "last_login",
      header: "Login Terakhir",
      cell: ({ row }) => {
        const date = row.getValue("last_login") as string | null;
        return date
          ? format(new Date(date), "dd MMM yyyy HH:mm", { locale: idLocale })
          : "-";
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingUser(user);
                setIsDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                toggleActiveMutation.mutate({
                  id: user.id,
                  isActive: user.is_active,
                })
              }
              className={
                user.is_active ? "text-yellow-600" : "text-primary"
              }
            >
              {user.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteConfirm(user.id)}
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
          <h1 className="font-heading text-3xl font-bold">Pengguna</h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengguna dan akses admin
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {users && (
        <DataTable
          columns={columns}
          data={users}
          searchKey="username"
          searchPlaceholder="Cari pengguna..."
        />
      )}

      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
        title="Hapus Pengguna"
        description="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
        variant="destructive"
        confirmText="Hapus"
      />
    </div>
  );
}

