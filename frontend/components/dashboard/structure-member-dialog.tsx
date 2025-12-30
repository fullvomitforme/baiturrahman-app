"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

const memberSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  position: z.string().min(1, "Posisi wajib diisi"),
  department: z.string().optional(),
  photo_url: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

type MemberForm = z.infer<typeof memberSchema>;

interface StructureMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member?: any;
}

export function StructureMemberDialog({
  open,
  onClose,
  member,
}: StructureMemberDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!member;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name || "",
        position: member.position || "",
        department: member.department || "",
        photo_url: member.photo_url || "",
        bio: member.bio || "",
        email: member.email || "",
        phone: member.phone || "",
        display_order: member.display_order || 0,
        is_active: member.is_active ?? true,
      });
    } else {
      reset({
        name: "",
        position: "",
        department: "",
        photo_url: "",
        bio: "",
        email: "",
        phone: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [member, reset]);

  const mutation = useMutation({
    mutationFn: async (data: MemberForm) => {
      if (isEditing) {
        return api.put(`/admin/structure/${member.id}`, data);
      }
      return api.post("/admin/structure", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structure"] });
      toast.success(isEditing ? "Anggota berhasil diupdate" : "Anggota berhasil ditambahkan");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: MemberForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEditing ? "Edit Anggota" : "Tambah Anggota"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit informasi anggota struktur"
              : "Tambahkan anggota baru ke struktur organisasi"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Posisi *</Label>
              <Input id="position" {...register("position")} />
              {errors.position && (
                <p className="text-sm text-destructive">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departemen</Label>
            <Input id="department" {...register("department")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo_url">URL Foto</Label>
            <Input id="photo_url" {...register("photo_url")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...register("bio")} rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Menyimpan..."
                : isEditing
                ? "Update"
                : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

