'use client';

import { useState } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Download, 
  CheckCircle,
  QrCode,
  ShieldCheck,
  Printer,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function EntranceExamDetails() {
  const { activeUser } = usePortalState();
  const [admitCardOpen, setAdmitCardOpen] = useState<boolean>(false);

  if (!activeUser) return null;

  const hasBooked = !!activeUser.bookedSlot;
  const booked = activeUser.bookedSlot;

  const handleDownloadAdmitCard = () => {
    toast.success('Official RPET 2026 Admit Card PDF downloaded successfully!', {
      description: 'The secure digital document has been verified and saved.'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5">
        <h1 className="font-outfit font-black text-2xl text-navy-950">Entrance Examination Schedule</h1>
        <p className="text-xs font-semibold text-text-slate">Inspect testing parameters, guidelines, and access your official digital admit card.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Parameters - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="premium-card bg-white border border-border-slate p-6 space-y-5 shadow-sm">
            <h3 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-blue-800" />
              Official Schedule Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-semibold">
              <div className="space-y-1">
                <span className="text-text-slate">Examination Date</span>
                <p className="font-bold text-navy-950 text-[13px] mt-0.5">
                  {hasBooked ? booked?.date : '15 August 2026'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-text-slate">Examination Hour</span>
                <p className="font-bold text-navy-950 text-[13px] mt-0.5">
                  {hasBooked ? booked?.time : 'Pending Slot Booking'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-text-slate">Duration</span>
                <p className="font-bold text-navy-950 text-[13px] mt-0.5">120 Minutes</p>
              </div>
              <div className="space-y-1">
                <span className="text-text-slate">Examination Mode</span>
                <p className="font-bold text-navy-950 text-[13px] mt-0.5">Online Proctored</p>
              </div>
              <div className="space-y-1">
                <span className="text-text-slate">Total Questions</span>
                <p className="font-bold text-navy-950 text-[13px] mt-0.5">100 MCQs</p>
              </div>
              <div className="space-y-1">
                <span className="text-text-slate">Negative Marking</span>
                <p className="font-bold text-success-green text-[13px] mt-0.5">No Negative Marks</p>
              </div>
            </div>
          </div>

          <div className="premium-card bg-white border border-border-slate p-6 space-y-4 shadow-sm">
            <h3 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-blue-800" />
              Testing Conduct Guidelines
            </h3>

            <ul className="list-disc pl-5 text-xs text-text-slate space-y-2.5 font-medium">
              <li>Candidates must maintain active audio and video streaming feeds throughout the entire 120 minutes.</li>
              <li>A high-speed, stable internet connection is mandatory. Mobile hotspot connections are highly discouraged to avoid connection drops.</li>
              <li>Any screen switching, background workspace navigation, or second-device matching will trigger automated red flag warnings. Multiple warnings will lead to instant assessment lockout.</li>
              <li>Ensure your physical room holds adequate lighting and zero auditory interference.</li>
              <li>Keep your physical Aadhaar card handy at the startup screen for visual digital matching validations.</li>
            </ul>
          </div>

        </div>

        {/* Right Column Admit Card download lock - 4 cols */}
        <div className="lg:col-span-4 premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
          <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3">
            Admit Card Terminal
          </h4>

          {hasBooked ? (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-success-green/10 text-success-green flex items-center justify-center mx-auto border border-success-green/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-navy-950">Admit Card Generated</p>
                <p className="text-[10px] font-semibold text-text-slate">Your credentials have been signed and locked by the board.</p>
              </div>

              <button
                onClick={() => setAdmitCardOpen(true)}
                className="w-full py-3 bg-navy-950 hover:bg-blue-800 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm"
              >
                View Admit Card
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-border-slate text-text-slate flex items-center justify-center mx-auto border border-border-slate">
                <Calendar className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-navy-950">Admit Card Locked</p>
                <p className="text-[10px] font-semibold text-text-slate leading-relaxed">
                  You must complete your entrance timeslot reservation to generate the admit card document.
                </p>
              </div>

              <button
                disabled
                className="w-full py-3 bg-border-slate text-text-slate font-bold rounded-xl text-xs cursor-not-allowed"
              >
                Locked: Book Slot First
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ADMIT CARD VIEW MODAL */}
      {admitCardOpen && booked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setAdmitCardOpen(false)}
            className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-[650px] bg-white rounded-3xl premium-shadow overflow-hidden border border-border-slate">
            
            {/* Header toolbar */}
            <div className="bg-surface-slate px-6 py-4 border-b border-border-slate flex items-center justify-between">
              <h3 className="font-outfit font-extrabold text-[14px] text-navy-950">Secure Admit Card Console</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadAdmitCard}
                  className="px-3.5 py-1.5 bg-navy-950 hover:bg-blue-800 text-white rounded-lg font-bold text-[10.5px] flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF Download
                </button>
                <button
                  onClick={handlePrint}
                  className="p-1.5 hover:bg-border-slate rounded-lg text-text-slate hover:text-navy-950 transition-colors border border-border-slate/60"
                  title="Print Document"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAdmitCardOpen(false)}
                  className="p-1.5 hover:bg-border-slate rounded-lg text-text-slate hover:text-navy-950 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ADMIT CARD RENDER */}
            <div className="p-8 space-y-6" id="printable-admit-card">
              
              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-navy-950 pb-5">
                <div className="space-y-1">
                  <h4 className="font-outfit font-black text-navy-950 text-base leading-none">RATHINAM GLOBAL UNIVERSITY</h4>
                  <p className="text-[9px] font-bold text-gold-500 tracking-wider">OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
                  <p className="text-[10px] font-bold text-navy-950 uppercase tracking-widest pt-1 bg-surface-slate px-2 py-0.5 rounded w-fit">RPET 2026 ADMIT CARD</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-outfit font-black text-xl">
                  R
                </div>
              </div>

              {/* Scholar photo & QR details split */}
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                
                {/* Profile fields details table */}
                <div className="flex-grow space-y-3.5 text-xs font-semibold text-text-slate">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Candidate Name</span>
                      <p className="font-bold text-navy-950 text-[13px]">{activeUser.personalInfo?.firstName} {activeUser.personalInfo?.lastName}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Reference Application ID</span>
                      <p className="font-bold text-navy-950 text-[13px]">{activeUser.id}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Research Domain</span>
                      <p className="font-bold text-navy-950 text-[13px]">{activeUser.academicInfo?.researchDepartment}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Social Category Group</span>
                      <p className="font-bold text-navy-950 text-[13px]">{activeUser.identityInfo?.category}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Exam Date</span>
                      <p className="font-bold text-navy-950 text-[13px]">{booked.date}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Exam Time Slot</span>
                      <p className="font-bold text-navy-950 text-[13px]">{booked.time}</p>
                    </div>
                  </div>
                </div>

                {/* Photo & QR Side blocks */}
                <div className="flex gap-4 shrink-0 justify-center sm:justify-end items-center sm:items-start">
                  {/* Photo mock */}
                  <div className="w-24 h-28 border border-border-slate bg-surface-slate rounded-lg overflow-hidden flex items-center justify-center relative">
                    {activeUser.documents?.passportPhoto ? (
                      <img 
                        src={activeUser.documents.passportPhoto.url} 
                        alt="Passport photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[9px] font-semibold text-text-slate">Photo</span>
                    )}
                  </div>
                  
                  {/* QR code mock */}
                  <div className="w-24 h-28 border border-border-slate bg-surface-slate rounded-lg flex flex-col items-center justify-center p-3 relative space-y-1.5">
                    <QrCode className="w-12 h-12 text-navy-950 shrink-0" />
                    <span className="text-[8px] font-bold text-text-slate leading-none">SECURE KEY</span>
                  </div>
                </div>

              </div>

              {/* Verification Stamp Footer */}
              <div className="pt-6 border-t border-border-slate/60 flex items-end justify-between">
                <div className="text-[10px] text-text-slate font-medium max-w-sm leading-relaxed">
                  * Note: This is an electronically generated admit card signed using digital hash algorithms. No physical signatures are requested.
                </div>

                <div className="text-center space-y-1">
                  <div className="h-10 w-24 bg-success-green/5 text-success-green flex items-center justify-center border border-dashed border-success-green/30 rounded text-[9px] font-extrabold uppercase select-none">
                    RGU COE STAMP
                  </div>
                  <p className="text-[8px] font-extrabold text-navy-950 uppercase tracking-wider">Controller of Exams</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
