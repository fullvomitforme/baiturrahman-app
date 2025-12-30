"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  category: string;
  status: string;
  created_at: string;
}

interface RecentDonationsTableProps {
  donations: Donation[];
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

export function RecentDonationsTable({
  donations,
}: RecentDonationsTableProps) {
  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada donasi terbaru
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Donatur</TableHead>
            <TableHead className="min-w-[100px]">Jumlah</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.slice(0, 5).map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="font-medium">
                {donation.donor_name}
              </TableCell>
              <TableCell>
                Rp {donation.amount.toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    statusColors[
                      donation.status as keyof typeof statusColors
                    ] || ""
                  )}
                >
                  {donation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(donation.created_at), "dd MMM yyyy", {
                  locale: idLocale,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
