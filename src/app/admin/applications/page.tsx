'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalState } from '@/hooks/usePortalState';
import { CandidateApplication } from '@/types';
import { 
  Search, 
  ArrowUpRight, 
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminApplicationsList() {
  const router = useRouter();
  const { candidates } = usePortalState();
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Handle Export Mock
  const handleExportData = () => {
    toast.success('Applicants spreadsheet exported successfully!', {
      description: 'Downloaded 144 registered candidate rows in CSV format.'
    });
  };

  // Status visual configurations
  const statusBadges: Record<string, string> = {
    Draft: 'bg-text-slate/10 text-text-slate border-text-slate/20',
    Submitted: 'bg-blue-800/10 text-blue-800 border-blue-800/20',
    Verified: 'bg-warning-amber/10 text-warning-amber border-warning-amber/20',
    Approved: 'bg-success-green/10 text-success-green border-success-green/20',
    Rejected: 'bg-error-red/10 text-error-red border-error-red/20'
  };

  // Filter computation
  const filteredCandidates = candidates.filter((candidate: CandidateApplication) => {
    // 1. Search Query Match
    const fullName = `${candidate.personalInfo?.firstName} ${candidate.personalInfo?.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      candidate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.personalInfo?.email.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status Match
    const matchesStatus = statusFilter === 'ALL' || candidate.status === statusFilter;

    // 3. Dept Match
    const matchesDept = 
      deptFilter === 'ALL' || 
      candidate.academicInfo?.researchDepartment.toLowerCase() === deptFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-slate/60 pb-5">
        <div>
          <h1 className="font-outfit font-black text-2xl text-navy-950">Candidate Spreadsheet Database</h1>
          <p className="text-xs font-semibold text-text-slate">Audit registered candidate files, filter metrics, and export data records.</p>
        </div>

        <button
          onClick={handleExportData}
          className="px-5 py-2.5 bg-navy-950 hover:bg-blue-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-center"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Database (CSV)
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="premium-card bg-white border border-border-slate p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-slate" />
            <input
              type="text"
              placeholder="Search by Name, Reference ID, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-xl border border-border-slate pl-11 pr-4 text-xs font-semibold text-text-navy focus:outline-none focus:border-blue-800 focus:ring-4 focus:ring-blue-800/5 bg-bg-slate/30 focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-12 rounded-xl border border-border-slate px-4 text-xs font-bold text-text-navy focus:outline-none focus:border-blue-800 bg-bg-slate/30 focus:bg-white transition-all"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted (Pending Audit)</option>
              <option value="Verified">Verified (Qualify Booking)</option>
              <option value="Approved">Approved Candidate</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Dept Filter */}
          <div className="md:col-span-3">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full h-12 rounded-xl border border-border-slate px-4 text-xs font-bold text-text-navy focus:outline-none focus:border-blue-800 bg-bg-slate/30 focus:bg-white transition-all"
            >
              <option value="ALL">All Research Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Data Science">Data Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Commerce">Commerce</option>
              <option value="Management">Management</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>

        </div>
      </div>

      {/* APPLICATIONS SHEET SPREADSHEET */}
      <div className="premium-card bg-white border border-border-slate rounded-2xl overflow-hidden shadow-sm p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-slate text-[10px] font-bold text-text-slate uppercase tracking-wider border-b border-border-slate">
                <th className="py-4 px-6">Reference ID</th>
                <th className="py-4 px-6">Candidate Details</th>
                <th className="py-4 px-6">Research Field</th>
                <th className="py-4 px-6">Registration Date</th>
                <th className="py-4 px-6">Form Progress</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/60 text-xs font-semibold text-text-navy">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c: CandidateApplication) => (
                  <tr key={c.id} className="hover:bg-bg-slate/40 transition-colors">
                    <td className="py-4.5 px-6 font-mono font-bold text-navy-950">{c.id}</td>
                    <td className="py-4.5 px-6">
                      <p className="font-outfit font-bold text-navy-950">{c.personalInfo?.firstName} {c.personalInfo?.lastName}</p>
                      <p className="text-[10px] font-semibold text-text-slate mt-0.5">{c.personalInfo?.email}</p>
                    </td>
                    <td className="py-4.5 px-6">
                      <p className="font-bold text-navy-950">{c.academicInfo?.researchDepartment}</p>
                      <p className="text-[9px] font-semibold text-text-slate mt-0.5 truncate max-w-[150px]">{c.academicInfo?.proposedResearchArea}</p>
                    </td>
                    <td className="py-4.5 px-6 text-text-slate">{c.registrationDate}</td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-surface-slate rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-blue-800" style={{ width: `${c.progressPercent}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-text-slate">{c.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${statusBadges[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => router.push(`/admin/verification?appId=${c.id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-black text-blue-800 hover:text-navy-950 bg-blue-800/5 hover:bg-blue-800/10 px-3 py-2 rounded-lg border border-blue-800/10 transition-colors"
                      >
                        Audit Files
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-slate font-medium">
                    No matching candidate records discovered under current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
