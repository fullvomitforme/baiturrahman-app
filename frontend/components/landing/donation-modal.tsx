"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Copy, Check } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import QRCode from "qrcode.react";

const donationSchema = z.object({
  donor_name: z.string().min(2, "Nama minimal 2 karakter"),
  donor_email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  donor_phone: z.string().optional(),
  amount: z.number().min(10000, "Minimum donasi Rp 10.000"),
  category: z.enum(["infaq", "sedekah", "zakat", "wakaf", "operasional"]),
  payment_method_id: z.string().optional(),
  notes: z.string().optional(),
});

type DonationForm = z.infer<typeof donationSchema>;

export function DonationModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const response = await api.get("/payment-methods?active=true");
      return response.data || [];
    },
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<DonationForm>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      category: "infaq",
    },
  });

  const onSubmit = async (data: DonationForm) => {
    try {
      const response = await api.post("/donations", {
        ...data,
        payment_method_id: selectedMethod || undefined,
      });
      toast.success("Donasi berhasil dikirim! Terima kasih atas kebaikan Anda.");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Gagal mengirim donasi. Silakan coba lagi."
      );
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Berhasil disalin!");
    setTimeout(() => setCopied(null), 2000);
  };

  const activeMethods = paymentMethods?.filter((m: any) => m.is_active) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="min-h-[48px] px-8 text-base font-medium gap-2">
          <Heart className="h-5 w-5" />
          Donasi Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Donasi untuk Masjid
          </DialogTitle>
          <DialogDescription>
            Bantu pengembangan dan kegiatan Masjid Baiturrahim
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeMethods[0]?.id || "form"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Form Donasi</TabsTrigger>
            <TabsTrigger value="payment">Metode Pembayaran</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donor_name">Nama Donatur *</Label>
                <Input
                  id="donor_name"
                  {...register("donor_name")}
                  placeholder="Nama lengkap"
                />
                {errors.donor_name && (
                  <p className="text-sm text-destructive">
                    {errors.donor_name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donor_email">Email</Label>
                  <Input
                    id="donor_email"
                    type="email"
                    {...register("donor_email")}
                    placeholder="email@example.com"
                  />
                  {errors.donor_email && (
                    <p className="text-sm text-destructive">
                      {errors.donor_email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donor_phone">Telepon</Label>
                  <Input
                    id="donor_phone"
                    {...register("donor_phone")}
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Donasi (Rp) *</Label>
                <Input
                  id="amount"
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="100000"
                  min="10000"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Donasi *</Label>
                <select
                  id="category"
                  {...register("category")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="infaq">Infaq</option>
                  <option value="sedekah">Sedekah</option>
                  <option value="zakat">Zakat</option>
                  <option value="wakaf">Wakaf</option>
                  <option value="operasional">Operasional</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method_id">Metode Pembayaran</Label>
                <select
                  id="payment_method_id"
                  {...register("payment_method_id")}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Pilih metode pembayaran</option>
                  {activeMethods.map((method: any) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Tulis catatan atau doa..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Donasi"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : activeMethods.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada metode pembayaran yang tersedia
              </p>
            ) : (
              <div className="space-y-6">
                {activeMethods.map((method: any) => (
                  <div
                    key={method.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <h3 className="font-heading text-lg font-semibold">
                      {method.name}
                    </h3>

                    {method.type === "qris" && method.qr_code_url && (
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg">
                          <QRCode value={method.qr_code_url} size={200} />
                        </div>
                      </div>
                    )}

                    {method.account_number && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Nomor Rekening</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(method.account_number, method.id)
                            }
                          >
                            {copied === method.id ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Input
                          value={method.account_number}
                          readOnly
                          className="font-mono"
                        />
                      </div>
                    )}

                    {method.account_name && (
                      <div className="space-y-2">
                        <Label>Nama Rekening</Label>
                        <Input value={method.account_name} readOnly />
                      </div>
                    )}

                    {method.instructions && (
                      <div className="space-y-2">
                        <Label>Petunjuk Pembayaran</Label>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {method.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
