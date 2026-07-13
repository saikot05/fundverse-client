'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button } from '@heroui/react';
import { Mail, Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { authClient } from '../../lib/auth-client';

const loginSchema = z.z.object({
  email: z.z.string().email('Invalid email address'),
  password: z.z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard/supporter' });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const { register: formRegister, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const res = await login(values);
      setSuccess(true);
      setTimeout(() => { router.push(`/dashboard/${res.user.role}`); }, 1200);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 bg-gradient-to-br from-background via-surface to-background">
      <Card className="w-full max-w-md border border-border relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <Card.Header className="text-center relative z-10 pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-accent" />
            <Card.Title className="text-3xl font-extrabold tracking-tight">Welcome Back</Card.Title>
          </div>
          <Card.Description>Log in to manage your campaigns and credits</Card.Description>
        </Card.Header>

        <Card.Content className="space-y-5 relative z-10">
          {/* Alerts */}
          {error && (
            <div className="bg-danger-soft border border-danger/20 text-danger-soft-foreground text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success-soft border border-success/20 text-success-soft-foreground text-sm px-4 py-3 rounded-xl">
              Authentication successful! Redirecting...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  {...formRegister('email')}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-field border border-field-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-field-foreground placeholder:text-field-placeholder focus:outline-none focus:ring-2 focus:ring-focus transition"
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  {...formRegister('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-field border border-field-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-field-foreground placeholder:text-field-placeholder focus:outline-none focus:ring-2 focus:ring-focus transition"
                />
              </div>
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-3 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>

            {/* Demo Auto-fill Buttons */}
            <div className="space-y-2 pt-2 border-t border-dashed border-separator">
              <p className="text-[10px] font-bold text-center uppercase tracking-wider text-muted">Quick Demo Accounts (Auto-fill)</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'supporter@fundverse.io');
                    setValue('password', 'supporter123');
                  }}
                  className="py-2 px-3 border border-dashed border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Demo Supporter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'creator@fundverse.io');
                    setValue('password', 'creator123');
                  }}
                  className="py-2 px-3 border border-dashed border-violet-500/30 hover:border-violet-500 bg-violet-500/5 hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Demo Creator
                </button>
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-separator" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-muted">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full rounded-xl border border-border hover:border-accent/40 bg-surface-secondary hover:bg-surface-tertiary text-foreground font-semibold py-2.5 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-muted">
            New to FundVerse?{' '}
            <Link href="/register" className="text-link hover:underline font-semibold">
              Create an Account
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
