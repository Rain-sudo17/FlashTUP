import React from 'react';

function SiteHeader({ onShowStats }) {
  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-300">
      {/* 1. Glass Background Layer (The main "Bar") */}
      <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"></div>
      
      {/* 2. Content Container */}
      <div className="container mx-auto px-6 py-4 relative z-10">
        
        {/* PARENT CONTAINER */}
        <div className="relative flex items-center justify-end min-h-[60px]">

          {/* --- ABSOLUTE CENTERED LOGO --- */}
          {/* Layout remains absolute centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-auto flex justify-center pointer-events-none md:pointer-events-auto">
             
             {/* UPDATED DIV:
                - Removed: bg-white/5, border, shadow, rounded-3xl, px-8
                - Kept: cursor-pointer, hover:scale-105, transition
             */}
             <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300 cursor-pointer pointer-events-auto">
                 <div className="flex items-center gap-3">
                    <span className="text-3xl animate-pulse">⚡</span>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading drop-shadow-md">
                      FlashTUP
                    </h1>
                 </div>
                 <p className="text-xs text-indigo-200 font-bold tracking-[0.2em] uppercase opacity-90 mt-1">
                   Your AI Study Companion
                 </p>
             </div>
             
          </div>

          {/* --- RIGHT SIDE BUTTONS --- */}
          <div className="hidden md:flex items-center gap-4 relative z-20"> 
            
            <button 
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all hover:-translate-y-1 shadow-lg group cursor-pointer"
              onClick={onShowStats}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
              <span>Stats</span>
            </button>

            <a 
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 no-underline cursor-pointer"
            >
              <span className="text-xl">+</span>
              <span>New</span>
            </a>

          </div>
        </div>
      </div>
    </header>
  );
}

export default React.memo(SiteHeader);