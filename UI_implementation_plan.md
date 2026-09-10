# SehatNama — Complete Visual UI/UX Redesign

A visual-only redesign transforming SehatNama into a premium, modern, minimal healthcare SaaS product. Zero changes to business logic, authentication, Supabase, routing, or data flow.

## Design Direction

**Visual language:** Subtle glassmorphism + soft neumorphism + minimal modern SaaS
**Inspiration:** Apple Health, Linear, Vercel, premium clinical software
**Feeling:** Calm, trustworthy, medical, spacious, professional

---

## Color System

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#f6f8fb` | Page background (cool off-white) |
| `--bg-elevated` | `#ffffff` | Cards, panels |
| `--bg-glass` | `rgba(255,255,255,0.65)` | Glass surfaces |
| `--primary` | `#0f766e` (teal-700) | Primary actions, active states |
| `--primary-soft` | `#f0fdfa` | Primary tint backgrounds |
| `--text-primary` | `#1e293b` (slate-800) | Headings |
| `--text-secondary` | `#64748b` (slate-500) | Body/secondary |
| `--text-muted` | `#94a3b8` (slate-400) | Metadata |
| `--border` | `rgba(148,163,184,0.2)` | Subtle borders |
| `--border-strong` | `rgba(148,163,184,0.35)` | Emphasized borders |
| `--shadow-soft` | `0 1px 3px rgba(0,0,0,0.04)` | Subtle elevation |
| `--shadow-card` | `0 4px 16px rgba(0,0,0,0.04)` | Card elevation |
| `--radius-sm` | `8px` | Buttons, badges |
| `--radius-md` | `12px` | Cards, inputs |
| `--radius-lg` | `16px` | Panels, modals |

**Semantic colors (all muted):**
- Success: `#059669` / bg `#ecfdf5`
- Warning: `#d97706` / bg `#fffbeb`  
- Danger: `#dc2626` / bg `#fef2f2`
- Info: `#2563eb` / bg `#eff6ff`

---

## Proposed Changes

### Phase 1 — Global Design Tokens & Base Styles

#### [MODIFY] [index.css](file:///d:/SehatNama/SehatNama/src/index.css)
- Replace existing `@theme` with comprehensive design token system
- Add glass, neumorphic, and surface utility classes
- Refine animations (subtler, faster)
- Add skeleton loader keyframes
- Update scrollbar styling
- Keep Inter/Outfit fonts

---

### Phase 2 — Shared UI Components

#### [MODIFY] [Button.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Button.jsx)
- Refined radius (`rounded-lg` instead of `rounded-xl`)
- Subtle shadow + soft press animation (`active:translate-y-px`)
- Add `outline` variant for secondary glass style
- Consistent 40px height for `md`, 36px for `sm`, 48px for `lg`

#### [MODIFY] [Card.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Card.jsx)
- Softer border (`border-[var(--border)]`)
- Refined shadow (`shadow-card`)
- Moderate radius (`rounded-xl` → stays, but less aggressive rounding)
- Add glass variant prop

#### [MODIFY] [TextInput.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/TextInput.jsx)
- Lighter background (`bg-slate-50/50`)
- Softer border, refined focus glow
- Consistent height

#### [MODIFY] [SelectInput.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/SelectInput.jsx)
- Match TextInput styling

#### [MODIFY] [Badge.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Badge.jsx)
- Smaller, more restrained
- Subtle tinted backgrounds with semantic dot

#### [MODIFY] [Alert.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Alert.jsx)
- Softer backgrounds, thinner borders
- More compact

#### [MODIFY] [Modal.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Modal.jsx)
- Glass surface with backdrop blur
- Refined shadow and border

#### [MODIFY] [Toast.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Toast.jsx)
- Modern SaaS notification style
- Compact, glass surface

#### [MODIFY] [Loader.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Loader.jsx)
- Minimal spinner, refined colors

#### [MODIFY] [Checkbox.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/Checkbox.jsx)
- Softer selected state

#### [MODIFY] [RadioGroup.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/RadioGroup.jsx)
- Softer selected state, refined borders

#### [MODIFY] [FormSection.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/FormSection.jsx)
- Refined typography hierarchy

#### [MODIFY] [ValidationMessage.jsx](file:///d:/SehatNama/SehatNama/src/components/ui/ValidationMessage.jsx)
- Softer styling

---

### Phase 3 — Layouts & Navigation

#### [MODIFY] [AppLayout.jsx](file:///d:/SehatNama/SehatNama/src/components/layout/AppLayout.jsx)
- Full viewport layout (no narrow centered container with giant margins)
- Sensible max-width for content, but full-screen shell
- Use `100dvh` for the outer container
- Subtle background treatment

#### [MODIFY] [PageContainer.jsx](file:///d:/SehatNama/SehatNama/src/components/layout/PageContainer.jsx)
- Wider content area with proper max-width
- Consistent padding

#### [MODIFY] [PatientLayout.jsx](file:///d:/SehatNama/SehatNama/src/components/layout/PatientLayout.jsx)
- Refined patient info bar (more subtle, glass-like)

#### [MODIFY] [Header.jsx](file:///d:/SehatNama/SehatNama/src/components/navigation/Header.jsx)
- Glass navbar with backdrop blur
- Minimal, premium feel
- Clean active states

#### [MODIFY] [ProgressBar.jsx](file:///d:/SehatNama/SehatNama/src/components/navigation/ProgressBar.jsx)
- Thin segmented progress line with step dots
- Clear active step, muted completed steps
- Elegant step labels

#### [MODIFY] [DoctorLayout.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/DoctorLayout.jsx)
- Full viewport SaaS layout
- Refined background

#### [MODIFY] [DoctorHeader.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/DoctorHeader.jsx)
- Premium glass header bar
- Clean profile section

#### [MODIFY] [DoctorSidebar.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/DoctorSidebar.jsx)
- Minimal dark sidebar
- Subtle active states (soft tinted background, not huge colorful pills)
- Clean nav items with outline icons

---

### Phase 4 — Patient Auth Screens

#### [MODIFY] [PatientLogin.jsx](file:///d:/SehatNama/SehatNama/src/pages/auth/PatientLogin.jsx)
- Full viewport layout
- Glass card on subtle background
- Refined form inputs
- Premium button

#### [MODIFY] [PatientSignup.jsx](file:///d:/SehatNama/SehatNama/src/pages/auth/PatientSignup.jsx)
- Same visual system as login

#### [MODIFY] [ForgotPassword.jsx](file:///d:/SehatNama/SehatNama/src/pages/auth/ForgotPassword.jsx)
- Same visual system

#### [MODIFY] [DoctorLogin.jsx](file:///d:/SehatNama/SehatNama/src/pages/doctor/DoctorLogin.jsx)
- Dark variant using same design system
- Premium clinical feel

---

### Phase 5 — Patient Screens

#### [MODIFY] [Welcome.jsx](file:///d:/SehatNama/SehatNama/src/pages/Welcome.jsx)
- Full viewport hero with SehatNama logo
- Spacious, calm, inviting
- Clear CTA hierarchy

#### [MODIFY] [CheckIn.jsx](file:///d:/SehatNama/SehatNama/src/pages/CheckIn.jsx)
- Clean form layout
- Refined inputs

#### [MODIFY] [Language.jsx](file:///d:/SehatNama/SehatNama/src/pages/Language.jsx)
- Clean language selection cards

#### [MODIFY] [PatientDetails.jsx](file:///d:/SehatNama/SehatNama/src/pages/PatientDetails.jsx)
- Refined form with proper spacing

#### [MODIFY] [Consent.jsx](file:///d:/SehatNama/SehatNama/src/pages/Consent.jsx)
- Clean consent layout

#### [MODIFY] [ConcernSelection.jsx](file:///d:/SehatNama/SehatNama/src/pages/ConcernSelection.jsx)
- Elegant concern cards (minimal icon, title, description)
- Subtle selected state

#### [MODIFY] [Interview.jsx](file:///d:/SehatNama/SehatNama/src/pages/Interview.jsx)
- Premium guided interview experience
- Large question as visual focus
- Spacious whitespace

#### [MODIFY] [Question.jsx](file:///d:/SehatNama/SehatNama/src/pages/Question.jsx)
- Clean question presentation

#### [MODIFY] [PriorityAlert.jsx](file:///d:/SehatNama/SehatNama/src/pages/PriorityAlert.jsx)
- Calm but clear priority indication

#### [MODIFY] [Documents.jsx](file:///d:/SehatNama/SehatNama/src/pages/Documents.jsx)
- Minimal upload dropzone
- Clean file previews

#### [MODIFY] [Review.jsx](file:///d:/SehatNama/SehatNama/src/pages/Review.jsx)
- Clean review sections with proper typography hierarchy

#### [MODIFY] [Success.jsx](file:///d:/SehatNama/SehatNama/src/pages/Success.jsx)
- Calm success state

#### [MODIFY] [PatientDashboard.jsx](file:///d:/SehatNama/SehatNama/src/pages/patient/PatientDashboard.jsx)
- Full viewport dashboard
- Glass stats cards
- Clean case list
- Clear action hierarchy

---

### Phase 6 — Doctor Screens

#### [MODIFY] [DoctorDashboard.jsx](file:///d:/SehatNama/SehatNama/src/pages/doctor/DoctorDashboard.jsx)
- Professional clinical workspace
- Refined stat cards
- Clean case queue

#### [MODIFY] [DoctorCases.jsx](file:///d:/SehatNama/SehatNama/src/pages/doctor/DoctorCases.jsx)
- Modern table with subtle row separators
- Clean filters

#### [MODIFY] [DoctorCaseDetails.jsx](file:///d:/SehatNama/SehatNama/src/pages/doctor/DoctorCaseDetails.jsx)
- Clean case detail layout
- Proper information hierarchy

#### [MODIFY] [DoctorProfile.jsx](file:///d:/SehatNama/SehatNama/src/pages/doctor/DoctorProfile.jsx)
- Premium profile page

#### [MODIFY] [DashboardStats.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/DashboardStats.jsx)
- Restrained stat cards (no excessive rounded corners or shadows)

#### [MODIFY] [CaseTable.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/CaseTable.jsx)
- Modern lightweight table

#### [MODIFY] [CaseCard.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/CaseCard.jsx)
- Clean case card

#### [MODIFY] [CaseFilters.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/CaseFilters.jsx)
- Minimal filter controls

#### [MODIFY] [StatusBadge.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/StatusBadge.jsx)
- Unified restrained badge

#### [MODIFY] [PriorityBadge.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/PriorityBadge.jsx)
- Unified restrained badge

#### [MODIFY] [PatientInfoCard.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/PatientInfoCard.jsx)
- Clean info presentation

#### [MODIFY] [DoctorNotes.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/DoctorNotes.jsx)
- Refined notes UI

#### [MODIFY] [InterviewAnswers.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/InterviewAnswers.jsx)
- Clean answer display

#### [MODIFY] [MedicalDocuments.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/MedicalDocuments.jsx)
- Clean document display

#### [MODIFY] [PriorityIndicators.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/PriorityIndicators.jsx)
- Restrained indicators

#### [MODIFY] [RealtimeToast.jsx](file:///d:/SehatNama/SehatNama/src/components/doctor/RealtimeToast.jsx)
- Modern notification toast

---

### Phase 7 — Interview Components

#### [MODIFY] [InterviewHeader.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/InterviewHeader.jsx)
- Subtle, premium interview header

#### [MODIFY] [DynamicQuestion.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/DynamicQuestion.jsx)
- Clean question display

#### [MODIFY] [AnswerInput.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/AnswerInput.jsx)
- Refined answer controls

#### [MODIFY] [AnswerOption.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/AnswerOption.jsx)
- Clean option styling

#### [MODIFY] [AssistantAvatar.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/AssistantAvatar.jsx)
- Minimal avatar

#### [MODIFY] [AssistantMessage.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/AssistantMessage.jsx)
- Clean message bubble

#### [MODIFY] [QuestionCard.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/QuestionCard.jsx)
- Refined question card

#### [MODIFY] [VoiceButton.jsx](file:///d:/SehatNama/SehatNama/src/components/interview/VoiceButton.jsx)
- Premium voice button

---

### Phase 8 — Review & Document Components

#### [MODIFY] [ReviewCard.jsx](file:///d:/SehatNama/SehatNama/src/components/review/ReviewCard.jsx)
- Clean review card

#### [MODIFY] [ReviewSection.jsx](file:///d:/SehatNama/SehatNama/src/components/review/ReviewSection.jsx)
- Refined section layout

#### [MODIFY] [EditButton.jsx](file:///d:/SehatNama/SehatNama/src/components/review/EditButton.jsx)
- Minimal edit button

#### [MODIFY] [DocumentUploader.jsx](file:///d:/SehatNama/SehatNama/src/components/documents/DocumentUploader.jsx)
- Minimal upload dropzone

#### [MODIFY] [UploadedDocumentCard.jsx](file:///d:/SehatNama/SehatNama/src/components/documents/UploadedDocumentCard.jsx)
- Clean document card

#### [MODIFY] [DocumentTypeCard.jsx](file:///d:/SehatNama/SehatNama/src/components/documents/DocumentTypeCard.jsx)
- Refined type card

#### [MODIFY] [ExtractedDataCard.jsx](file:///d:/SehatNama/SehatNama/src/components/documents/ExtractedDataCard.jsx)
- Clean extracted data display

#### [MODIFY] [OCRProcessing.jsx](file:///d:/SehatNama/SehatNama/src/components/documents/OCRProcessing.jsx)
- Refined processing state

---

### Phase 9 — Protected Routes (Loading/Error States)

#### [MODIFY] [DoctorProtectedRoute.jsx](file:///d:/SehatNama/SehatNama/src/components/auth/DoctorProtectedRoute.jsx)
- Refined loading and access-denied screens

#### [MODIFY] [PatientProtectedRoute.jsx](file:///d:/SehatNama/SehatNama/src/components/auth/PatientProtectedRoute.jsx)
- Refined loading and redirect screens

---

## What Will NOT Change

- Supabase configuration, schema, queries, RLS policies
- Authentication logic (signIn, signUp, signOut, role verification)
- Route paths and routing logic
- Patient/doctor workflow sequence
- Case submission, symptom/question, document upload logic
- All services (patientService, caseService, doctorService, etc.)
- State management (AuthContext, PatientContext)
- API calls and data models
- Form validation behavior

---

## Verification Plan

### Build Verification
- Run `npx vite build` — must pass with zero errors

### Functional Verification
1. Visit every patient route (Welcome → CheckIn → ... → Success)
2. Visit patient login/signup/forgot-password
3. Visit patient dashboard
4. Visit doctor login
5. Visit doctor dashboard, cases, case details, profile
6. Confirm Supabase data is still displayed correctly
7. Confirm authentication flows work unchanged
8. Confirm responsive behavior on mobile viewport

### Visual Verification
- Generate browser screenshots of major redesigned screens
