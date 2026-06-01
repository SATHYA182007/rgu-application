'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  AlertTriangle
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

    // Initialize application submission
    const candidateId = activeUser?.id || `RPET-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Auto-save the full submitted state first
    saveDraftApplication(personal, academic, identity, {}, 100);
    submitApplication(candidateId);

    toast.success('Application locked successfully!');
    router.push('/verify');
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

      {/* Absolute Logo at the top-left corner of the screen page */}
      <div className="absolute top-8 left-8 md:top-10 md:left-10 flex items-center gap-3 cursor-pointer z-30" onClick={() => router.push('/')}>
        <div className="w-9 h-9 rounded-lg bg-navy-950 text-white font-extrabold flex items-center justify-center">
          R
        </div>
        <div>
          <p className="font-outfit font-black text-sm text-navy-950 leading-none">RGU RPET 2026</p>
          <p className="text-[9px] font-semibold text-gold-500 tracking-wider">ADMISSIONS DESK</p>
        </div>
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
                      <Check className="w-5 h-5" />
                      Submit & Lock Application
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

      </div>

    </div>
  );
}
