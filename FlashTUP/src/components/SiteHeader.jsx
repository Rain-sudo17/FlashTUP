import React from 'react';

function SiteHeader({ onShowStats }) {
  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-300">
      {/* Glass Background Wrapper */}
      <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"></div>
      
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* 1. LEFT: Invisible Spacer (Keeps center element perfectly centered) */}
          <div className="hidden md:block w-1/3"></div>

          {/* 2. CENTER: Logo & Title (Bigger & Glassmorphic) */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center mb-4 md:mb-0">
             <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col items-center gap-2 transform hover:scale-105 transition-transform duration-300">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 text-3xl">
                      ⚡
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading drop-shadow-md">
                      FlashTUP
                    </h1>
                 </div>
                 <p className="text-sm text-indigo-200 font-bold tracking-[0.2em] uppercase opacity-90">
                    Your AI Study Tutor
                 </p>
             </div>
          </div>

          {/* 3. RIGHT: Action Buttons (Separated with gap-6) */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="flex items-center gap-6"> 
              
              <button 
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all hover:-translate-y-1 shadow-lg"
                onClick={onShowStats}
              >
                <span className="text-2xl">📊</span>
                <span className="text-lg">Stats</span>
              </button>

              <a 
                href="/"
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 no-underline"
              >
                <span className="text-2xl">+</span>
                <span className="text-lg">New</span>
              </a>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default React.memo(SiteHeader);