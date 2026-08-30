import React, { createContext, useContext, useState } from 'react';

const PatientContext = createContext();

const initialPatientState = {
  patientName: 'Rahul Kumar',
  mobileNumber: '',
  selectedLanguage: null,
  consentAccepted: false,
  chiefComplaint: '',
  answers: {},
  severity: '',
  duration: '',
  associatedSymptoms: [],
  documents: [],
  extractedMedicalData: {
    medications: [],
    labResults: []
  },
  emergencyAlertTriggered: false
};

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState(initialPatientState);

  const updatePatientData = (fields) => {
    setPatientData(prev => ({
      ...prev,
      ...fields
    }));
  };

  const addAnswer = (questionId, answer) => {
    setPatientData(prev => {
      const newAnswers = { ...prev.answers, [questionId]: answer };
      let updatedFields = { answers: newAnswers };

      // Map questions directly to convenience fields
      if (questionId === 1) {
        // "Where exactly are you feeling the pain?"
        updatedFields.painLocation = answer;
      } else if (questionId === 2) {
        // "How severe is the pain?"
        updatedFields.severity = answer;
      } else if (questionId === 3) {
        // "When did the pain start?"
        updatedFields.duration = answer;
      } else if (questionId === 4) {
        // "Are you experiencing difficulty breathing?"
        const isDifficultyBreathing = answer.includes("Yes, I have difficulty breathing");
        let newSymptoms = [...prev.associatedSymptoms];
        if (isDifficultyBreathing) {
          if (!newSymptoms.includes("Difficulty breathing")) {
            newSymptoms.push("Difficulty breathing");
          }
          updatedFields.emergencyAlertTriggered = true;
        } else {
          newSymptoms = newSymptoms.filter(s => s !== "Difficulty breathing");
        }
        
        // Add "Sweating" as a mock secondary associated symptom if they have pain
        if (prev.chiefComplaint && !newSymptoms.includes("Sweating")) {
          newSymptoms.push("Sweating");
        }
        
        updatedFields.associatedSymptoms = newSymptoms;
      }

      return {
        ...prev,
        ...updatedFields
      };
    });
  };

  const addDocument = (doc) => {
    setPatientData(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
  };

  const updateDocumentStatus = (docId, status, extractedData) => {
    setPatientData(prev => {
      const updatedDocs = prev.documents.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status, extractedData };
        }
        return doc;
      });

      // Aggregate extracted data into context state if status is completed
      let cumulativeMeds = [...prev.extractedMedicalData.medications];
      let cumulativeLab = [...prev.extractedMedicalData.labResults];

      if (status === 'completed' && extractedData) {
        if (extractedData.medications) {
          extractedData.medications.forEach(med => {
            if (!cumulativeMeds.includes(med)) {
              cumulativeMeds.push(med);
            }
          });
        }
        if (extractedData.labResults) {
          extractedData.labResults.forEach(lab => {
            if (!cumulativeLab.some(l => l.name === lab.name)) {
              cumulativeLab.push(lab);
            }
          });
        }
      }

      return {
        ...prev,
        documents: updatedDocs,
        extractedMedicalData: {
          medications: cumulativeMeds,
          labResults: cumulativeLab
        }
      };
    });
  };

  const removeDocument = (docId) => {
    setPatientData(prev => {
      const remainingDocs = prev.documents.filter(doc => doc.id !== docId);
      
      // Recompute cumulative extracted medical data based on remaining completed documents
      let cumulativeMeds = [];
      let cumulativeLab = [];
      
      remainingDocs.forEach(doc => {
        if (doc.status === 'completed' && doc.extractedData) {
          if (doc.extractedData.medications) {
            doc.extractedData.medications.forEach(med => {
              if (!cumulativeMeds.includes(med)) {
                cumulativeMeds.push(med);
              }
            });
          }
          if (doc.extractedData.labResults) {
            doc.extractedData.labResults.forEach(lab => {
              if (!cumulativeLab.some(l => l.name === lab.name)) {
                cumulativeLab.push(lab);
              }
            });
          }
        }
      });

      return {
        ...prev,
        documents: remainingDocs,
        extractedMedicalData: {
          medications: cumulativeMeds,
          labResults: cumulativeLab
        }
      };
    });
  };

  const triggerEmergencyAlert = (triggered) => {
    setPatientData(prev => ({
      ...prev,
      emergencyAlertTriggered: triggered
    }));
  };

  const resetPatientData = () => {
    setPatientData({
      ...initialPatientState,
      selectedLanguage: patientData.selectedLanguage // Keep language for better UX if they restart
    });
  };

  return (
    <PatientContext.Provider value={{
      patientData,
      updatePatientData,
      addAnswer,
      addDocument,
      updateDocumentStatus,
      removeDocument,
      triggerEmergencyAlert,
      resetPatientData
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
