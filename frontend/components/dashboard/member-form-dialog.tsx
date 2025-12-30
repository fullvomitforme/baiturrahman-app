"use client";

import { useState, useEffect } from "react";
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
import { ImageUpload } from "./image-upload";
import { api } from "@/lib/api";
import { toast } from "sonner";

const memberSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  position: z.string().min(2, "Posisi wajib diisi"),
  department: z.string().optional(),
  photo_url: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  display_order: z.number(),
  is_active: z.boolean(),
});

type MemberForm = z.infer<typeof memberSchema>;

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: any;
}

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
}: MemberFormDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      is_active: true,
      display_order: 0,
    },
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
      if (member) {
        return api.put(`/admin/structure/${member.id}`, data);
      }
      return api.post("/admin/structure", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structure"] });
      toast.success(member ? "Anggota berhasil diupdate" : "Anggota berhasil ditambahkan");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: MemberForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {member ? "Edit Anggota" : "Tambah Anggota"}
          </DialogTitle>
          <DialogDescription>
            Kelola data anggota struktur organisasi
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
            <Label>Foto</Label>
            <ImageUpload
              value={watch("photo_url")}
              onChange={(url) => setValue("photo_url", url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              rows={3}
              placeholder="Tulis bio singkat..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Urutan Tampil</Label>
            <Input
              id="display_order"
              type="number"
              {...register("display_order", { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

