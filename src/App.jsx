import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import AppLayout from './components/layout/AppLayout';

// Page Imports
import Welcome from './pages/Welcome';
import CheckIn from './pages/CheckIn';
import Language from './pages/Language';
import Consent from './pages/Consent';
import Interview from './pages/Interview';
import Question from './pages/Question';
import PriorityAlert from './pages/PriorityAlert';
import Documents from './pages/Documents';
import Review from './pages/Review';
import Success from './pages/Success';

function App() {
  return (
    <PatientProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/language" element={<Language />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview/question/:id" element={<Question />} />
            <Route path="/priority-alert" element={<PriorityAlert />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/review" element={<Review />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </PatientProvider>
  );
}

export default App;
