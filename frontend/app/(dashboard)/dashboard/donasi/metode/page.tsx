"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, GripVertical, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { PaymentMethodFormDialog } from "@/components/dashboard/payment-method-form-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function MetodePage() {
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const response = await api.get("/admin/payment-methods");
      return response.data?.data || response.data || [];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.put(`/admin/payment-methods/${id}`, { is_active: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/payment-methods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Metode pembayaran berhasil dihapus");
      setDeleteConfirm(null);
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (!methods || methods.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="Belum ada metode pembayaran"
        description="Tambahkan metode pembayaran untuk donasi"
        actionLabel="Tambah Metode"
        onAction={() => setIsDialogOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Metode Pembayaran</h1>
          <p className="text-muted-foreground mt-1">
            Kelola metode pembayaran untuk donasi
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Metode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {methods.map((method: any, index: number) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <CardTitle className="font-heading">{method.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${method.id}`} className="text-sm">
                      Aktif
                    </Label>
                    <Switch
                      id={`active-${method.id}`}
                      checked={method.is_active}
                      onCheckedChange={() =>
                        toggleActive.mutate({
                          id: method.id,
                          isActive: method.is_active,
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {method.logo_url && (
                  <div className="relative h-16 w-full">
                    <Image
                      src={method.logo_url}
                      alt={method.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipe</p>
                    <p className="font-medium">{method.type}</p>
                  </div>
                  {method.account_number && (
                    <div>
                      <p className="text-muted-foreground">Nomor Rekening</p>
                      <p className="font-mono font-medium">
                        {method.account_number}
                      </p>
                    </div>
                  )}
                  {method.account_name && (
                    <div>
                      <p className="text-muted-foreground">Nama Rekening</p>
                      <p className="font-medium">{method.account_name}</p>
                    </div>
                  )}
                </div>
                {method.instructions && (
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Instruksi</p>
                    <p className="line-clamp-2">{method.instructions}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingMethod(method);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirm(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <PaymentMethodFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingMethod(null);
        }}
        method={editingMethod}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
        title="Hapus Metode Pembayaran"
        description="Apakah Anda yakin ingin menghapus metode pembayaran ini? Tindakan ini tidak dapat dibatalkan."
        variant="destructive"
        confirmText="Hapus"
      />
    </div>
  );
}

