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

const eventSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  category: z.enum(["kajian", "sosial", "pendidikan", "other"]),
  description: z.string().optional(),
  content: z.string().optional(),
  event_date: z.string().min(1, "Tanggal wajib diisi"),
  event_time: z.string().optional(),
  location: z.string().optional(),
  image_url: z.string().optional(),
  max_participants: z.number().optional(),
  registration_required: z.boolean(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
});

type EventForm = z.infer<typeof eventSchema>;

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any;
}

export function EventFormDialog({
  open,
  onOpenChange,
  event,
}: EventFormDialogProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      registration_required: false,
      status: "upcoming",
    },
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || "",
        category: event.category || "other",
        description: event.description || "",
        content: event.content || "",
        event_date: event.event_date
          ? new Date(event.event_date).toISOString().split("T")[0]
          : "",
        event_time: event.event_time || "",
        location: event.location || "",
        image_url: event.image_url || "",
        max_participants: event.max_participants || undefined,
        registration_required: event.registration_required || false,
        status: event.status || "upcoming",
      });
      setContent(event.content || "");
    } else {
      reset({
        title: "",
        category: "other",
        description: "",
        content: "",
        event_date: "",
        event_time: "",
        location: "",
        image_url: "",
        max_participants: undefined,
        registration_required: false,
        status: "upcoming",
      });
      setContent("");
    }
  }, [event, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EventForm) => {
      if (event) {
        return api.put(`/admin/events/${event.id}`, { ...data, content });
      }
      return api.post("/admin/events", { ...data, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(event ? "Event berhasil diupdate" : "Event berhasil dibuat");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: EventForm) => {
    mutation.mutate({ ...data, content });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {event ? "Edit Kegiatan" : "Tambah Kegiatan"}
          </DialogTitle>
          <DialogDescription>
            Kelola kegiatan dan event masjid
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kajian">Kajian</SelectItem>
                  <SelectItem value="sosial">Sosial</SelectItem>
                  <SelectItem value="pendidikan">Pendidikan</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Konten</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Tanggal *</Label>
              <Input
                id="event_date"
                type="date"
                {...register("event_date")}
              />
              {errors.event_date && (
                <p className="text-sm text-destructive">
                  {errors.event_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time">Waktu</Label>
              <Input id="event_time" type="time" {...register("event_time")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" {...register("location")} />
          </div>

          <div className="space-y-2">
            <Label>Gambar</Label>
            <ImageUpload
              value={watch("image_url")}
              onChange={(url) => setValue("image_url", url)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_participants">Maksimal Peserta</Label>
              <Input
                id="max_participants"
                type="number"
                {...register("max_participants", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Mendatang</SelectItem>
                  <SelectItem value="ongoing">Berlangsung</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="registration_required"
              {...register("registration_required")}
              className="rounded"
            />
            <Label htmlFor="registration_required">
              Perlu pendaftaran
            </Label>
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
