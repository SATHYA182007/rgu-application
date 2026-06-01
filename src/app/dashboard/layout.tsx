'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  BookOpen, 
  Award, 
  Bell, 
  Settings, 
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { usePortalState } from '../../hooks/usePortalState';
import { toast } from 'sonner';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeUser, logout, loading } = usePortalState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If loading is done and no active user session, redirect to landing page
  useEffect(() => {
    if (!loading && !activeUser) {
      toast.warning('Access denied. Please authenticate to access the student terminal.');
      router.push('/');
    }
  }, [activeUser, loading]);

  if (loading || !activeUser) {
    return (
      <div className="min-h-screen bg-bg-slate flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-navy-950 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-navy-950">Synchronizing Session Logs...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Profile Information', path: '/dashboard/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Documents Cabinet', path: '/dashboard/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Slot Booking', path: '/dashboard/slot-booking', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Mock Test Simulator', path: '/dashboard/mock-test', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Entrance Exam details', path: '/dashboard/exam', icon: <Award className="w-4 h-4" /> },
    { label: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully from your session.');
    router.push('/');
  };

  const statusColors: Record<string, { bg: string, text: string, border: string }> = {
    Draft: { bg: 'bg-text-slate/10', text: 'text-text-slate', border: 'border-text-slate/20' },
    Submitted: { bg: 'bg-blue-800/10', text: 'text-blue-800', border: 'border-blue-800/20' },
    Verified: { bg: 'bg-warning-amber/10', text: 'text-warning-amber', border: 'border-warning-amber/20' },
    Approved: { bg: 'bg-success-green/10', text: 'text-success-green', border: 'border-success-green/20' },
    Rejected: { bg: 'bg-error-red/10', text: 'text-error-red', border: 'border-error-red/20' }
  };

  const status = activeUser.status || 'Draft';
  const c = statusColors[status] || statusColors.Draft;

  return (
    <div className="min-h-screen bg-bg-slate flex flex-col md:flex-row relative">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex w-72 bg-white border-r border-border-slate flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div className="p-6 space-y-8">
          
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-950 text-white font-extrabold flex items-center justify-center shadow-md">
              R
            </div>
            <div>
              <h2 className="font-outfit font-black text-sm text-navy-950 leading-none">RGU RPET 2026</h2>
              <p className="text-[9px] font-bold text-gold-500 tracking-wider">SCHOLAR PLATFORM</p>
            </div>
          </div>

          {/* Navigation link blocks */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all ${active ? 'bg-navy-950 text-white shadow-sm' : 'text-text-slate hover:text-navy-950 hover:bg-surface-slate'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer logout node */}
        <div className="p-6 border-t border-border-slate/60">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-error-red hover:bg-error-red/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* HEADER / CONTENT COMBINED CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER PANEL */}
        <header className="bg-white border-b border-border-slate/80 h-20 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-surface-slate rounded-xl border border-border-slate text-navy-950"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <p className="text-xs font-semibold text-text-slate">Welcome back,</p>
              <h3 className="font-outfit font-bold text-navy-950 text-sm md:text-base leading-none mt-1">
                {activeUser.personalInfo?.firstName} {activeUser.personalInfo?.lastName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Status indicator pill */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-text-slate hidden md:block">Application Status:</span>
              <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                {status}
              </span>
            </div>

            <div className="h-6 w-[1px] bg-border-slate" />

            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-text-slate leading-none">Reference ID</p>
              <p className="text-xs font-extrabold text-navy-950 mt-1">{activeUser.id}</p>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE MENU DRAW */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-navy-950/20 backdrop-blur-xs"
          />

          <motion.aside 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="relative w-72 bg-white h-full flex flex-col justify-between p-6 border-r border-border-slate z-10"
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 text-white font-extrabold flex items-center justify-center">
                    R
                  </div>
                  <div>
                    <h2 className="font-outfit font-black text-xs text-navy-950">RGU RPET</h2>
                    <p className="text-[8px] font-bold text-gold-500">SCHOLAR</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-surface-slate rounded-lg text-text-slate"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all ${active ? 'bg-navy-950 text-white shadow-sm' : 'text-text-slate hover:text-navy-950 hover:bg-surface-slate'}`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border-slate">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-error-red hover:bg-error-red/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        </div>
      )}

    </div>
  );
}
