export type ApplicationStatus = 'Draft' | 'Submitted' | 'Verified' | 'Approved' | 'Rejected' | 'Pending';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
}

export interface AcademicInfo {
  highestQualification: string;
  percentageCgpa: string;
  schoolFaculty: string;
  researchDepartment: string;
  proposedResearchArea: string;
}

export interface IdentityInfo {
  nationality: string;
  aadhaarId: string;
  category: string;
  proofType?: string;
  proofNumber?: string;
  proofDocumentName?: string;
  proofDocumentUrl?: string;
  verificationStatus?: string;
  issueCountry?: string;
  uploadedAt?: string;
  passportNumber?: string;
  visaNumber?: string;
  doc1Name?: string;
  doc1Url?: string;
  doc2Name?: string;
  doc2Url?: string;
}

export interface DocumentUpload {
  name: string;
  url: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  feedback?: string;
}

export interface CandidateDocuments {
  passportPhoto?: DocumentUpload;
  aadhaarCard?: DocumentUpload;
  degreeCertificate?: DocumentUpload;
  markSheets?: DocumentUpload;
  researchProposal?: DocumentUpload;
}

export interface CandidateApplication {
  id: string; // e.g. RPET2026-000001
  status: ApplicationStatus;
  progressPercent: number;
  registrationDate: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  identityInfo: IdentityInfo;
  documents: CandidateDocuments;
  otpVerified: boolean;
  bookedSlot?: CandidateSlotBookingInfo;
  mockTestResult?: MockTestResult;
  mockTestResults?: Record<string, MockTestResult>;
  verificationNotes?: string;
}

export interface CandidateSlotBookingInfo {
  bookingId: string;
  date: string;
  time: string;
  mode: string;
  rescheduleCount: number;
  bookingHistory?: Array<{
    bookingId: string;
    date: string;
    time: string;
    mode: string;
    bookingDate: string;
  }>;
}

export interface MockTestResult {
  score: number; // raw score out of 20
  accuracy: number; // percentage
  timeTaken: string; // e.g. "12:45"
  attemptDate: string;
  categoryScores: {
    researchAptitude: number;
    logicalReasoning: number;
    quantitativeAptitude: number;
    english: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SlotAvailability {
  time: string;
  available: number;
  total: number;
}
