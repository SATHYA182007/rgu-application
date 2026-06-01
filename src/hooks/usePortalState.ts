'use client';

import { useState, useEffect } from 'react';
import {
  CandidateApplication,
  NotificationItem,
  ApplicationStatus,
  MockTestResult,
  PersonalInfo,
  AcademicInfo,
  IdentityInfo,
  CandidateDocuments,
  CandidateSlotBookingInfo
} from '../types';

// Pre-seeded candidates for realistic database display
const INITIAL_CANDIDATES: CandidateApplication[] = [
  {
    id: 'RPET2026-000108',
    status: 'Approved',
    progressPercent: 100,
    registrationDate: '2026-05-12',
    personalInfo: {
      firstName: 'Aarav',
      lastName: 'Sharma',
      dob: '1998-04-12',
      gender: 'Male',
      mobile: '+91 98765 43210',
      email: 'aarav.sharma@gmail.com'
    },
    academicInfo: {
      highestQualification: 'M.Tech Computer Science',
      percentageCgpa: '9.2 CGPA',
      schoolFaculty: 'School of Engineering & Technology',
      researchDepartment: 'Computer Science',
      proposedResearchArea: 'Quantum Computing and Cryptography'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '3214-5678-9012',
      category: 'General'
    },
    documents: {
      passportPhoto: { name: 'photo.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Verified' },
      aadhaarCard: { name: 'aadhaar.pdf', url: '#', status: 'Verified' },
      degreeCertificate: { name: 'mtech_degree.pdf', url: '#', status: 'Verified' },
      markSheets: { name: 'marksheets.pdf', url: '#', status: 'Verified' },
      researchProposal: { name: 'proposal.pdf', url: '#', status: 'Verified' }
    },
    otpVerified: true,
    bookedSlot: {
      bookingId: 'BOOK-2026-000108',
      date: '2026-08-15',
      time: '09:00 AM – 11:00 AM',
      mode: 'Online Proctored',
      rescheduleCount: 0,
      bookingHistory: []
    },
    mockTestResult: {
      score: 18,
      accuracy: 90,
      timeTaken: '34:10',
      attemptDate: '2026-05-28',
      categoryScores: { researchAptitude: 5, logicalReasoning: 5, quantitativeAptitude: 4, english: 4 }
    },
    mockTestResults: {
      test1: {
        score: 15,
        accuracy: 75,
        timeTaken: '38:20',
        attemptDate: '2026-05-20',
        categoryScores: { researchAptitude: 3, logicalReasoning: 4, quantitativeAptitude: 4, english: 4 }
      },
      test2: {
        score: 17,
        accuracy: 85,
        timeTaken: '36:45',
        attemptDate: '2026-05-24',
        categoryScores: { researchAptitude: 4, logicalReasoning: 5, quantitativeAptitude: 4, english: 4 }
      },
      test3: {
        score: 18,
        accuracy: 90,
        timeTaken: '34:10',
        attemptDate: '2026-05-28',
        categoryScores: { researchAptitude: 5, logicalReasoning: 5, quantitativeAptitude: 4, english: 4 }
      }
    }
  },
  {
    id: 'RPET2026-000109',
    status: 'Verified',
    progressPercent: 100,
    registrationDate: '2026-05-14',
    personalInfo: {
      firstName: 'Ananya',
      lastName: 'Iyer',
      dob: '1999-07-22',
      gender: 'Female',
      mobile: '+91 87654 32109',
      email: 'ananya.iyer@yahoo.com'
    },
    academicInfo: {
      highestQualification: 'M.Sc Biotechnology',
      percentageCgpa: '88.5%',
      schoolFaculty: 'School of Life Sciences',
      researchDepartment: 'Biotechnology',
      proposedResearchArea: 'CRISPR Cas9 Gene Editing in Cereal Crops'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '9876-5432-1098',
      category: 'General'
    },
    documents: {
      passportPhoto: { name: 'ananya_photo.png', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Verified' },
      aadhaarCard: { name: 'aadhaar_card.pdf', url: '#', status: 'Verified' },
      degreeCertificate: { name: 'msc_degree.pdf', url: '#', status: 'Verified' },
      markSheets: { name: 'marks.pdf', url: '#', status: 'Verified' },
      researchProposal: { name: 'gene_proposal.pdf', url: '#', status: 'Verified' }
    },
    otpVerified: true,
    bookedSlot: {
      bookingId: 'BOOK-2026-000109',
      date: '2026-08-15',
      time: '01:00 PM – 03:00 PM',
      mode: 'Online Proctored',
      rescheduleCount: 0,
      bookingHistory: []
    }
  },
  {
    id: 'RPET2026-000110',
    status: 'Pending',
    progressPercent: 100,
    registrationDate: '2026-05-18',
    personalInfo: {
      firstName: 'Kabir',
      lastName: 'Verma',
      dob: '1997-11-05',
      gender: 'Male',
      mobile: '+91 76543 21098',
      email: 'kabir.verma@outlook.com'
    },
    academicInfo: {
      highestQualification: 'MBA Finance',
      percentageCgpa: '7.8 CGPA',
      schoolFaculty: 'School of Commerce & Management',
      researchDepartment: 'Management',
      proposedResearchArea: 'Sustainable FinTech in Rural Ecosystems'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '4567-8901-2345',
      category: 'OBC'
    },
    documents: {
      passportPhoto: { name: 'kabir.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Pending' },
      aadhaarCard: { name: 'id.pdf', url: '#', status: 'Pending' },
      degreeCertificate: { name: 'mba_cert.pdf', url: '#', status: 'Pending' },
      markSheets: { name: 'marks_all.pdf', url: '#', status: 'Pending' },
      researchProposal: { name: 'fintech_paper.pdf', url: '#', status: 'Pending' }
    },
    otpVerified: true
  },
  {
    id: 'RPET2026-000111',
    status: 'Rejected',
    progressPercent: 100,
    registrationDate: '2026-05-20',
    personalInfo: {
      firstName: 'Riya',
      lastName: 'Sen',
      dob: '1996-02-14',
      gender: 'Female',
      mobile: '+91 65432 10987',
      email: 'riya.sen@gmail.com'
    },
    academicInfo: {
      highestQualification: 'M.Sc Agriculture',
      percentageCgpa: '6.4 CGPA',
      schoolFaculty: 'School of Agricultural Sciences',
      researchDepartment: 'Agriculture',
      proposedResearchArea: 'Hydroponics Soil Replacements'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '1111-2222-3333',
      category: 'SC'
    },
    documents: {
      passportPhoto: { name: 'riya.jpg', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'Rejected', feedback: 'Blurry photo, please reupload' },
      aadhaarCard: { name: 'aadhaar.pdf', url: '#', status: 'Verified' },
      degreeCertificate: { name: 'degree.pdf', url: '#', status: 'Verified' },
      markSheets: { name: 'marks.pdf', url: '#', status: 'Rejected', feedback: 'Marksheets of 1st and 2nd semesters are missing' },
      researchProposal: { name: 'proposal.pdf', url: '#', status: 'Verified' }
    },
    otpVerified: true,
    verificationNotes: 'Applicant uploaded low resolution documents and incomplete marksheets. Status set to Rejected.'
  },
  {
    id: 'RPET2026-000112',
    status: 'Approved',
    progressPercent: 100,
    registrationDate: '2026-05-22',
    personalInfo: {
      firstName: 'Aditya',
      lastName: 'Nair',
      dob: '1998-09-30',
      gender: 'Male',
      mobile: '+91 99988 87776',
      email: 'aditya.nair@gmail.com'
    },
    academicInfo: {
      highestQualification: 'M.Sc Data Science',
      percentageCgpa: '9.5 CGPA',
      schoolFaculty: 'School of Computer Sciences',
      researchDepartment: 'Data Science',
      proposedResearchArea: 'Federated Learning in Healthcare Diagnostics'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '5432-1098-7654',
      category: 'General'
    },
    documents: {
      passportPhoto: { name: 'photo_aditya.png', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'Verified' },
      aadhaarCard: { name: 'aadhaar_card.pdf', url: '#', status: 'Verified' },
      degreeCertificate: { name: 'msc_degree.pdf', url: '#', status: 'Verified' },
      markSheets: { name: 'all_marks.pdf', url: '#', status: 'Verified' },
      researchProposal: { name: 'proposal_federated.pdf', url: '#', status: 'Verified' }
    },
    otpVerified: true,
    bookedSlot: {
      bookingId: 'BOOK-2026-000112',
      date: '2026-08-15',
      time: '11:00 AM – 01:00 PM',
      mode: 'Online Proctored',
      rescheduleCount: 0,
      bookingHistory: []
    },
    mockTestResult: {
      score: 19,
      accuracy: 95,
      timeTaken: '32:15',
      attemptDate: '2026-05-29',
      categoryScores: { researchAptitude: 5, logicalReasoning: 5, quantitativeAptitude: 5, english: 4 }
    }
  },
  {
    id: 'RPET2026-000113',
    status: 'Pending',
    progressPercent: 100,
    registrationDate: '2026-05-25',
    personalInfo: {
      firstName: 'Meera',
      lastName: 'Deshmukh',
      dob: '1997-03-18',
      gender: 'Female',
      mobile: '+91 88877 76665',
      email: 'meera.d@gmail.com'
    },
    academicInfo: {
      highestQualification: 'M.Com',
      percentageCgpa: '82%',
      schoolFaculty: 'School of Commerce & Management',
      researchDepartment: 'Commerce',
      proposedResearchArea: 'GST Compliance Impacts on Micro Enterprises'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '9898-7676-5454',
      category: 'OBC'
    },
    documents: {
      passportPhoto: { name: 'meera.jpg', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', status: 'Pending' },
      aadhaarCard: { name: 'aadhaar.pdf', url: '#', status: 'Pending' },
      degreeCertificate: { name: 'mcom.pdf', url: '#', status: 'Pending' },
      markSheets: { name: 'sheets.pdf', url: '#', status: 'Pending' },
      researchProposal: { name: 'proposal.pdf', url: '#', status: 'Pending' }
    },
    otpVerified: true
  },
  {
    id: 'RPET2026-000114',
    status: 'Pending',
    progressPercent: 100,
    registrationDate: '2026-05-26',
    personalInfo: {
      firstName: 'Sai',
      lastName: 'Prasad',
      dob: '1995-12-12',
      gender: 'Male',
      mobile: '+91 77766 65554',
      email: 'sai.prasad@gmail.com'
    },
    academicInfo: {
      highestQualification: 'M.Tech Electronics',
      percentageCgpa: '8.4 CGPA',
      schoolFaculty: 'School of Engineering & Technology',
      researchDepartment: 'Engineering',
      proposedResearchArea: 'VLSI Architectures for Neuromorphic Chips'
    },
    identityInfo: {
      nationality: 'Indian',
      aadhaarId: '4444-5555-6666',
      category: 'ST'
    },
    documents: {
      passportPhoto: { name: 'sai_photo.jpg', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'Pending' },
      aadhaarCard: { name: 'aadhaar.pdf', url: '#', status: 'Pending' },
      degreeCertificate: { name: 'mtech.pdf', url: '#', status: 'Pending' },
      markSheets: { name: 'marks.pdf', url: '#', status: 'Pending' },
      researchProposal: { name: 'proposal.pdf', url: '#', status: 'Pending' }
    },
    otpVerified: true
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Admission Portal Open',
    description: 'RGU RPET 2026 Applications are now officially open. Submit yours before registration closes.',
    timestamp: '2026-05-01 10:00 AM',
    read: false,
    type: 'info'
  },
  {
    id: 'n2',
    title: 'Interactive Mock Test Active',
    description: 'Candidates can now attempt the official research syllabus mock test simulator from their dashboards.',
    timestamp: '2026-05-15 02:00 PM',
    read: false,
    type: 'success'
  }
];

export function usePortalState() {
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [activeUser, setActiveUser] = useState<CandidateApplication | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync with localStorage on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCandidates = localStorage.getItem('rgu_rpet_candidates');
      if (storedCandidates) {
        setCandidates(JSON.parse(storedCandidates));
      } else {
        localStorage.setItem('rgu_rpet_candidates', JSON.stringify(INITIAL_CANDIDATES));
        setCandidates(INITIAL_CANDIDATES);
      }

      const storedUser = localStorage.getItem('rgu_rpet_active_user');
      if (storedUser) {
        setActiveUser(JSON.parse(storedUser));
      }

      const storedAdmin = localStorage.getItem('rgu_rpet_admin_logged');
      if (storedAdmin) {
        setAdminLoggedIn(JSON.parse(storedAdmin));
      }

      const storedNotifications = localStorage.getItem('rgu_rpet_notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        localStorage.setItem('rgu_rpet_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
        setNotifications(DEFAULT_NOTIFICATIONS);
      }

      setLoading(false);
    }
  }, []);

  // Sync candidates with localStorage when changed
  const saveCandidatesState = (newCandidates: CandidateApplication[]) => {
    setCandidates(newCandidates);
    localStorage.setItem('rgu_rpet_candidates', JSON.stringify(newCandidates));
  };

  // Sync active user with localStorage when changed
  const saveActiveUserState = (user: CandidateApplication | null) => {
    setActiveUser(user);
    if (user) {
      localStorage.setItem('rgu_rpet_active_user', JSON.stringify(user));
      // update active user in candidate list as well
      const updatedList = candidates.map(c => c.id === user.id ? user : c);
      saveCandidatesState(updatedList);
    } else {
      localStorage.removeItem('rgu_rpet_active_user');
    }
  };

  // Login dynamic functions
  const loginAsStudent = (email: string, appNumber?: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    // Search candidates by email (or application number if provided)
    const match = candidates.find(
      c => c.personalInfo.email.toLowerCase() === cleanEmail || (appNumber && c.id === appNumber.trim())
    );

    if (match) {
      saveActiveUserState(match);
      setAdminLoggedIn(false);
      localStorage.setItem('rgu_rpet_admin_logged', 'false');
      return true;
    }
    return false;
  };

  const loginAsAdmin = (password: string): boolean => {
    if (password === 'admin123') {
      setAdminLoggedIn(true);
      localStorage.setItem('rgu_rpet_admin_logged', 'true');
      setActiveUser(null);
      localStorage.removeItem('rgu_rpet_active_user');
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveUser(null);
    setAdminLoggedIn(false);
    localStorage.removeItem('rgu_rpet_active_user');
    localStorage.setItem('rgu_rpet_admin_logged', 'false');
  };

  // Register new candidate / Save drafts
  const saveDraftApplication = (
    personal: Partial<PersonalInfo>,
    academic: Partial<AcademicInfo>,
    identity: Partial<IdentityInfo>,
    docs: CandidateDocuments,
    progress: number
  ) => {
    const draftUser: CandidateApplication = {
      id: activeUser?.id || `RPET-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Draft',
      progressPercent: progress,
      registrationDate: activeUser?.registrationDate || new Date().toISOString().split('T')[0],
      personalInfo: {
        firstName: personal.firstName || '',
        lastName: personal.lastName || '',
        dob: personal.dob || '',
        gender: personal.gender || '',
        mobile: personal.mobile || '',
        email: personal.email || ''
      },
      academicInfo: {
        highestQualification: academic.highestQualification || '',
        percentageCgpa: academic.percentageCgpa || '',
        schoolFaculty: academic.schoolFaculty || '',
        researchDepartment: academic.researchDepartment || '',
        proposedResearchArea: academic.proposedResearchArea || ''
      },
      identityInfo: {
        nationality: identity.nationality || '',
        aadhaarId: identity.aadhaarId || '',
        category: identity.category || '',
        proofType: identity.proofType || '',
        proofNumber: identity.proofNumber || '',
        proofDocumentName: identity.proofDocumentName || '',
        proofDocumentUrl: identity.proofDocumentUrl || '',
        verificationStatus: identity.verificationStatus || 'Pending',
        issueCountry: identity.issueCountry || '',
        uploadedAt: identity.uploadedAt || '',
        passportNumber: identity.passportNumber || '',
        visaNumber: identity.visaNumber || '',
        doc1Name: identity.doc1Name || '',
        doc1Url: identity.doc1Url || '',
        doc2Name: identity.doc2Name || '',
        doc2Url: identity.doc2Url || ''
      },
      documents: docs,
      otpVerified: activeUser?.otpVerified || false,
      bookedSlot: activeUser?.bookedSlot,
      mockTestResult: activeUser?.mockTestResult,
      mockTestResults: activeUser?.mockTestResults,
      verificationNotes: activeUser?.verificationNotes
    };

    saveActiveUserState(draftUser);

    // If candidate isn't in main database list, add it
    if (!candidates.find(c => c.id === draftUser.id)) {
      saveCandidatesState([...candidates, draftUser]);
    }
  };

  // Submit complete application
  const submitApplication = (appId: string) => {
    const match = candidates.find(c => c.id === appId);
    if (match) {
      const updatedUser: CandidateApplication = {
        ...match,
        status: 'Submitted',
        progressPercent: 100
      };
      saveActiveUserState(updatedUser);

      // Create new transaction alert
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Application Submitted',
        description: `Application ${appId} was submitted successfully and is queued for verification.`,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'success'
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // OTP Validation lock
  const verifyOTPCode = (appId: string): boolean => {
    const match = candidates.find(c => c.id === appId);
    if (match) {
      const updatedUser: CandidateApplication = {
        ...match,
        otpVerified: true
      };
      saveActiveUserState(updatedUser);
      return true;
    }
    return false;
  };

  // Slot Booking engine
  const bookSlot = (appId: string, booking: CandidateSlotBookingInfo) => {
    const match = candidates.find(c => c.id === appId);
    if (match) {
      const updatedUser: CandidateApplication = {
        ...match,
        bookedSlot: booking
      };
      saveActiveUserState(updatedUser);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: booking.rescheduleCount > 0 ? 'Entrance Slot Rescheduled' : 'Entrance Slot Booked',
        description: booking.rescheduleCount > 0 
          ? `Your exam slot has been rescheduled to ${booking.date} at ${booking.time}.`
          : `Your exam slot on ${booking.date} at ${booking.time} was successfully confirmed.`,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'info'
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // Mock test submission
  const saveMockTestScore = (appId: string, result: MockTestResult, testId?: string) => {
    const match = candidates.find(c => c.id === appId);
    if (match) {
      const activeTestKey = testId || 'test1';
      const updatedResults = {
        ...(match.mockTestResults || {}),
        [activeTestKey]: result
      };
      const updatedUser: CandidateApplication = {
        ...match,
        mockTestResult: result,
        mockTestResults: updatedResults
      };
      saveActiveUserState(updatedUser);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Mock Test Completed',
        description: `You completed the syllabus mock test with an analytical score of ${result.score}/20 (${result.accuracy}% accuracy).`,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'success'
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // Administrative verification
  const adminVerifyApplication = (
    appId: string,
    status: ApplicationStatus,
    docStatuses?: Partial<Record<keyof CandidateDocuments, 'Verified' | 'Rejected' | 'Pending'>>,
    notes?: string
  ) => {
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === appId) {
        const updatedDocs = { ...candidate.documents };
        if (docStatuses) {
          Object.keys(docStatuses).forEach(key => {
            const docKey = key as keyof CandidateDocuments;
            if (updatedDocs[docKey]) {
              updatedDocs[docKey] = {
                ...updatedDocs[docKey]!,
                status: docStatuses[docKey]!
              };
            }
          });
        }

        return {
          ...candidate,
          status,
          documents: updatedDocs,
          verificationNotes: notes || candidate.verificationNotes
        };
      }
      return candidate;
    });

    saveCandidatesState(updatedCandidates);

    // If the verified user is currently logged in, update active user session
    if (activeUser && activeUser.id === appId) {
      const matchedUpdated = updatedCandidates.find(c => c.id === appId);
      if (matchedUpdated) {
        saveActiveUserState(matchedUpdated);
      }
    }

    // Add administrative notice notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Application Status Update: ${status}`,
      description: `RGU Verification Committee updated application ${appId} status to ${status}.`,
      timestamp: new Date().toLocaleString(),
      read: false,
      type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
  };

  // Clear notification read statuses
  const markNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updated));
  };

  return {
    candidates,
    activeUser,
    adminLoggedIn,
    notifications,
    loading,
    loginAsStudent,
    loginAsAdmin,
    logout,
    saveDraftApplication,
    submitApplication,
    verifyOTPCode,
    bookSlot,
    saveMockTestScore,
    adminVerifyApplication,
    markNotificationsAsRead,
    saveActiveUserState
  };
}
