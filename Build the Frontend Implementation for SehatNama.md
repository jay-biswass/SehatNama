# Build the Frontend Implementation for SehatNama

You are a senior ReactJS frontend engineer.

Build a complete, production-quality frontend implementation for an AI-powered healthcare application called **SehatNama**.

The UI design and user experience should follow the previously created SehatNama patient-side design.

Your responsibility is to transform the design into a clean, scalable, responsive **ReactJS frontend architecture**.

---

# PRODUCT CONTEXT

## Application Name

**SehatNama**

## Tagline

**Your health story, understood.**

## What the Product Does

SehatNama is an AI-powered **Patient Case-Taking System** designed for hospitals and healthcare centers in India.

Before meeting a doctor, patients interact with the application through a simple multilingual interface.

The system allows patients to:

- Describe their health problem
- Speak in their preferred language
- Answer AI-generated follow-up questions
- Provide information using voice or touch
- Upload previous prescriptions and medical reports
- Review extracted medical information
- Detect potential emergency red flags
- Review their collected health information
- Submit their case to a doctor

The frontend should simulate this complete workflow.

---

# TECH STACK

Build using:

- ReactJS
- JavaScript
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React for icons

Do NOT use TypeScript unless absolutely necessary.

Use modern React best practices.

Use:

- Functional components
- React Hooks
- Reusable components
- Clean folder architecture
- Component composition
- Centralized mock data where appropriate

---

# IMPORTANT: FRONTEND ONLY

This is currently a frontend prototype.

Do NOT build a real backend.

Do NOT implement:

- Real authentication
- Real ABHA integration
- Real AI APIs
- Real speech recognition
- Real OCR
- Real database
- Real emergency notifications

Instead, simulate all functionality using:

- Mock data
- React state
- Fake API/service files if needed
- Loading states
- Interactive UI transitions

The frontend should look and behave like a realistic working application.

---

# DESIGN SYSTEM

Maintain the same visual direction as the SehatNama UI design.

## DESIGN PERSONALITY

The UI should feel:

- Modern
- Clean
- Premium
- Trustworthy
- Calm
- Human-centered
- Accessible
- Healthcare-focused
- AI-powered but not intimidating

Avoid:

- Cyberpunk designs
- Excessive gradients
- Dark mode
- Overly flashy animations
- Cluttered interfaces

---

# COLOR SYSTEM

Use a modern healthcare palette.

### Primary

Deep healthcare teal / blue-green.

### Background

Clean white.

### Secondary Background

Very light cool gray.

### Positive

Soft green or mint.

### Warning

Warm amber.

### Critical Alert

Red.

### Text

Dark navy or charcoal.

Use colors consistently throughout the application.

Create reusable color tokens through Tailwind configuration or CSS variables.

---

# TYPOGRAPHY

Use a clean modern sans-serif font.

Prioritize:

- Large headings
- Clear body text
- Accessible font sizes
- High contrast

Avoid tiny text.

The application should be comfortable for:

- Elderly users
- First-time users
- Less technically experienced patients

---

# RESPONSIVE DESIGN

The application should be designed primarily for:

1. Hospital kiosk
2. Tablet
3. Mobile

Use responsive layouts.

The interface should look excellent on:

- Desktop
- Tablet
- Mobile

---

# APPLICATION ROUTES

Create the following routes.

```text
/
```

Welcome Page

```text
/check-in
```

Patient Identification

```text
/language
```

Language Selection

```text
/consent
```

Consent & Privacy

```text
/interview
```

AI Health Interview

```text
/interview/question/:id
```

Adaptive Follow-up Questions

```text
/priority-alert
```

Priority Medical Alert

```text
/documents
```

Medical Document Upload

```text
/review
```

Review & Submit

```text
/success
```

Submission Success Page

---

# COMPLETE APPLICATION FLOW

```text
Welcome
   ↓
Patient Identification
   ↓
Language Selection
   ↓
Consent
   ↓
AI Health Interview
   ↓
Adaptive Questions
   ↓
Optional Priority Alert
   ↓
Medical Document Upload
   ↓
Review Information
   ↓
Success
```

The navigation should work properly.

---

# PAGE 1 — WELCOME PAGE

## Route

```text
/
```

## Purpose

Introduce SehatNama and explain the experience.

## Content

### Logo

**SehatNama**

Tagline:

**Your health story, understood.**

### Main Heading

# Welcome to SehatNama

### Description

Let's understand your health concerns before you meet your doctor.

You can speak or answer using simple touch options. Your information will be prepared securely for your doctor.

### Feature Cards

🎤 **Speak Naturally**

🌐 **Choose Your Language**

🔒 **Your Information is Private**

### Primary Button

**Start Health Check-in →**

Navigate to:

```text
/check-in
```

---

# PAGE 2 — PATIENT IDENTIFICATION

## Route

```text
/check-in
```

## Progress

**Step 1 of 5**

Include reusable progress bar.

## Heading

# Let's identify you

### Description

This helps us prepare the right health record for your consultation.

## Mobile Number Option

Input:

```text
Enter your 10-digit mobile number
```

Button:

**Continue**

## Divider

**OR**

## ABHA Option

Heading:

**Use ABHA Health ID**

Description:

Connect your existing digital health record securely.

Button:

**Continue with ABHA**

## Privacy Footer

🔒 Your health information is handled securely and only used for your healthcare consultation.

For the prototype:

Both continue buttons should navigate to:

```text
/language
```

---

# PAGE 3 — LANGUAGE SELECTION

## Route

```text
/language
```

## Heading

# Choose your language

## Description

Select the language you are most comfortable speaking or reading.

## Languages

Create language cards using reusable data.

```javascript
[
  "English",
  "हिन्दी",
  "বাংলা",
  "தமிழ்",
  "తెలుగు",
  "मराठी"
]
```

Each card should be selectable.

Maintain selected language in React state.

Example selected state:

```javascript
selectedLanguage
```

## Continue Button

Disabled until a language is selected.

Then navigate to:

```text
/consent
```

---

# PAGE 4 — CONSENT & PRIVACY

## Route

```text
/consent
```

## Heading

# Your privacy matters

## Description

Before we begin, please understand how your information will be used.

## Information Cards

### 🩺 Understand your health concerns

Your answers help create a clear summary for your doctor.

### 📄 Read your medical documents

You can securely add previous prescriptions and reports.

### 👨‍⚕️ Support your doctor

Your doctor will review and verify all information before making any medical decisions.

## Important Notice

SehatNama does not replace your doctor. It helps collect and organize your health information.

## Checkbox

I understand and agree to continue.

Use React state:

```javascript
const [consentAccepted, setConsentAccepted]
```

## Button

**I Agree & Continue**

Disabled until consent is checked.

Navigate to:

```text
/interview
```

---

# PAGE 5 — AI HEALTH INTERVIEW

## Route

```text
/interview
```

This is the most important screen.

## Header

Create reusable InterviewHeader.

Include:

- SehatNama logo
- Health Interview title
- Progress indicator
- Selected language

Example:

**Question 1 of 8**

---

## AI Assistant Section

Create reusable:

```text
AssistantMessage
```

Display:

Hello! I'm Sehat, your health assistant.

Then:

# How can I help you today?

Description:

Please tell me what health problem you are experiencing.

---

## Voice Interaction

Create reusable component:

```text
VoiceButton
```

Large circular microphone button.

Text:

🎤 Tap and Speak

For prototype:

Clicking microphone should simulate listening state.

States:

```javascript
idle
listening
processing
completed
```

Show visual feedback.

Example:

Idle:

🎤 Tap and Speak

Listening:

🔴 Listening...

Processing:

✨ Understanding your response...

---

## Text Input

Reusable component:

```text
AnswerInput
```

Placeholder:

```text
Type your answer here...
```

Mock user input:

"I have chest pain."

When submitted:

Navigate to:

```text
/interview/question/1
```

Store the answer in shared patient state/context.

---

# PAGE 6 — ADAPTIVE FOLLOW-UP QUESTIONS

## Route

```text
/interview/question/:id
```

Use reusable question data.

Example:

```javascript
const questions = [
 {
   id: 1,
   question: "Where exactly are you feeling the pain?",
   options: [
     "Center of the chest",
     "Left side of the chest",
     "Right side of the chest",
     "Somewhere else"
   ]
 }
]
```

## AI Context

Display:

**I understand that you're experiencing chest pain.**

## Question

# Where exactly are you feeling the pain?

## Answer Options

Create reusable:

```text
AnswerOption
```

Large touch-friendly selectable cards.

Allow only one selection.

State:

```javascript
selectedAnswer
```

## Voice Alternative

🎤 Speak your answer instead

## Navigation

Back button.

Continue button.

For the prototype:

Continue through multiple mock questions.

Suggested questions:

1. Where exactly are you feeling the pain?
2. How severe is the pain?
3. When did the pain start?
4. Are you experiencing difficulty breathing?

When the patient selects:

**Yes, I have difficulty breathing**

Navigate to:

```text
/priority-alert
```

Otherwise continue to:

```text
/documents
```

---

# PAGE 7 — PRIORITY MEDICAL ALERT

## Route

```text
/priority-alert
```

## IMPORTANT

This must NOT diagnose the patient.

Use language such as:

# Priority medical attention may be needed

Some of the symptoms you described may require immediate attention from medical staff.

Important message:

This is not a diagnosis. A healthcare professional should assess your symptoms as soon as possible.

## Buttons

### Primary

🚨 Alert Medical Staff

For frontend prototype:

Show a temporary success notification:

**Medical staff has been notified.**

### Secondary

Continue Case Information

Navigate to:

```text
/documents
```

---

# PAGE 8 — MEDICAL DOCUMENT UPLOAD

## Route

```text
/documents
```

## Heading

# Do you have any previous medical reports?

## Description

You can add them so your doctor can better understand your medical history.

---

## Document Type Cards

Create reusable:

```text
DocumentTypeCard
```

Types:

### 💊 Prescription

Add previous medicines or prescriptions.

### 🧪 Lab Report

Blood tests and other investigations.

### 🏥 Discharge Summary

Previous hospital treatment records.

### 📄 Other Medical Document

Upload any other relevant health record.

---

## Upload Component

Create reusable:

```text
DocumentUploader
```

Display:

📷 Scan or Upload Document

Take a photo or upload a file from your device.

Use a real frontend file input if possible.

After upload:

Show uploaded document card.

Example:

```text
📄 Prescription.pdf

Processing complete ✓
```

Create mock OCR loading animation.

Example:

```text
Reading your document...
████████░░
```

Then show mock extracted data:

💊 Metformin 500 mg

💊 Amlodipine 5 mg

🧪 HbA1c: 8.4%

Store uploaded document metadata in shared patient state.

## Button

**Continue**

Navigate to:

```text
/review
```

## Secondary

**Skip for now**

Also navigate to:

```text
/review
```

---

# PAGE 9 — REVIEW & SUBMIT

## Route

```text
/review
```

This page should display all patient data collected during the flow.

Use reusable:

```text
ReviewCard
```

---

## Heading

# Review Your Health Information

Description:

Please check the information below before submitting it to your doctor.

---

## Summary Sections

### 🩺 Main Health Concern

Chest pain

### ⏱ Duration

Since this morning

### 📊 Severity

8 / 10

### 💬 Associated Symptoms

- Difficulty breathing
- Sweating

### 💊 Current Medicines

Metformin 500 mg

### 📄 Medical Documents

2 documents added

Button:

View Documents

Each section should have an Edit icon.

---

## Important Information

👨‍⚕️ Your doctor will review and verify this information before using it for your consultation.

---

## Primary Button

# Submit to Doctor

On click:

Simulate submission loading.

Example:

```text
Preparing your case summary...
```

Then navigate to:

```text
/success
```

---

# PAGE 10 — SUCCESS PAGE

## Route

```text
/success
```

## Success Icon

Large animated checkmark.

## Heading

# Your health information is ready!

## Description

Your case summary has been securely prepared and sent to your healthcare team.

## Token Card

Label:

**Your Token**

Large token:

# A-104

## Next Instruction

Please wait for your turn. Your doctor will review your information before the consultation.

## Footer

💙 Thank you for using SehatNama.

---

# STATE MANAGEMENT

Use React Context for shared patient information.

Create:

```text
PatientContext
```

Store:

```javascript
{
  patientName,
  mobileNumber,
  selectedLanguage,
  consentAccepted,

  chiefComplaint,

  answers,

  severity,

  duration,

  associatedSymptoms,

  documents,

  extractedMedicalData,

  emergencyAlertTriggered
}
```

Provide helper functions:

```javascript
updatePatientData()
addAnswer()
addDocument()
triggerEmergencyAlert()
resetPatientData()
```

---

# REUSABLE COMPONENT ARCHITECTURE

Create the following reusable components.

```text
components/
```

## Layout Components

```text
AppLayout
PatientLayout
PageContainer
```

## Navigation

```text
Header
BackButton
ProgressBar
LanguageSelector
```

## AI Interview

```text
AssistantAvatar
AssistantMessage
VoiceButton
AnswerInput
AnswerOption
QuestionCard
InterviewHeader
```

## Documents

```text
DocumentTypeCard
DocumentUploader
UploadedDocumentCard
OCRProcessing
ExtractedDataCard
```

## Review

```text
ReviewCard
ReviewSection
EditButton
```

## UI

```text
Button
Card
Badge
Alert
Checkbox
Modal
Loader
Toast
```

---

# FOLDER STRUCTURE

Use a clean architecture similar to:

```text
src/

├── assets/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── interview/
│   ├── documents/
│   ├── review/
│   └── ui/
│
├── context/
│   └── PatientContext.jsx
│
├── data/
│   ├── questions.js
│   ├── languages.js
│   └── mockPatientData.js
│
├── pages/
│   ├── Welcome.jsx
│   ├── CheckIn.jsx
│   ├── Language.jsx
│   ├── Consent.jsx
│   ├── Interview.jsx
│   ├── Question.jsx
│   ├── PriorityAlert.jsx
│   ├── Documents.jsx
│   ├── Review.jsx
│   └── Success.jsx
│
├── services/
│   └── mockApi.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# MOCK DATA

Create realistic mock data.

## Patient

```javascript
{
  name: "Rahul Kumar",
  age: 52,
  gender: "Male"
}
```

## Health Complaint

```javascript
{
  chiefComplaint: "Chest pain",
  duration: "Since this morning",
  severity: "8 / 10",
  symptoms: [
    "Difficulty breathing",
    "Sweating"
  ]
}
```

## Medical Data

```javascript
{
  medications: [
    "Metformin 500 mg",
    "Amlodipine 5 mg"
  ],

  labResults: [
    {
      name: "HbA1c",
      value: "8.4%",
      status: "attention"
    }
  ]
}
```

---

# ANIMATIONS

Use subtle animations.

Examples:

- Page transitions
- Button hover states
- Card selection
- Voice listening animation
- OCR processing animation
- Success checkmark animation

Keep animations:

- Smooth
- Professional
- Minimal

Do not make the app feel like a game.

---

# UX REQUIREMENTS

The application must always provide:

- Clear next steps
- Back navigation
- Progress indication
- Large buttons
- Touch-friendly interactions
- Clear loading states
- Empty states
- Disabled button states
- Success feedback
- Error feedback

---

# CODE QUALITY REQUIREMENTS

Write clean and maintainable code.

Follow these rules:

- Do not put everything inside one component.
- Create reusable components.
- Avoid duplicated code.
- Keep mock data separate.
- Use meaningful component names.
- Use React Context only for genuinely shared state.
- Keep local UI state inside components.
- Add comments only where helpful.
- Ensure all routes work.
- Ensure navigation works correctly.
- Ensure the app runs without errors.

---

# FINAL DELIVERABLE

Build a fully functional frontend prototype where a user can:

1. Start the health check-in.
2. Enter patient identification.
3. Select a language.
4. Accept consent.
5. Start an AI health interview.
6. Answer adaptive health questions.
7. Trigger a simulated priority medical alert.
8. Upload medical documents.
9. See simulated OCR processing.
10. Review all collected information.
11. Submit the case.
12. Receive a success screen and token.

The final application should feel like a **real, polished AI healthcare product**, not a collection of disconnected UI pages.

The most important priorities are:

# Clean UI

# Excellent user experience

# Reusable React architecture

# Smooth patient journey

# Accessibility

# Realistic interactive prototype