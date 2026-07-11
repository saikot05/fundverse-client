'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { campaignService } from '../../services/api';
import CampaignCard from '../../components/CampaignCard';
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight, Loader } from 'lucide-react';

export default function ExploreCampaignsPage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<string>('');

  // Fetch campaigns
  const { data, isLoading } = useQuery({
    queryKey: ['explore-campaigns', page, search, category, sort],
    queryFn: () =>
      campaignService.getAll({
        page,
        limit: 6,
        search,
        category,
        sort,
        status: 'active',
      }),
  });

  const campaigns = data?.campaigns || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 6, pages: 1 };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 sm:p-10 text-white max-w-7xl mx-auto w-full">
      {/* Hero Header Section */}
      <div className="text-center py-10 max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
          Discover Extraordinary Campaigns
        </h1>
        <p className="text-sm text-slate-400">
          Back verified projects launched by global creators. Support tech innovation, arts, and charities.
        </p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="glass p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search campaigns..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Category Pills (Desktop) */}
        <div className="hidden lg:flex gap-2">
          {['', 'Tech', 'Creative', 'Community', 'Charity', 'Gaming'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                category === cat
                  ? 'bg-indigo-500 border-indigo-500 text-white shadow'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat === '' ? 'All categories' : cat}
            </button>
          ))}
        </div>

        {/* Mobile Category Select */}
        <div className="lg:hidden w-full">
          <select
            value={category}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Tech">Technology</option>
            <option value="Creative">Creative Arts</option>
            <option value="Community">Community Actions</option>
            <option value="Charity">Charity / Relief</option>
            <option value="Gaming">Gaming / Design</option>
          </select>
        </div>

        {/* Sorting selector */}
        <div className="relative w-full md:w-48 flex items-center gap-2">
          <span className="text-slate-500 shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <select
            value={sort}
            onChange={handleSortChange}
            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Latest Uploads</option>
            <option value="targetAmountAsc">Target: Low to High</option>
            <option value="targetAmountDesc">Target: High to Low</option>
            <option value="progressAsc">Pledged: Low to High</option>
            <option value="progressDesc">Pledged: High to Low</option>
            <option value="deadline">Approaching Deadline</option>
          </select>
        </div>
      </div>

      {/* Campaigns Listing Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-dashed border-white/5 rounded-3xl">
          <p className="text-slate-500">No campaigns found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp: any) => (
            <CampaignCard key={camp._id} campaign={camp} />
          ))}
        </div>
      )}

      {/* Pagination Footer Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12 border-t border-white/5 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 border border-white/10 rounded-xl bg-slate-900/50 hover:bg-slate-900 disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-slate-300">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
            disabled={page === pagination.pages}
            className="p-2 border border-white/10 rounded-xl bg-slate-900/50 hover:bg-slate-900 disabled:opacity-30 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
