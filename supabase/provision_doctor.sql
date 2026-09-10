-- =========================================================================
-- SEHATNAMA DOCTOR ACCOUNT PROVISIONING SQL SCRIPT
-- Run this in your Supabase Dashboard -> SQL Editor
-- =========================================================================
-- This script provides an authorized, secure mechanism to provision real
-- doctor accounts into Supabase Auth (auth.users) and public.profiles with role = 'doctor'.
--
-- Security:
-- 1. No public signup route exists for doctors.
-- 2. Passwords are encrypted using pgcrypto's crypt() with bcrypt salts.
-- 3. Email confirmation is automatically granted for provisioned physicians.
-- 4. Automatically assigns role = 'doctor' in public.profiles.
-- =========================================================================

-- Enable pgcrypto for password hashing if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to safely provision or update a doctor account
CREATE OR REPLACE FUNCTION public.provision_doctor(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_specialization TEXT DEFAULT 'General Physician',
  p_hospital TEXT DEFAULT 'SehatNama Medical Center',
  p_registration_no TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
  v_profile RECORD;
BEGIN
  -- 1. Validate inputs
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Doctor email is required';
  END IF;
  
  IF p_password IS NULL OR length(p_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters long';
  END IF;

  p_email := lower(trim(p_email));
  v_encrypted_pw := crypt(p_password, gen_salt('bf'));

  -- 2. Check if user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    -- Insert into auth.users with confirmed email
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      p_email,
      v_encrypted_pw,
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'full_name', p_full_name,
        'role', 'doctor',
        'specialization', p_specialization,
        'phone', p_phone
      ),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', p_email),
      'email',
      p_email,
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT DO NOTHING;
  ELSE
    -- Update existing user password and email confirmation
    UPDATE auth.users
    SET 
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
        'full_name', p_full_name,
        'role', 'doctor',
        'specialization', p_specialization,
        'phone', p_phone
      ),
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  -- 3. Insert or update public.profiles with role = 'doctor'
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    specialization,
    hospital,
    registration_no,
    phone,
    avatar_url,
    updated_at
  ) VALUES (
    v_user_id,
    p_email,
    p_full_name,
    'doctor',
    p_specialization,
    p_hospital,
    p_registration_no,
    p_phone,
    p_avatar_url,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = 'doctor',
    specialization = EXCLUDED.specialization,
    hospital = EXCLUDED.hospital,
    registration_no = EXCLUDED.registration_no,
    phone = EXCLUDED.phone,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  -- Return the created/updated profile data
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'status', 'success',
    'message', 'Doctor account provisioned successfully',
    'user_id', v_user_id,
    'email', p_email,
    'role', 'doctor',
    'full_name', v_profile.full_name,
    'specialization', v_profile.specialization,
    'hospital', v_profile.hospital
  );
END;
$$;

-- =========================================================================
-- EXAMPLE USAGE:
-- To provision a real doctor account, execute the function below:
-- =========================================================================
/*
SELECT public.provision_doctor(
  'doctor@sehatnama.in',            -- Doctor Email
  'Doctor@SecurePass2026',           -- Strong Password
  'Dr. Rajesh Kumar',               -- Doctor Full Name
  'Cardiology & Critical Care',     -- Specialization
  'AIIMS New Delhi',                -- Hospital / Organization
  'MCI-2019-84721',                 -- Medical Registration No
  '+91 98765 43210',                -- Phone Number
  NULL                              -- Avatar URL (optional)
);
*/
