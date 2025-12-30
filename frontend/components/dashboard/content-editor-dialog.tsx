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
import { RichTextEditor } from "./rich-text-editor";
import { ImageUpload } from "./image-upload";
import { api } from "@/lib/api";
import { toast } from "sonner";

const contentSchema = z.object({
  section_key: z.string().min(1, "Section key wajib diisi"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
  is_active: z.boolean(),
});

type ContentForm = z.infer<typeof contentSchema>;

interface ContentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content?: any;
}

export function ContentEditorDialog({
  open,
  onOpenChange,
  content,
}: ContentEditorDialogProps) {
  const queryClient = useQueryClient();
  const [bodyContent, setBodyContent] = useState("");

  useEffect(() => {
		console.log('ContentEditorDialog - open:', open, 'content:', content);
	}, [open, content]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    if (content) {
      reset({
        section_key: content.section_key,
        title: content.title || "",
        subtitle: content.subtitle || "",
        body: content.body || "",
        image_url: content.image_url || "",
        video_url: content.video_url || "",
        is_active: content.is_active ?? true,
      });
      setBodyContent(content.body || "");
    } else {
      reset({
        section_key: "",
        title: "",
        subtitle: "",
        body: "",
        image_url: "",
        video_url: "",
        is_active: true,
      });
      setBodyContent("");
    }
  }, [content, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ContentForm) => {
      const payload = { ...data, body: bodyContent };
			if (content) {
				return api.put(`/admin/content/${content.id}`, payload);
			}
      return api.post("/admin/content", payload);
    },
    retry: false,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["content", "sections"] });
      toast.success(content ? "Konten berhasil diupdate" : "Konten berhasil dibuat");
      onOpenChange(false);
      reset();
      setBodyContent('');
    },
    onError: (error: any) => {
      const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				error.message ||
				'Terjadi kesalahan saat menyimpan konten';
			console.error('Content save error:', error);
			toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ContentForm) => {
    console.log('Submitting content form:', { ...data, body: bodyContent });
    mutation.mutate({ ...data, body: bodyContent });
  };

  return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='font-heading'>
						{content ? 'Edit Konten' : 'Tambah Konten'}
					</DialogTitle>
					<DialogDescription>
						Kelola konten untuk halaman website
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-2'>
						<Label htmlFor='section_key'>Section Key *</Label>
						<Input
							id='section_key'
							{...register('section_key')}
							placeholder='hero, about, vision, facilities'
							disabled={!!content}
						/>
						{errors.section_key && (
							<p className='text-sm text-destructive'>
								{errors.section_key.message}
							</p>
						)}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='title'>Judul</Label>
							<Input id='title' {...register('title')} />
						</div>
						<div className='space-y-2'>
							<Label htmlFor='subtitle'>Subjudul</Label>
							<Input id='subtitle' {...register('subtitle')} />
						</div>
					</div>

					<div className='space-y-2'>
						<Label>Konten</Label>
						<RichTextEditor value={bodyContent} onChange={setBodyContent} />
					</div>

					<div className='space-y-2'>
						<Label>Gambar</Label>
						<ImageUpload
							value={watch('image_url')}
							onChange={(url) => setValue('image_url', url)}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='video_url'>URL Video</Label>
						<Input
							id='video_url'
							{...register('video_url')}
							placeholder='https://youtube.com/...'
						/>
					</div>

					<div className='flex justify-end gap-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							Batal
						</Button>
						<Button type='submit' disabled={isSubmitting || mutation.isPending}>
							{isSubmitting || mutation.isPending ? 'Menyimpan...' : 'Simpan'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

