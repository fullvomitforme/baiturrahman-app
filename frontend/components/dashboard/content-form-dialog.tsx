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

const contentSchema = z.object({
  section_key: z.string().min(1, "Section key wajib diisi"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().min(1, "Body wajib diisi"),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
  is_active: z.boolean(),
});

type ContentForm = z.infer<typeof contentSchema>;

interface ContentFormDialogProps {
  open: boolean;
  onClose: () => void;
  section?: any;
}

export function ContentFormDialog({
  open,
  onClose,
  section,
}: ContentFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!section;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    if (section) {
      reset({
        section_key: section.section_key,
        title: section.title || "",
        subtitle: section.subtitle || "",
        body: section.body || "",
        image_url: section.image_url || "",
        video_url: section.video_url || "",
        is_active: section.is_active ?? true,
      });
    } else {
      reset({
        section_key: "",
        title: "",
        subtitle: "",
        body: "",
        image_url: "",
        video_url: "",
        is_active: true,
      });
    }
  }, [section, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ContentForm) => {
      if (isEditing) {
        return api.put(`/admin/content/${section.id}`, data);
      }
      return api.post("/admin/content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success(isEditing ? "Konten berhasil diupdate" : "Konten berhasil dibuat");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: ContentForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEditing ? "Edit Konten" : "Tambah Konten"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit konten section"
              : "Buat konten section baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section_key">Section Key *</Label>
            <Input
              id="section_key"
              {...register("section_key")}
              disabled={isEditing}
              placeholder="hero, about, vision"
            />
            {errors.section_key && (
              <p className="text-sm text-destructive">
                {errors.section_key.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" {...register("subtitle")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body *</Label>
            <Textarea
              id="body"
              {...register("body")}
              rows={6}
              placeholder="Konten section..."
            />
            {errors.body && (
              <p className="text-sm text-destructive">
                {errors.body.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" {...register("image_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input id="video_url" {...register("video_url")} />
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

