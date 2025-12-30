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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { api } from "@/lib/api";
import { toast } from "sonner";

const userSchema = z
  .object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter").optional(),
    password_confirmation: z.string().optional(),
    full_name: z.string().optional(),
    role: z.enum(["admin", "editor", "super_admin"]),
    avatar_url: z.string().optional(),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.password && !data.password_confirmation) return true;
      return data.password === data.password_confirmation;
    },
    {
      message: "Password tidak cocok",
      path: ["password_confirmation"],
    }
  );

type UserForm = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "admin",
      is_active: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        full_name: user.full_name || "",
        role: user.role || "admin",
        avatar_url: user.avatar_url || "",
        is_active: user.is_active ?? true,
      });
    } else {
      reset({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        full_name: "",
        role: "admin",
        avatar_url: "",
        is_active: true,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UserForm) => {
      const { password_confirmation, ...submitData } = data;
      if (!password) {
        delete submitData.password;
      }
      if (user) {
        return api.put(`/admin/users/${user.id}`, submitData);
      }
      return api.post("/admin/users", submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(user ? "User berhasil diupdate" : "User berhasil dibuat");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const password = watch("password");

  const onSubmit = (data: UserForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {user ? "Edit Pengguna" : "Tambah Pengguna"}
          </DialogTitle>
          <DialogDescription>
            Kelola pengguna dan akses admin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                {...register("username")}
                disabled={!!user}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input id="full_name" {...register("full_name")} />
          </div>

          {!user && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Konfirmasi Password *
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...register("password_confirmation")}
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-destructive">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {user && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru (opsional)</Label>
                <Input id="password" type="password" {...register("password")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Konfirmasi Password Baru
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...register("password_confirmation")}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={watch("role")}
                onValueChange={(value) => setValue("role", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <ImageUpload
                value={watch("avatar_url")}
                onChange={(url) => setValue("avatar_url", url)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              className="rounded"
            />
            <Label htmlFor="is_active">Aktif</Label>
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

