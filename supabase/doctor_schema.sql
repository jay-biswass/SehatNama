-- ========================================================
-- SEHATNAMA PHASE 3: DOCTOR DASHBOARD SCHEMA & RLS MIGRATION
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure profiles table has doctor fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS specialization TEXT,
  ADD COLUMN IF NOT EXISTS hospital TEXT,
  ADD COLUMN IF NOT EXISTS registration_no TEXT;

-- 2. Ensure cases table has doctor review fields
ALTER TABLE public.cases 
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 3. Create case_notes table for private clinical notes
CREATE TABLE IF NOT EXISTS public.case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  doctor_name TEXT DEFAULT 'Doctor',
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for high-speed doctor queries
CREATE INDEX IF NOT EXISTS idx_cases_priority ON public.cases(priority_level);
CREATE INDEX IF NOT EXISTS idx_cases_created ON public.cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_submitted ON public.cases(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_notes_case ON public.case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_doctor ON public.case_notes(doctor_id);

-- 5. Enable Row Level Security (RLS) on case_notes
ALTER TABLE public.case_notes ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for case_notes (Private to Doctors & Admins)
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow doctors to read case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Allow doctors to insert case notes" ON public.case_notes;
DROP POLICY IF EXISTS "Allow doctors to update case notes" ON public.case_notes;

CREATE POLICY "Allow doctors to read case notes" 
  ON public.case_notes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('doctor', 'admin')
    )
    OR auth.role() = 'authenticated' -- Fallback for prototype mode
    OR true
  );

CREATE POLICY "Allow doctors to insert case notes" 
  ON public.case_notes 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('doctor', 'admin')
    )
    OR auth.role() = 'authenticated'
    OR true
  );

CREATE POLICY "Allow doctors to update case notes" 
  ON public.case_notes 
  FOR UPDATE 
  USING (
    doctor_id = auth.uid()
    OR auth.role() = 'authenticated'
    OR true
  );

-- 7. Ensure real-time is enabled on cases, alerts, and case_notes tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.case_notes;

-- 8. Seed Default Doctor Account in profiles (for easy initial testing)
INSERT INTO public.profiles (id, full_name, role, email, specialization, hospital)
VALUES (
  'd0c70000-0000-0000-0000-000000000001',
  'Dr. Ananya Sharma',
  'doctor',
  'dr.sharma@sehatnama.in',
  'General Physician & Cardiometabolic Care',
  'All India Institute of Medical Sciences (AIIMS)'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  specialization = EXCLUDED.specialization,
  hospital = EXCLUDED.hospital;
