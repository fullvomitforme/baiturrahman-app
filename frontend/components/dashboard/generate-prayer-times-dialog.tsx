"use client";

import { useState } from "react";
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
import { api } from "@/lib/api";
import { toast } from "sonner";

const generateSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type GenerateForm = z.infer<typeof generateSchema>;

interface GeneratePrayerTimesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeneratePrayerTimesDialog({
  open,
  onOpenChange,
}: GeneratePrayerTimesDialogProps) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      latitude: -6.2088, // Default Jakarta
      longitude: 106.8456,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: GenerateForm) => {
      setIsGenerating(true);
      return api.post("/admin/prayer-times/generate", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayer-times"] });
      toast.success("Jadwal sholat berhasil digenerate");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Gagal generate jadwal");
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const onSubmit = (data: GenerateForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Generate Jadwal Sholat</DialogTitle>
          <DialogDescription>
            Generate jadwal sholat untuk bulan tertentu
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <Input
                id="month"
                type="number"
                min="1"
                max="12"
                {...register("month", { valueAsNumber: true })}
              />
              {errors.month && (
                <p className="text-sm text-destructive">{errors.month.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                min="2020"
                max="2100"
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
              />
              {errors.latitude && (
                <p className="text-sm text-destructive">
                  {errors.latitude.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
              />
              {errors.longitude && (
                <p className="text-sm text-destructive">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Mengenerate..." : "Generate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
