'use client';

import { useState, useEffect, useRef } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  FileDown, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Activity, 
  UserCheck, 
  Timer, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Camera, 
  Mic, 
  Wifi, 
  Laptop 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function SlotBooking() {
  const { activeUser, bookSlot } = usePortalState();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [successScreen, setSuccessScreen] = useState<boolean>(false);
  const [reschedulingMode, setReschedulingMode] = useState<boolean>(false);
  
  // System diagnostics check states
  const [diagnosticsRunning, setDiagnosticsRunning] = useState<boolean>(false);
  const [diagnosticStep, setDiagnosticStep] = useState<number>(0);
  const [readiness, setReadiness] = useState({
    webcam: 'Pending',
    microphone: 'Pending',
    internet: 'Pending',
    browser: 'Passed',
    photoId: 'Pending'
  });

  // Countdown timer state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Print reference
  const ticketRef = useRef<HTMLDivElement>(null);

  // Handle setting photo ID state from activeUser verification status
  useEffect(() => {
    if (activeUser) {
      const idStatus = activeUser.status !== 'Draft' ? 'Passed' : 'Pending';
      setReadiness(prev => ({
        ...prev,
        photoId: idStatus
      }));
    }
  }, [activeUser]);

  // Real-time Countdown clock to the examination slot
  useEffect(() => {
    if (!activeUser?.bookedSlot) return;

    const targetDateStr = activeUser.bookedSlot.date;
    const timePart = activeUser.bookedSlot.time.split(' – ')[0] || '09:00 AM';

    const parseTimeAndDate = () => {
      try {
        const [datePart] = targetDateStr.split('T');
        const examDate = new Date(`${datePart} ${timePart}`);
        if (isNaN(examDate.getTime())) {
          return new Date('2026-08-15T09:00:00');
        }
        return examDate;
      } catch (e) {
        return new Date('2026-08-15T09:00:00');
      }
    };

    const targetDate = parseTimeAndDate();

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [activeUser?.bookedSlot]);

  if (!activeUser) return null;

  const isEligible = activeUser.status !== 'Draft';
  const hasBooked = !!activeUser.bookedSlot;
  const isRescheduledMax = hasBooked && (activeUser.bookedSlot?.rescheduleCount ?? 0) >= 1;
  const bookedSlot = activeUser.bookedSlot;

  // Custom static testing slots
  const examDates = [
    { id: '2026-08-15', date: '15 Aug 2026', day: 'Saturday', seats: 45 },
    { id: '2026-08-16', date: '16 Aug 2026', day: 'Sunday', seats: 28 },
    { id: '2026-08-17', date: '17 Aug 2026', day: 'Monday', seats: 62 },
    { id: '2026-08-18', date: '18 Aug 2026', day: 'Tuesday', seats: 50 },
    { id: '2026-08-19', date: '19 Aug 2026', day: 'Wednesday', seats: 37 },
    { id: '2026-08-20', date: '20 Aug 2026', day: 'Thursday', seats: 19 }
  ];

  const sessions = [
    {
      title: 'Morning Session',
      slots: [
        { time: '09:00 AM – 11:00 AM', seatsRemaining: 12, capacityPercent: 80 },
        { time: '11:00 AM – 01:00 PM', seatsRemaining: 8, capacityPercent: 88 }
      ]
    },
    {
      title: 'Afternoon Session',
      slots: [
        { time: '01:00 PM – 03:00 PM', seatsRemaining: 15, capacityPercent: 75 },
        { time: '03:00 PM – 05:00 PM', seatsRemaining: 5, capacityPercent: 92 }
      ]
    }
  ];



  const runSystemDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticStep(1);

    setTimeout(() => {
      setDiagnosticStep(2);
      setTimeout(() => {
        setDiagnosticStep(3);
        setTimeout(() => {
          setDiagnosticStep(4);
          setTimeout(() => {
            setReadiness(prev => ({
              ...prev,
              webcam: 'Passed',
              microphone: 'Passed',
              internet: 'Passed'
            }));
            setDiagnosticsRunning(false);
            setDiagnosticStep(0);
            toast.success('Hardware diagnostics completed successfully!', {
              description: 'Camera, Microphone, and Ping thresholds have passed our online assessment benchmarks.'
            });
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;

    const matchedDate = examDates.find(d => d.id === selectedDate);
    const dateLabel = matchedDate ? `${matchedDate.date} (${matchedDate.day})` : selectedDate;

    const prevRescheduleCount = bookedSlot?.rescheduleCount ?? 0;
    const isReschedule = hasBooked;

    const historyArray = bookedSlot?.bookingHistory ? [...bookedSlot.bookingHistory] : [];
    if (isReschedule && bookedSlot) {
      historyArray.push({
        bookingId: bookedSlot.bookingId,
        date: bookedSlot.date,
        time: bookedSlot.time,
        mode: bookedSlot.mode,
        bookingDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }

    const bookingReferenceId = `BOOK-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newSlotDetails = {
      bookingId: bookingReferenceId,
      date: selectedDate,
      time: selectedTime,
      mode: 'Online Proctored',
      rescheduleCount: isReschedule ? prevRescheduleCount + 1 : 0,
      bookingHistory: historyArray
    };

    bookSlot(activeUser.id, newSlotDetails);
    setConfirmationOpen(false);
    setReschedulingMode(false);
    setSuccessScreen(true);

    confetti({
      particleCount: 150,
      spread: 80,
      colors: ['#0B1F3A', '#1E4D8C', '#D4A017', '#10B981']
    });

    toast.success(isReschedule ? 'Examination slot rescheduled!' : 'Examination slot reserved successfully!', {
      description: `Confirmed for ${dateLabel} at ${selectedTime}.`
    });
  };

  const handlePrintTicket = () => {
    window.print();
  };

  // Render Section 7: Booking Success Screen
  if (successScreen && bookedSlot) {
    const dateDetail = examDates.find(d => d.id === bookedSlot.date);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-3xl mx-auto space-y-8 py-8"
      >
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm shadow-emerald-100">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h2 className="font-outfit font-black text-3xl text-navy-950">Slot Booking Complete</h2>
          <p className="text-sm font-semibold text-text-slate max-w-lg mx-auto">
            Your research seat reservation has been verified and permanently locked in the university's academic register.
          </p>
        </div>

        {/* Printable Ticket */}
        <div 
          ref={ticketRef} 
          className="bg-white border border-border-slate rounded-3xl overflow-hidden premium-shadow print-ticket"
        >
          <div className="bg-navy-950 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Admissions Wing</h4>
              <h3 className="font-outfit font-black text-lg">Rathinam Global University</h3>
              <p className="text-[10px] text-slate-300 font-medium">Research & PhD Entrance Test (RPET 2026)</p>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-right shrink-0">
              <p className="text-[9px] text-slate-300 font-bold uppercase">Booking Reference</p>
              <p className="font-outfit font-black text-sm text-amber-400 mt-0.5">{bookedSlot.bookingId}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Candidate Identity */}
            <div className="grid md:grid-cols-3 gap-6 border-b border-slate-100 pb-6">
              <div>
                <p className="text-[9px] font-bold text-text-slate uppercase tracking-wider">Candidate Name</p>
                <p className="font-outfit font-extrabold text-navy-950 text-sm mt-1">
                  {activeUser.personalInfo.firstName} {activeUser.personalInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-slate uppercase tracking-wider">Application ID</p>
                <p className="font-outfit font-extrabold text-navy-950 text-sm mt-1">{activeUser.id}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-slate uppercase tracking-wider">Department</p>
                <p className="font-outfit font-extrabold text-navy-950 text-sm mt-1">
                  {activeUser.academicInfo?.researchDepartment || 'Engineering'}
                </p>
              </div>
            </div>

            {/* Assessment Details */}
            <div className="grid md:grid-cols-2 gap-8 bg-surface-slate/50 p-6 rounded-2xl border border-border-slate/50">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-slate flex items-center justify-center shrink-0 text-blue-800 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-slate uppercase">Examination Date</p>
                  <p className="font-outfit font-extrabold text-navy-950 text-base">
                    {dateDetail ? `${dateDetail.date}` : bookedSlot.date}
                  </p>
                  <p className="text-[10px] text-text-slate font-medium">{dateDetail?.day || 'Saturday'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-slate flex items-center justify-center shrink-0 text-blue-800 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-slate uppercase">Timeslot Window</p>
                  <p className="font-outfit font-extrabold text-navy-950 text-base">{bookedSlot.time}</p>
                  <p className="text-[10px] text-text-slate font-medium">Session: Online Proctoring</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-text-slate uppercase">Duration</span>
                <p className="font-outfit font-extrabold text-navy-950 text-sm mt-0.5">120 Mins</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-text-slate uppercase">Questions</span>
                <p className="font-outfit font-extrabold text-navy-950 text-sm mt-0.5">100 MCQs</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-text-slate uppercase">Max Marks</span>
                <p className="font-outfit font-extrabold text-navy-950 text-sm mt-0.5">100 Marks</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-text-slate uppercase">Exam Mode</span>
                <p className="font-outfit font-extrabold text-emerald-600 text-sm mt-0.5">Proctored</p>
              </div>
            </div>

            {/* Advisory */}
            <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-navy-950 text-xs">Verification & Compliance Advisory</p>
                <p className="text-[11px] text-text-slate leading-relaxed">
                  Please keep this ticket printed or saved on your drive. You can reschedule your exam slot only <span className="font-bold text-navy-950">once</span> before the registration closure. AI system locks your device IP address 30 minutes before your slot triggers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[10px] text-text-slate font-medium">
            Rathinam Research Syndicate • Technical Helpdesk: testing@rathinam.in
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handlePrintTicket}
            className="w-full sm:w-auto h-12 px-6 rounded-xl border border-border-slate bg-white text-navy-950 font-bold text-xs hover:bg-surface-slate transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            Download Slot Confirmation
          </button>
          
          <button
            onClick={() => setSuccessScreen(false)}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-navy-950 text-white font-extrabold text-xs hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Go To Slot Console
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-slate/60 pb-5 gap-4">
        <div>
          <h1 className="font-outfit font-black text-2xl text-navy-950">Examination Slot Booking</h1>
          <p className="text-xs font-semibold text-text-slate">Select your preferred entrance examination date and time slot.</p>
        </div>
        {bookedSlot && !reschedulingMode && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold text-text-slate">Reschedule Attempt:</span>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${isRescheduledMax ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
              {(bookedSlot?.rescheduleCount ?? 0)} / 1 Used
            </span>
          </div>
        )}
      </div>

      {/* SECTION 1: BOOKING STATUS CARD & Countdown Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Booking Status Card */}
        <div className="lg:col-span-8 bg-white border border-border-slate rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 premium-shadow">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-slate uppercase tracking-wider">Application Status</span>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                activeUser.status === 'Approved' ? 'bg-success-green/10 text-success-green border-success-green/20' : 
                activeUser.status === 'Verified' ? 'bg-blue-50 text-blue-800 border-blue-200' : 
                activeUser.status === 'Submitted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                {activeUser.status}
              </span>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-outfit font-black text-xl text-navy-950">
                {activeUser.personalInfo.firstName} {activeUser.personalInfo.lastName}
              </h2>
              <p className="text-xs text-text-slate font-semibold flex items-center gap-1.5">
                <span>Application Reference:</span>
                <span className="text-navy-950 font-extrabold">{activeUser.id}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
            <p className="text-[10px] font-bold text-text-slate uppercase tracking-wider">Booking Status</p>
            
            {bookedSlot && !reschedulingMode ? (
              <div className="flex flex-col md:items-end gap-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <Check className="w-4 h-4 stroke-[3]" />
                  Slot Confirmed
                </span>
                <p className="text-[10px] text-text-slate font-semibold mt-1">
                  Reference: <span className="text-navy-950 font-bold">{bookedSlot.bookingId}</span>
                </p>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4" />
                Not Booked
              </span>
            )}
          </div>
        </div>

        {/* countdown / active slot preview card */}
        <div className="lg:col-span-4 bg-white border border-border-slate rounded-3xl p-6 flex flex-col justify-center items-center text-center premium-shadow">
          {bookedSlot && !reschedulingMode ? (
            <div className="w-full space-y-4">
              <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider flex items-center justify-center gap-1">
                <Timer className="w-3.5 h-3.5 text-blue-800" />
                Examination Starts In
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-navy-950 text-white rounded-2xl p-2.5">
                  <span className="font-outfit font-black text-base md:text-lg block leading-tight">{countdown.days}</span>
                  <span className="text-[8px] font-medium text-slate-300 uppercase tracking-widest block mt-0.5">Days</span>
                </div>
                <div className="bg-navy-950 text-white rounded-2xl p-2.5">
                  <span className="font-outfit font-black text-base md:text-lg block leading-tight">{countdown.hours}</span>
                  <span className="text-[8px] font-medium text-slate-300 uppercase tracking-widest block mt-0.5">Hrs</span>
                </div>
                <div className="bg-navy-950 text-white rounded-2xl p-2.5">
                  <span className="font-outfit font-black text-base md:text-lg block leading-tight">{countdown.minutes}</span>
                  <span className="text-[8px] font-medium text-slate-300 uppercase tracking-widest block mt-0.5">Mins</span>
                </div>
              </div>

              <div className="text-[10px] text-text-slate font-semibold leading-relaxed border-t border-slate-100 pt-3">
                Exam on <span className="font-bold text-navy-950">{bookedSlot.date}</span> at <span className="font-bold text-navy-950">{bookedSlot.time.split(' – ')[0]}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-text-slate">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-navy-950">Select Your Examination Date</p>
              <p className="text-[10px] leading-relaxed">Book a slot below to initialize your live examination countdown tracker.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Core Slot Reservation Terminal */}
      {(!bookedSlot || reschedulingMode) && isEligible ? (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Panel - Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION 3: AVAILABLE EXAM DATES */}
            <div className="bg-white border border-border-slate rounded-3xl p-6 md:p-8 space-y-6 premium-shadow">
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-black text-md text-navy-950 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-800" />
                  Select Examination Date
                </h3>
                <span className="text-[10px] font-semibold text-text-slate bg-surface-slate px-2.5 py-1 rounded-full">
                  August 2026 Window
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {examDates.map((item) => {
                  const isSelected = selectedDate === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDate(item.id);
                        setSelectedTime('');
                      }}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                        isSelected 
                          ? 'border-blue-800 bg-blue-50/40 shadow-xs' 
                          : 'border-border-slate bg-white hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                      
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-text-slate uppercase tracking-wider">{item.day}</span>
                        <p className="font-outfit font-black text-navy-950 text-base">{item.date.split(' ')[0]} {item.date.split(' ')[1]}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 mt-3 w-full">
                        <p className="text-[10px] font-bold text-blue-800">{item.seats} Seats Available</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: AVAILABLE TIME SLOTS */}
            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-border-slate rounded-3xl p-6 md:p-8 space-y-6 premium-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit font-black text-md text-navy-950 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-800" />
                    Available Time Slots
                  </h3>
                  <span className="text-[10px] font-bold text-text-slate">
                    Selected: {examDates.find(d => d.id === selectedDate)?.date}
                  </span>
                </div>

                <div className="space-y-6">
                  {sessions.map((session, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h4 className="text-[10px] font-black text-text-slate uppercase tracking-wider border-b border-slate-100 pb-2">
                        {session.title}
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {session.slots.map((slot, slotIdx) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slotIdx}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`p-5 rounded-2xl border text-left transition-all duration-300 space-y-4 ${
                                isSelected 
                                  ? 'border-blue-800 bg-blue-50/40' 
                                  : 'border-border-slate bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-outfit font-extrabold text-sm text-navy-950">
                                  {slot.time.split(' – ')[0]} – {slot.time.split(' – ')[1]}
                                </span>
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-blue-800 text-white flex items-center justify-center">
                                    <Check className="w-3 stroke-[3]" />
                                  </span>
                                )}
                              </div>

                              {/* Progress bar occupancy indicator */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-semibold text-text-slate">
                                  <span>{slot.capacityPercent}% Occupied</span>
                                  <span className="font-bold text-navy-950">{slot.seatsRemaining} Seats Remaining</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-800 rounded-full transition-all duration-500" 
                                    style={{ width: `${slot.capacityPercent}%` }}
                                  />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* SECTION 5: SLOT SUMMARY PANEL */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white border border-border-slate rounded-3xl p-6 space-y-6 premium-shadow">
              <h3 className="font-outfit font-black text-md text-navy-950 pb-4 border-b border-slate-100">
                Reservation Summary
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-text-slate">Candidate</span>
                  <span className="text-navy-950 font-bold">{activeUser.personalInfo.firstName} {activeUser.personalInfo.lastName}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-text-slate">Application ID</span>
                  <span className="text-navy-950 font-mono font-bold">{activeUser.id}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-text-slate">Exam Mode</span>
                  <span className="text-navy-950 font-bold">Online Proctored</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-text-slate">Duration</span>
                  <span className="text-navy-950 font-bold">120 Minutes (2 Hrs)</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-text-slate">Selected Date</span>
                  <span className={`${selectedDate ? 'text-blue-800 font-extrabold' : 'text-text-slate font-medium'}`}>
                    {selectedDate ? examDates.find(d => d.id === selectedDate)?.date : 'Not Selected'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-text-slate">Selected Time</span>
                  <span className={`${selectedTime ? 'text-blue-800 font-extrabold' : 'text-text-slate font-medium'}`}>
                    {selectedTime ? selectedTime.split(' – ')[0] : 'Not Selected'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setConfirmationOpen(true)}
                  className={`w-full h-12 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                    selectedDate && selectedTime 
                      ? 'bg-navy-950 hover:bg-blue-800 hover:shadow-md cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {reschedulingMode ? 'Confirm Reschedule Slot' : 'Reserve Entrance Slot'}
                </button>
                {reschedulingMode && (
                  <button
                    onClick={() => {
                      setReschedulingMode(false);
                      setSelectedDate('');
                      setSelectedTime('');
                    }}
                    className="w-full mt-3 py-2.5 rounded-xl border border-border-slate text-xs font-bold text-text-slate hover:bg-surface-slate transition-all text-center"
                  >
                    Cancel Rescheduling
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 bg-blue-50/30 border border-blue-100 rounded-3xl flex gap-3 text-xs">
              <HelpCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-navy-950">Rescheduling Rules</p>
                <p className="text-[10px] text-text-slate leading-relaxed">
                  You are allowed to modify your scheduled time slot exactly once. Ensure you review local timetables carefully before clicking reserve.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      ) : (
        /* If already booked and NOT in rescheduling mode, render gorgeous confirmed console */
        bookedSlot && !reschedulingMode && isEligible ? (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Confirmed Ticket Preview and Details */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Confirmed Details card */}
              <div className="bg-white border border-border-slate rounded-3xl premium-shadow overflow-hidden">
                <div className="bg-slate-50/50 p-6 border-b border-border-slate/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                      <ShieldCheck className="w-5.5 h-5.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="font-outfit font-black text-navy-950 text-sm">Active Seat Reservation</h4>
                      <p className="text-[10px] font-semibold text-text-slate">Confirmed reference number: {bookedSlot.bookingId}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrintTicket}
                      className="h-10 px-4 rounded-xl border border-border-slate bg-white text-navy-950 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <FileDown className="w-4 h-4 text-text-slate" />
                      Print Slip
                    </button>

                    {!isRescheduledMax ? (
                      <button
                        onClick={() => {
                          setReschedulingMode(true);
                          setSelectedDate(bookedSlot.date);
                          setSelectedTime(bookedSlot.time);
                        }}
                        className="h-10 px-4 rounded-xl bg-navy-950 text-white font-extrabold text-xs hover:bg-blue-800 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Modify Slot (1 Remaining)
                      </button>
                    ) : (
                      <div className="group relative">
                        <button
                          disabled
                          className="h-10 px-4 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 font-extrabold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Reschedule Locked
                        </button>
                        <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-52 p-2 bg-navy-950 text-white text-[9px] leading-relaxed rounded-lg shadow-md z-10">
                          1 slot reschedule is allowed and has already been utilized for this candidate profile.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  
                  {/* Detailed parameters */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider">Testing Window Date</span>
                      <p className="font-outfit font-extrabold text-navy-950 text-sm flex items-center gap-1.5 mt-1">
                        <Calendar className="w-4.5 h-4.5 text-blue-800 shrink-0" />
                        {examDates.find(d => d.id === bookedSlot.date)?.date || bookedSlot.date}
                      </p>
                      <p className="text-[10px] text-text-slate font-medium">Day: {examDates.find(d => d.id === bookedSlot.date)?.day || 'Saturday'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider">Allocated Hour Block</span>
                      <p className="font-outfit font-extrabold text-navy-950 text-sm flex items-center gap-1.5 mt-1">
                        <Clock className="w-4.5 h-4.5 text-blue-800 shrink-0" />
                        {bookedSlot.time}
                      </p>
                      <p className="text-[10px] text-text-slate font-medium">Session: Online Proctoring</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider">Center Mode</span>
                      <p className="font-outfit font-extrabold text-emerald-600 text-sm flex items-center gap-1.5 mt-1">
                        <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        Online Proctored Exam
                      </p>
                      <p className="text-[10px] text-text-slate font-medium">Remote Cloud Sandbox</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 text-xs text-left">
                    <AlertCircle className="w-4.5 h-4.5 text-blue-800 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-extrabold text-navy-950">Active Instructions Advisory</p>
                      <p className="text-[10px] text-text-slate leading-relaxed">
                        Please keep your hardware diagnostics completed before the test day. System login gate opens 30 minutes before your slot. Late arrivals will not be granted access to the cloud environment.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 9: EXAM READINESS CHECKLIST */}
              <div className="bg-white border border-border-slate rounded-3xl p-6 md:p-8 space-y-6 premium-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-outfit font-black text-md text-navy-950 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-800" />
                      Exam Readiness Checklist
                    </h3>
                    <p className="text-[10px] font-semibold text-text-slate">Ensure hardware and ID verifications are completed beforehand.</p>
                  </div>

                  <button
                    disabled={diagnosticsRunning}
                    onClick={runSystemDiagnostics}
                    className={`h-9 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                      diagnosticsRunning 
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-white border-border-slate text-navy-950 hover:bg-slate-50'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-text-slate ${diagnosticsRunning ? 'animate-spin' : ''}`} />
                    {diagnosticsRunning ? 'Running Tests...' : 'Run System Diagnostics'}
                  </button>
                </div>

                {diagnosticsRunning && (
                  <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-navy-950">
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <Activity className="w-3.5 h-3.5 text-blue-800 animate-spin" />
                        {diagnosticStep === 1 && 'Probing camera driver layers...'}
                        {diagnosticStep === 2 && 'Calibrating audio latency thresholds...'}
                        {diagnosticStep === 3 && 'Pinging Rathinam AWS master gateway...'}
                        {diagnosticStep === 4 && 'Securing browser window lock hooks...'}
                      </span>
                      <span>{diagnosticStep * 25}% Complete</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-800 rounded-full transition-all duration-300"
                        style={{ width: `${diagnosticStep * 25}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border-slate rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${readiness.webcam === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <Camera className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Webcam Availability</p>
                        <p className="text-[9px] font-medium text-text-slate">Visual feed testing</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${readiness.webcam === 'Passed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {readiness.webcam === 'Passed' ? 'Passed' : 'Pending'}
                    </span>
                  </div>

                  <div className="p-4 border border-border-slate rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${readiness.microphone === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <Mic className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Microphone Input</p>
                        <p className="text-[9px] font-medium text-text-slate">Decibel validation</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${readiness.microphone === 'Passed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {readiness.microphone === 'Passed' ? 'Passed' : 'Pending'}
                    </span>
                  </div>

                  <div className="p-4 border border-border-slate rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${readiness.internet === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <Wifi className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Internet Bandwidth</p>
                        <p className="text-[9px] font-medium text-text-slate">Ping and Upload speed</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${readiness.internet === 'Passed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {readiness.internet === 'Passed' ? 'Passed' : 'Pending'}
                    </span>
                  </div>

                  <div className="p-4 border border-border-slate rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Laptop className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Browser Compatibility</p>
                        <p className="text-[9px] font-medium text-text-slate">Cookie & API lock checks</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border bg-emerald-50 text-emerald-600 border-emerald-200">
                      Passed
                    </span>
                  </div>

                  <div className="p-4 border border-border-slate rounded-2xl flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${readiness.photoId === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <UserCheck className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">Photo ID Verification</p>
                        <p className="text-[9px] font-medium text-text-slate">
                          {readiness.photoId === 'Passed' 
                            ? 'Your registration passport photo is uploaded and ready.' 
                            : 'Requires application submission.'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${readiness.photoId === 'Passed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {readiness.photoId === 'Passed' ? 'Passed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 11: BOOKING HISTORY */}
              <div className="bg-white border border-border-slate rounded-3xl p-6 md:p-8 space-y-6 premium-shadow">
                <h3 className="font-outfit font-black text-md text-navy-950 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-800" />
                  Booking Audit History
                </h3>

                {bookedSlot?.bookingHistory && bookedSlot.bookingHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-text-slate border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-text-slate">
                          <th className="py-3 px-2">Ref ID</th>
                          <th className="py-3 px-2">Exam Date</th>
                          <th className="py-3 px-2">Session Timeslot</th>
                          <th className="py-3 px-2">Change Date</th>
                          <th className="py-3 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {bookedSlot.bookingHistory.map((history, hIdx) => (
                          <tr key={hIdx} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-2 font-mono font-bold text-navy-950">{history.bookingId}</td>
                            <td className="py-3.5 px-2 font-semibold text-navy-950">
                              {examDates.find(d => d.id === history.date)?.date || history.date}
                            </td>
                            <td className="py-3.5 px-2 text-text-slate">{history.time}</td>
                            <td className="py-3.5 px-2 text-text-slate">{history.bookingDate}</td>
                            <td className="py-3.5 px-2">
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                                Superceded
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50/20 font-bold text-blue-900">
                          <td className="py-3.5 px-2 font-mono text-blue-950">{bookedSlot.bookingId}</td>
                          <td className="py-3.5 px-2">
                            {examDates.find(d => d.id === bookedSlot.date)?.date || bookedSlot.date}
                          </td>
                          <td className="py-3.5 px-2">{bookedSlot.time}</td>
                          <td className="py-3.5 px-2">Active</td>
                          <td className="py-3.5 px-2">
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-center text-xs text-text-slate">
                    This reservation has not been rescheduled. No audit history matches this active candidate reference.
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: EXAMINATION INFORMATION */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              
              <div className="bg-white border border-border-slate rounded-3xl p-6 space-y-6 premium-shadow">
                <h3 className="font-outfit font-black text-md text-navy-950 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Examination Details
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Exam Name</span>
                    <p className="text-navy-950 font-extrabold mt-0.5 leading-snug">Research & PhD Entrance Test (RPET 2026)</p>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Testing Mode</span>
                    <p className="text-navy-950 font-extrabold mt-0.5">Online Proctored Examination</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Duration</span>
                      <p className="text-navy-950 font-extrabold mt-0.5">120 Minutes</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Max Questions</span>
                      <p className="text-navy-950 font-extrabold mt-0.5">100 MCQs</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Total Marks</span>
                      <p className="text-navy-950 font-extrabold mt-0.5">100 Marks</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Syllabus Grid</span>
                      <p className="text-navy-950 font-extrabold mt-0.5">MCQ Standard</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Exam Window</span>
                    <p className="text-navy-950 font-extrabold mt-0.5">15 Aug 2026 – 20 Aug 2026</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex gap-3 text-xs">
                <HelpCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-navy-950">Need Assistance?</p>
                  <p className="text-[10px] text-text-slate leading-relaxed">
                    Experiencing server connectivity drops or device validation crashes? Connect instantly with our proctor syndicate wing at <span className="font-bold text-navy-950">testing@rathinam.in</span>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : null
      )}

      {/* If Candidate's Application is pending verification */}
      {!isEligible && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-border-slate rounded-3xl p-8 md:p-12 text-center space-y-5 premium-shadow flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-outfit font-black text-xl text-navy-950">Slot Reservation Locked</h3>
                <p className="text-xs font-semibold text-text-slate leading-relaxed">
                  Your academic registration profile documents are currently queued under administrative audit. Once our admissions board verifies your research proposal and transcripts, this terminal will automatically unlock.
                </p>
              </div>
              
              <div className="text-[11px] font-extrabold text-text-slate bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 inline-flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Current Application Status: <span className="text-navy-950 font-black tracking-wide">{activeUser.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="opacity-45 pointer-events-none relative bg-white border border-border-slate rounded-3xl p-6 md:p-8 space-y-6">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10 rounded-3xl" />
              
              <h3 className="font-outfit font-black text-md text-navy-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-800" />
                Select Examination Date (Sample Preview Only)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {examDates.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 border border-slate-100 rounded-xl">
                    <span className="text-[9px] text-text-slate uppercase tracking-wider block font-bold">{item.day}</span>
                    <span className="font-outfit font-bold text-sm text-navy-950">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-border-slate rounded-3xl p-6 space-y-6 premium-shadow">
              <h3 className="font-outfit font-black text-md text-navy-950 pb-4 border-b border-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Examination Details
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Exam Name</span>
                  <p className="text-navy-950 font-extrabold mt-0.5">Research & PhD Entrance Test (RPET 2026)</p>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Testing Mode</span>
                  <p className="text-navy-950 font-extrabold mt-0.5">Online Proctored Examination</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Duration</span>
                    <p className="text-navy-950 font-extrabold mt-0.5">120 Minutes</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Questions</span>
                    <p className="text-navy-950 font-extrabold mt-0.5">100 MCQs</p>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-text-slate uppercase tracking-wider block">Exam Window</span>
                  <p className="text-navy-950 font-extrabold mt-0.5">15 Aug 2026 – 20 Aug 2026</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}



      {/* SECTION 6: CONFIRMATION MODAL OVERLAY */}
      <AnimatePresence>
        {confirmationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmationOpen(false)}
              className="absolute inset-0 bg-navy-950/40 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-border-slate p-8 text-center space-y-6 premium-shadow z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto border border-blue-200">
                <Calendar className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-outfit font-black text-xl text-navy-950">Confirm Examination Slot</h3>
                <p className="text-xs font-semibold text-text-slate">
                  Please review your scheduled parameters carefully. Rescheduling slot options are strictly controlled.
                </p>
              </div>

              <div className="p-5 bg-surface-slate rounded-2xl border border-border-slate/60 text-xs font-bold text-left grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-text-slate uppercase tracking-wider font-semibold">Scheduled Date</span>
                  <p className="text-navy-950 font-extrabold text-[13px]">
                    {examDates.find(d => d.id === selectedDate)?.date || selectedDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-text-slate uppercase tracking-wider font-semibold">Allocated Slot</span>
                  <p className="text-navy-950 font-extrabold text-[13px]">{selectedTime}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-text-slate uppercase tracking-wider font-semibold">Exam Mode</span>
                  <p className="text-navy-950 font-extrabold text-[13px]">Online Proctored</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-text-slate uppercase tracking-wider font-semibold">Seat Occupancy</span>
                  <p className="text-navy-950 font-extrabold text-[13px]">Reservation Guaranteed</p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-semibold flex items-center gap-2 text-left border border-amber-200/50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>You can modify your examination slot only once before the booking deadline.</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmationOpen(false)}
                  className="flex-1 py-3 border border-border-slate rounded-xl text-xs font-bold text-navy-950 hover:bg-surface-slate transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3 bg-navy-950 text-white rounded-xl text-xs font-extrabold hover:bg-blue-800 transition-all shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-ticket, .print-ticket * {
            visibility: visible;
          }
          .print-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
