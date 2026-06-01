'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  CalendarRange, 
  FileQuestion, 
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { usePortalState } from '@/hooks/usePortalState';

export default function CandidateDashboardOverview() {
  const router = useRouter();
  const { activeUser } = usePortalState();

  if (!activeUser) return null;

  const status = activeUser.status || 'Draft';
  const hasBookedSlot = !!activeUser.bookedSlot;
  const hasMockTest = !!activeUser.mockTestResult;

  interface ChecklistItem {
    title: string;
    desc: string;
    done: boolean;
    inProgress?: boolean;
    blocked?: boolean;
    action: string;
    actionLabel: string;
  }

  // Checklist computation
  const checklist: ChecklistItem[] = [
    {
      title: 'Registration Form Submitted',
      desc: 'Form information completed, draft verified, and locked.',
      done: status !== 'Draft',
      action: '/dashboard/profile',
      actionLabel: 'View Profile'
    },
    {
      title: 'Academic Document Cabinet',
      desc: 'Transcripts, identity proof, and research proposal successfully uploaded.',
      done: status !== 'Draft',
      action: '/dashboard/documents',
      actionLabel: 'Documents Hub'
    },
    {
      title: 'Entrance slot reservation',
      desc: 'Book your preferred date and timing for the online examination.',
      done: hasBookedSlot,
      blocked: status === 'Draft',
      action: '/dashboard/slot-booking',
      actionLabel: 'Book Slot'
    },
    {
      title: 'Diagnostic Mock Test Simulator',
      desc: 'Acclimatize with a 20-question portal test covering general and core research methodology.',
      done: hasMockTest,
      action: '/dashboard/mock-test',
      actionLabel: 'Take Mock Test'
    },
    {
      title: 'Central RPET Entrance Examination',
      desc: 'Appear for the official 120-minute examination on August 15, 2026.',
      done: false,
      blocked: !hasBookedSlot,
      action: '/dashboard/exam',
      actionLabel: 'Exam Parameters'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Dynamic welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-border-slate/85 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gold-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1 z-10">
          <span className="text-[10px] font-extrabold uppercase bg-gold-500/10 text-gold-500 border border-gold-500/20 px-3 py-1 rounded-full">
            Scholar Terminal
          </span>
          <h1 className="font-outfit font-black text-2xl text-navy-950 mt-1.5">
            PhD Applicant Workspace
          </h1>
          <p className="text-xs font-semibold text-text-slate">
            Track validation metrics, book exam slots, and run online test simulations.
          </p>
        </div>
        
        {/* Progress status card */}
        <div className="flex items-center gap-4 shrink-0 bg-surface-slate/60 border border-border-slate px-4 py-3 rounded-xl z-10">
          <div className="text-right">
            <span className="text-[10px] font-semibold text-text-slate leading-none">Admission Progress</span>
            <p className="text-[15px] font-black text-navy-950 mt-0.5">
              {status === 'Approved' ? '100%' : status === 'Verified' ? '75%' : status === 'Submitted' ? '50%' : '25%'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center text-white">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* TOP 4 SaaS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-950/5 text-navy-950 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-slate leading-none block">Application Status</span>
            <p className="text-[14px] font-extrabold text-navy-950 mt-1">
              {status === 'Submitted' ? 'Under Audit' : status}
            </p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-950/5 text-navy-950 flex items-center justify-center shrink-0">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-slate leading-none block">Testing Slot Status</span>
            <p className="text-[14px] font-extrabold text-navy-950 mt-1">
              {hasBookedSlot ? 'Confirmed' : 'Action Required'}
            </p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-950/5 text-navy-950 flex items-center justify-center shrink-0">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-slate leading-none block">Mock Test Status</span>
            <p className="text-[14px] font-extrabold text-navy-950 mt-1">
              {hasMockTest ? `Completed (${activeUser.mockTestResult?.score}/20)` : 'Not Attempted'}
            </p>
          </div>
        </div>

        <div className="premium-card premium-shadow bg-white border border-border-slate flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-950/5 text-navy-950 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-slate leading-none block">Entrance Exam Status</span>
            <p className="text-[14px] font-extrabold text-navy-950 mt-1">
              Scheduled (Aug 15)
            </p>
          </div>
        </div>

      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Checklists - 8 Columns */}
        <div className="lg:col-span-8 premium-card bg-white border border-border-slate space-y-6">
          <div className="border-b border-border-slate/60 pb-4">
            <h3 className="font-outfit font-extrabold text-lg text-navy-950">Admission Roadmap Checklist</h3>
            <p className="text-xs font-semibold text-text-slate">Follow these five key chronological milestones to secure your guide allocations.</p>
          </div>

          <div className="space-y-4">
            {checklist.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  item.done 
                    ? 'bg-success-green/[0.02] border-success-green/10' 
                    : item.inProgress 
                    ? 'bg-blue-800/[0.02] border-blue-800/10'
                    : item.blocked
                    ? 'opacity-60 bg-bg-slate/50 border-border-slate/50'
                    : 'bg-white border-border-slate hover:border-navy-950/20'
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {item.done ? (
                      <CheckCircle className="w-5 h-5 text-success-green" />
                    ) : item.inProgress ? (
                      <Clock className="w-5 h-5 text-blue-800 animate-pulse" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border-slate shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[13.5px] font-bold text-navy-950 flex items-center gap-2">
                      {item.title}
                      {item.blocked && (
                        <span className="text-[8px] font-extrabold uppercase bg-border-slate text-text-slate px-2 py-0.5 rounded">Locked</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-text-slate leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {!item.done && !item.blocked ? (
                    <button
                      onClick={() => router.push(item.action)}
                      className="inline-flex items-center gap-1 text-[11px] font-black text-blue-800 hover:text-navy-950 bg-blue-800/5 px-3 py-2 rounded-lg border border-blue-800/10 transition-colors"
                    >
                      {item.actionLabel}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : item.done ? (
                    <span className="text-[10px] font-extrabold text-success-green uppercase bg-success-green/10 border border-success-green/20 px-2.5 py-1 rounded-full">
                      Complete
                    </span>
                  ) : (
                    <div className="h-8" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Details Profile info - 4 Columns */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Metadata Card */}
          <div className="premium-card bg-white border border-border-slate space-y-4">
            <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3">
              Application specifications
            </h4>
            
            <div className="space-y-3.5 text-xs font-semibold text-text-slate">
              <div className="flex justify-between">
                <span>Application Reference ID</span>
                <span className="font-extrabold text-navy-950">{activeUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Research Domain</span>
                <span className="font-extrabold text-navy-950 truncate max-w-[150px]">{activeUser.academicInfo?.researchDepartment || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Registration Logged</span>
                <span className="font-extrabold text-navy-950">{activeUser.registrationDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Highest Degree</span>
                <span className="font-extrabold text-navy-950 truncate max-w-[150px]">{activeUser.academicInfo?.highestQualification || 'Unspecified'}</span>
              </div>
            </div>
          </div>

          {/* Confirmed Slot Card for Dashboard Integration */}
          {hasBookedSlot && activeUser.bookedSlot && (
            <div className="premium-card bg-white border border-border-slate space-y-4 shadow-sm">
              <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-1.5">
                <CalendarRange className="w-4 h-4 text-blue-800" />
                Slot Confirmation
              </h4>
              
              <div className="space-y-3.5 text-xs font-semibold text-text-slate">
                <div className="flex justify-between items-center">
                  <span>Slot Status</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase">
                    Confirmed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Exam Date</span>
                  <span className="font-extrabold text-navy-950">{activeUser.bookedSlot.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exam Time</span>
                  <span className="font-extrabold text-navy-950">{activeUser.bookedSlot.time.split(' – ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking ID</span>
                  <span className="font-extrabold text-navy-950 font-mono">{activeUser.bookedSlot.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exam Mode</span>
                  <span className="font-extrabold text-navy-950">{activeUser.bookedSlot.mode || 'Online Proctored'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Advisory */}
          {status === 'Submitted' && (
            <div className="p-4 bg-blue-800/5 border border-blue-800/10 rounded-2xl flex gap-3 text-xs leading-relaxed font-semibold">
              <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-navy-950">Application Completed</p>
                <p className="text-text-slate text-[11px] leading-relaxed">
                  Your academic application has been submitted successfully. Please proceed to the <strong>Slot Booking</strong> page to select and lock your examination date and session.
                </p>
              </div>
            </div>
          )}

          {status === 'Approved' && (
            <div className="p-4 bg-success-green/5 border border-success-green/15 rounded-2xl flex gap-3 text-xs leading-relaxed font-semibold">
              <Info className="w-5 h-5 text-success-green shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-navy-950">Fully Validated Candidate</p>
                <p className="text-text-slate text-[11px] leading-relaxed">
                  Your application has been approved by the board. You are cleared for the official entrance exam on August 15, 2026.
                </p>
              </div>
            </div>
          )}

          {status === 'Rejected' && (
            <div className="p-4 bg-error-red/5 border border-error-red/15 rounded-2xl space-y-2.5 text-xs font-semibold">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-error-red shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-error-red">Re-Upload Documents Requested</p>
                  <p className="text-text-slate text-[11px] leading-relaxed">
                    Some documents were rejected. Please click the button below to inspect administrative feedback and reupload documents.
                  </p>
                </div>
              </div>
              
              {activeUser.verificationNotes && (
                <div className="p-3 bg-white border border-border-slate rounded-xl text-[10.5px] font-medium text-text-navy italic">
                  " {activeUser.verificationNotes} "
                </div>
              )}

              <button
                onClick={() => router.push('/dashboard/documents')}
                className="w-full text-center py-2 bg-error-red/10 hover:bg-error-red/15 text-error-red rounded-xl font-bold transition-all text-[11px]"
              >
                Reupload Documents Cabinet
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
