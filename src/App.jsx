import React, { useState, lazy, Suspense } from 'react';
import { FlashcardProvider } from './context/FlashcardContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import SiteHeader from './components/SiteHeader'; 
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load heavy components
const UploadSection = lazy(() => import('./components/UploadSection'));
const StudySection = lazy(() => import('./components/StudySection'));
const StatsModal = lazy(() => import('./components/StatsModal'));

function AppContent() {
  const [showStatsModal, setShowStatsModal] = useState(false);

  return (
    <div className="App">
      {/* UPDATE THIS LINE: Use SiteHeader */}
      <SiteHeader onShowStats={() => setShowStatsModal(true)} />
      
      <main className="container p-4">
        <Suspense fallback={<div className="flex justify-center mt-10"><LoadingSpinner message="Loading..." /></div>}>
          <UploadSection />
          <StudySection />
        </Suspense>
      </main>

      {showStatsModal && (
        <Suspense fallback={<LoadingSpinner />}>
           <StatsModal onClose={() => setShowStatsModal(false)} />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <FlashcardProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </FlashcardProvider>
    </ToastProvider>
  );
}

export default App;