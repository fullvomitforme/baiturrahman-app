"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { api } from "@/lib/api";
import { MemberFormDialog } from "@/components/dashboard/member-form-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function StrukturPage() {
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["structure"],
    queryFn: async () => {
      const response = await api.get("/admin/structure");
      return response.data?.data || response.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/structure/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structure"] });
      toast.success("Anggota berhasil dihapus");
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error("Gagal menghapus anggota");
    },
  });

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    console.log("handleAdd called");
    setEditingMember(null);
    setIsDialogOpen(true);
    console.log("isDialogOpen set to true");
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Belum ada struktur organisasi"
        description="Tambahkan anggota struktur organisasi masjid"
        actionLabel="Tambah Anggota"
        onAction={handleAdd}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Struktur Organisasi</h1>
          <p className="text-muted-foreground mt-1">
            Kelola struktur organisasi masjid
          </p>
        </div>
        <Button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAdd();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Anggota
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {members.map((member: any, index: number) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                      <AvatarImage src={member.photo_url} alt={member.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -left-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className="font-heading text-xl font-bold mb-1">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="mb-2">
                      {member.position}
                    </Badge>
                    {member.department && (
                      <p className="text-sm text-muted-foreground">
                        {member.department}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirm(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <MemberFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          console.log("MemberFormDialog onOpenChange:", open);
          setIsDialogOpen(open);
        }}
        member={editingMember}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Hapus Anggota"
        description="Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan."
        variant="destructive"
        confirmText="Hapus"
      />
    </div>
  );
}
