import React, { useState, lazy, Suspense } from 'react';
import { FlashcardProvider } from './context/FlashcardContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import SiteHeader from './components/homepage/SiteHeader'; 
import LoadingSpinner from './components/homepage/LoadingSpinner';

// Lazy load heavy components
const UploadSection = lazy(() => import('./components/homepage/UploadSection'));
const StudySection = lazy(() => import('./components/flashcard-page/StudySection'));
const StatsModal = lazy(() => import('./components/StatsModal'));

function AppContent() {
  const [showStatsModal, setShowStatsModal] = useState(false);

  return (
    // REMOVED className="App" to prevent legacy style conflicts
    <div className="min-h-screen bg-[#0f172a] text-white">
      
      <SiteHeader onShowStats={() => setShowStatsModal(true)} />
      
      {/* ADDED mt-24: Pushes content down so it's not hidden behind the fixed header */}
      <main className="container mx-auto p-4 mt-24">
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