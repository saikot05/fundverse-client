'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Have questions about backing, launching campaigns, or custom credit packages? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-400 uppercase tracking-wider">Email Us</h4>
                <p className="text-sm font-semibold">support@fundverse.io</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-violet-400 p-2 bg-violet-500/10 rounded-lg">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-400 uppercase tracking-wider">Call Support</h4>
                <p className="text-sm font-semibold">+1 (555) 234-5678</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-cyan-400 p-2 bg-cyan-500/10 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-400 uppercase tracking-wider">Office</h4>
                <p className="text-sm font-semibold">San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-emerald-400 p-3 bg-emerald-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Message Received</h3>
                <p className="text-xs text-slate-400">
                  Thank you! Our support team will respond to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe how we can help..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-2.5 rounded-xl transition shadow"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
