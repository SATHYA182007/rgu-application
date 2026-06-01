'use client';

import { useState } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { CandidateDocuments } from '@/types';
import { toast } from 'sonner';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  Download, 
  Eye, 
  AlertCircle 
} from 'lucide-react';

export default function CandidateDocumentsCabinet() {
  const { activeUser, saveActiveUserState } = usePortalState();
  const [uploadingField, setUploadingField] = useState<keyof CandidateDocuments | null>(null);

  if (!activeUser) return null;

  const docs = activeUser.documents || {};

  const handleSimulateReupload = (field: keyof CandidateDocuments, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);

    setTimeout(() => {
      const updatedDocs = { ...docs };
      
      updatedDocs[field] = {
        name: file.name,
        url: URL.createObjectURL(file),
        status: 'Pending' // resets back to pending upon reupload
      };

      // If application was rejected, check if we need to reset status to Submitted so admins know to re-evaluate!
      const statusReset = activeUser.status === 'Rejected' ? 'Submitted' : activeUser.status;

      const updatedUser = {
        ...activeUser,
        status: statusReset,
        documents: updatedDocs
      };

      saveActiveUserState(updatedUser);
      setUploadingField(null);
      toast.success(`${file.name} replaced successfully! Document queued for auditing.`);
    }, 1500);
  };

  const documentList = [
    { key: 'passportPhoto', label: 'Passport Size Photograph', desc: 'Recent high-resolution studio photo with a light background' },
    { key: 'aadhaarCard', label: 'Aadhaar Card / ID Proof', desc: 'Official government national identity card' },
    { key: 'degreeCertificate', label: 'Degree Certificate (UG/PG)', desc: 'Consolidated post-graduate degree scroll or provisional passing diploma' },
    { key: 'markSheets', label: 'Consolidated Mark Sheets', desc: 'Consolidated transcripts of all academic grading semesters' },
    { key: 'researchProposal', label: 'Proposed Research Proposal Synopsis', desc: '1500-word academic overview of methodology and research goals' }
  ];

  const statusIcons = {
    Verified: <CheckCircle className="w-5 h-5 text-success-green shrink-0" />,
    Rejected: <XCircle className="w-5 h-5 text-error-red shrink-0" />,
    Pending: <Clock className="w-5 h-5 text-text-slate shrink-0 animate-pulse" />
  };

  const statusBadges = {
    Verified: 'bg-success-green/10 text-success-green border-success-green/20',
    Rejected: 'bg-error-red/10 text-error-red border-error-red/20',
    Pending: 'bg-surface-slate text-text-slate border-border-slate'
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5">
        <h1 className="font-outfit font-black text-2xl text-navy-950">Academic Documents Cabinet</h1>
        <p className="text-xs font-semibold text-text-slate">Manage your uploaded transcripts and monitor audit statuses assigned by the university committee.</p>
      </div>

      {activeUser.status === 'Rejected' && (
        <div className="p-4 bg-error-red/5 border border-error-red/10 rounded-2xl flex gap-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-error-red shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-navy-950">Action Required: Document Rectification</p>
            <p className="text-text-slate text-[11px] leading-relaxed">
              Some documents did not meet verification criteria. Review the administrative notes in red and reupload rectified transcripts immediately.
            </p>
          </div>
        </div>
      )}

      {/* Document grid list */}
      <div className="space-y-4">
        {documentList.map((docItem) => {
          const field = docItem.key as keyof CandidateDocuments;
          const userDoc = docs[field];
          const isUploading = uploadingField === field;

          return (
            <div key={docItem.key} className="premium-card bg-white border border-border-slate p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-navy-950/15">
              
              {/* Document Info */}
              <div className="flex gap-4 items-start min-w-0">
                <div className="w-12 h-12 rounded-xl bg-surface-slate/80 border border-border-slate/50 text-navy-950 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="font-outfit font-bold text-[15px] text-navy-950 flex items-center gap-2.5">
                    {docItem.label}
                    {userDoc && (
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${statusBadges[userDoc.status as keyof typeof statusBadges]}`}>
                        {userDoc.status}
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] font-semibold text-text-slate leading-relaxed">{docItem.desc}</p>
                  
                  {userDoc && (
                    <p className="text-[10.5px] font-bold text-navy-950 truncate max-w-[300px] sm:max-w-[400px] mt-1 italic">
                      Uploaded File: {userDoc.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Status and Action Panel */}
              <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border-slate/60">
                
                {userDoc && (
                  <div className="flex items-center gap-1.5 md:mr-4">
                    {statusIcons[userDoc.status as keyof typeof statusIcons]}
                    <span className="text-xs font-bold text-navy-950 hidden sm:inline">
                      {userDoc.status === 'Verified' ? 'Approved' : userDoc.status === 'Rejected' ? 'Rejected' : 'Under Review'}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  {userDoc && (
                    <>
                      <a 
                        href={userDoc.url} 
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-surface-slate text-text-navy hover:bg-border-slate rounded-xl border border-border-slate transition-all"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a 
                        href={userDoc.url} 
                        download={userDoc.name}
                        className="p-2.5 bg-surface-slate text-text-navy hover:bg-border-slate rounded-xl border border-border-slate transition-all"
                        title="Download File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </>
                  )}

                  {(!userDoc || userDoc.status === 'Rejected' || activeUser.status !== 'Approved') && (
                    <label className="flex items-center gap-2 cursor-pointer bg-navy-950 text-white hover:bg-blue-800 py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all">
                      {isUploading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Replacing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          {userDoc ? 'Re-upload' : 'Upload'}
                        </>
                      )}
                      <input
                        type="file"
                        disabled={isUploading}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleSimulateReupload(field, e)}
                      />
                    </label>
                  )}
                </div>

              </div>

              {/* Display Feedback in case of Rejection */}
              {userDoc?.status === 'Rejected' && userDoc.feedback && (
                <div className="md:col-span-12 w-full mt-4 p-4 bg-error-red/5 border border-error-red/10 rounded-2xl flex gap-3 text-xs font-semibold text-error-red items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Administrative Rejection Feedback</p>
                    <p className="text-[11px] leading-relaxed italic text-text-navy">
                      " {userDoc.feedback} "
                    </p>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
