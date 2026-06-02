-- ==========================================
-- RGU RPET 2026 SUPABASE DATABASE SCHEMA
-- ==========================================

-- ------------------------------------------
-- 1. CLEANUP EXISTING TABLES (IF ANY)
-- ------------------------------------------
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS candidates;

-- ------------------------------------------
-- 2. CREATE CANDIDATES TABLE
-- ------------------------------------------
CREATE TABLE candidates (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft',
    progress_percent INTEGER NOT NULL DEFAULT 0,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_notes TEXT,
    personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    academic_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    identity_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    documents JSONB NOT NULL DEFAULT '{}'::jsonb,
    booked_slot JSONB DEFAULT NULL,
    mock_test_result JSONB DEFAULT NULL,
    mock_test_results JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------
-- 3. CREATE NOTIFICATIONS TABLE
-- ------------------------------------------
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    type TEXT NOT NULL DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------
-- 4. OPTIMIZED INDEXES FOR HIGH PERFORMANCE
-- ------------------------------------------
CREATE INDEX idx_candidates_email ON candidates(email);

-- ------------------------------------------
-- 5. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
-- ------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Candidates Table Policies
CREATE POLICY "Allow public read candidates" ON candidates 
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert candidates" ON candidates 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update candidates" ON candidates 
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete candidates" ON candidates 
    FOR DELETE USING (true);

-- Notifications Table Policies
CREATE POLICY "Allow public read notifications" ON notifications 
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert notifications" ON notifications 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update notifications" ON notifications 
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete notifications" ON notifications 
    FOR DELETE USING (true);

-- ------------------------------------------
-- 7. PRE-SEED SAMPLE CANDIDATES DATA
-- ------------------------------------------
INSERT INTO candidates (
    id, email, status, progress_percent, registration_date, otp_verified,
    personal_info, academic_info, identity_info, documents, booked_slot,
    mock_test_result, mock_test_results
) VALUES 
-- Aarav Sharma (Approved Applicant with 3 Mock Attempts)
(
    'RPET2026-000108',
    'aarav.sharma@gmail.com',
    'Approved',
    100,
    '2026-05-12',
    TRUE,
    '{
        "firstName": "Aarav",
        "lastName": "Sharma",
        "dob": "1998-04-12",
        "gender": "Male",
        "mobile": "+91 98765 43210",
        "email": "aarav.sharma@gmail.com"
    }'::jsonb,
    '{
        "highestQualification": "M.Tech Computer Science",
        "percentageCgpa": "9.2 CGPA",
        "schoolFaculty": "School of Engineering & Technology",
        "researchDepartment": "Computer Science",
        "proposedResearchArea": "Quantum Computing and Cryptography"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "3214-5678-9012",
        "category": "General"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "photo.jpg", "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "status": "Verified"},
        "aadhaarCard": {"name": "aadhaar.pdf", "url": "#", "status": "Verified"},
        "degreeCertificate": {"name": "mtech_degree.pdf", "url": "#", "status": "Verified"},
        "markSheets": {"name": "marksheets.pdf", "url": "#", "status": "Verified"},
        "researchProposal": {"name": "proposal.pdf", "url": "#", "status": "Verified"}
    }'::jsonb,
    '{
        "bookingId": "BOOK-2026-000108",
        "date": "2026-08-15",
        "time": "09:00 AM – 11:00 AM",
        "mode": "Online Proctored",
        "rescheduleCount": 0,
        "bookingHistory": []
    }'::jsonb,
    '{
        "score": 18,
        "accuracy": 90,
        "timeTaken": "34:10",
        "attemptDate": "2026-05-28",
        "categoryScores": {"researchAptitude": 5, "logicalReasoning": 5, "quantitativeAptitude": 4, "english": 4}
    }'::jsonb,
    '{
        "test1": {
            "score": 15,
            "accuracy": 75,
            "timeTaken": "38:20",
            "attemptDate": "2026-05-20",
            "categoryScores": {"researchAptitude": 3, "logicalReasoning": 4, "quantitativeAptitude": 4, "english": 4}
        },
        "test2": {
            "score": 17,
            "accuracy": 85,
            "timeTaken": "36:45",
            "attemptDate": "2026-05-24",
            "categoryScores": {"researchAptitude": 4, "logicalReasoning": 5, "quantitativeAptitude": 4, "english": 4}
        },
        "test3": {
            "score": 18,
            "accuracy": 90,
            "timeTaken": "34:10",
            "attemptDate": "2026-05-28",
            "categoryScores": {"researchAptitude": 5, "logicalReasoning": 5, "quantitativeAptitude": 4, "english": 4}
        }
    }'::jsonb
),
-- Ananya Iyer (Verified Applicant with Slot Booked)
(
    'RPET2026-000109',
    'ananya.iyer@yahoo.com',
    'Verified',
    100,
    '2026-05-14',
    TRUE,
    '{
        "firstName": "Ananya",
        "lastName": "Iyer",
        "dob": "1999-07-22",
        "gender": "Female",
        "mobile": "+91 87654 32109",
        "email": "ananya.iyer@yahoo.com"
    }'::jsonb,
    '{
        "highestQualification": "M.Sc Biotechnology",
        "percentageCgpa": "88.5%",
        "schoolFaculty": "School of Life Sciences",
        "researchDepartment": "Biotechnology",
        "proposedResearchArea": "CRISPR Cas9 Gene Editing in Cereal Crops"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "9876-5432-1098",
        "category": "General"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "ananya_photo.png", "url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "status": "Verified"},
        "aadhaarCard": {"name": "aadhaar_card.pdf", "url": "#", "status": "Verified"},
        "degreeCertificate": {"name": "msc_degree.pdf", "url": "#", "status": "Verified"},
        "markSheets": {"name": "marks.pdf", "url": "#", "status": "Verified"},
        "researchProposal": {"name": "gene_proposal.pdf", "url": "#", "status": "Verified"}
    }'::jsonb,
    '{
        "bookingId": "BOOK-2026-000109",
        "date": "2026-08-15",
        "time": "01:00 PM – 03:00 PM",
        "mode": "Online Proctored",
        "rescheduleCount": 0,
        "bookingHistory": []
    }'::jsonb,
    NULL,
    '{}'::jsonb
),
-- Kabir Verma (Pending Applicant)
(
    'RPET2026-000110',
    'kabir.verma@outlook.com',
    'Pending',
    100,
    '2026-05-18',
    TRUE,
    '{
        "firstName": "Kabir",
        "lastName": "Verma",
        "dob": "1997-11-05",
        "gender": "Male",
        "mobile": "+91 76543 21098",
        "email": "kabir.verma@outlook.com"
    }'::jsonb,
    '{
        "highestQualification": "MBA Finance",
        "percentageCgpa": "7.8 CGPA",
        "schoolFaculty": "School of Commerce & Management",
        "researchDepartment": "Management",
        "proposedResearchArea": "Sustainable FinTech in Rural Ecosystems"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "4567-8901-2345",
        "category": "OBC"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "kabir.jpg", "url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "status": "Pending"},
        "aadhaarCard": {"name": "id.pdf", "url": "#", "status": "Pending"},
        "degreeCertificate": {"name": "mba_cert.pdf", "url": "#", "status": "Pending"},
        "markSheets": {"name": "marks_all.pdf", "url": "#", "status": "Pending"},
        "researchProposal": {"name": "fintech_paper.pdf", "url": "#", "status": "Pending"}
    }'::jsonb,
    NULL,
    NULL,
    '{}'::jsonb
),
-- Riya Sen (Rejected Applicant with Notes)
(
    'RPET2026-000111',
    'riya.sen@gmail.com',
    'Rejected',
    100,
    '2026-05-20',
    TRUE,
    '{
        "firstName": "Riya",
        "lastName": "Sen",
        "dob": "1996-02-14",
        "gender": "Female",
        "mobile": "+91 65432 10987",
        "email": "riya.sen@gmail.com"
    }'::jsonb,
    '{
        "highestQualification": "M.Sc Agriculture",
        "percentageCgpa": "6.4 CGPA",
        "schoolFaculty": "School of Agricultural Sciences",
        "researchDepartment": "Agriculture",
        "proposedResearchArea": "Hydroponics Soil Replacements"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "1111-2222-3333",
        "category": "SC"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "riya.jpg", "url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", "status": "Rejected", "feedback": "Blurry photo, please reupload"},
        "aadhaarCard": {"name": "aadhaar.pdf", "url": "#", "status": "Verified"},
        "degreeCertificate": {"name": "degree.pdf", "url": "#", "status": "Verified"},
        "markSheets": {"name": "marks.pdf", "url": "#", "status": "Rejected", "feedback": "Marksheets of 1st and 2nd semesters are missing"},
        "researchProposal": {"name": "proposal.pdf", "url": "#", "status": "Verified"}
    }'::jsonb,
    NULL,
    NULL,
    '{}'::jsonb
);

-- Seed other applicants
INSERT INTO candidates (
    id, email, status, progress_percent, registration_date, otp_verified,
    personal_info, academic_info, identity_info, documents, booked_slot,
    mock_test_result
) VALUES
-- Aditya Nair (Approved with Slot Booked & 1 Mock Score)
(
    'RPET2026-000112',
    'aditya.nair@gmail.com',
    'Approved',
    100,
    '2026-05-22',
    TRUE,
    '{
        "firstName": "Aditya",
        "lastName": "Nair",
        "dob": "1998-09-30",
        "gender": "Male",
        "mobile": "+91 99988 87776",
        "email": "aditya.nair@gmail.com"
    }'::jsonb,
    '{
        "highestQualification": "M.Sc Data Science",
        "percentageCgpa": "9.5 CGPA",
        "schoolFaculty": "School of Computer Sciences",
        "researchDepartment": "Data Science",
        "proposedResearchArea": "Federated Learning in Healthcare Diagnostics"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "5432-1098-7654",
        "category": "General"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "photo_aditya.png", "url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", "status": "Verified"},
        "aadhaarCard": {"name": "aadhaar_card.pdf", "url": "#", "status": "Verified"},
        "degreeCertificate": {"name": "msc_degree.pdf", "url": "#", "status": "Verified"},
        "markSheets": {"name": "all_marks.pdf", "url": "#", "status": "Verified"},
        "researchProposal": {"name": "proposal_federated.pdf", "url": "#", "status": "Verified"}
    }'::jsonb,
    '{
        "bookingId": "BOOK-2026-000112",
        "date": "2026-08-15",
        "time": "11:00 AM – 01:00 PM",
        "mode": "Online Proctored",
        "rescheduleCount": 0,
        "bookingHistory": []
    }'::jsonb,
    '{
        "score": 19,
        "accuracy": 95,
        "timeTaken": "32:15",
        "attemptDate": "2026-05-29",
        "categoryScores": {"researchAptitude": 5, "logicalReasoning": 5, "quantitativeAptitude": 5, "english": 4}
    }'::jsonb
),
-- Meera Deshmukh (Pending Draft/Form)
(
    'RPET2026-000113',
    'meera.d@gmail.com',
    'Pending',
    100,
    '2026-05-25',
    TRUE,
    '{
        "firstName": "Meera",
        "lastName": "Deshmukh",
        "dob": "1997-03-18",
        "gender": "Female",
        "mobile": "+91 88877 76665",
        "email": "meera.d@gmail.com"
    }'::jsonb,
    '{
        "highestQualification": "M.Com",
        "percentageCgpa": "82%",
        "schoolFaculty": "School of Commerce & Management",
        "researchDepartment": "Commerce",
        "proposedResearchArea": "GST Compliance Impacts on Micro Enterprises"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "9898-7676-5454",
        "category": "OBC"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "meera.jpg", "url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", "status": "Pending"},
        "aadhaarCard": {"name": "aadhaar.pdf", "url": "#", "status": "Pending"},
        "degreeCertificate": {"name": "mcom.pdf", "url": "#", "status": "Pending"},
        "markSheets": {"name": "sheets.pdf", "url": "#", "status": "Pending"},
        "researchProposal": {"name": "proposal.pdf", "url": "#", "status": "Pending"}
    }'::jsonb,
    NULL,
    NULL
),
-- Sai Prasad (Pending Form)
(
    'RPET2026-000114',
    'sai.prasad@gmail.com',
    'Pending',
    100,
    '2026-05-26',
    TRUE,
    '{
        "firstName": "Sai",
        "lastName": "Prasad",
        "dob": "1995-12-12",
        "gender": "Male",
        "mobile": "+91 77766 65554",
        "email": "sai.prasad@gmail.com"
    }'::jsonb,
    '{
        "highestQualification": "M.Tech Electronics",
        "percentageCgpa": "8.4 CGPA",
        "schoolFaculty": "School of Engineering & Technology",
        "researchDepartment": "Engineering",
        "proposedResearchArea": "VLSI Architectures for Neuromorphic Chips"
    }'::jsonb,
    '{
        "nationality": "Indian",
        "aadhaarId": "4444-5555-6666",
        "category": "ST"
    }'::jsonb,
    '{
        "passportPhoto": {"name": "sai_photo.jpg", "url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", "status": "Pending"},
        "aadhaarCard": {"name": "aadhaar.pdf", "url": "Pending"},
        "degreeCertificate": {"name": "mtech.pdf", "url": "Pending"},
        "markSheets": {"name": "marks.pdf", "url": "Pending"},
        "researchProposal": {"name": "proposal.pdf", "url": "Pending"}
    }'::jsonb,
    NULL,
    NULL
);

-- ------------------------------------------
-- 8. PRE-SEED NOTIFICATIONS
-- ------------------------------------------
INSERT INTO notifications (id, candidate_id, title, description, timestamp, read, type) VALUES 
('n1', NULL, 'Admission Portal Open', 'RGU RPET 2026 Applications are now officially open. Submit yours before registration closes.', '2026-05-01 10:00 AM', FALSE, 'info'),
('n2', NULL, 'Interactive Mock Test Active', 'Candidates can now attempt the official research syllabus mock test simulator from their dashboards.', '2026-05-15 02:00 PM', FALSE, 'success');
