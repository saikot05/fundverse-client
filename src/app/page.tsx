'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { campaignService } from '../lib/api';
import CampaignCard from '../components/CampaignCard';
import { AnimateSection, StaggerList, StaggerItem } from '../lib/animations';
import {
  Sparkles,
  TrendingUp,
  Award,
  Users,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState<number>(0);

  // Fetch 4 active campaigns for homepage
  const { data } = useQuery({
    queryKey: ['home-campaigns'],
    queryFn: () => campaignService.getAll({ page: 1, limit: 4, status: 'active' }),
  });

  const campaigns = data?.campaigns || [];

  const heroSlides = [
    {
      title: 'Fund the Future of Technology',
      desc: 'Join a network of global supporters backing autonomous systems, smart gadgets, and software.',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200',
      category: 'Tech',
    },
    {
      title: 'Support Next-Gen Creativity',
      desc: 'Pledge credits directly to directors, game designers, writers, and painters bringing vision to life.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200',
      category: 'Creative',
    },
  ];

  const faqs = [
    {
      q: 'What is FundVerse and how does it work?',
      a: 'FundVerse is a crowdfunding ecosystem where backers purchase digital credits via Stripe and pledge them to active campaigns. Creators receive funding in credits, which they can withdraw directly to their bank account once approved.',
    },
    {
      q: 'How do I top up my credit wallet?',
      a: 'Log into your account as a Supporter, navigate to your Dashboard, choose a deposit credit quantity (e.g. $10, $50, $100), and checkout securely via Stripe card elements or Mock instant payment.',
    },
    {
      q: 'How do creators withdraw their funds?',
      a: 'Creators can submit a withdrawal request from their dashboard for any campaign that has raised credits. Once submitted, administrators review the request and approve payouts directly to the bank account provided.',
    },
    {
      q: 'Are contributions refundable if a goal is not met?',
      a: 'Campaign rules specify delivery milestones. Users are encouraged to pledge to verified creators. Our admin team monitors and flags campaign reports to maintain transparency.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Hardware Engineer',
      quote: 'Launching our drone on FundVerse was seamless. Payout approval was processed within 24 hours of requesting.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    },
    {
      name: 'Michael Chen',
      role: 'Supporter / Backer',
      quote: 'Pledging credits is simple and addicting. The glassmorphic interface and transaction lists make details easy to read.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Michael',
    },
    {
      name: 'Aria Thompson',
      role: 'Game Designer',
      quote: 'The stats page and Recharts graphs help me track funding timelines and backer categories. Exceptional experience.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria',
    },
  ];

  return (
    <div className="flex-1 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative">
      {/* 3D Animated Mesh/Orb Gradients */}
      <div className="mesh-gradient-container">
        <div className="mesh-orb orb-1" />
        <div className="mesh-orb orb-2" />
        <div className="mesh-orb orb-3" />
      </div>

      {/* Hero Section with custom slider */}
      <section className="relative h-[550px] w-full overflow-hidden border-b border-slate-200 dark:border-white/10 flex items-center">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroSlides[heroIndex].image}
            alt="Hero Slide"
            className="w-full h-full object-cover opacity-20 transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />
        </div>

        {/* Content Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-6">
            <motion.span
              key={heroIndex + '-badge'}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Project Category: {heroSlides[heroIndex].category}</span>
            </motion.span>

            <motion.h1
              key={heroIndex + '-title'}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white"
            >
              {heroSlides[heroIndex].title}
            </motion.h1>

            <motion.p
              key={heroIndex + '-desc'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg"
            >
              {heroSlides[heroIndex].desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/campaigns"
                className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 px-6 py-3 font-semibold text-sm shadow-lg shadow-indigo-500/20 text-white transition-all duration-200 flex items-center gap-2"
              >
                <span>Back a Campaign</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register?role=creator"
                className="rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500 bg-slate-50 dark:bg-white/5 hover:bg-indigo-500/5 px-6 py-3 font-semibold text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Launch Idea
              </Link>
            </motion.div>
          </div>

          {/* Slide Indicator Controls */}
          <div className="flex gap-2.5 mt-10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  heroIndex === idx ? 'w-8 bg-indigo-500' : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.25 }} className="glass p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">45,000+ Backers</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Supporting global innovative ideas</p>
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.25 }} className="glass p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-600 dark:text-violet-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">2.4M Credits Pledged</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Securing next-generation projects</p>
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.25 }} className="glass p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">99.2% Payout Success</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Escrow and bank withdrawal approvals</p>
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerList>
      </section>

      {/* 7th Section: Why Choose FundVerse */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-white/5">
        <AnimateSection className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Why FundVerse?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Experience next-generation decentralized support and transparent campaign tracking</p>
        </AnimateSection>

        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', color: 'indigo', title: 'Secure Escrow', desc: 'Credits pledged are securely held in escrow until milestones are reached.' },
            { num: '02', color: 'violet', title: 'Stripe Card Integration', desc: 'Easily buy digital credits inside your dashboard using standard credit card systems.' },
            { num: '03', color: 'emerald', title: 'Zero Extra Fees', desc: 'Pledging credits does not incur additional hidden network processing fees.' },
            { num: '04', color: 'amber', title: 'Verified Creators', desc: 'All launching campaign pitches are strictly reviewed and monitored by admins.' },
          ].map((f) => (
            <StaggerItem key={f.num}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="glass p-6 rounded-2xl space-y-3 h-full"
              >
                <div className={`h-10 w-10 rounded-lg bg-${f.color}-500/10 text-${f.color}-500 flex items-center justify-center font-bold`}>
                  {f.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* Featured campaigns Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200 dark:border-white/5">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              <span>Trending Campaigns</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Backed by the community this week</p>
          </div>
          <Link href="/campaigns" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View all campaigns
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-10 bg-slate-100/50 dark:bg-slate-900/10 rounded-2xl border border-slate-200 dark:border-white/5">
            <p className="text-slate-500 text-xs">No active campaigns available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((camp: any, i: number) => (
              <CampaignCard key={camp._id} campaign={camp} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-white/5">
        <AnimateSection className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Success Stories</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hear from our community of creators and supporters</p>
        </AnimateSection>

        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <StaggerItem key={idx}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="glass p-6 rounded-2xl flex flex-col justify-between space-y-4 h-full"
              >
                <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-white/5">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full border border-slate-200 dark:border-white/10" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* Accordion FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-16 border-t border-slate-200 dark:border-white/5">
        <AnimateSection className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            <Award className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Got questions? We have answers.</p>
        </AnimateSection>

        <StaggerList className="space-y-3">
          {faqs.map((faq, idx) => (
            <StaggerItem key={idx}>
              <div className="glass rounded-xl overflow-hidden transition-colors">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 font-semibold text-sm text-left text-slate-800 dark:text-slate-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-slate-500"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-white/5 mt-2 bg-slate-50/50 dark:bg-slate-900/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* CTA Box */}
      <AnimateSection variant="scaleIn" className="mx-auto max-w-5xl px-4 py-10">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 to-transparent z-0 pointer-events-none" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10">
            Ready to Fund the Future?
          </h2>
          <p className="text-indigo-100 text-sm max-w-md mx-auto leading-relaxed relative z-10">
            Sign up now to browse campaigns, buy credits, or start mapping out your crowdfunding proposal.
          </p>
          <div className="pt-2 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }} className="inline-block">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-indigo-600 font-bold px-6 py-3 rounded-xl text-sm shadow transition cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}
