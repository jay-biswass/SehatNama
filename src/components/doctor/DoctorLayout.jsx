import React, { useState, useEffect } from 'react';
import DoctorSidebar from './DoctorSidebar';
import DoctorHeader from './DoctorHeader';
import RealtimeToast from './RealtimeToast';
import doctorService from '../../services/doctorService';

export const DoctorLayout = ({ children, onRealtimeEvent }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [alertsCount, setAlertsCount] = useState(0);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    // Initial fetch of active alerts
    doctorService.getDashboardStats().then(({ data }) => {
      if (data) setAlertsCount(data.activeAlerts || 0);
    });

    const subscription = doctorService.subscribeToRealtimeCases({
      onNewCase: (newCase) => {
        const isHigh = newCase.priority_level === 'high';
        setActiveNotification({
          caseId: newCase.id,
          priority_level: newCase.priority_level,
          title: isHigh ? '🚨 Urgent Priority Application' : 'New Patient Application',
          message: `Concern: ${newCase.chief_complaint || 'Medical check-in'} (${newCase.priority_level?.toUpperCase() || 'NORMAL'} priority)`
        });

        if (onRealtimeEvent) onRealtimeEvent(newCase);
      },
      onAlert: (newAlert) => {
        setAlertsCount(prev => prev + 1);
        setActiveNotification({
          caseId: newAlert.case_id,
          priority_level: 'high',
          title: '🚨 High Priority Alert Flagged',
          message: newAlert.message || 'Critical clinical indicator detected.'
        });

        if (onRealtimeEvent) onRealtimeEvent(newAlert);
      }
    });

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [onRealtimeEvent]);

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] flex flex-col lg:flex-row text-[var(--color-text-primary)] font-sans antialiased select-none">
      {/* Sidebar Navigation */}
      <DoctorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[100dvh] overflow-x-hidden">
        <DoctorHeader
          onMenuClick={() => setSidebarOpen(true)}
          alertsCount={alertsCount}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Realtime Toast */}
      {activeNotification && (
        <RealtimeToast
          notification={activeNotification}
          onClose={() => setActiveNotification(null)}
        />
      )}
    </div>
  );
};

export default DoctorLayout;
