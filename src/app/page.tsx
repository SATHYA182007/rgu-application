'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Users, 
  Building, 
  ArrowRight, 
  Download, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  Lock, 
  FileText,
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { usePortalState } from '../hooks/usePortalState';
import { toast } from 'sonner';

export default function LandingPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsAdmin, candidates, logout } = usePortalState();
  
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'student' | 'admin'>('student');
  
  // Form states
  const [studentEmail, setStudentEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Auto reset any active logins
  useEffect(() => {
    logout();
  }, []);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) {
      toast.error('Please enter your registered email address');
      return;
    }
    
    const success = loginAsStudent(studentEmail);
    if (success) {
      toast.success('Logged in successfully!');
      setLoginModalOpen(false);
      router.push('/dashboard');
    } else {
      toast.error('No applicant record found with this email. Try "aarav.sharma@gmail.com" to test.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      toast.error('Please enter the administrative access key');
      return;
    }
    
    const success = loginAsAdmin(adminPassword);
    if (success) {
      toast.success('Administrator terminal accessed!');
      setLoginModalOpen(false);
      router.push('/admin');
    } else {
      toast.error('Invalid administrative security key. Try "admin123".');
    }
  };

  const handleQuickLogin = (email: string) => {
    setStudentEmail(email);
    const success = loginAsStudent(email);
    if (success) {
      toast.success(`Success! Exploring as ${email.split('@')[0]}`);
      setLoginModalOpen(false);
      router.push('/dashboard');
    }
  };

  const handleDownloadBrochure = () => {
    toast.success('RPET 2026 Academic Brochure downloaded successfully!', {
      description: 'The PDF has been generated and saved to your device.',
    });
  };

  // Mock FAQs
  const faqs = [
    {
      q: "What is the minimum eligibility criteria for PhD Admission at RGU?",
      a: "Candidates must possess a Master's degree or a professional degree declared equivalent to the Master’s degree by the corresponding qualifying body, with at least 55% marks in aggregate or its equivalent grade 'B' in the UGC 7-point scale."
    },
    {
      q: "Is there any exemption from the written test?",
      a: "Yes, candidates who have cleared UGC-NET (including JRF), UGC-CSIR NET (including JRF), SLET, GATE, teacher fellowship holders or who have passed M.Phil. programme are exempted from the RPET 2026 written examination. However, they must apply through the portal and appear for the personal interview."
    },
    {
      q: "What is the structure of the RPET 2026 Entrance Examination?",
      a: "The exam consists of two parts: Part A (Research Methodology & General Aptitude - 50%) and Part B (Subject-specific core paper - 50%). The total exam duration is 120 minutes with multiple choice questions and no negative marking."
    },
    {
      q: "Can I edit my application after final submission?",
      a: "No, once you click 'Submit' and your Application ID is generated, the details are locked for administrative verification. However, you can edit your profile information prior to the verification approval."
    },
    {
      q: "How does the slot booking work?",
      a: "Upon successful document verification, candidates are notified to select their preferred date and examination timing slot via the student dashboard. Slots are allocated on a first-come, first-served basis."
    }
  ];

  const researchDomains = [
    {
      title: 'Artificial Intelligence',
      icon: <Sparkles className="w-8 h-8 text-gold-500" />,
      desc: 'Advancing frontier architectures in deep learning, neural systems, and NLP applications.',
      areas: ['Deep Learning', 'Computer Vision', 'Generative Architectures', 'Edge AI'],
      scholars: '45+ Scholars',
      faculty: 12
    },
    {
      title: 'Data Science',
      icon: <Layers className="w-8 h-8 text-gold-500" />,
      desc: 'Synthesizing multi-modal analytics, big data structures, and mathematical modeling systems.',
      areas: ['Federated Datasets', 'Graph Neural Networks', 'Predictive Analysis'],
      scholars: '32+ Scholars',
      faculty: 8
    },
    {
      title: 'Computer Science',
      icon: <BookOpen className="w-8 h-8 text-gold-500" />,
      desc: 'Developing decentralized networks, advanced cryptography, and high-performance computing.',
      areas: ['Distributed Ledgers', 'Cloud Orchestrations', 'Cybersecurity Protocols'],
      scholars: '80+ Scholars',
      faculty: 18
    },
    {
      title: 'Engineering',
      icon: <Building className="w-8 h-8 text-gold-500" />,
      desc: 'Leading sustainable hardware frameworks, automation robotics, and VLSI circuit layouts.',
      areas: ['VLSI Designs', 'Robotics Systems', 'Internet of Things (IoT)'],
      scholars: '65+ Scholars',
      faculty: 14
    },
    {
      title: 'Commerce & Mgmt',
      icon: <Award className="w-8 h-8 text-gold-500" />,
      desc: 'Re-evaluating financial ecosystems, GST frameworks, and sustainable resource strategies.',
      areas: ['FinTech in Development', 'Behavioral Economics', 'Supply Chain Tech'],
      scholars: '50+ Scholars',
      faculty: 10
    },
    {
      title: 'Biotechnology',
      icon: <GraduationCap className="w-8 h-8 text-gold-500" />,
      desc: 'Innovating genetic modification therapies, environmental biomes, and clinical drugs.',
      areas: ['CRISPR Engineering', 'Pathogen Controls', 'Molecular Diagnostics'],
      scholars: '28+ Scholars',
      faculty: 6
    }
  ];

  return (
    <div className="min-h-screen bg-bg-slate text-text-navy relative overflow-hidden">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-800/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 premium-glass border-b border-border-slate/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/rgu-img.png" alt="RGU Logo" width={240} height={96} quality={100} className="object-contain h-12 w-auto" />
            <div className="h-6 w-[1px] bg-border-slate/80 mx-2" />
            <span className="font-outfit font-semibold text-xs tracking-wider bg-surface-slate text-blue-800 px-3 py-1.5 rounded-full border border-border-slate">
              RPET 2026
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-text-slate">
            <a href="#about" className="hover:text-navy-950 transition-colors">About RGU</a>
            <a href="#domains" className="hover:text-navy-950 transition-colors">Research Domains</a>
            <a href="#timeline" className="hover:text-navy-950 transition-colors">Admission Steps</a>
            <a href="#dates" className="hover:text-navy-950 transition-colors">Important Dates</a>
            <a href="#faq" className="hover:text-navy-950 transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-border-slate text-[14px] font-bold text-navy-950 hover:bg-surface-slate transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/register')}
              className="px-5 py-2.5 rounded-xl bg-navy-950 text-[14px] font-bold text-white hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 text-gold-500 text-xs font-bold rounded-full border border-gold-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Doctoral Admission Open | Academic Session 2026-27
            </div>
            
            <h1 className="text-4xl md:text-6xl font-outfit font-extrabold tracking-tight text-navy-950 leading-[1.1]">
              Research & PhD <br />
              <span className="gradient-text-navy-blue">Entrance Test (RPET) 2026</span>
            </h1>
            
            <p className="text-lg text-text-slate font-medium max-w-2xl leading-relaxed">
              Begin your research journey at Rathinam Global University. Apply for admission into prestigious doctoral and research programmes through our comprehensive, merit-driven admission gateway.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => router.push('/register')}
                className="px-8 py-4 rounded-xl bg-navy-950 text-[15px] font-extrabold text-white hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDownloadBrochure}
                className="px-8 py-4 rounded-xl border-2 border-navy-950 text-[15px] font-extrabold text-navy-950 hover:bg-surface-slate transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border-slate/60">
              <div>
                <p className="text-3xl font-outfit font-extrabold text-navy-950">20+</p>
                <p className="text-xs font-semibold text-text-slate uppercase tracking-wider mt-1">Research Centres</p>
              </div>
              <div>
                <p className="text-3xl font-outfit font-extrabold text-navy-950">120+</p>
                <p className="text-xs font-semibold text-text-slate uppercase tracking-wider mt-1">Research Guides</p>
              </div>
              <div>
                <p className="text-3xl font-outfit font-extrabold text-navy-950">500+</p>
                <p className="text-xs font-semibold text-text-slate uppercase tracking-wider mt-1">Research Scholars</p>
              </div>
              <div>
                <p className="text-3xl font-outfit font-extrabold text-navy-950">A++</p>
                <p className="text-xs font-semibold text-text-slate uppercase tracking-wider mt-1">NAAC Accredited</p>
              </div>
            </div>
          </div>

          {/* Right Floating Elements Design */}
          <div className="md:col-span-5 relative flex justify-center items-center">
            <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-border-slate/80 flex items-center justify-center relative bg-white/50 backdrop-blur-3xl shadow-sm">
              <div className="w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full border border-dashed border-border-slate flex items-center justify-center" />
              
              {/* Inner Circle Logo container */}
              <div className="absolute">
                <Image src="/rgu-img.png" alt="RGU Logo" width={180} height={180} quality={100} className="object-contain drop-shadow-xl" />
              </div>

              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-2 left-2 premium-card premium-shadow flex items-center gap-3 py-3.5 px-4 bg-white"
              >
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-950 leading-none">Top 50 NIRF</p>
                  <p className="text-[10px] text-text-slate font-medium mt-1">National Ranking</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 right-2 premium-card premium-shadow flex items-center gap-3 py-3.5 px-4 bg-white"
              >
                <div className="w-9 h-9 rounded-lg bg-success-green/10 flex items-center justify-center text-success-green">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-950 leading-none">Verified Scholars</p>
                  <p className="text-[10px] text-text-slate font-medium mt-1">International Journals</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute right-[-10px] top-[20%] premium-card premium-shadow flex items-center gap-2.5 py-2 px-3 bg-white"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-success-green animate-ping" />
                <span className="text-[11px] font-bold text-navy-950">1,200+ Citations</span>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT RATHINAM GLOBAL UNIVERSITY */}
      <section id="about" className="py-20 border-t border-border-slate bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gold-500 uppercase">About Rathinam</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-extrabold text-navy-950">
              Shaping the Future of Scholarly Research
            </h3>
            <p className="text-text-slate font-medium text-[15px] leading-relaxed">
              Rathinam Global University is a pioneer in multidisciplinary research, offering a dynamic environment that nurtures high-impact scholarship, fosters global industry integration, and achieves academic excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="premium-card bg-bg-slate/50 border border-border-slate hover:border-navy-950/20 transition-all p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-navy-950 font-outfit">Research Excellence</h4>
              <p className="text-[14px] text-text-slate leading-relaxed">
                RGU scholars benefit from dedicated research grants, state-of-the-art laboratory ecosystems, publication mentorship programs, and strong international institutional collaborations.
              </p>
            </div>

            <div className="premium-card bg-bg-slate/50 border border-border-slate hover:border-navy-950/20 transition-all p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-navy-950 font-outfit">Academic Mentorship</h4>
              <p className="text-[14px] text-text-slate leading-relaxed">
                Over 120 recognized research supervisors with extensive experience in leading patents, writing indexed research papers (Scopus/Web of Science), and organizing international conferences.
              </p>
            </div>

            <div className="premium-card bg-bg-slate/50 border border-border-slate hover:border-navy-950/20 transition-all p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center text-white">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-navy-950 font-outfit">Institutional Rankings</h4>
              <p className="text-[14px] text-text-slate leading-relaxed">
                Accredited with an A++ grade by NAAC and classified in the top tiers nationally for technology transfer, start-up incubations, and societal research frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH DOMAINS */}
      <section id="domains" className="py-20 bg-bg-slate">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gold-500 uppercase">Research Domains</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-extrabold text-navy-950">
              Explore Our Vibrant Research Fields
            </h3>
            <p className="text-text-slate font-medium text-[15px] leading-relaxed">
              We offer advanced doctoral research avenues in a range of emerging scientific, technological, commercial, and agricultural disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {researchDomains.map((domain, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -6 }}
                className="premium-card premium-shadow bg-white border border-border-slate relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-surface-slate w-fit rounded-xl border border-border-slate/60">
                    {domain.icon}
                  </div>
                  <h4 className="text-xl font-bold font-outfit text-navy-950 group-hover:text-blue-800 transition-colors">
                    {domain.title}
                  </h4>
                  <p className="text-text-slate text-[13.5px] leading-relaxed">
                    {domain.desc}
                  </p>
                  
                  <div className="pt-2">
                    <p className="text-[12px] font-bold text-navy-950 uppercase tracking-wide mb-2">Key Research Focus:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.areas.map((area, idx) => (
                        <span key={idx} className="text-[11px] font-semibold bg-bg-slate text-text-slate border border-border-slate px-2 py-1 rounded-md">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-slate/60">
                  <span className="text-[12px] font-bold text-text-slate">{domain.scholars}</span>
                  <button 
                    onClick={() => router.push('/register')}
                    className="text-[12px] font-bold text-navy-950 hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Apply Domain
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSION PROCESS */}
      <section id="timeline" className="py-20 border-t border-border-slate bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gold-500 uppercase">Admission Roadmap</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-extrabold text-navy-950">
              Interactive Admission Pathway
            </h3>
            <p className="text-text-slate font-medium text-[15px] leading-relaxed">
              Our doctoral selection methodology is transparent, structured, and completely streamlined online.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="absolute top-[28px] left-[50px] right-[50px] h-[2px] bg-border-slate hidden md:block z-0" />
            
            {[
              { s: '01', title: 'Registration', desc: 'Create account and supply your active verification emails.' },
              { s: '02', title: 'Submit Form', desc: 'Input academic achievements and upload draft research topics.' },
              { s: '03', title: 'Document Review', desc: 'Academic panel evaluates transcripts and proposals.' },
              { s: '04', title: 'Slot Selection', desc: 'Secure your preferred online entrance exam timeslot.' },
              { s: '05', title: 'Mock Test', desc: 'Acclimatize with a realistic full exam simulator.' },
              { s: '06', title: 'Entrance Exam', desc: 'Appear for the centralized online portal examination.' },
              { s: '07', title: 'Doctoral Panel', desc: 'Present research vision in front of RGU academic leads.' },
              { s: '08', title: 'Confirmation', desc: 'Complete validation and unlock guide allocations.' }
            ].map((step, i) => (
              <div key={i} className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-navy-950 text-white font-outfit font-black text-xl flex items-center justify-center shadow-md border-4 border-white">
                  {step.s}
                </div>
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-navy-950 text-[16px]">{step.title}</h4>
                  <p className="text-[13px] text-text-slate leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPORTANT DATES */}
      <section id="dates" className="py-20 bg-bg-slate border-t border-border-slate">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gold-500 uppercase">Critical Dates</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-extrabold text-navy-950">
              RPET 2026 Examination Calendar
            </h3>
            <p className="text-text-slate font-medium text-[15px] leading-relaxed">
              Ensure to log your submissions prior to closing deadlines. No extensions will be authorized.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { d: 'May 01, 2026', label: 'Online Application Portal Opens', status: 'Active', desc: 'Portal open for forms and drafts' },
              { d: 'July 15, 2026', label: 'Applications Close', status: 'Upcoming', desc: 'Final time to submit fee logs' },
              { d: 'July 25, 2026', label: 'Interactive Slot Bookings Start', status: 'Upcoming', desc: 'Select testing times' },
              { d: 'August 01, 2026', label: 'Official Mock Testing Opens', status: 'Upcoming', desc: 'Simulate with portal questions' },
              { d: 'August 15, 2026', label: 'Central RPET Entrance Exam', status: 'Upcoming', desc: 'National online examination' },
              { d: 'August 22, 2026', label: 'Entrance Results Publication', status: 'Upcoming', desc: 'Marks card downloads' },
              { d: 'Sept 01-05, 2026', label: 'Doctoral Personal Interviews', status: 'Upcoming', desc: 'Presentation & document lock' },
              { d: 'Sept 15, 2026', label: 'Academic Session Commencement', status: 'Upcoming', desc: 'Coursework registration' }
            ].map((date, idx) => (
              <div key={idx} className="premium-card bg-white border border-border-slate hover:border-blue-800/30 transition-all flex flex-col justify-between min-h-[160px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-gold-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {date.d}
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${date.status === 'Active' ? 'bg-success-green/10 text-success-green border border-success-green/20' : 'bg-surface-slate text-text-slate border border-border-slate'}`}>
                      {date.status}
                    </span>
                  </div>
                  <h4 className="font-outfit font-bold text-navy-950 text-[14px] pt-1">
                    {date.label}
                  </h4>
                </div>
                <p className="text-[11.5px] text-text-slate mt-2">{date.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white border-t border-border-slate">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gold-500 uppercase">Common Queries</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-extrabold text-navy-950">
              Frequently Asked Questions
            </h3>
            <p className="text-text-slate font-medium text-[15px] max-w-2xl mx-auto">
              Identify instant answers regarding the admission process, slot allocations, and diagnostic simulations.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border-slate rounded-2xl overflow-hidden bg-bg-slate/30">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-outfit font-bold text-navy-950 hover:bg-bg-slate/50 transition-colors"
                >
                  <span className="text-[15px]">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-text-slate transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-[14px] text-text-slate leading-relaxed border-t border-border-slate/60 pt-4 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-950 text-white border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-800/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/rgu-img.png" alt="RGU Logo" width={240} height={96} quality={100} className="object-contain h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-white/60 text-[12.5px] leading-relaxed pt-2">
              Empowering innovators, academic scholars, and doctoral guides to synthesize high-impact societal discoveries.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-outfit font-bold text-[14px] tracking-widest text-gold-500 uppercase">Admission Avenues</h5>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              <li><a href="/register" className="hover:text-white transition-colors">Apply PhD Program</a></li>
              <li><a href="#dates" className="hover:text-white transition-colors">Admission Calendar</a></li>
              <li><a href="#domains" className="hover:text-white transition-colors">Research Domains</a></li>
              <li><button onClick={handleDownloadBrochure} className="hover:text-white transition-colors text-left">Academic Brochure</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-outfit font-bold text-[14px] tracking-widest text-gold-500 uppercase">University Links</h5>
            <ul className="space-y-2.5 text-[13px] text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Official Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Research Repository</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guides Directory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Global Accreditations</a></li>
            </ul>
          </div>

          <div className="space-y-4 font-medium">
            <h5 className="font-outfit font-bold text-[14px] tracking-widest text-gold-500 uppercase">Contact Information</h5>
            <ul className="space-y-3 text-[13px] text-white/70">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>admissions.rpet@rathinam.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>+91 422 298 4600 / 01</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span>RGU Campus, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu - 641021</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between text-xs text-white/40 font-medium">
          <p>© 2026 Rathinam Global University. All rights reserved. Research Wing Admissions Cell.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button 
              onClick={() => {
                setLoginTab('admin');
                setLoginModalOpen(true);
              }}
              className="hover:text-gold-500 transition-colors flex items-center gap-1 font-bold text-white/60"
            >
              <Lock className="w-3 h-3" />
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {loginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginModalOpen(false)}
              className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[480px] bg-white rounded-3xl premium-shadow overflow-hidden border border-border-slate"
            >
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="font-outfit font-black text-2xl text-navy-950">Access RGU RPET Portal</h3>
                  <p className="text-xs font-semibold text-text-slate">Login to track application statuses, book exam slots, and run mocks.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-surface-slate p-1.5 rounded-2xl border border-border-slate">
                  <button
                    onClick={() => setLoginTab('student')}
                    className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all ${loginTab === 'student' ? 'bg-white text-navy-950 shadow-sm' : 'text-text-slate hover:text-navy-950'}`}
                  >
                    Applicant Login
                  </button>
                  <button
                    onClick={() => setLoginTab('admin')}
                    className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all ${loginTab === 'admin' ? 'bg-white text-navy-950 shadow-sm' : 'text-text-slate hover:text-navy-950'}`}
                  >
                    University Admin
                  </button>
                </div>

                {/* Tab Student form */}
                {loginTab === 'student' ? (
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div className="floating-label-group">
                      <input
                        type="email"
                        placeholder=" "
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full premium-input font-medium"
                      />
                      <label>Registered Email Address</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-navy-950 text-white font-extrabold text-[14px] hover:bg-blue-800 transition-colors shadow-md"
                    >
                      Verify & Log In
                    </button>

                    {/* Pre-seeded accounts shortcut for easy evaluation */}
                    <div className="mt-6 pt-6 border-t border-border-slate/60 text-center space-y-3 bg-bg-slate/50 p-4 rounded-2xl">
                      <p className="text-[11px] font-bold text-navy-950 uppercase tracking-wider">Evaluation Fast-Pass Shortcuts</p>
                      <p className="text-[10px] text-text-slate font-medium leading-relaxed">
                        To explore dynamic student pages immediately, click a pre-seeded scholar profile below:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('aarav.sharma@gmail.com')}
                          className="px-3 py-2 text-[11px] font-bold text-blue-800 bg-white border border-border-slate hover:border-blue-800 rounded-xl transition-all text-left truncate flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-success-green" />
                          Aarav (Approved)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('ananya.iyer@yahoo.com')}
                          className="px-3 py-2 text-[11px] font-bold text-blue-800 bg-white border border-border-slate hover:border-blue-800 rounded-xl transition-all text-left truncate flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-warning-amber" />
                          Ananya (Verified)
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="floating-label-group">
                      <input
                        type="password"
                        placeholder=" "
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full premium-input font-medium"
                      />
                      <label>Security Key</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-navy-950 text-white font-extrabold text-[14px] hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Access Administrative Desk
                    </button>

                    <div className="pt-4 border-t border-border-slate/60 text-center bg-bg-slate/50 p-4 rounded-2xl">
                      <p className="text-[10px] text-text-slate leading-relaxed font-semibold">
                        Enter key <span className="font-extrabold text-blue-800 underline">admin123</span> to review the comprehensive university dashboard, verify candidates, and analyze statistics.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
