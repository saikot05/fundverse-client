'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '@heroui/react';
import {
  Mail, Lock, User as UserIcon, Image as ImageIcon,
  ArrowRight, Shield, Coins, Sparkles, Loader2,
} from 'lucide-react';

const registerSchema = z.z.object({
  name: z.z.string().min(2, 'Name must be at least 2 characters'),
  email: z.z.string().email('Invalid email address'),
  password: z.z.string().min(6, 'Password must be at least 6 characters'),
  role: z.z.enum(['supporter', 'creator']),
  image: z.z.string().optional(),
});

type RegisterFormValues = z.z.infer<typeof registerSchema>;

// Reusable styled input
function FieldInput({ icon: Icon, error, ...props }: any) {
  return (
    <div className="space-y-1">
      {props.label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          {props.label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />}
        <input
          {...props}
          className={`w-full bg-field border rounded-xl py-2.5 pl-10 pr-4 text-sm text-field-foreground placeholder:text-field-placeholder focus:outline-none focus:ring-2 focus:ring-focus transition ${error ? 'border-danger' : 'border-field-border'}`}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { register: formRegister, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<RegisterFormValues>({
      resolver: zodResolver(registerSchema),
      defaultValues: { role: 'supporter', image: '' },
    });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const finalImage =
        values.image ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(values.name)}`;
      await registerUser({ ...values, image: finalImage });
      setSuccess(true);
      setTimeout(() => { router.push('/login'); }, 1200);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-background via-surface to-background">
      <Card className="w-full max-w-lg border border-border relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <Card.Header className="text-center relative z-10 pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-accent" />
            <Card.Title className="text-3xl font-extrabold tracking-tight">Create Account</Card.Title>
          </div>
          <Card.Description>Join FundVerse and start your crowdfunding journey</Card.Description>
        </Card.Header>

        <Card.Content className="space-y-5 relative z-10">
          {error && (
            <div className="bg-danger-soft border border-danger/20 text-danger-soft-foreground text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success-soft border border-success/20 text-success-soft-foreground text-sm px-4 py-3 rounded-xl">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selector */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Select Your Role</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('role', 'supporter')}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 ${
                    selectedRole === 'supporter'
                      ? 'border-accent bg-accent/10 scale-[1.02]'
                      : 'border-border bg-surface text-muted hover:border-accent/40'
                  }`}
                >
                  <Coins className="h-6 w-6 text-accent" />
                  <div>
                    <p className="text-sm font-bold">Supporter</p>
                    <p className="text-[11px] text-muted mt-0.5">Back campaigns & buy credits</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'creator')}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 ${
                    selectedRole === 'creator'
                      ? 'border-success bg-success/10 scale-[1.02]'
                      : 'border-border bg-surface text-muted hover:border-success/40'
                  }`}
                >
                  <Shield className="h-6 w-6 text-success" />
                  <div>
                    <p className="text-sm font-bold">Creator</p>
                    <p className="text-[11px] text-muted mt-0.5">Launch campaigns & withdraw</p>
                  </div>
                </button>
              </div>
            </div>

            <FieldInput
              {...formRegister('name')}
              label="Full Name"
              icon={UserIcon}
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
            />
            <FieldInput
              {...formRegister('email')}
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
            />
            <FieldInput
              {...formRegister('password')}
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
            <FieldInput
              {...formRegister('image')}
              label="Avatar Image URL (Optional)"
              icon={ImageIcon}
              type="text"
              placeholder="https://example.com/avatar.png"
            />
            <p className="text-[10px] text-muted -mt-3">Leave blank and we'll generate a fun avatar for you.</p>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-3 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-link hover:underline font-semibold">Log In</Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
