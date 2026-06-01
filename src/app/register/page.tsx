'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  BookOpen, 
  FileText, 
  Upload, 
  Check, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Info,
  Trash,
  AlertTriangle,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  X,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { usePortalState } from '../../hooks/usePortalState';
import { PersonalInfo, AcademicInfo, IdentityInfo } from '../../types';
import { toast } from 'sonner';

const COUNTRIES_DATA = [
  { 
    code: 'IN', 
    name: 'India', 
    flag: '🇮🇳', 
    idLabel: 'Aadhaar Number', 
    idPlaceholder: 'XXXX XXXX XXXX', 
    doc1Label: 'Aadhaar Card Front', 
    doc2Label: 'Aadhaar Card Back or Category/PAN Card',
    proofs: ['Aadhaar Card', 'PAN Card', 'Voter ID']
  },
  { 
    code: 'FR', 
    name: 'France', 
    flag: '🇫🇷', 
    idLabel: "Carte Nationale d'Identité No.", 
    idPlaceholder: 'e.g. 123456789012', 
    doc1Label: 'CNI Front Copy', 
    doc2Label: 'CNI Back Copy',
    proofs: ["Carte Nationale d'Identité"]
  },
  { 
    code: 'DE', 
    name: 'Germany', 
    flag: '🇩🇪', 
    idLabel: 'Personalausweis No.', 
    idPlaceholder: 'e.g. L01X00T471', 
    doc1Label: 'Personalausweis Front Copy', 
    doc2Label: 'Personalausweis Back Copy',
    proofs: ['Personalausweis']
  },
  { 
    code: 'GB', 
    name: 'United Kingdom', 
    flag: '🇬🇧', 
    idLabel: 'Passport / BRP No.', 
    idPlaceholder: 'e.g. 012345678', 
    doc1Label: 'Passport Bio Page Copy', 
    doc2Label: 'Biometric Residence Permit (BRP) Copy',
    proofs: ['Passport', 'BRP']
  },
  { 
    code: 'NL', 
    name: 'Netherlands', 
    flag: '🇳🇱', 
    idLabel: 'BSN (Burgerservicenummer)', 
    idPlaceholder: 'e.g. 123456789', 
    doc1Label: 'BSN Proof Document', 
    doc2Label: 'Dutch Residence Card Copy',
    proofs: ['BSN Document']
  },
  { 
    code: 'ES', 
    name: 'Spain', 
    flag: '🇪🇸', 
    idLabel: 'DNI / NIE No.', 
    idPlaceholder: 'e.g. 12345678A', 
    doc1Label: 'DNI / NIE Card Front Copy', 
    doc2Label: 'DNI / NIE Card Back Copy',
    proofs: ['DNI NIE Card']
  },
  { 
    code: 'IT', 
    name: 'Italy', 
    flag: '🇮🇹', 
    idLabel: "Carta d'Identità No.", 
    idPlaceholder: 'e.g. CA00000AA', 
    doc1Label: "Carta d'Identità Front Copy", 
    doc2Label: "Carta d'Identità Back Copy",
    proofs: ["Carta d'Identità"]
  },
  { 
    code: 'SE', 
    name: 'Sweden', 
    flag: '🇸🇪', 
    idLabel: 'Personnummer', 
    idPlaceholder: 'e.g. YYYYMMDD-XXXX', 
    doc1Label: 'Personnummer Certificate Copy', 
    doc2Label: 'Swedish ID Card Copy',
    proofs: ['Personnummer Document']
  },
  { 
    code: 'CH', 
    name: 'Switzerland', 
    flag: '🇨🇭', 
    idLabel: 'Swiss Identity Card No.', 
    idPlaceholder: 'e.g. S1234567', 
    doc1Label: 'Swiss ID Card Front Copy', 
    doc2Label: 'Swiss ID Card Back Copy',
    proofs: ['Swiss Identity Card']
  },
  { 
    code: 'JP', 
    name: 'Japan', 
    flag: '🇯🇵', 
    idLabel: 'My Number / Residence Card No.', 
    idPlaceholder: 'e.g. 1234-5678-9012', 
    doc1Label: 'My Number Card Front Copy', 
    doc2Label: 'Residence Card Front/Back Copy',
    proofs: ['My Number / Residence Card']
  },
  { 
    code: 'KR', 
    name: 'South Korea', 
    flag: '🇰🇷', 
    idLabel: 'Alien Registration Card No.', 
    idPlaceholder: 'e.g. 123456-1234567', 
    doc1Label: 'Alien Registration Card Front Copy', 
    doc2Label: 'Alien Registration Card Back Copy',
    proofs: ['Alien Registration Card']
  },
  { 
    code: 'SG', 
    name: 'Singapore', 
    flag: '🇸🇬', 
    idLabel: 'FIN / Pass No.', 
    idPlaceholder: 'e.g. G1234567X', 
    doc1Label: 'FIN / Pass Card Front Copy', 
    doc2Label: 'FIN / Pass Card Back Copy',
    proofs: ['FIN / Pass Card']
  },
  { 
    code: 'AE', 
    name: 'UAE', 
    flag: '🇦🇪', 
    idLabel: 'Emirates ID No.', 
    idPlaceholder: 'e.g. 784-XXXX-XXXXXXX-X', 
    doc1Label: 'Emirates ID Front Copy', 
    doc2Label: 'Emirates ID Back Copy',
    proofs: ['Emirates ID']
  },
  { 
    code: 'MY', 
    name: 'Malaysia', 
    flag: '🇲🇾', 
    idLabel: 'MyKad / Passport No.', 
    idPlaceholder: 'e.g. 123456-07-1234', 
    doc1Label: 'MyKad Front Copy', 
    doc2Label: 'MyKad Back Copy',
    proofs: ['MyKad / Passport']
  },
  { 
    code: 'TH', 
    name: 'Thailand', 
    flag: '🇹🇭', 
    idLabel: 'National ID / Passport No.', 
    idPlaceholder: 'e.g. 1 2345 67890 12 3', 
    doc1Label: 'Thai ID Card Front Copy', 
    doc2Label: 'Thai ID Card Back Copy',
    proofs: ['National ID / Passport']
  },
  { 
    code: 'LK', 
    name: 'Sri Lanka', 
    flag: '🇱🇰', 
    idLabel: 'NIC No.', 
    idPlaceholder: 'e.g. 199012345678', 
    doc1Label: 'NIC Card Front Copy', 
    doc2Label: 'NIC Card Back Copy',
    proofs: ['NIC Card']
  },
  { 
    code: 'NP', 
    name: 'Nepal', 
    flag: '🇳🇵', 
    idLabel: 'Citizenship Certificate No.', 
    idPlaceholder: 'e.g. 12-34-56-78901', 
    doc1Label: 'Citizenship Certificate Front Copy', 
    doc2Label: 'Citizenship Certificate Back Copy',
    proofs: ['Citizenship Certificate']
  }
];

const SCHOOLS_WITH_DEPTS: Record<string, string[]> = {
  "School of Engineering & Technology": [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical & Electronics Engineering",
    "Electronics & Communication Engineering",
    "Chemical Engineering",
    "Aerospace Engineering"
  ],
  "School of Computer Sciences": [
    "Computer Science & Engineering",
    "Information Technology",
    "Software Engineering",
    "Artificial Intelligence & Machine Learning",
    "Cyber Security",
    "Data Science"
  ],
  "School of Life Sciences": [
    "Biotechnology",
    "Microbiology",
    "Biochemistry",
    "Bioinformatics",
    "Botany",
    "Zoology"
  ],
  "School of Commerce & Management": [
    "Business Administration",
    "Finance & Accounts",
    "Human Resource Management",
    "Marketing Management",
    "International Business",
    "Commerce"
  ],
  "School of Agricultural Sciences": [
    "Agronomy",
    "Horticulture",
    "Soil Science",
    "Plant Pathology",
    "Agricultural Economics",
    "Entomology"
  ],
  "School of Social Sciences": [
    "Psychology",
    "Sociology",
    "Political Science",
    "Economics",
    "History"
  ],
  "School of Science & Humanities": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "English Literature",
    "Modern Languages"
  ]
};

export default function RegistrationWizard() {
  const router = useRouter();
  const { saveDraftApplication, submitApplication, activeUser, candidates } = usePortalState();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [agreedDeclaration, setAgreedDeclaration] = useState<boolean>(false);

  // Payment Gateway local states
  const [showPaymentGateway, setShowPaymentGateway] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [processingMessage, setProcessingMessage] = useState<string>('Initiating secure payment gateway connection...');
  const [simulateSuccess, setSimulateSuccess] = useState<boolean>(true);
  
  const [cardNo, setCardNo] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [upiVal, setUpiVal] = useState<string>('');
  const [netbankSelected, setNetbankSelected] = useState<string>('');

  // Step 1: Personal Fields
  const [personal, setPersonal] = useState<Partial<PersonalInfo>>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    mobile: '',
    email: ''
  });

  // Step 2: Academic Fields
  const [academic, setAcademic] = useState<Partial<AcademicInfo>>({
    highestQualification: '',
    percentageCgpa: '',
    schoolFaculty: '',
    researchDepartment: '',
    proposedResearchArea: ''
  });

  // Step 3: Identity Fields
  const [identity, setIdentity] = useState<Partial<IdentityInfo>>({
    nationality: 'India',
    category: '',
    aadhaarId: '',
    proofType: 'Aadhaar Card',
    proofNumber: '',
    proofDocumentName: '',
    proofDocumentUrl: '',
    verificationStatus: 'Pending',
    issueCountry: 'India',
    uploadedAt: ''
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState<boolean>(false);
  const [identityUploadProgress, setIdentityUploadProgress] = useState<Record<string, number>>({ doc1: 0, doc2: 0 });

  // Sync draft if activeUser exists
  useEffect(() => {
    if (activeUser) {
      if (activeUser.personalInfo) setPersonal(activeUser.personalInfo);
      if (activeUser.academicInfo) setAcademic(activeUser.academicInfo);
      if (activeUser.identityInfo) setIdentity(activeUser.identityInfo);
    }
  }, [activeUser]);

  // Auto-Save Trigger
  const triggerAutoSave = () => {
    saveDraftApplication(personal, academic, identity, {}, Math.round(((currentStep - 1) / 4) * 100));
  };

  // Input Change Handlers
  const handlePersonalChange = (field: keyof PersonalInfo, val: string) => {
    setPersonal(prev => ({ ...prev, [field]: val }));
  };

  const handleAcademicChange = (field: keyof AcademicInfo, val: string) => {
    setAcademic(prev => ({ ...prev, [field]: val }));
  };

  const handleIdentityChange = (field: keyof IdentityInfo, val: string) => {
    setIdentity(prev => ({ ...prev, [field]: val }));
  };

  const handleCountrySelect = (country: typeof COUNTRIES_DATA[0]) => {
    const isIndian = country.name.toLowerCase() === 'india';
    setIdentity(prev => ({
      ...prev,
      nationality: country.name,
      issueCountry: country.name,
      proofType: country.proofs[0],
      proofNumber: '',
      proofDocumentName: '',
      proofDocumentUrl: '',
      category: isIndian ? (prev.category === 'Foreign National' ? '' : prev.category || '') : 'Foreign National',
      doc1Name: '',
      doc1Url: '',
      doc2Name: '',
      doc2Url: '',
      passportNumber: '',
      visaNumber: ''
    }));
    setCountryDropdownOpen(false);
    setSearchQuery('');
    toast.info(`Nationality adjusted to ${country.name}. Category and required ID proofs adjusted dynamically.`);
  };

  const getSelectedCountryProofs = (): string[] => {
    const match = COUNTRIES_DATA.find(c => c.name.toLowerCase() === (identity.nationality || '').toLowerCase());
    return match ? match.proofs : ['Passport', 'National Identity Card'];
  };

  const getIdentityNumberLabel = (): string => {
    const match = COUNTRIES_DATA.find(c => c.name.toLowerCase() === (identity.nationality || '').toLowerCase());
    return match ? match.idLabel : 'National ID Number';
  };

  const getIdentityNumberPlaceholder = (): string => {
    const match = COUNTRIES_DATA.find(c => c.name.toLowerCase() === (identity.nationality || '').toLowerCase());
    return match ? match.idPlaceholder : 'Enter ID number';
  };

  const getSelectedCountry = () => {
    return COUNTRIES_DATA.find(c => c.name.toLowerCase() === (identity.nationality || '').toLowerCase()) || COUNTRIES_DATA[0];
  };

  const getDepartmentsForSelectedSchool = (): string[] => {
    const school = academic.schoolFaculty || '';
    return SCHOOLS_WITH_DEPTS[school] || [];
  };

  const handleIdentityDocUpload = (field: 'doc1' | 'doc2', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB limit.');
      return;
    }

    setIdentityUploadProgress(prev => ({ ...prev, [field]: 10 }));
    let prog = 10;
    const interval = setInterval(() => {
      prog += 30;
      if (prog >= 100) {
        clearInterval(interval);
        setIdentityUploadProgress(prev => ({ ...prev, [field]: 0 }));
        
        const docNameField = field === 'doc1' ? 'doc1Name' : 'doc2Name';
        const docUrlField = field === 'doc1' ? 'doc1Url' : 'doc2Url';
        
        setIdentity(prev => {
          const updated = {
            ...prev,
            [docNameField]: file.name,
            [docUrlField]: URL.createObjectURL(file),
            proofDocumentName: field === 'doc1' ? file.name : (prev.proofDocumentName || ''),
            proofDocumentUrl: field === 'doc1' ? URL.createObjectURL(file) : (prev.proofDocumentUrl || ''),
            uploadedAt: new Date().toISOString()
          };
          saveDraftApplication(personal, academic, updated, {}, Math.round(((currentStep - 1) / 4) * 100));
          return updated;
        });
        toast.success(`Uploaded successfully: ${file.name}`);
      } else {
        setIdentityUploadProgress(prev => ({ ...prev, [field]: prog }));
      }
    }, 150);
  };

  const filteredCountries = () => {
    if (!searchQuery) return COUNTRIES_DATA;
    const query = searchQuery.toLowerCase();
    return COUNTRIES_DATA.filter(
      c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
    );
  };



  // Validations per step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!personal.firstName || !personal.lastName || !personal.dob || !personal.gender || !personal.mobile || !personal.email) {
        toast.warning('Please fill in all personal information fields.');
        return false;
      }
      if (!personal.email.includes('@')) {
        toast.warning('Please enter a valid email address.');
        return false;
      }
    } else if (step === 2) {
      if (!academic.highestQualification || !academic.percentageCgpa || !academic.schoolFaculty || !academic.researchDepartment) {
        toast.warning('Please complete all academic fields.');
        return false;
      }
    } else if (step === 3) {
      if (!identity.nationality || !identity.category || !identity.proofNumber) {
        toast.warning('Please complete all identity verification fields.');
        return false;
      }
      
      const isIndian = (identity.nationality || '').toLowerCase() === 'india';
      if (!isIndian && !identity.passportNumber) {
        toast.warning('Please enter your Passport Number.');
        return false;
      }

      if (!identity.doc1Name || !identity.doc2Name) {
        toast.warning('Please upload both required identity verification documents.');
        return false;
      }

      const pNum = (identity.proofNumber || '').trim();
      if (isIndian) {
        // Aadhaar validation by default for Indian National ID number
        if (!/^\d{12}$/.test(pNum)) {
          toast.warning('Aadhaar Card number must be exactly 12 numeric digits (e.g. 123456789012).');
          return false;
        }
      }
    }
    return true;
  };

  // Navigations
  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    
    // Save state draft before moving
    triggerAutoSave();
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraftManual = () => {
    triggerAutoSave();
    toast.success('Application progress saved as draft successfully!', {
      description: 'Your changes have been safely backed up.'
    });
  };

  // Submit flow
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedDeclaration) {
      toast.warning('Please accept the declaration before final submission.');
      return;
    }

    // Reset payment states to clean values
    setPaymentStatus('idle');
    setCardNo('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setUpiVal('');
    setNetbankSelected('');
    
    // Open payment gateway modal
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = () => {
    const candidateId = activeUser?.id || `RPET-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Auto-save the full submitted state first
    saveDraftApplication(personal, academic, identity, {}, 100);
    submitApplication(candidateId);

    toast.success('Payment Received! Application locked successfully.');
    setShowPaymentGateway(false);
    router.push('/verify');
  };

  const handleInitiatePayment = () => {
    // Basic validation depending on the method
    if (paymentMethod === 'card') {
      if (!cardNo || !cardExpiry || !cardCvv || !cardName) {
        toast.error('Please fill in all credit/debit card fields.');
        return;
      }
      const cleanCard = cardNo.replace(/\s/g, '');
      if (cleanCard.length < 16) {
        toast.error('Card Number must be 16 digits.');
        return;
      }
      if (cardExpiry.length < 5) {
        toast.error('Expiry Date must be in MM/YY format.');
        return;
      }
      if (cardCvv.length < 3) {
        toast.error('CVV must be 3 or 4 digits.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiVal || !upiVal.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!netbankSelected) {
        toast.error('Please select a bank to proceed.');
        return;
      }
    }

    setPaymentStatus('processing');
    setProcessingMessage('Initiating secure payment gateway connection...');

    // Simulate multi-stage gateway connection
    setTimeout(() => {
      setProcessingMessage('Verifying payment credentials with gateway...');
    }, 700);

    setTimeout(() => {
      setProcessingMessage('Securing transaction logs with RGU systems...');
    }, 1400);

    setTimeout(() => {
      if (simulateSuccess) {
        setPaymentStatus('success');
        toast.success('Payment authorized successfully!');
        setTimeout(() => {
          handlePaymentSuccess();
        }, 1200);
      } else {
        setPaymentStatus('failed');
        toast.error('Transaction declined by issuing bank.');
      }
    }, 2100);
  };

  const formatCardNo = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleCardNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNo(e.target.value);
    if (formatted.length <= 19) {
      setCardNo(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    if (val.length <= 5) {
      setCardExpiry(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 4) {
      setCardCvv(val);
    }
  };

  const steps = [
    { num: 1, title: 'Personal Details', desc: 'Name, mobile, email', icon: <User className="w-5 h-5" /> },
    { num: 2, title: 'Academic Qualifications', desc: 'Degree details & department', icon: <BookOpen className="w-5 h-5" /> },
    { num: 3, title: 'Identity Verification', desc: 'Nationality & ID documents', icon: <Info className="w-5 h-5" /> },
    { num: 4, title: 'Review & Submit', desc: 'Final declaration logs', icon: <FileText className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-bg-slate flex items-center justify-center py-12 px-4 md:px-8 relative overflow-hidden">
      
      {/* Dynamic Background Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-8 left-8 md:top-10 md:left-10 flex items-center gap-4 z-30">
        <div className="cursor-pointer" onClick={() => router.push('/')}>
          <Image src="/rgu-img.png" alt="RGU Logo" width={240} height={96} quality={100} className="object-contain h-12 w-auto" />
        </div>
      </div>

      {/* Back button — bottom-left corner */}
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 z-30">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-slate bg-white text-navy-950 text-xs font-bold hover:bg-surface-slate hover:border-navy-950/30 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>
      </div>

      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: STICKY PROGRESS SIDEBAR */}
          <aside className="md:col-span-4 md:sticky md:top-24 space-y-6">
            <div className="premium-card bg-white border border-border-slate shadow-sm">
            <h3 className="font-outfit font-extrabold text-lg text-navy-950 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              Progress Wizard
            </h3>
            
            <div className="space-y-6">
              {steps.map((step) => {
                const isActive = step.num === currentStep;
                const isCompleted = step.num < currentStep;
                
                return (
                  <div key={step.num} className="flex gap-4 relative">
                    {step.num !== 5 && (
                      <div className={`absolute left-[17px] top-9 bottom-[-24px] w-[2px] ${isCompleted ? 'bg-navy-950' : 'bg-border-slate'}`} />
                    )}

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 font-bold text-sm transition-all z-10 ${
                      isActive 
                        ? 'bg-navy-950 text-white border-navy-950 shadow-md shadow-navy-950/20' 
                        : isCompleted 
                        ? 'bg-navy-950 text-white border-navy-950' 
                        : 'bg-white text-text-slate border-border-slate'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                    </div>

                    <div className="space-y-1">
                      <p className={`text-[13.5px] font-bold transition-colors ${isActive ? 'text-navy-950' : isCompleted ? 'text-navy-950/70' : 'text-text-slate'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] font-semibold text-text-slate">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border-slate/60 flex items-center justify-between gap-4">
              <div className="text-[11.5px] font-semibold text-text-slate">
                Auto-saving enabled
              </div>
              <button 
                onClick={handleSaveDraftManual}
                className="text-xs font-bold text-blue-800 hover:text-navy-950 flex items-center gap-1 bg-surface-slate border border-border-slate py-2 px-3 rounded-lg"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: DYNAMIC FORM PANELS */}
        <main className="md:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="premium-card bg-white border border-border-slate shadow-sm min-h-[500px] flex flex-col justify-between"
            >
              
              {/* STEP content */}
              <div className="space-y-6">
                
                {/* Header */}
                <div className="border-b border-border-slate/60 pb-5">
                  <span className="text-[11px] font-extrabold uppercase text-gold-500 tracking-wider">Step {currentStep} of 4</span>
                  <h2 className="font-outfit font-black text-2xl text-navy-950 mt-1">
                    {steps[currentStep - 1].title}
                  </h2>
                </div>

                {/* STEP 1: Personal */}
                {currentStep === 1 && (
                  <div className="grid md:grid-cols-2 gap-5 pt-2">
                    <div className="floating-label-group">
                      <input
                        type="text"
                        placeholder=" "
                        value={personal.firstName}
                        onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>First Name</label>
                      <p className="text-[10px] text-text-slate mt-1 pl-1 font-medium">As per Aadhaar / Passport</p>
                    </div>

                    <div className="floating-label-group">
                      <input
                        type="text"
                        placeholder=" "
                        value={personal.lastName}
                        onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>Last Name</label>
                      <p className="text-[10px] text-text-slate mt-1 pl-1 font-medium">Surname</p>
                    </div>

                    <div className="floating-label-group">
                      <input
                        type="date"
                        placeholder=" "
                        value={personal.dob}
                        onChange={(e) => handlePersonalChange('dob', e.target.value)}
                        className="w-full premium-input font-semibold pt-4"
                      />
                      <label>Date of Birth (DD/MM/YYYY)</label>
                    </div>
                    <div className="floating-label-group">
                      <select
                        value={personal.gender}
                        onChange={(e) => handlePersonalChange('gender', e.target.value)}
                        className={`w-full premium-input font-semibold ${personal.gender ? 'has-value' : ''}`}
                      >
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <label>Gender</label>
                    </div>
                    <div className="floating-label-group">
                      <input
                        type="tel"
                        placeholder=" "
                        value={personal.mobile}
                        onChange={(e) => handlePersonalChange('mobile', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>Mobile Number</label>
                      <p className="text-[10px] text-text-slate mt-1 pl-1 font-medium">+91 XXXXX XXXXX</p>
                    </div>

                    <div className="floating-label-group">
                      <input
                        type="email"
                        placeholder=" "
                        value={personal.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>Email Address</label>
                      <p className="text-[10px] text-text-slate mt-1 pl-1 font-medium">official@email.com</p>
                    </div>
                  </div>
                )}

                {/* STEP 2: Academic */}
                {currentStep === 2 && (
                  <div className="grid md:grid-cols-2 gap-5 pt-2">
                    <div className="floating-label-group md:col-span-2">
                      <select
                        value={academic.highestQualification}
                        onChange={(e) => handleAcademicChange('highestQualification', e.target.value)}
                        className={`w-full premium-input font-semibold ${academic.highestQualification ? 'has-value' : ''}`}
                      >
                        <option value=""></option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="M.A.">M.A.</option>
                        <option value="M.Com.">M.Com.</option>
                        <option value="M.B.A.">M.B.A.</option>
                        <option value="M.Tech.">M.Tech.</option>
                        <option value="M.E.">M.E.</option>
                        <option value="M.Phil.">M.Phil.</option>
                        <option value="Other PG">Other PG</option>
                      </select>
                      <label>Highest Qualification</label>
                    </div>

                    <div className="floating-label-group">
                      <input
                        type="text"
                        placeholder=" "
                        value={academic.percentageCgpa}
                        onChange={(e) => handleAcademicChange('percentageCgpa', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>Aggregate Percentage / CGPA Score</label>
                    </div>

                    <div className="floating-label-group">
                      <select
                        value={academic.schoolFaculty}
                        onChange={(e) => {
                          handleAcademicChange('schoolFaculty', e.target.value);
                          handleAcademicChange('researchDepartment', '');
                        }}
                        className={`w-full premium-input font-semibold ${academic.schoolFaculty ? 'has-value' : ''}`}
                      >
                        <option value=""></option>
                        {Object.keys(SCHOOLS_WITH_DEPTS).map((school) => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </select>
                      <label>School / Faculty</label>
                    </div>

                    <div className="floating-label-group">
                      <select
                        value={academic.researchDepartment}
                        onChange={(e) => handleAcademicChange('researchDepartment', e.target.value)}
                        className={`w-full premium-input font-semibold ${academic.researchDepartment ? 'has-value' : ''}`}
                        disabled={!academic.schoolFaculty}
                      >
                        <option value=""></option>
                        {getDepartmentsForSelectedSchool().map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <label>Proposed Research Department</label>
                    </div>

                    <div className="floating-label-group md:col-span-2">
                      <input
                        type="text"
                        placeholder=" "
                        value={academic.proposedResearchArea}
                        onChange={(e) => handleAcademicChange('proposedResearchArea', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>Proposed Specialization / Specific Area of Research</label>
                    </div>
                  </div>
                )}

                {/* STEP 3: Identity */}
                {currentStep === 3 && (
                  <div className="grid md:grid-cols-2 gap-5 pt-2">
                    
                    {/* Searchable Country Selector (Combobox) */}
                    <div className="floating-label-group relative">
                      <input
                        type="text"
                        placeholder=" "
                        value={countryDropdownOpen ? searchQuery : (identity.nationality || '')}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (!countryDropdownOpen) setCountryDropdownOpen(true);
                        }}
                        onFocus={() => {
                          setCountryDropdownOpen(true);
                          setSearchQuery('');
                        }}
                        className={`w-full premium-input font-semibold ${identity.nationality ? 'has-value' : ''}`}
                      />
                      <label>Nationality</label>
                      
                      <AnimatePresence>
                        {countryDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => {
                                setCountryDropdownOpen(false);
                                setSearchQuery('');
                              }}
                            />
                            
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-0 right-0 top-full mt-2 bg-white border border-border-slate rounded-2xl shadow-lg max-h-[220px] overflow-y-auto z-50 p-2 space-y-1"
                            >
                              <div className="p-1.5 text-[9px] font-bold text-text-slate uppercase tracking-wider sticky top-0 bg-white border-b border-slate-50">
                                Search or select country
                              </div>
                              {filteredCountries().length > 0 ? (
                                filteredCountries().map((country) => (
                                  <button
                                    type="button"
                                    key={country.code}
                                    onClick={() => handleCountrySelect(country)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left text-xs font-bold text-navy-950"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-base">{country.flag}</span>
                                      <span>{country.name}</span>
                                    </span>
                                    <span className="text-[10px] text-text-slate font-mono uppercase">{country.code}</span>
                                  </button>
                                ))
                              ) : (
                                <div className="p-4 text-center text-xs text-text-slate">
                                  No matching countries found
                                </div>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Social Category Group */}
                    <div className="floating-label-group">
                      <select
                        value={identity.category}
                        onChange={(e) => handleIdentityChange('category', e.target.value)}
                        className={`w-full premium-input font-semibold ${identity.category ? 'has-value' : ''}`}
                        disabled={(identity.nationality || '').toLowerCase() !== 'india'}
                      >
                        {(identity.nationality || '').toLowerCase() === 'india' ? (
                          <>
                            <option value=""></option>
                            <option value="General">General</option>
                            <option value="OBC-NCL">OBC-NCL</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                            <option value="PwBD">PwBD</option>
                          </>
                        ) : (
                          <option value="Foreign National">Foreign National</option>
                        )}
                      </select>
                      <label>Social Category Group</label>
                    </div>

                    {/* Identity Proof Type */}
                    {((identity.nationality || '').toLowerCase() === 'india') ? (
                      <div className="floating-label-group">
                        <select
                          value={identity.proofType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIdentity(prev => ({
                              ...prev,
                              proofType: val,
                              proofNumber: '',
                              proofDocumentName: '',
                              proofDocumentUrl: ''
                            }));
                          }}
                          className={`w-full premium-input font-semibold ${identity.proofType ? 'has-value' : ''}`}
                        >
                          {getSelectedCountryProofs().map((proof) => (
                            <option key={proof} value={proof}>{proof}</option>
                          ))}
                        </select>
                        <label>Identity Proof Type</label>
                      </div>
                    ) : (
                      <div className="floating-label-group">
                        <input
                          type="text"
                          readOnly
                          value={identity.proofType || 'National Identity ID'}
                          className="w-full premium-input font-semibold bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                        <label>Identity Proof Type</label>
                      </div>
                    )}

                    {/* Auto-filled Issue Country */}
                    <div className="floating-label-group">
                      <input
                        type="text"
                        readOnly
                        value={identity.issueCountry || identity.nationality || ''}
                        className="w-full premium-input font-semibold bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                      <label>Issue Country</label>
                    </div>

                    {/* Dynamic National ID Input */}
                    <div className="floating-label-group md:col-span-2">
                      <input
                        type="text"
                        placeholder=" "
                        value={identity.proofNumber || ''}
                        onChange={(e) => handleIdentityChange('proofNumber', e.target.value)}
                        className="w-full premium-input font-semibold"
                      />
                      <label>{getIdentityNumberLabel()}</label>
                      <p className="text-[10px] text-text-slate mt-1.5 font-medium pl-1">
                        💡 {getIdentityNumberPlaceholder()}
                      </p>
                    </div>

                    {/* Conditional Passport / Visa Row for non-Indians */}
                    {(identity.nationality || '').toLowerCase() !== 'india' && (
                      <>
                        <div className="floating-label-group">
                          <input
                            type="text"
                            placeholder=" "
                            value={identity.passportNumber || ''}
                            onChange={(e) => handleIdentityChange('passportNumber', e.target.value)}
                            className="w-full premium-input font-semibold"
                          />
                          <label>Passport Number</label>
                          <p className="text-[10px] text-text-slate mt-1.5 font-medium pl-1">
                            💡 e.g. A12345678 (Required for non-Indians)
                          </p>
                        </div>
                        <div className="floating-label-group">
                          <input
                            type="text"
                            placeholder=" "
                            value={identity.visaNumber || ''}
                            onChange={(e) => handleIdentityChange('visaNumber', e.target.value)}
                            className="w-full premium-input font-semibold"
                          />
                          <label>Visa / Student Permit No. (If applicable)</label>
                          <p className="text-[10px] text-text-slate mt-1.5 font-medium pl-1">
                            💡 Optional for foreign candidates
                          </p>
                        </div>
                      </>
                    )}

                    {/* Document Upload 1 */}
                    <div className="premium-card bg-bg-slate/40 border border-border-slate p-6 md:col-span-2 space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-navy-950">Upload: {getSelectedCountry().doc1Label}</h4>
                        <p className="text-[11px] font-semibold text-text-slate">
                          Please upload a clear scanned copy of your {getSelectedCountry().doc1Label} (PDF, JPG, PNG, Max 2MB)
                        </p>
                      </div>

                      <div className="w-full">
                        {identity.doc1Name ? (
                          <div className="flex items-center justify-between bg-white border border-border-slate p-4 rounded-xl shadow-2xs">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-navy-950 truncate max-w-[300px]">
                                {identity.doc1Name}
                              </p>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                                Uploaded
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                setIdentity(prev => ({
                                  ...prev,
                                  doc1Name: '',
                                  doc1Url: '',
                                  proofDocumentName: '',
                                  proofDocumentUrl: ''
                                }));
                                toast.info('Document 1 removed.');
                              }}
                              className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ) : identityUploadProgress.doc1 > 0 ? (
                          <div className="w-full p-4 bg-white border border-border-slate rounded-xl space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-navy-950">
                              <span>Uploading...</span>
                              <span>{identityUploadProgress.doc1}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-800 transition-all duration-300" style={{ width: `${identityUploadProgress.doc1}%` }} />
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-800/40 bg-white hover:bg-slate-50/50 p-6 rounded-2xl cursor-pointer transition-all">
                            <Upload className="w-8 h-8 text-slate-300 mb-2" />
                            <span className="text-xs font-bold text-navy-950">Select File</span>
                            <span className="text-[10px] text-text-slate mt-1">Supported formats: PDF, JPG, PNG (Max 2MB)</span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleIdentityDocUpload('doc1', e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Document Upload 2 */}
                    <div className="premium-card bg-bg-slate/40 border border-border-slate p-6 md:col-span-2 space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-navy-950">Upload: {getSelectedCountry().doc2Label}</h4>
                        <p className="text-[11px] font-semibold text-text-slate">
                          Please upload a clear scanned copy of your {getSelectedCountry().doc2Label} (PDF, JPG, PNG, Max 2MB)
                        </p>
                      </div>

                      <div className="w-full">
                        {identity.doc2Name ? (
                          <div className="flex items-center justify-between bg-white border border-border-slate p-4 rounded-xl shadow-2xs">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-navy-950 truncate max-w-[300px]">
                                {identity.doc2Name}
                              </p>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                                Uploaded
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                setIdentity(prev => ({
                                  ...prev,
                                  doc2Name: '',
                                  doc2Url: ''
                                }));
                                toast.info('Document 2 removed.');
                              }}
                              className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ) : identityUploadProgress.doc2 > 0 ? (
                          <div className="w-full p-4 bg-white border border-border-slate rounded-xl space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-navy-950">
                              <span>Uploading...</span>
                              <span>{identityUploadProgress.doc2}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-800 transition-all duration-300" style={{ width: `${identityUploadProgress.doc2}%` }} />
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-800/40 bg-white hover:bg-slate-50/50 p-6 rounded-2xl cursor-pointer transition-all">
                            <Upload className="w-8 h-8 text-slate-300 mb-2" />
                            <span className="text-xs font-bold text-navy-950">Select File</span>
                            <span className="text-[10px] text-text-slate mt-1">Supported formats: PDF, JPG, PNG (Max 2MB)</span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleIdentityDocUpload('doc2', e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 4: Review & Submit */}
                {currentStep === 4 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-6 pt-2">
                    
                    {/* Data Summary Cards */}
                    <div className="space-y-4">
                      
                      <div className="border border-border-slate rounded-2xl overflow-hidden">
                        <div className="bg-surface-slate px-5 py-3 border-b border-border-slate">
                          <h4 className="text-[12.5px] font-bold text-navy-950 uppercase tracking-wider">Candidate & Family details</h4>
                        </div>
                        <div className="p-5 grid md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-semibold text-text-slate">Full Candidate Name</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{personal.firstName} {personal.lastName}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">Date of Birth / Gender</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{personal.dob} ({personal.gender})</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">Registered Contacts</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{personal.mobile} | {personal.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-border-slate rounded-2xl overflow-hidden">
                        <div className="bg-surface-slate px-5 py-3 border-b border-border-slate">
                          <h4 className="text-[12.5px] font-bold text-navy-950 uppercase tracking-wider">Academic Selection & Fields</h4>
                        </div>
                        <div className="p-5 grid md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-semibold text-text-slate">Highest Degree / Score</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{academic.highestQualification} ({academic.percentageCgpa})</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">School Faculty & Department</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{academic.schoolFaculty} - <span className="underline">{academic.researchDepartment}</span></p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="font-semibold text-text-slate">Proposed Area of Research</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{academic.proposedResearchArea}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-border-slate rounded-2xl overflow-hidden">
                        <div className="bg-surface-slate px-5 py-3 border-b border-border-slate">
                          <h4 className="text-[12.5px] font-bold text-navy-950 uppercase tracking-wider">Identity Specifications</h4>
                        </div>
                        <div className="p-5 grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-semibold">
                          <div>
                            <p className="font-semibold text-text-slate">Nationality</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{identity.nationality}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">Social Category Group</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{identity.category}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">{getIdentityNumberLabel()}</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{identity.proofNumber || '—'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">Issue Country</p>
                            <p className="font-bold text-navy-950 text-[13px] mt-0.5">{identity.issueCountry || identity.nationality}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">Document 1</p>
                            <p className={`font-bold text-[13px] mt-0.5 truncate max-w-[200px] ${identity.doc1Name ? 'text-emerald-600' : 'text-error-red'}`}>
                              {identity.doc1Name || 'Not Uploaded'}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-text-slate">Document 2</p>
                            <p className={`font-bold text-[13px] mt-0.5 truncate max-w-[200px] ${identity.doc2Name ? 'text-emerald-600' : 'text-error-red'}`}>
                              {identity.doc2Name || 'Not Uploaded'}
                            </p>
                          </div>
                          {(identity.nationality || '').toLowerCase() !== 'india' && (
                            <>
                              <div>
                                <p className="font-semibold text-text-slate">Passport Number</p>
                                <p className={`font-bold text-[13px] mt-0.5 ${identity.passportNumber ? 'text-navy-950' : 'text-error-red'}`}>
                                  {identity.passportNumber || 'Not Provided'}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold text-text-slate">Visa / Permit No.</p>
                                <p className="font-bold text-navy-950 text-[13px] mt-0.5">
                                  {identity.visaNumber || '—'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>



                    </div>

                    {/* Declaration Checkbox */}
                    <div className="p-5 border border-warning-amber/20 bg-warning-amber/5 rounded-2xl flex gap-3.5 items-start">
                      <input
                        type="checkbox"
                        id="declare"
                        checked={agreedDeclaration}
                        onChange={(e) => setAgreedDeclaration(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-navy-950 rounded shrink-0"
                      />
                      <label htmlFor="declare" className="text-xs text-text-navy leading-relaxed font-semibold cursor-pointer">
                        I hereby declare that all statements, upload logs, and educational transcript representations supplied inside this portal are absolutely correct, valid, and authentic to the best of my knowledge. I understand that any false logs identified will lead to instantaneous cancellation of my RPET registration.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!agreedDeclaration}
                      className="w-full h-14 rounded-2xl bg-navy-950 text-white font-extrabold text-[14px] hover:bg-blue-800 transition-colors shadow-md disabled:bg-border-slate disabled:text-text-slate disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Proceed to Payment (₹ 1,770.00)
                    </button>

                  </form>
                )}

              </div>

              {/* ACTION FOOTER buttons */}
              {currentStep < 4 && (
                <div className="flex items-center justify-between gap-4 mt-12 pt-6 border-t border-border-slate/60">
                  {currentStep > 1 ? (
                    <button
                      onClick={prevStep}
                      className="px-6 py-3.5 rounded-xl border border-border-slate hover:bg-surface-slate font-bold text-xs text-navy-950 flex items-center gap-2 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={nextStep}
                    className="px-8 py-3.5 rounded-xl bg-navy-950 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

        {/* PAYMENT GATEWAY MODAL OVERLAY */}
        <AnimatePresence>
          {showPaymentGateway && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="bg-white rounded-3xl w-full max-w-[640px] shadow-2xl border border-border-slate overflow-hidden flex flex-col my-8 font-sans"
              >
                
                {/* Header */}
                <div className="bg-navy-950 text-white px-6 py-5 flex items-center justify-between border-b border-navy-900">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500 text-navy-950 font-black flex items-center justify-center text-lg">
                      R
                    </div>
                    <div>
                      <h3 className="font-outfit font-black text-md tracking-wide">RGU Secure Pay</h3>
                      <p className="text-[10px] font-semibold text-gold-500 tracking-widest uppercase">Payment Gateway Portal</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (paymentStatus !== 'processing') {
                        setShowPaymentGateway(false);
                      }
                    }}
                    disabled={paymentStatus === 'processing'}
                    className="p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sub-body: Progress, Success, or Error */}
                {paymentStatus === 'processing' ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px]">
                    <Loader2 className="w-16 h-16 text-gold-500 animate-spin" />
                    <div className="space-y-2">
                      <h4 className="font-outfit font-extrabold text-navy-950 text-lg">Processing Transaction...</h4>
                      <p className="text-xs font-semibold text-text-slate animate-pulse">{processingMessage}</p>
                    </div>
                    <div className="w-full max-w-[280px] h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-navy-950 animate-pulse rounded-full w-full" />
                    </div>
                  </div>
                ) : paymentStatus === 'success' ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px]">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-emerald-100">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-outfit font-black text-navy-950 text-xl">Payment Authorized</h4>
                      <p className="text-xs font-semibold text-emerald-600">₹ 1,770.00 successfully captured</p>
                    </div>
                    <p className="text-[11px] font-semibold text-text-slate">Updating your admission registration record...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border-slate/60">
                    
                    {/* LEFT PANEL: RECEIPT & INFO (5 cols) */}
                    <div className="md:col-span-5 bg-surface-slate/30 p-6 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-navy-950 uppercase tracking-widest text-left block">Order Summary</span>
                        <div className="space-y-2.5 text-xs text-left">
                          <div className="flex justify-between font-semibold text-text-slate">
                            <span>Application Fee</span>
                            <span>₹ 1,500.00</span>
                          </div>
                          <div className="flex justify-between font-semibold text-text-slate">
                            <span>GST (18%)</span>
                            <span>₹ 270.00</span>
                          </div>
                          <div className="pt-2.5 border-t border-border-slate/60 flex justify-between font-extrabold text-navy-950 text-sm">
                            <span>Total Payable</span>
                            <span className="text-blue-800">₹ 1,770.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Security & Refund info cards */}
                      <div className="space-y-4 pt-6 border-t border-border-slate/60 text-left">
                        <div className="flex gap-2.5 items-start">
                          <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold text-navy-950 leading-snug">Secure SSL Encrypted</p>
                            <p className="text-[9px] font-semibold text-text-slate leading-normal">
                              Protected via 256-bit SSL network encryption gateway keys.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold text-navy-950 leading-snug">Refund Policy & Reschedules</p>
                            <p className="text-[9px] font-semibold text-text-slate leading-normal">
                              Non-refundable; exam time slot changes allowed up to 15 days before the test date.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: METHOD SELECTION & INPUTS (7 cols) */}
                    <div className="md:col-span-7 p-6 flex flex-col justify-between min-h-[420px]">
                      <div className="space-y-5">
                        
                        {/* Tabs */}
                        <div className="flex bg-surface-slate rounded-xl p-1 border border-border-slate/60">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              paymentMethod === 'card' ? 'bg-white text-navy-950 shadow-xs' : 'text-text-slate hover:text-navy-950'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Card
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              paymentMethod === 'upi' ? 'bg-white text-navy-950 shadow-xs' : 'text-text-slate hover:text-navy-950'
                            }`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            UPI
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('netbanking')}
                            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              paymentMethod === 'netbanking' ? 'bg-white text-navy-950 shadow-xs' : 'text-text-slate hover:text-navy-950'
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            Net Banking
                          </button>
                        </div>

                        {/* Input configurations based on Tab */}
                        {paymentMethod === 'card' && (
                          <div className="space-y-4">
                            <div className="floating-label-group text-left">
                              <input
                                type="text"
                                placeholder=" "
                                value={cardNo}
                                onChange={handleCardNoChange}
                                className="w-full premium-input font-mono font-semibold"
                              />
                              <label>Card Number</label>
                              <p className="text-[9px] text-text-slate mt-1 font-semibold pl-1">Supports Visa, Mastercard, Amex, RuPay</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="floating-label-group text-left">
                                <input
                                  type="text"
                                  placeholder=" "
                                  value={cardExpiry}
                                  onChange={handleExpiryChange}
                                  className="w-full premium-input font-mono font-semibold"
                                />
                                <label>Expiry (MM/YY)</label>
                              </div>
                              <div className="floating-label-group text-left">
                                <input
                                  type="password"
                                  placeholder=" "
                                  value={cardCvv}
                                  onChange={handleCvvChange}
                                  className="w-full premium-input font-mono font-semibold"
                                />
                                <label>CVV / CVC</label>
                              </div>
                            </div>

                            <div className="floating-label-group text-left">
                              <input
                                type="text"
                                placeholder=" "
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                className="w-full premium-input font-semibold uppercase"
                              />
                              <label>Cardholder Name</label>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'upi' && (
                          <div className="space-y-5 text-center">
                            <div className="floating-label-group text-left">
                              <input
                                type="text"
                                placeholder=" "
                                value={upiVal}
                                onChange={(e) => setUpiVal(e.target.value)}
                                className="w-full premium-input font-semibold"
                              />
                              <label>UPI ID (VPA)</label>
                              <p className="text-[9px] text-text-slate mt-1 font-semibold pl-1">e.g. mobile@ybl, name@okhdfcbank</p>
                            </div>

                            {/* Quick options */}
                            <div className="flex flex-wrap gap-2 justify-center">
                              {['@ybl', '@okhdfcbank', '@paytm', '@apl'].map(suffix => (
                                <button
                                  type="button"
                                  key={suffix}
                                  onClick={() => {
                                    const base = upiVal.split('@')[0] || 'candidate';
                                    setUpiVal(base + suffix);
                                  }}
                                  className="text-[10px] font-bold text-navy-950 bg-surface-slate hover:bg-slate-200 py-1.5 px-3 rounded-lg border border-border-slate/50 transition-colors"
                                >
                                  {suffix}
                                </button>
                              ))}
                            </div>

                            <div className="pt-2 pb-1 border-t border-slate-100">
                              <p className="text-[10px] font-bold text-text-slate uppercase tracking-wider mb-3">Or Scan Dynamic UPI QR Code</p>
                              <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-100">
                                <svg className="w-32 h-32 text-navy-950 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                                  <path d="M5,5 h20 v20 h-20 z M9,9 h12 v12 h-12 z M13,13 h4 v4 h-4 z" />
                                  <path d="M75,5 h20 v20 h-20 z M79,9 h12 v12 h-12 z M83,13 h4 v4 h-4 z" />
                                  <path d="M5,75 h20 v20 h-20 z M9,79 h12 v12 h-12 z M13,83 h4 v4 h-4 z" />
                                  <rect x="35" y="5" width="4" height="8" />
                                  <rect x="45" y="5" width="12" height="4" />
                                  <rect x="65" y="5" width="4" height="4" />
                                  <rect x="35" y="17" width="8" height="4" />
                                  <rect x="50" y="15" width="4" height="12" />
                                  <rect x="60" y="15" width="8" height="4" />
                                  <rect x="35" y="35" width="4" height="4" />
                                  <rect x="45" y="35" width="8" height="8" />
                                  <rect x="60" y="30" width="4" height="4" />
                                  <rect x="70" y="35" width="8" height="4" />
                                  <rect x="85" y="35" width="4" height="12" />
                                  <rect x="5" y="35" width="8" height="4" />
                                  <rect x="18" y="35" width="4" height="12" />
                                  <rect x="5" y="50" width="12" height="4" />
                                  <rect x="22" y="50" width="4" height="4" />
                                  <rect x="35" y="50" width="8" height="4" />
                                  <rect x="55" y="45" width="4" height="16" />
                                  <rect x="65" y="50" width="12" height="4" />
                                  <rect x="85" y="55" width="8" height="4" />
                                  <rect x="35" y="65" width="4" height="4" />
                                  <rect x="45" y="65" width="12" height="4" />
                                  <rect x="65" y="65" width="4" height="12" />
                                  <rect x="75" y="65" width="4" height="4" />
                                  <rect x="85" y="65" width="4" height="4" />
                                  <rect x="35" y="75" width="12" height="4" />
                                  <rect x="55" y="75" width="4" height="12" />
                                  <rect x="65" y="80" width="8" height="4" />
                                  <rect x="80" y="75" width="12" height="4" />
                                  <rect x="35" y="85" width="4" height="8" />
                                  <rect x="45" y="90" width="12" height="4" />
                                  <rect x="65" y="90" width="4" height="4" />
                                  <rect x="75" y="85" width="8" height="8" />
                                </svg>
                              </div>
                              <p className="text-[10px] text-text-slate mt-2 font-semibold">Scan via GPay, PhonePe, Paytm, or BHIM</p>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'netbanking' && (
                          <div className="space-y-4 text-left">
                            <div className="grid grid-cols-2 gap-3.5">
                              {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bankName => (
                                <button
                                  type="button"
                                  key={bankName}
                                  onClick={() => setNetbankSelected(bankName)}
                                  className={`p-3 text-center text-xs font-bold border rounded-xl transition-all ${
                                    netbankSelected === bankName
                                      ? 'border-blue-800 bg-blue-50/50 text-blue-900 ring-2 ring-blue-800/10'
                                      : 'border-border-slate hover:bg-slate-50 text-navy-950'
                                  }`}
                                >
                                  {bankName}
                                </button>
                              ))}
                            </div>
                            
                            <div className="floating-label-group text-left">
                              <select
                                value={['SBI', 'HDFC', 'ICICI', 'Axis'].includes(netbankSelected) ? '' : netbankSelected}
                                onChange={(e) => setNetbankSelected(e.target.value)}
                                className={`w-full premium-input font-semibold ${
                                  netbankSelected && !['SBI', 'HDFC', 'ICICI', 'Axis'].includes(netbankSelected) ? 'has-value' : ''
                                }`}
                              >
                                <option value=""></option>
                                <option value="Canara Bank">Canara Bank</option>
                                <option value="Bank of Baroda">Bank of Baroda (BoB)</option>
                                <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                                <option value="Union Bank of India">Union Bank of India</option>
                                <option value="Others">Others</option>
                              </select>
                              <label>Select Other Bank</label>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Error or failed message display */}
                      {paymentStatus === 'failed' && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex gap-2.5 items-start text-left text-[11px] font-bold text-red-700">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span>Transaction Failed. Insufficient funds or invalid bank response. Feel free to toggle the Simulation setting below and try again.</span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons & Sandbox Controls */}
                      <div className="space-y-4 pt-6 border-t border-slate-100">
                        {/* Simulation Controls */}
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          <span className="font-extrabold text-navy-950">Simulation Status:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setSimulateSuccess(true)}
                              className={`py-1 px-2.5 rounded font-black uppercase text-[10px] border transition-all ${
                                simulateSuccess 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-500'
                              }`}
                            >
                              Success
                            </button>
                            <button
                              type="button"
                              onClick={() => setSimulateSuccess(false)}
                              className={`py-1 px-2.5 rounded font-black uppercase text-[10px] border transition-all ${
                                !simulateSuccess 
                                  ? 'bg-red-50 text-red-700 border-red-300' 
                                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-500'
                              }`}
                            >
                              Failure
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleInitiatePayment}
                          className="w-full h-12 bg-blue-800 hover:bg-navy-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          Pay ₹ 1,770.00 Securely
                        </button>
                      </div>

                    </div>

                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
