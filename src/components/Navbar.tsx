'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../lib/api';
import { Notification } from '../types';
import {
  Coins,
  Bell,
  User as UserIcon,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Megaphone,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const data = await notificationService.getAll();
          if (data && data.notifications) {
            setNotifications(data.notifications);
          }
        } catch (err) {
          // Silently ignore network errors during polling
        }
      };

      fetchNotifications();
      // Poll notifications every 30s
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.readAll();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await notificationService.readSingle(id);
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-800 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
              <Megaphone className="h-6 w-6 text-indigo-500" />
              <span>FundVerse</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-indigo-500 dark:hover:text-indigo-400 ${
                pathname === '/' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className={`text-sm font-medium transition-colors hover:text-indigo-500 dark:hover:text-indigo-400 ${
                pathname === '/campaigns' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Explore Campaigns
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors hover:text-indigo-500 dark:hover:text-indigo-400 ${
                pathname === '/how-it-works' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-indigo-500/5 rounded-xl transition cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500" />
              )}
            </button>

            {user ? (
              <>
                {/* Credit balance display */}
                <div className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold border border-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                  <Coins className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <span>{user.credits} Credits</span>
                  {user.role === 'supporter' && (
                    <Link
                      href="/dashboard/supporter"
                      className="ml-1 rounded-full bg-indigo-500 hover:bg-indigo-600 p-0.5 text-white transition-colors"
                      title="Buy Credits"
                    >
                      <Plus className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center text-white scale-90 translate-x-1 -translate-y-1">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2 px-3">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto mt-2 space-y-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif._id)}
                              className={`p-2.5 rounded-lg text-left cursor-pointer transition ${
                                notif.isRead ? 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5' : 'bg-indigo-500/10 hover:bg-indigo-500/20'
                              }`}
                            >
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown Profile */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 px-3 py-1.5 rounded-lg transition"
                  >
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-1.5 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{user.role}</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href={`/dashboard/${user.role}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-500" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/items/add"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Plus className="h-4 w-4 text-indigo-500" />
                          <span>Add Campaign Item</span>
                        </Link>
                        <Link
                          href="/items/manage"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Megaphone className="h-4 w-4 text-violet-500" />
                          <span>Manage Items</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/dashboard/admin"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Shield className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500" />
              )}
            </button>

            {user && (
              <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                <Coins className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                <span>{user.credits}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 p-4 space-y-3">
          <Link
            href="/"
            className={`block text-sm font-medium hover:text-indigo-500 dark:hover:text-white ${
              pathname === '/' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/campaigns"
            className={`block text-sm font-medium hover:text-indigo-500 dark:hover:text-white ${
              pathname === '/campaigns' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Campaigns
          </Link>
          <Link
            href="/how-it-works"
            className={`block text-sm font-medium hover:text-indigo-500 dark:hover:text-white ${
              pathname === '/how-it-works' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </Link>

          {user ? (
            <div className="border-t border-slate-100 dark:border-white/5 pt-3 space-y-2">
              <Link
                href={`/dashboard/${user.role}`}
                className="block text-sm font-semibold text-indigo-500 dark:text-indigo-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm text-rose-500 dark:text-rose-400 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-100 dark:border-white/5 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center px-4 py-2 text-sm font-medium border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-transparent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="w-full text-center bg-indigo-500 rounded-lg py-2 text-sm font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
