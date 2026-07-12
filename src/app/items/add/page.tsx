'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';

import {
  Sparkles,
  ArrowLeft,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  Bookmark,
} from 'lucide-react';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(20, 'Full description must be at least 20 characters'),
  category: z.enum(['Tech', 'Creative', 'Community', 'Charity', 'Gaming']),
  targetAmount: z.number().min(10, 'Target amount must be at least 10 credits'),
  image: z.string().min(1, 'Image is required'),
  deadline: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Deadline must be a date in the future',
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function ItemsAddPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      category: 'Tech',
      targetAmount: 100,
    },
  });

  const campaignImage = watch('image');

  // Protect page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const launchMutation = useMutation({
    mutationFn: campaignService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['creator-stats'] });
      router.push('/items/manage');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create campaign. Please try again.');
    },
  });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'mock_imgbb_key';

    if (imgbbKey === 'mock_imgbb_key') {
      setTimeout(() => {
        const mockUrls = [
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600',
        ];
        const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
        setValue('image', randomUrl);
        setUploadingImage(false);
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();
      if (resData.success) {
        setValue('image', resData.data.url);
      } else {
        throw new Error('imgBB upload failed.');
      }
    } catch (err: any) {
      setError('Image upload failed. Using a fallback mockup image instead.');
      setValue('image', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (values: CampaignFormValues) => {
    setError(null);
    launchMutation.mutate(values);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 p-6 sm:p-10 text-slate-800 dark:text-slate-200 max-w-3xl mx-auto w-full transition-colors duration-300">
      <Link
        href="/items/manage"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Manage</span>
      </Link>

      <div className="glass p-8 rounded-2xl relative overflow-hidden bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
          <span>Add New Campaign Item</span>
        </h2>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
              Item Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FileText className="h-4 w-4" />
              </span>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. NextGen Autonomous Drone"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            {errors.title && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Bookmark className="h-4 w-4" />
                </span>
                <select
                  {...register('category')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Tech">Technology</option>
                  <option value="Creative">Creative Arts</option>
                  <option value="Community">Community Actions</option>
                  <option value="Charity">Charity / Relief</option>
                  <option value="Gaming">Gaming / Design</option>
                </select>
              </div>
              {errors.category && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                Target Funding Goal (Credits)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  placeholder="1000"
                  {...register('targetAmount', { valueAsNumber: true })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              {errors.targetAmount && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.targetAmount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
              Short Description
            </label>
            <input
              type="text"
              {...register('shortDescription')}
              placeholder="e.g. A revolutionary drone project featuring carbon-fiber builds."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {errors.shortDescription && (
              <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.shortDescription.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
              Full Campaign Pitch Description
            </label>
            <textarea
              rows={5}
              {...register('description')}
              placeholder="Provide a comprehensive pitch, budget breakdown, team details, and shipping timelines..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {errors.description && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                Campaign Image Banner
              </label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-4 py-2.5 rounded-xl cursor-pointer transition">
                  <Upload className="h-4 w-4" />
                  <span>{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
                  <input type="file" onChange={handleImageFileChange} className="hidden" accept="image/*" />
                </label>
                {campaignImage && (
                  <img src={campaignImage} alt="Preview" className="h-10 w-16 object-cover rounded-lg border border-slate-200 dark:border-white/10" />
                )}
              </div>
              <input type="hidden" {...register('image')} />
              {errors.image && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.image.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                Deadline Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Calendar className="h-4 w-4" />
                </span>
                <input
                  type="date"
                  {...register('deadline')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              {errors.deadline && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.deadline.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={launchMutation.isPending || uploadingImage}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl cursor-pointer disabled:opacity-50 transition"
          >
            {launchMutation.isPending ? 'Submitting Item...' : 'Submit Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
