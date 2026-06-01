'use client';

import { usePortalState } from '@/hooks/usePortalState';
import { CandidateApplication } from '@/types';
import { 
  Users, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  CalendarRange, 
  GraduationCap,
  TrendingUp,
  BarChart as ChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AdminDashboardOverview() {
  const { candidates } = usePortalState();

  // Computational stats
  const totalApps = candidates.length;
  const approvedApps = candidates.filter((c: CandidateApplication) => c.status === 'Approved').length;
  const pendingApps = candidates.filter((c: CandidateApplication) => c.status === 'Pending' || c.status === 'Submitted').length;
  const rejectedApps = candidates.filter((c: CandidateApplication) => c.status === 'Rejected').length;
  const slotBookings = candidates.filter((c: CandidateApplication) => !!c.bookedSlot).length;
  const mockAttempts = candidates.filter((c: CandidateApplication) => !!c.mockTestResult).length;

  // 1. Department-wise applications mock compilation (realistic)
  const deptData = [
    { name: 'Comp. Science', Count: 18 },
    { name: 'Artificial Int.', Count: 24 },
    { name: 'Data Science', Count: 14 },
    { name: 'Management', Count: 10 },
    { name: 'Engineering', Count: 8 },
    { name: 'Biotech', Count: 12 },
    { name: 'Agriculture', Count: 6 }
  ];

  // 2. Monthly registration trend line chart data
  const monthlyData = [
    { month: 'Jan', Applicants: 42 },
    { month: 'Feb', Applicants: 78 },
    { month: 'Mar', Applicants: 110 },
    { month: 'Apr', Applicants: 165 },
    { month: 'May', Applicants: 232 },
    { month: 'Jun', Applicants: 120 }
  ];

  // 3. Category distribution data
  const categoryData = [
    { category: 'General', Count: 48, percentage: '45%' },
    { category: 'OBC', Count: 32, percentage: '30%' },
    { category: 'SC', Count: 16, percentage: '15%' },
    { category: 'ST', Count: 10, percentage: '10%' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5">
        <h1 className="font-outfit font-black text-2xl text-navy-950">Administrative Diagnostics</h1>
        <p className="text-xs font-semibold text-text-slate">Monitor applicant demographics, document audits, slot selection ratios, and diagnostic analytics.</p>
      </div>

      {/* STATS TILES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        
        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-3.5 p-4.5">
          <div className="w-10 h-10 rounded-xl bg-navy-950/5 text-navy-950 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Total Applications</span>
            <p className="text-lg font-outfit font-extrabold text-navy-950 mt-0.5">{totalApps}</p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-3.5 p-4.5">
          <div className="w-10 h-10 rounded-xl bg-success-green/5 text-success-green flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Approved logs</span>
            <p className="text-lg font-outfit font-extrabold text-success-green mt-0.5">{approvedApps}</p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-3.5 p-4.5">
          <div className="w-10 h-10 rounded-xl bg-blue-800/5 text-blue-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Under Audit</span>
            <p className="text-lg font-outfit font-extrabold text-blue-800 mt-0.5">{pendingApps}</p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-3.5 p-4.5">
          <div className="w-10 h-10 rounded-xl bg-error-red/5 text-error-red flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Rejected logs</span>
            <p className="text-lg font-outfit font-extrabold text-error-red mt-0.5">{rejectedApps}</p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-3.5 p-4.5">
          <div className="w-10 h-10 rounded-xl bg-gold-500/5 text-gold-500 flex items-center justify-center shrink-0">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Slot Reservations</span>
            <p className="text-lg font-outfit font-extrabold text-navy-950 mt-0.5">{slotBookings}</p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-3.5 p-4.5">
          <div className="w-10 h-10 rounded-xl bg-surface-slate text-text-slate flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Mock Attempts</span>
            <p className="text-lg font-outfit font-extrabold text-navy-950 mt-0.5">{mockAttempts}</p>
          </div>
        </div>

      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Bar Chart: Dept applications - 8 cols */}
        <div className="lg:col-span-8 premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
          <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
            <ChartIcon className="w-4.5 h-4.5 text-blue-800" />
            Research Department Applications Density
          </h4>

          <div className="h-[280px] w-full text-[11px] font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 20, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }} 
                />
                <Bar dataKey="Count" fill="#1E4D8C" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0B1F3A' : '#1E4D8C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Line Chart: Monthly Registrations - 4 cols */}
        <div className="lg:col-span-4 premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
          <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-blue-800" />
            Monthly Registration Curves
          </h4>

          <div className="h-[280px] w-full text-[11px] font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Applicants" 
                  stroke="#D4A017" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#D4A017', strokeWidth: 2, fill: '#FFFFFF' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LOWER SPLIT DEMOGRAPHICS */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Social Categories */}
        <div className="premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
          <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3">
            Social Category representation
          </h4>

          <div className="space-y-4">
            {categoryData.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs font-bold text-navy-950">
                <div className="flex justify-between">
                  <span>{item.category} Category</span>
                  <span>{item.Count} Scholars ({item.percentage})</span>
                </div>
                <div className="h-2 w-full bg-surface-slate rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-navy-950' : idx === 1 ? 'bg-blue-800' : idx === 2 ? 'bg-gold-500' : 'bg-success-green'
                    }`} 
                    style={{ width: item.percentage }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Balance Mock Stats */}
        <div className="premium-card bg-white border border-border-slate p-6 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3">
              Gender Demographics Ratio
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-text-slate">
              <div className="p-4 bg-blue-800/[0.03] border border-blue-800/10 rounded-2xl space-y-1">
                <span>Male Applicants</span>
                <p className="font-outfit font-black text-2xl text-navy-950 mt-1">58%</p>
                <p className="text-[10px] font-medium text-text-slate mt-0.5">National & International</p>
              </div>
              <div className="p-4 bg-gold-500/[0.03] border border-gold-500/10 rounded-2xl space-y-1">
                <span>Female Applicants</span>
                <p className="font-outfit font-black text-2xl text-gold-500 mt-1">42%</p>
                <p className="text-[10px] font-medium text-text-slate mt-0.5">National & International</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-success-green/5 border border-success-green/10 rounded-xl text-[10.5px] font-semibold text-text-slate leading-relaxed flex gap-2">
            <CheckCircle className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
            Demographics data complies perfectly with university reservation frameworks for the academic year 2026.
          </div>
        </div>

      </div>

    </div>
  );
}

// Inline mini CheckCircle wrapper
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
