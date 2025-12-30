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
import { ImageUpload } from "./image-upload";
import { api } from "@/lib/api";
import { toast } from "sonner";

const paymentMethodSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  type: z.enum(["bank_transfer", "ewallet", "qris"]),
  account_number: z.string().optional(),
  account_name: z.string().optional(),
  instructions: z.string().optional(),
  logo_url: z.string().optional(),
  qr_code_url: z.string().optional(),
  display_order: z.number(),
  is_active: z.boolean(),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  method?: any;
}

export function PaymentMethodFormDialog({
  open,
  onOpenChange,
  method,
}: PaymentMethodFormDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    if (method) {
      reset({
        name: method.name || "",
        type: method.type || "bank_transfer",
        account_number: method.account_number || "",
        account_name: method.account_name || "",
        instructions: method.instructions || "",
        logo_url: method.logo_url || "",
        qr_code_url: method.qr_code_url || "",
        display_order: method.display_order || 0,
        is_active: method.is_active ?? true,
      });
    } else {
      reset({
        name: "",
        type: "bank_transfer",
        account_number: "",
        account_name: "",
        instructions: "",
        logo_url: "",
        qr_code_url: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [method, reset]);

  const mutation = useMutation({
    mutationFn: async (data: PaymentMethodForm) => {
      if (method) {
        return api.put(`/admin/payment-methods/${method.id}`, data);
      }
      return api.post("/admin/payment-methods", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success(
        method
          ? "Metode pembayaran berhasil diupdate"
          : "Metode pembayaran berhasil ditambahkan"
      );
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: PaymentMethodForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {method ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}
          </DialogTitle>
          <DialogDescription>
            Kelola metode pembayaran untuk donasi
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
              <Label htmlFor="type">Tipe *</Label>
              <Select
                value={watch("type")}
                onValueChange={(value) => setValue("type", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account_number">Nomor Rekening/Akun</Label>
              <Input id="account_number" {...register("account_number")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_name">Nama Rekening/Akun</Label>
              <Input id="account_name" {...register("account_name")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instruksi</Label>
            <Textarea
              id="instructions"
              {...register("instructions")}
              rows={3}
              placeholder="Cara melakukan pembayaran..."
            />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUpload
              value={watch("logo_url")}
              onChange={(url) => setValue("logo_url", url)}
            />
          </div>

          <div className="space-y-2">
            <Label>QR Code</Label>
            <ImageUpload
              value={watch("qr_code_url")}
              onChange={(url) => setValue("qr_code_url", url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Urutan Tampil</Label>
            <Input
              id="display_order"
              type="number"
              {...register("display_order", { valueAsNumber: true })}
            />
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

