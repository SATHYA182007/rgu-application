'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Clipboard, FileCheck, HelpCircle } from 'lucide-react';
import { usePortalState } from '../../hooks/usePortalState';
import { toast } from 'sonner';

export default function SubmissionSuccess() {
  const router = useRouter();
  const { activeUser } = usePortalState();

  const handleCopyId = () => {
    if (activeUser?.id) {
      navigator.clipboard.writeText(activeUser.id);
      toast.success('Application ID copied to clipboard!');
    }
  };

  const handleProceedToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg-slate flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-800/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white rounded-3xl premium-card premium-shadow border border-border-slate p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-success-green/10 text-success-green flex items-center justify-center mx-auto border border-success-green/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase bg-success-green/10 text-success-green border border-success-green/20 px-3 py-1 rounded-full">
            Submission Confirmed
          </span>
          <h1 className="font-outfit font-black text-3xl text-navy-950 mt-2">Application Logged</h1>
          <p className="text-xs font-semibold text-text-slate max-w-sm mx-auto leading-relaxed">
            Your application for the Rathinam Global University Research & PhD Entrance Test (RPET 2026) has been registered successfully.
          </p>
        </div>

        {/* Application ID Card */}
        <div className="p-6 bg-surface-slate rounded-2xl border border-border-slate space-y-4">
          <div className="flex justify-between items-center pb-3.5 border-b border-border-slate/60">
            <span className="text-xs font-bold text-text-slate">Application Reference ID</span>
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-black text-navy-950 text-base">{activeUser?.id || 'RPET2026-000101'}</span>
              <button 
                onClick={handleCopyId}
                className="p-1.5 hover:bg-bg-slate rounded-lg text-text-slate hover:text-navy-950 transition-colors"
                title="Copy ID"
              >
                <Clipboard className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium">
            <div>
              <p className="text-text-slate font-semibold">Registered Email</p>
              <p className="font-bold text-navy-950 mt-0.5 truncate">{activeUser?.personalInfo?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-slate font-semibold">Registered Contact</p>
              <p className="font-bold text-navy-950 mt-0.5 truncate">{activeUser?.personalInfo?.mobile || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Informative tips */}
        <div className="p-4 bg-blue-800/5 border border-blue-800/10 rounded-2xl flex gap-3 text-left">
          <FileCheck className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-navy-950">What's Next?</p>
            <p className="text-[11px] text-text-slate leading-relaxed">
              Our academic verify panel is currently auditing your certificates. Once verified, you will be authorized to book your testing slot and attempt official diagnostic mock exams directly from the student hub.
            </p>
          </div>
        </div>

        <button
          onClick={handleProceedToDashboard}
          className="w-full h-14 rounded-2xl bg-navy-950 text-white font-extrabold text-[14px] hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          Go To Candidate Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

    </div>
  );
}
