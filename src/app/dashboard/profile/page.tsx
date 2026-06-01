'use client';

import { useState, useEffect } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { PersonalInfo, AcademicInfo, IdentityInfo } from '@/types';
import { toast } from 'sonner';
import { Save, Lock, UserCheck, GraduationCap, Shield } from 'lucide-react';

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

export default function CandidateProfile() {
  const { activeUser, saveActiveUserState } = usePortalState();

  const isLocked = activeUser?.status !== 'Draft';

  // Unconditional hook declarations at the top level
  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    mobile: '',
    email: ''
  });

  const [academic, setAcademic] = useState<AcademicInfo>({
    highestQualification: '',
    percentageCgpa: '',
    schoolFaculty: '',
    researchDepartment: '',
    proposedResearchArea: ''
  });

  const [identity, setIdentity] = useState<IdentityInfo>({
    nationality: 'Indian',
    aadhaarId: '',
    category: ''
  });

  // Synchronize state when activeUser becomes available
  useEffect(() => {
    if (activeUser) {
      setPersonal({
        firstName: activeUser.personalInfo?.firstName || '',
        lastName: activeUser.personalInfo?.lastName || '',
        dob: activeUser.personalInfo?.dob || '',
        gender: activeUser.personalInfo?.gender || '',
        mobile: activeUser.personalInfo?.mobile || '',
        email: activeUser.personalInfo?.email || ''
      });
      setAcademic({
        highestQualification: activeUser.academicInfo?.highestQualification || '',
        percentageCgpa: activeUser.academicInfo?.percentageCgpa || '',
        schoolFaculty: activeUser.academicInfo?.schoolFaculty || '',
        researchDepartment: activeUser.academicInfo?.researchDepartment || '',
        proposedResearchArea: activeUser.academicInfo?.proposedResearchArea || ''
      });
      setIdentity({
        nationality: activeUser.identityInfo?.nationality || 'Indian',
        aadhaarId: activeUser.identityInfo?.aadhaarId || '',
        category: activeUser.identityInfo?.category || '',
        proofType: activeUser.identityInfo?.proofType || '',
        proofNumber: activeUser.identityInfo?.proofNumber || '',
        proofDocumentName: activeUser.identityInfo?.proofDocumentName || '',
        proofDocumentUrl: activeUser.identityInfo?.proofDocumentUrl || '',
        verificationStatus: activeUser.identityInfo?.verificationStatus || 'Pending',
        issueCountry: activeUser.identityInfo?.issueCountry || '',
        uploadedAt: activeUser.identityInfo?.uploadedAt || '',
        passportNumber: activeUser.identityInfo?.passportNumber || '',
        visaNumber: activeUser.identityInfo?.visaNumber || '',
        doc1Name: activeUser.identityInfo?.doc1Name || '',
        doc1Url: activeUser.identityInfo?.doc1Url || '',
        doc2Name: activeUser.identityInfo?.doc2Name || '',
        doc2Url: activeUser.identityInfo?.doc2Url || ''
      });
    }
  }, [activeUser]);

  // Conditional early return safely placed AFTER hook declarations
  if (!activeUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-navy-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error('Profile Locked', {
        description: 'You cannot edit profile fields since your documents have been verified.'
      });
      return;
    }

    // Save profile to state
    const updatedUser = {
      ...activeUser,
      personalInfo: personal,
      academicInfo: academic,
      identityInfo: identity
    };

    saveActiveUserState(updatedUser);
    toast.success('Profile details updated successfully!');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-black text-2xl text-navy-950">Candidate Information Profile</h1>
          <p className="text-xs font-semibold text-text-slate">Review and manage your personal, academic, and identity information records.</p>
        </div>

        {isLocked && (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase bg-success-green/10 text-success-green border border-success-green/20 px-3.5 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            Profile Verified & Locked
          </span>
        )}
      </div>

      {isLocked && (
        <div className="p-4 bg-success-green/5 border border-success-green/10 rounded-2xl flex gap-3 text-xs font-semibold">
          <UserCheck className="w-5 h-5 text-success-green shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-navy-950">Administrative Verification Verified</p>
            <p className="text-text-slate text-[11px] leading-relaxed">
              Your profile records have been matched against uploaded documents and verified. For any corrective updates, contact the university registrar support office directly.
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Step 1: Personal Details */}
        <div className="premium-card bg-white border border-border-slate space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/60 pb-4">
            <div className="w-8 h-8 rounded-lg bg-navy-950/5 text-navy-950 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">1. Personal Information</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>First Name</label>
              <input
                type="text"
                disabled={isLocked}
                value={personal.firstName}
                onChange={(e) => setPersonal((prev: PersonalInfo) => ({ ...prev, firstName: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Last Name</label>
              <input
                type="text"
                disabled={isLocked}
                value={personal.lastName}
                onChange={(e) => setPersonal((prev: PersonalInfo) => ({ ...prev, lastName: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Date of Birth</label>
              <input
                type="date"
                disabled={isLocked}
                value={personal.dob}
                onChange={(e) => setPersonal((prev: PersonalInfo) => ({ ...prev, dob: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold pt-2"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Gender</label>
              <select
                disabled={isLocked}
                value={personal.gender}
                onChange={(e) => setPersonal((prev: PersonalInfo) => ({ ...prev, gender: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Mobile Number</label>
              <input
                type="text"
                disabled={isLocked}
                value={personal.mobile}
                onChange={(e) => setPersonal((prev: PersonalInfo) => ({ ...prev, mobile: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Email Address</label>
              <input
                type="email"
                disabled={isLocked}
                value={personal.email}
                onChange={(e) => setPersonal((prev: PersonalInfo) => ({ ...prev, email: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Academic Information */}
        <div className="premium-card bg-white border border-border-slate space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/60 pb-4">
            <div className="w-8 h-8 rounded-lg bg-navy-950/5 text-navy-950 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">2. Academic Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Highest Qualification</label>
              <input
                type="text"
                disabled={isLocked}
                value={academic.highestQualification}
                onChange={(e) => setAcademic((prev: AcademicInfo) => ({ ...prev, highestQualification: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Percentage / CGPA Score</label>
              <input
                type="text"
                disabled={isLocked}
                value={academic.percentageCgpa}
                onChange={(e) => setAcademic((prev: AcademicInfo) => ({ ...prev, percentageCgpa: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>School / Faculty</label>
              <select
                disabled={isLocked}
                value={academic.schoolFaculty}
                onChange={(e) => setAcademic((prev: AcademicInfo) => ({ ...prev, schoolFaculty: e.target.value, researchDepartment: '' }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              >
                <option value=""></option>
                {Object.keys(SCHOOLS_WITH_DEPTS).map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Research Department</label>
              <select
                disabled={isLocked || !academic.schoolFaculty}
                value={academic.researchDepartment}
                onChange={(e) => setAcademic((prev: AcademicInfo) => ({ ...prev, researchDepartment: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              >
                <option value=""></option>
                {(SCHOOLS_WITH_DEPTS[academic.schoolFaculty] || []).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate md:col-span-2">
              <label>Proposed Research Area</label>
              <input
                type="text"
                disabled={isLocked}
                value={academic.proposedResearchArea}
                onChange={(e) => setAcademic((prev: AcademicInfo) => ({ ...prev, proposedResearchArea: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Identity Information */}
        <div className="premium-card bg-white border border-border-slate space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/60 pb-4">
            <div className="w-8 h-8 rounded-lg bg-navy-950/5 text-navy-950 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">3. Identity Verification</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Nationality</label>
              <input
                type="text"
                disabled={isLocked}
                value={identity.nationality}
                onChange={(e) => setIdentity((prev: IdentityInfo) => ({ ...prev, nationality: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Social Category Group</label>
              <select
                disabled={isLocked}
                value={identity.category}
                onChange={(e) => setIdentity((prev: IdentityInfo) => ({ ...prev, category: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              >
                <option value="General">General Category</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>
            <div className="space-y-1.5 text-xs font-bold text-text-slate">
              <label>Aadhaar / National ID</label>
              <input
                type="text"
                disabled={isLocked}
                value={identity.aadhaarId}
                onChange={(e) => setIdentity((prev: IdentityInfo) => ({ ...prev, aadhaarId: e.target.value }))}
                className="w-full premium-input disabled:bg-bg-slate disabled:text-text-slate disabled:border-border-slate font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        {!isLocked && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-navy-950 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        )}

      </form>

    </div>
  );
}
