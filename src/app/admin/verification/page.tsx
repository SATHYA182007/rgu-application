'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePortalState } from '@/hooks/usePortalState';
import { CandidateApplication, CandidateDocuments, ApplicationStatus } from '@/types';
import { toast } from 'sonner';
import { 
  FileCheck, 
  Check, 
  X, 
  User, 
  Eye, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function AdminVerificationWorkstation() {
  const searchParams = useSearchParams();
  const { candidates, adminVerifyApplication } = usePortalState();

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);

  // Verification Workstation form states
  const [docStatuses, setDocStatuses] = useState<Record<string, 'Verified' | 'Rejected' | 'Pending'>>({});
  const [docFeedbacks, setDocFeedbacks] = useState<Record<string, string>>({});
  const [overallStatus, setOverallStatus] = useState<ApplicationStatus>('Verified');
  const [committeeNotes, setCommitteeNotes] = useState('');

  // Load applicant matching URL query parameter ?appId=
  useEffect(() => {
    const appId = searchParams.get('appId');
    if (appId) {
      const match = candidates.find((c: CandidateApplication) => c.id === appId);
      if (match) {
        handleSelectCandidate(match);
      }
    } else if (candidates.length > 0 && !selectedCandidate) {
      // Default to first pending or submitted candidate
      const defaultCandidate = candidates.find((c: CandidateApplication) => c.status === 'Submitted' || c.status === 'Pending') || candidates[0];
      handleSelectCandidate(defaultCandidate);
    }
  }, [searchParams, candidates]);

  const handleSelectCandidate = (candidate: CandidateApplication) => {
    setSelectedCandidate(candidate);
    
    // Seed verification forms from active candidate values
    const statuses: Record<string, 'Verified' | 'Rejected' | 'Pending'> = {};
    const feedbacks: Record<string, string> = {};

    if (candidate.documents) {
      Object.keys(candidate.documents).forEach(k => {
        const key = k as keyof CandidateDocuments;
        const doc = candidate.documents[key];
        if (doc) {
          statuses[k] = doc.status;
          feedbacks[k] = doc.feedback || '';
        }
      });
    }

    setDocStatuses(statuses);
    setDocFeedbacks(feedbacks);
    setOverallStatus(candidate.status === 'Draft' || candidate.status === 'Submitted' ? 'Verified' : candidate.status);
    setCommitteeNotes(candidate.verificationNotes || '');
  };

  const handleDocStatusChange = (field: string, status: 'Verified' | 'Rejected') => {
    setDocStatuses(prev => ({
      ...prev,
      [field]: status
    }));
  };

  const handleFeedbackChange = (field: string, text: string) => {
    setDocFeedbacks(prev => ({
      ...prev,
      [field]: text
    }));
  };

  const handleUpdateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    // Save individual document comments/feedbacks directly back to candidate's documents
    const docKeys = Object.keys(selectedCandidate.documents);
    const resolvedDocs = { ...selectedCandidate.documents };

    docKeys.forEach(k => {
      const key = k as keyof CandidateDocuments;
      if (resolvedDocs[key]) {
        resolvedDocs[key] = {
          ...resolvedDocs[key]!,
          status: docStatuses[k] || 'Pending',
          feedback: docStatuses[k] === 'Rejected' ? docFeedbacks[k] : undefined
        };
      }
    });

    adminVerifyApplication(
      selectedCandidate.id,
      overallStatus,
      docStatuses as any,
      committeeNotes
    );

    // Deep merge updates in active local selections
    setSelectedCandidate((prev: CandidateApplication | null) => prev ? {
      ...prev,
      status: overallStatus,
      documents: resolvedDocs,
      verificationNotes: committeeNotes
    } : null);

    toast.success(`Verification logs locked for candidate reference: ${selectedCandidate.id}!`, {
      description: `New Application Status: ${overallStatus}`
    });
  };

  const documentKeys = [
    { key: 'passportPhoto', label: 'Passport Size Photograph' },
    { key: 'aadhaarCard', label: 'Aadhaar Card / ID Proof' },
    { key: 'degreeCertificate', label: 'Degree Certificate (UG/PG)' },
    { key: 'markSheets', label: 'Consolidated Mark Sheets' },
    { key: 'researchProposal', label: 'Proposed Research Proposal Synopsis' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5">
        <h1 className="font-outfit font-black text-2xl text-navy-950">Verification & Document Auditing Workbench</h1>
        <p className="text-xs font-semibold text-text-slate">Review applicant files, approve/reject certificates, and issue dynamic admission statuses.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column candidate listing - 4 cols */}
        <div className="lg:col-span-4 premium-card bg-white border border-border-slate p-6 space-y-5 shadow-sm h-[680px] flex flex-col">
          <div className="border-b border-border-slate/60 pb-3 flex items-center justify-between shrink-0">
            <h4 className="font-outfit font-extrabold text-xs text-navy-950 uppercase tracking-wider">Candidate Registry</h4>
            <span className="text-[10px] font-bold text-text-slate">{candidates.length} Registered</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
            {candidates.map((c: CandidateApplication) => {
              const active = selectedCandidate?.id === c.id;
              const isAuditNeeded = c.status === 'Submitted' || c.status === 'Pending';
              
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCandidate(c)}
                  className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                    active 
                      ? 'bg-navy-950 text-white border-navy-950 shadow-md shadow-navy-950/10' 
                      : 'bg-white border-border-slate hover:bg-surface-slate text-text-navy'
                  }`}
                >
                  <div>
                    <p className="font-outfit font-bold text-[13px]">{c.personalInfo?.firstName} {c.personalInfo?.lastName}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-white/60' : 'text-text-slate'}`}>{c.id} | {c.academicInfo?.researchDepartment}</p>
                  </div>

                  <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    c.status === 'Approved' 
                      ? 'bg-success-green/10 text-success-green border-success-green/20' 
                      : c.status === 'Rejected' 
                      ? 'bg-error-red/10 text-error-red border-error-red/20'
                      : isAuditNeeded
                      ? 'bg-blue-800/10 text-blue-800 border-blue-800/20'
                      : 'bg-surface-slate text-text-slate border-border-slate'
                  }`}>
                    {c.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column details and audits workbench - 8 cols */}
        {selectedCandidate ? (
          <form onSubmit={handleUpdateAudit} className="lg:col-span-8 space-y-6">
            
            {/* Scholar overview card */}
            <div className="premium-card bg-white border border-border-slate p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-border-slate/60 pb-3">
                <h3 className="font-outfit font-extrabold text-sm text-navy-950 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-blue-800" />
                  Applicant Overview
                </h3>
                <span className="font-mono text-xs font-bold text-navy-950 bg-surface-slate px-3 py-1 rounded-lg">{selectedCandidate.id}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs font-semibold text-text-slate">
                <div>
                  <span className="text-[10px] font-bold block uppercase tracking-wider">Candidate Name</span>
                  <p className="font-bold text-navy-950 mt-0.5">{selectedCandidate.personalInfo?.firstName} {selectedCandidate.personalInfo?.lastName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold block uppercase tracking-wider">Academic Qualification</span>
                  <p className="font-bold text-navy-950 mt-0.5">{selectedCandidate.academicInfo?.highestQualification} ({selectedCandidate.academicInfo?.percentageCgpa})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold block uppercase tracking-wider">Department Selection</span>
                  <p className="font-bold text-navy-950 mt-0.5">{selectedCandidate.academicInfo?.researchDepartment}</p>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-[10px] font-bold block uppercase tracking-wider">Proposed Research Proposal</span>
                  <p className="font-bold text-navy-950 mt-0.5 leading-relaxed">{selectedCandidate.academicInfo?.proposedResearchArea}</p>
                </div>
              </div>
            </div>

            {/* Document Verification checklist panels */}
            <div className="premium-card bg-white border border-border-slate p-6 space-y-5 shadow-sm">
              <h3 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
                <FileCheck className="w-4.5 h-4.5 text-blue-800" />
                Uploaded Documents Checklist
              </h3>

              <div className="space-y-4">
                {documentKeys.map((docItem) => {
                  const field = docItem.key as keyof CandidateDocuments;
                  const candidateDoc = selectedCandidate.documents?.[field];
                  const currentStatus = docStatuses[docItem.key] || 'Pending';

                  return (
                    <div key={docItem.key} className="p-4 rounded-xl border border-border-slate/85 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-navy-950">{docItem.label}</h4>
                          <p className="text-[10px] font-semibold text-text-slate truncate max-w-[250px] sm:max-w-[320px]">
                            {candidateDoc ? `File: ${candidateDoc.name}` : 'Not Uploaded'}
                          </p>
                        </div>

                        {candidateDoc ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={candidateDoc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-surface-slate text-text-navy hover:bg-border-slate rounded-lg border border-border-slate shrink-0 transition-colors"
                              title="Inspect File"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>

                            <div className="flex border border-border-slate rounded-lg overflow-hidden shrink-0">
                              <button
                                type="button"
                                onClick={() => handleDocStatusChange(docItem.key, 'Verified')}
                                className={`px-3 py-1.5 text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  currentStatus === 'Verified' 
                                    ? 'bg-success-green text-white shadow-sm' 
                                    : 'bg-white text-text-slate hover:bg-surface-slate'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDocStatusChange(docItem.key, 'Rejected')}
                                className={`px-3 py-1.5 text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  currentStatus === 'Rejected' 
                                    ? 'bg-error-red text-white shadow-sm' 
                                    : 'bg-white text-text-slate hover:bg-surface-slate'
                                }`}
                              >
                                <X className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-extrabold text-error-red uppercase bg-error-red/10 border border-error-red/20 px-2 py-0.5 rounded-full shrink-0">
                            Missing
                          </span>
                        )}
                      </div>

                      {/* Display feedback box if rejected */}
                      {currentStatus === 'Rejected' && (
                        <div className="pt-2">
                          <input
                            type="text"
                            placeholder="Provide rejection reason comments (e.g. Low resolution, incorrect transcript)..."
                            value={docFeedbacks[docItem.key] || ''}
                            onChange={(e) => handleFeedbackChange(docItem.key, e.target.value)}
                            className="w-full h-10 border border-error-red/40 rounded-lg px-3 text-[11px] font-semibold text-text-navy focus:outline-none focus:ring-4 focus:ring-error-red/5 bg-error-red/[0.01]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification decision selection */}
            <div className="premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
              <h3 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3.5">
                3. Committee Verification Decisions
              </h3>

              <div className="grid md:grid-cols-2 gap-5 text-xs font-bold text-text-slate">
                <div className="space-y-1.5">
                  <label>Commit Application Verification Status</label>
                  <select
                    value={overallStatus}
                    onChange={(e) => setOverallStatus(e.target.value as ApplicationStatus)}
                    className="w-full premium-input font-bold"
                  >
                    <option value="Verified">Verified (Pass Document Audit)</option>
                    <option value="Approved">Approved (Clear entrance examination eligibility)</option>
                    <option value="Rejected">Rejected (Requested reuploads)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label>Overall Auditing Committee Notes</label>
                  <input
                    type="text"
                    placeholder="Enter official audit remarks or corrective actions..."
                    value={committeeNotes}
                    onChange={(e) => setCommitteeNotes(e.target.value)}
                    className="w-full premium-input font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border-slate/60 flex items-center justify-between gap-4">
                <div className="p-3 bg-blue-800/5 border border-blue-800/10 rounded-xl flex gap-2 text-[10.5px] font-semibold text-text-slate leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                  Updating the verification locks candidate dashboard views and transmits notification reports.
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 bg-navy-950 hover:bg-blue-800 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Check className="w-4 h-4" />
                  Save Auditing Decision
                </button>
              </div>
            </div>

          </form>
        ) : (
          <div className="lg:col-span-8 premium-card bg-white border border-border-slate p-12 text-center space-y-4 shadow-sm h-[400px] flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-bg-slate text-text-slate flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy-950">Select Candidate for Auditing</p>
              <p className="text-[10px] font-semibold text-text-slate mt-1">Please select an applicant from the registry drawer to execute audit workstation functions.</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
