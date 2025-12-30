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
import { RichTextEditor } from "./rich-text-editor";
import { ImageUpload } from "./image-upload";
import { api } from "@/lib/api";
import { toast } from "sonner";

const announcementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  category: z.string().optional(),
  published_at: z.string().optional(),
  expires_at: z.string().optional(),
  is_pinned: z.boolean().default(false),
  image_url: z.string().optional(),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: any;
}

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementFormDialogProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      priority: "medium",
      is_pinned: false,
    },
  });

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title || "",
        content: announcement.content || "",
        priority: announcement.priority || "medium",
        category: announcement.category || "",
        published_at: announcement.published_at
          ? new Date(announcement.published_at).toISOString().split("T")[0]
          : "",
        expires_at: announcement.expires_at
          ? new Date(announcement.expires_at).toISOString().split("T")[0]
          : "",
        is_pinned: announcement.is_pinned || false,
        image_url: announcement.image_url || "",
      });
      setContent(announcement.content || "");
    } else {
      reset({
        title: "",
        content: "",
        priority: "medium",
        category: "",
        published_at: new Date().toISOString().split("T")[0],
        expires_at: "",
        is_pinned: false,
        image_url: "",
      });
      setContent("");
    }
  }, [announcement, reset]);

  const mutation = useMutation({
    mutationFn: async (data: AnnouncementForm) => {
      if (announcement) {
        return api.put(`/admin/announcements/${announcement.id}`, {
          ...data,
          content,
        });
      }
      return api.post("/admin/announcements", { ...data, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success(
        announcement
          ? "Pengumuman berhasil diupdate"
          : "Pengumuman berhasil dibuat"
      );
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: AnnouncementForm) => {
    mutation.mutate({ ...data, content });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {announcement ? "Edit Pengumuman" : "Tambah Pengumuman"}
          </DialogTitle>
          <DialogDescription>
            Kelola pengumuman masjid
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Konten *</Label>
            <RichTextEditor value={content} onChange={setContent} />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioritas</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" {...register("category")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="published_at">Tanggal Publikasi</Label>
              <Input
                id="published_at"
                type="date"
                {...register("published_at")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">Tanggal Kadaluarsa</Label>
              <Input
                id="expires_at"
                type="date"
                {...register("expires_at")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gambar</Label>
            <ImageUpload
              value={watch("image_url")}
              onChange={(url) => setValue("image_url", url)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_pinned"
              {...register("is_pinned")}
              className="rounded"
            />
            <Label htmlFor="is_pinned">Pin pengumuman</Label>
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

