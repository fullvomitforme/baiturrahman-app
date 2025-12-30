"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const mosqueInfoSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  established_year: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  website: z.string().url("URL tidak valid").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maps_embed_url: z.string().optional(),
});

type MosqueInfoForm = z.infer<typeof mosqueInfoSchema>;

export default function PengaturanPage() {
  const queryClient = useQueryClient();

  const { data: mosqueInfo, isLoading } = useQuery({
    queryKey: ["mosque", "info"],
    queryFn: async () => {
      const response = await api.get("/mosque");
      return response.data?.data || response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<MosqueInfoForm>({
    resolver: zodResolver(mosqueInfoSchema),
  });

  // Reset form when data loads
  if (mosqueInfo && !isLoading) {
    reset({
      name: mosqueInfo.name || "",
      description: mosqueInfo.description || "",
      logo_url: mosqueInfo.logo_url || "",
      banner_url: mosqueInfo.banner_url || "",
      established_year: mosqueInfo.established_year || undefined,
      phone: mosqueInfo.phone || "",
      email: mosqueInfo.email || "",
      website: mosqueInfo.website || "",
      facebook: mosqueInfo.facebook || "",
      instagram: mosqueInfo.instagram || "",
      youtube: mosqueInfo.youtube || "",
      twitter: mosqueInfo.twitter || "",
      address: mosqueInfo.address || "",
      city: mosqueInfo.city || "",
      province: mosqueInfo.province || "",
      postal_code: mosqueInfo.postal_code || "",
      latitude: mosqueInfo.latitude || undefined,
      longitude: mosqueInfo.longitude || undefined,
      maps_embed_url: mosqueInfo.maps_embed_url || "",
    });
  }

  const mutation = useMutation({
    mutationFn: async (data: MosqueInfoForm) => {
      return api.put("/admin/mosque", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mosque", "info"] });
      toast.success("Pengaturan berhasil disimpan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: MosqueInfoForm) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi dan pengaturan masjid
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Informasi Umum</TabsTrigger>
            <TabsTrigger value="contact">Kontak & Sosial Media</TabsTrigger>
            <TabsTrigger value="location">Lokasi</TabsTrigger>
          </TabsList>

          {/* Tab 1: Informasi Umum */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Informasi Umum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Masjid *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <ImageUpload
                      value={watch("logo_url")}
                      onChange={(url) => setValue("logo_url", url)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Banner</Label>
                    <ImageUpload
                      value={watch("banner_url")}
                      onChange={(url) => setValue("banner_url", url)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="established_year">Tahun Berdiri</Label>
                  <Input
                    id="established_year"
                    type="number"
                    {...register("established_year", { valueAsNumber: true })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Kontak & Sosial Media */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Kontak & Sosial Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon</Label>
                    <Input id="phone" type="tel" {...register("phone")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" {...register("website")} />
                  {errors.website && (
                    <p className="text-sm text-destructive">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" type="url" {...register("facebook")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" type="url" {...register("instagram")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input id="youtube" type="url" {...register("youtube")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" type="url" {...register("twitter")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Lokasi */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Lokasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" {...register("city")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input id="province" {...register("province")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Kode Pos</Label>
                    <Input id="postal_code" {...register("postal_code")} />
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      {...register("longitude", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maps_embed_url">URL Embed Maps</Label>
                  <Input
                    id="maps_embed_url"
                    type="url"
                    {...register("maps_embed_url")}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Semua Pengaturan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
