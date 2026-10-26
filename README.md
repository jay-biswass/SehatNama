# 🩺 SehatNama — Your Health Story, Understood.

<p align="center">
  <strong>An AI-powered patient case-taking platform designed to help patients communicate their health concerns before meeting a doctor.</strong>
</p>

<p align="center">
  <a href="https://sehat-nama-red.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20SehatNama-0D9488?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://github.com/jay-biswass/SehatNama">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
</p>

---

## 🌟 Overview

**SehatNama** is a healthcare technology project focused on making patient information collection simpler, more accessible, and more structured.

Designed for hospitals and healthcare centers in India, SehatNama guides patients through a digital health check-in experience before their consultation. Patients can describe their health concerns, select their preferred language, answer follow-up questions, and organize relevant medical information for a doctor to review.

The goal is to bridge the communication gap between patients and healthcare professionals through a simple, accessible, and user-friendly interface.

## 🎯 Problem Statement

Patients may struggle to explain their symptoms clearly, communicate in a language they are comfortable with, or organize their previous medical records before a consultation.

Traditional patient intake can also require repetitive questions and manual information collection.

SehatNama aims to improve this process through a structured digital workflow that helps patients share their health stories more clearly.

## ✨ Key Features

- 🩺 **Digital Patient Check-in** — A guided workflow for collecting patient information before consultation.
- 🌐 **Multilingual Interface** — Language selection designed to make the experience more accessible to Indian patients.
- 🤖 **AI-Assisted Health Interview** — A conversational workflow designed to collect health concerns and ask relevant follow-up questions.
- 🎙️ **Voice-Friendly Interaction** — An interface designed around voice-based and touch-based responses.
- 📄 **Medical Document Upload** — A dedicated step for adding previous prescriptions and medical reports.
- 🚨 **Priority Alert Interface** — A workflow for highlighting potential emergency warning signs.
- 🔍 **Information Review** — Allows patients to review collected information before submission.
- 📱 **Responsive Design** — A clean, healthcare-focused interface designed for desktop, tablet, and mobile screens.

*Note: SehatNama is currently a frontend prototype. Features that require live AI services, speech recognition, OCR, or external healthcare integrations may be simulated rather than fully operational.*

## 🔄 How It Works

```text
        Welcome to SehatNama
                 ↓
        Patient Identification
                 ↓
          Language Selection
                 ↓
          Consent & Privacy
                 ↓
         AI Health Interview
                 ↓
       Follow-up Questions
                 ↓
         Priority Alert Check
                 ↓
       Medical Document Upload
                 ↓
        Review Health Details
                 ↓
           Submit Case
```

The guided workflow is designed to help patients organize their information before sharing it with a healthcare professional.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| JavaScript | Application logic and interactivity |
| Vite | Development server and build tooling |
| Tailwind CSS 4 | Styling and responsive layouts |
| React Router | Client-side navigation |
| Lucide React | Interface icons |
| Supabase JS | Client library for potential backend integration |
| Vercel | Application deployment |

## 🏗️ Project Structure

```text
SehatNama/
├── api/              # API-related code
├── public/            # Static assets
├── scratch/           # Development and working files
├── src/               # React application source
├── supabase/          # Supabase-related files
├── tests/             # Application tests
├── .env.example       # Example environment configuration
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js and npm
- Git
- A code editor such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/jay-biswass/SehatNama.git
```

### 2. Navigate to the Project

```bash
cd SehatNama
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Check `.env.example` for the environment variables required by the project.

If any integrations require credentials, create a local `.env` file and configure the necessary values. Never commit API keys, service-role keys, or other secrets to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL printed in your terminal, typically `http://localhost:5173/`.

### 6. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🧪 Testing and Code Quality

Run the project's available tests:

```bash
npm test
```

Run the linter:

```bash
npm run lint
```

These commands use the scripts configured in `package.json`.

## 🗺️ Project Roadmap

- [x] Create the patient-facing interface.
- [x] Develop the guided check-in workflow.
- [x] Add language selection and consent screens.
- [x] Build the health interview and review flow.
- [ ] Integrate production-ready AI-assisted interviews.
- [ ] Implement real speech recognition and multilingual voice support.
- [ ] Add reliable medical document extraction.
- [ ] Integrate secure patient records and healthcare workflows.
- [ ] Strengthen accessibility, testing, and production readiness.

*The roadmap reflects project goals; individual items may require further implementation and validation.*

## 🔐 Privacy, Safety & Responsible Healthcare

SehatNama is intended to support the collection and organization of patient information, not replace professional medical judgment.

- Patient information should be handled securely and with appropriate consent.
- AI-generated information must be reviewed and validated before being used in clinical decisions.
- Potential emergency symptoms require appropriate professional assessment.
- Production deployment requires careful testing of data security, access controls, and privacy safeguards.

**Important:** SehatNama is not a substitute for a qualified healthcare professional or emergency medical services.

## 💡 Vision

The vision behind SehatNama is to make healthcare interactions more patient-friendly by helping people communicate their symptoms and medical history in a clear, structured way.

By combining accessible design with AI-assisted workflows, SehatNama aims to make the first step of a healthcare consultation more efficient and understandable.

## 🔗 Links

- 🌐 **Live Demo:** [sehat-nama-red.vercel.app](https://sehat-nama-red.vercel.app/)
- 💻 **Source Code:** [github.com/jay-biswass/SehatNama](https://github.com/jay-biswass/SehatNama)

## 👨‍💻 Author

**Jay Biswas**

- GitHub: [@jay-biswass](https://github.com/jay-biswass)

## ⭐ Support

If you find this project interesting, consider giving the repository a star ⭐. Feedback and suggestions are always welcome.

-----------------------------------------------------------------------------------------

<p align="center">
  <strong>Better Communication. Better Understanding. Better Healthcare. 🩺</strong>
</p>

<p align="center">
  Built with ❤️ and a vision for accessible healthcare.
</p>
