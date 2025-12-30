"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Toaster } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      if (response.data?.data?.access_token || response.data?.access_token) {
        const token = response.data?.data?.access_token || response.data?.access_token;
        localStorage.setItem("token", token);
        toast.success("Login berhasil!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Email atau password salah"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pattern-islamic" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="font-heading text-2xl">
                Masjid Baiturrahim
              </CardTitle>
              <CardDescription className="mt-2">
                Masuk ke dashboard admin
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@masjid.com"
                  {...register("email")}
                  className="h-12"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="h-12"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Ingat saya</span>
                </label>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm px-0"
                >
                  Lupa Password?
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
