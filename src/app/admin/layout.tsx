'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePortalState } from '@/hooks/usePortalState';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPortalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { adminLoggedIn, logout, loading } = usePortalState();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock check
  useEffect(() => {
    if (!loading && !adminLoggedIn) {
      toast.error('Access Denied. Administrative keys requested.');
      router.push('/');
    }
  }, [adminLoggedIn, loading]);

  if (loading || !adminLoggedIn) {
    return (
      <div className="min-h-screen bg-bg-slate flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-navy-950 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-navy-950 font-outfit">Decrypting Security Gateway...</p>
        </div>
      </div>
    );
  }

  const adminMenu = [
    { label: 'Admin Console', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Applications List', path: '/admin/applications', icon: <Users className="w-4 h-4" /> },
    { label: 'Verification Workstation', path: '/admin/verification', icon: <FileCheck className="w-4 h-4" /> }
  ];

  const handleAdminLogout = () => {
    logout();
    toast.success('Admin workspace locked successfully.');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-slate flex flex-col md:flex-row">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex w-72 bg-navy-950 text-white flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div className="p-6 space-y-8">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-navy-950 font-extrabold flex items-center justify-center shadow-md">
              A
            </div>
            <div>
              <h2 className="font-outfit font-black text-sm tracking-wide text-white leading-none">RGU RPET ADMIN</h2>
              <p className="text-[9px] font-bold text-gold-500 tracking-widest mt-0.5">EXAMINATIONS CELL</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {adminMenu.map((item) => {
              const active = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-xs font-bold transition-all ${active ? 'bg-white text-navy-950 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-xs font-bold text-error-red hover:bg-error-red/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Lock Workspace
          </button>
        </div>
      </aside>

      {/* HEADER / CONTENT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-border-slate h-20 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 hover:bg-surface-slate rounded-xl border border-border-slate text-navy-950"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <p className="text-xs font-semibold text-text-slate">System Administrator</p>
              <h3 className="font-outfit font-bold text-navy-950 text-[13px] md:text-sm leading-none mt-1">
                EXAMINATIONS CONTROLLER TERMINAL
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-warning-amber/10 text-warning-amber border border-warning-amber/20 px-3 py-1.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="text-[10px] font-extrabold uppercase">Audit Mode active</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-navy-950/20 backdrop-blur-xs"
          />

          <aside className="relative w-72 bg-navy-950 text-white h-full flex flex-col justify-between p-6 z-10">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-navy-950 font-extrabold flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h2 className="font-outfit font-black text-xs text-white">RGU ADMIN</h2>
                    <p className="text-[8px] font-bold text-gold-500">EXAMS</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {adminMenu.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-xs font-bold transition-all ${active ? 'bg-white text-navy-950' : 'text-white/70 hover:bg-white/10'}`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={handleAdminLogout}
                className="w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-xs font-bold text-error-red hover:bg-error-red/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Lock Workspace
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
