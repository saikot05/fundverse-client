'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-white px-4 text-center">
      <div className="glass p-8 rounded-3xl max-w-md w-full border border-white/10 space-y-6">
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-rose-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">404 - Not Found</h2>
          <p className="text-sm text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
