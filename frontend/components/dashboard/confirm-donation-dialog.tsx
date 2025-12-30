"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ConfirmDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: any;
  onConfirm: () => void;
}

export function ConfirmDonationDialog({
  open,
  onOpenChange,
  donation,
  onConfirm,
}: ConfirmDonationDialogProps) {
  if (!donation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Konfirmasi Donasi</DialogTitle>
          <DialogDescription>
            Review detail donasi sebelum dikonfirmasi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Kode Donasi</p>
              <p className="font-mono font-medium">{donation.donation_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p className="font-medium">
                {format(new Date(donation.created_at), "dd MMMM yyyy", {
                  locale: idLocale,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Donatur</p>
              <p className="font-medium">{donation.donor_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jumlah</p>
              <p className="font-medium text-lg">
                Rp {donation.amount.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kategori</p>
              <Badge variant="outline">{donation.category}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
              <p className="font-medium">{donation.payment_method}</p>
            </div>
          </div>

          {donation.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Catatan</p>
              <p className="text-sm">{donation.notes}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={onConfirm}>Konfirmasi Donasi</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
