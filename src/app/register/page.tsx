'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import {
  Mail,
  Lock,
  User as UserIcon,
  Image as ImageIcon,
  ArrowRight,
  Shield,
  Coins,
  Sparkles,
} from 'lucide-react';

const registerSchema = z.z.object({
  name: z.z.string().min(2, 'Name must be at least 2 characters'),
  email: z.z.string().email('Invalid email address'),
  password: z.z.string().min(6, 'Password must be at least 6 characters'),
  role: z.z.enum(['supporter', 'creator']),
  image: z.z.string().optional(),
});

type RegisterFormValues = z.z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'supporter',
      image: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setLoading(true);
    try {
      // Auto-assign nice avatar if not provided
      const finalImage =
        values.image ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(values.name)}`;

      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        image: finalImage,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/${values.role}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="w-full max-w-lg glass p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            <span>Create Account</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2">Join FunVerse and start your crowdfunding journey</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm px-4 py-3 rounded-lg mb-6">
            Registration successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue('role', 'supporter')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedRole === 'supporter'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg text-white scale-105'
                    : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-white/20'
                }`}
              >
                <Coins className="h-6 w-6 text-indigo-400 mb-2" />
                <div>
                  <p className="text-sm font-bold">Supporter</p>
                  <p className="text-[11px] opacity-75 mt-1">Back awesome campaigns & buy credits</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'creator')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedRole === 'creator'
                    ? 'border-violet-500 bg-violet-500/10 shadow-lg text-white scale-105'
                    : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-white/20'
                }`}
              >
                <Shield className="h-6 w-6 text-violet-400 mb-2" />
                <div>
                  <p className="text-sm font-bold">Creator</p>
                  <p className="text-[11px] opacity-75 mt-1">Create campaigns & withdraw funding</p>
                </div>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                {...formRegister('name')}
                placeholder="John Doe"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                {...formRegister('email')}
                placeholder="john@example.com"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                {...formRegister('password')}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
          </div>

          {/* Custom Avatar URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Avatar Image URL (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <ImageIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                {...formRegister('image')}
                placeholder="https://example.com/avatar.png"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">If blank, we will generate a fun avatar for you.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-3 transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <span>{loading ? 'Registering...' : 'Create Account'}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <span>Already have an account? </span>
          <Link href="/login" className="text-indigo-400 hover:underline font-medium">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
