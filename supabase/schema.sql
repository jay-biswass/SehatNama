-- ========================================================
-- SEHATNAMA SUPABASE DATABASE SCHEMA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROFILES TABLE
-- Stores user authentication profiles and roles
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 2. PATIENTS TABLE
-- Stores demographic and personal information for patients
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  age INTEGER,
  gender TEXT,
  mobile_number TEXT NOT NULL,
  email TEXT,
  location TEXT,
  blood_group TEXT,
  has_allergies TEXT,
  allergies TEXT,
  preferred_language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 3. CASES TABLE
-- Represents completed or ongoing medical consultation intake sessions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  chief_complaint TEXT NOT NULL,
  patient_description TEXT,
  priority_level TEXT DEFAULT 'normal' CHECK (priority_level IN ('normal', 'medium', 'high')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'submitted', 'waiting_for_doctor', 'under_review', 'completed')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 4. CASE_ANSWERS TABLE
-- Stores dynamic interview responses for each case
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT,
  question_type TEXT,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 5. DOCUMENTS TABLE
-- Metadata for medical documents stored in Supabase Storage
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  document_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 6. ALERTS TABLE
-- Stores high priority / red-flag alerts generated during intake
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  alert_type TEXT DEFAULT 'potential_priority_symptoms',
  priority TEXT DEFAULT 'high' CHECK (priority IN ('normal', 'medium', 'high')),
  message TEXT NOT NULL,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ
);

-- ========================================================
-- INDEXES FOR PERFORMANCE & REALTIME QUERYING
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_patients_mobile ON public.patients(mobile_number);
CREATE INDEX IF NOT EXISTS idx_cases_patient ON public.cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_case_answers_case ON public.case_answers(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON public.documents(case_id);
CREATE INDEX IF NOT EXISTS idx_alerts_case ON public.alerts(case_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated insert/select/update for public prototype mode
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on patients" ON public.patients FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on cases" ON public.cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on cases" ON public.cases FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on case_answers" ON public.case_answers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on case_answers" ON public.case_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on case_answers" ON public.case_answers FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on documents" ON public.documents FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on alerts" ON public.alerts FOR UPDATE USING (true);

-- ========================================================
-- STORAGE BUCKET CREATION (medical-documents)
-- ========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-documents', 'medical-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Storage Policy" ON storage.objects 
FOR ALL USING (bucket_id = 'medical-documents');
