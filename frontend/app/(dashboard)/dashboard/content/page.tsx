"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, GripVertical } from "lucide-react";
import { api } from "@/lib/api";
import { ContentEditorDialog } from "@/components/dashboard/content-editor-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentPage() {
  const [editingContent, setEditingContent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contents, isLoading } = useQuery({
    queryKey: ["content", "sections"],
    queryFn: async () => {
      const response = await api.get("/admin/content");
      return response.data?.data || response.data || [];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await api.put(`/admin/content/${id}`, { is_active: isActive });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "sections"] });
    },
  });

  const handleEdit = (content: any) => {
    setEditingContent(content);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingContent(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Belum ada konten"
        description="Mulai dengan membuat konten baru untuk halaman website"
        actionLabel="Tambah Konten"
        onAction={handleAdd}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Kelola Konten</h1>
          <p className="text-muted-foreground mt-1">
            Kelola konten untuk halaman website
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Konten
        </Button>
      </div>

      <div className="grid gap-4">
        {contents.map((content: any, index: number) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div>
                      <CardTitle className="font-heading">
                        {content.title || content.section_key}
                      </CardTitle>
                      {content.subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {content.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${content.id}`} className="text-sm">
                        Aktif
                      </Label>
                      <Switch
                        id={`active-${content.id}`}
                        checked={content.is_active}
                        onCheckedChange={(checked) =>
                          toggleActive.mutate({
                            id: content.id,
                            isActive: checked,
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(content)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {content.body && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {content.body.replace(/<[^>]*>/g, "").substring(0, 150)}...
                  </p>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <ContentEditorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        content={editingContent}
      />
    </div>
  );
}
