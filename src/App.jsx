import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import DoctorProtectedRoute from './components/auth/DoctorProtectedRoute';

// Patient Page Imports
import Welcome from './pages/Welcome';
import CheckIn from './pages/CheckIn';
import Language from './pages/Language';
import PatientDetails from './pages/PatientDetails';
import Consent from './pages/Consent';
import ConcernSelection from './pages/ConcernSelection';
import Interview from './pages/Interview';
import Question from './pages/Question';
import PriorityAlert from './pages/PriorityAlert';
import Documents from './pages/Documents';
import Review from './pages/Review';
import Success from './pages/Success';

// Doctor Page Imports
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorCases from './pages/doctor/DoctorCases';
import DoctorCaseDetails from './pages/doctor/DoctorCaseDetails';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Layout container for patient kiosk routes
const PatientRoutesWrapper = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <BrowserRouter>
          <Routes>
            {/* Patient Kiosk Routes (Preserved with AppLayout) */}
            <Route element={<PatientRoutesWrapper />}>
              <Route path="/" element={<Welcome />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/language" element={<Language />} />
              <Route path="/patient-details" element={<PatientDetails />} />
              <Route path="/consent" element={<Consent />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/interview/concern" element={<ConcernSelection />} />
              <Route path="/interview/question/:id" element={<Question />} />
              <Route path="/priority-alert" element={<PriorityAlert />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/review" element={<Review />} />
              <Route path="/success" element={<Success />} />
            </Route>

            {/* Doctor Public Auth Route */}
            <Route path="/doctor/login" element={<DoctorLogin />} />

            {/* Doctor Protected Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <DoctorProtectedRoute>
                  <DoctorDashboard />
                </DoctorProtectedRoute>
              }
            />
            <Route
              path="/doctor/cases"
              element={
                <DoctorProtectedRoute>
                  <DoctorCases />
                </DoctorProtectedRoute>
              }
            />
            <Route
              path="/doctor/cases/:caseId"
              element={
                <DoctorProtectedRoute>
                  <DoctorCaseDetails />
                </DoctorProtectedRoute>
              }
            />
            <Route
              path="/doctor/cases/:caseId/documents"
              element={
                <DoctorProtectedRoute>
                  <DoctorCaseDetails />
                </DoctorProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile"
              element={
                <DoctorProtectedRoute>
                  <DoctorProfile />
                </DoctorProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </AuthProvider>
  );
}

export default App;
