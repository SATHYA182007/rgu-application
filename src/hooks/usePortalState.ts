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
import { supabase } from '../lib/supabase';

// Pre-seeded candidates for realistic database display / local fallbacks
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

// Helper to map DB record values to Frontend camelCase types
const mapDBCandidateToState = (db: any): CandidateApplication => ({
  id: db.id,
  status: db.status,
  progressPercent: db.progress_percent,
  registrationDate: db.registration_date,
  otpVerified: db.otp_verified,
  verificationNotes: db.verification_notes || '',
  personalInfo: db.personal_info || {},
  academicInfo: db.academic_info || {},
  identityInfo: db.identity_info || {},
  documents: db.documents || {},
  bookedSlot: db.booked_slot || null,
  mockTestResult: db.mock_test_result || null,
  mockTestResults: db.mock_test_results || {}
});

// Helper to map Frontend camelCase type keys to DB snake_case columns
const mapStateToDBCandidate = (state: CandidateApplication): any => ({
  id: state.id,
  email: state.personalInfo?.email || '',
  status: state.status,
  progress_percent: state.progressPercent,
  registration_date: state.registrationDate,
  otp_verified: state.otpVerified,
  verification_notes: state.verificationNotes || null,
  personal_info: state.personalInfo || {},
  academic_info: state.academicInfo || {},
  identity_info: state.identityInfo || {},
  documents: state.documents || {},
  booked_slot: state.bookedSlot || null,
  mock_test_result: state.mockTestResult || null,
  mock_test_results: state.mockTestResults || {}
});

export function usePortalState() {
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [activeUser, setActiveUser] = useState<CandidateApplication | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync with Supabase on load, with localStorage as local replication fallback
  useEffect(() => {
    async function initPortalData() {
      try {
        setLoading(true);

        // 1. Fetch Candidates from Supabase
        const { data: dbCandidates, error: candError } = await supabase
          .from('candidates')
          .select('*');

        let loadedCandidates: CandidateApplication[] = [];
        
        if (!candError && dbCandidates && dbCandidates.length > 0) {
          loadedCandidates = dbCandidates.map(mapDBCandidateToState);
          setCandidates(loadedCandidates);
          localStorage.setItem('rgu_rpet_candidates', JSON.stringify(loadedCandidates));
        } else {
          // Fallback to local replicates
          const storedCandidates = localStorage.getItem('rgu_rpet_candidates');
          if (storedCandidates) {
            loadedCandidates = JSON.parse(storedCandidates);
            setCandidates(loadedCandidates);
          } else {
            localStorage.setItem('rgu_rpet_candidates', JSON.stringify(INITIAL_CANDIDATES));
            setCandidates(INITIAL_CANDIDATES);
            loadedCandidates = INITIAL_CANDIDATES;
          }
        }

        // 2. Fetch Notifications from Supabase
        const { data: dbNotifs, error: notifError } = await supabase
          .from('notifications')
          .select('*');

        if (!notifError && dbNotifs && dbNotifs.length > 0) {
          const loadedNotifs: NotificationItem[] = dbNotifs.map((n: any) => ({
            id: n.id,
            title: n.title,
            description: n.description,
            timestamp: n.timestamp,
            read: n.read,
            type: n.type as any
          }));
          setNotifications(loadedNotifs);
          localStorage.setItem('rgu_rpet_notifications', JSON.stringify(loadedNotifs));
        } else {
          const storedNotifications = localStorage.getItem('rgu_rpet_notifications');
          if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications));
          } else {
            localStorage.setItem('rgu_rpet_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
            setNotifications(DEFAULT_NOTIFICATIONS);
          }
        }

        // 3. Hydrate Active User Session
        const storedUser = localStorage.getItem('rgu_rpet_active_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const freshUser = loadedCandidates.find(c => c.id === parsedUser.id);
          if (freshUser) {
            setActiveUser(freshUser);
            localStorage.setItem('rgu_rpet_active_user', JSON.stringify(freshUser));
          } else {
            setActiveUser(parsedUser);
          }
        }

        const storedAdmin = localStorage.getItem('rgu_rpet_admin_logged');
        if (storedAdmin) {
          setAdminLoggedIn(JSON.parse(storedAdmin));
        }

      } catch (err) {
        console.warn('Supabase initial fetch bypassed. Operational locally.', err);
      } finally {
        setLoading(false);
      }
    }

    initPortalData();
  }, []);

  // Sync candidate lists with LocalStorage
  const saveCandidatesState = (newCandidates: CandidateApplication[]) => {
    setCandidates(newCandidates);
    localStorage.setItem('rgu_rpet_candidates', JSON.stringify(newCandidates));
  };

  // Sync active user sessions with LocalStorage and execute async write to live Supabase DB
  const saveActiveUserState = async (user: CandidateApplication | null) => {
    setActiveUser(user);
    if (user) {
      localStorage.setItem('rgu_rpet_active_user', JSON.stringify(user));
      const updatedList = candidates.map(c => c.id === user.id ? user : c);
      saveCandidatesState(updatedList);

      // Async write to Supabase
      try {
        const dbCandidate = mapStateToDBCandidate(user);
        await supabase
          .from('candidates')
          .upsert(dbCandidate);
      } catch (e) {
        console.warn('Database write queued locally.', e);
      }
    } else {
      localStorage.removeItem('rgu_rpet_active_user');
    }
  };

  // Login handlers
  const loginAsStudent = (email: string, appNumber?: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
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

  // Save drafts / Registration inputs
  const saveDraftApplication = (
    personal: Partial<PersonalInfo>,
    academic: Partial<AcademicInfo>,
    identity: Partial<IdentityInfo>,
    docs: CandidateDocuments,
    progress: number
  ) => {
    const draftUser: CandidateApplication = {
      id: activeUser?.id || `RPET2026-${Math.floor(100000 + Math.random() * 900000)}`,
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

    if (!candidates.find(c => c.id === draftUser.id)) {
      saveCandidatesState([...candidates, draftUser]);
    }
  };

  // Submit complete application
  const submitApplication = async (appId: string) => {
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

      try {
        await supabase
          .from('notifications')
          .insert({
            id: newNotif.id,
            candidate_id: appId,
            title: newNotif.title,
            description: newNotif.description,
            timestamp: newNotif.timestamp,
            read: newNotif.read,
            type: newNotif.type
          });
      } catch (e) {
        console.warn('Database write bypass.', e);
      }

      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // OTP Verification complete status
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

  // Exam timeslot booking
  const bookSlot = async (appId: string, booking: CandidateSlotBookingInfo) => {
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

      try {
        await supabase
          .from('notifications')
          .insert({
            id: newNotif.id,
            candidate_id: appId,
            title: newNotif.title,
            description: newNotif.description,
            timestamp: newNotif.timestamp,
            read: newNotif.read,
            type: newNotif.type
          });
      } catch (e) {
        console.warn('Database write bypass.', e);
      }

      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // Mock test assessment submissions
  const saveMockTestScore = async (appId: string, result: MockTestResult, testId?: string) => {
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

      try {
        await supabase
          .from('notifications')
          .insert({
            id: newNotif.id,
            candidate_id: appId,
            title: newNotif.title,
            description: newNotif.description,
            timestamp: newNotif.timestamp,
            read: newNotif.read,
            type: newNotif.type
          });
      } catch (e) {
        console.warn('Database write bypass.', e);
      }

      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // Administrative candidate auditing & verification
  const adminVerifyApplication = async (
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

        const updated = {
          ...candidate,
          status,
          documents: updatedDocs,
          verificationNotes: notes || candidate.verificationNotes
        };

        // Async write to Supabase
        try {
          const dbCandidate = mapStateToDBCandidate(updated);
          supabase
            .from('candidates')
            .upsert(dbCandidate)
            .then(() => {});
        } catch (e) {
          console.warn('Database write bypass.', e);
        }

        return updated;
      }
      return candidate;
    });

    saveCandidatesState(updatedCandidates);

    // If verified user session is active, refresh activeUser state
    if (activeUser && activeUser.id === appId) {
      const matchedUpdated = updatedCandidates.find(c => c.id === appId);
      if (matchedUpdated) {
        saveActiveUserState(matchedUpdated);
      }
    }

    // Add administrative status notice update
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Application Status Update: ${status}`,
      description: `RGU Verification Committee updated application ${appId} status to ${status}.`,
      timestamp: new Date().toLocaleString(),
      read: false,
      type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning'
    };

    try {
      await supabase
        .from('notifications')
        .insert({
          id: newNotif.id,
          candidate_id: appId,
          title: newNotif.title,
          description: newNotif.description,
          timestamp: newNotif.timestamp,
          read: newNotif.read,
          type: newNotif.type
        });
    } catch (e) {
      console.warn('Database write bypass.', e);
    }

    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updatedNotifs));
  };

  // Mark all notification items as read
  const markNotificationsAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('rgu_rpet_notifications', JSON.stringify(updated));

    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
    } catch (e) {
      console.warn('Database write bypass.', e);
    }
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
