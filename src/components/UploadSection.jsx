import React, { useState } from 'react'
import { useFlashcards } from '../context/FlashcardContext'
import FileUploader from './FileUploader'
import SavedSets from './SavedSets'
import LoadingSpinner from './LoadingSpinner'
import CardLimitSelector from './CardLimitSelector'

function UploadSection() {
  const { generateFlashcards, isStudyMode, isLoading } = useFlashcards()
  const [textInput, setTextInput] = useState('')
  const [cardLimit, setCardLimit] = useState(20)

  const handleGenerate = async () => {
    if (textInput.trim()) {
      await generateFlashcards(textInput, cardLimit)
    }
  }

  if (isStudyMode) return null

  return (
    // Added pt-36 to push content way down below the fixed header
    <div className="w-full max-w-7xl mx-auto px-6 pt-36 pb-20">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-6xl font-extrabold text-white mb-6 font-heading tracking-tight drop-shadow-2xl">
          Turn Notes into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Knowledge</span>
        </h2>
        <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
          Upload your lecture slides, documents, or paste text below. <br/>
          Our AI will instantly generate a study deck for you.
        </p>
      </div>

      <div className="dashboard-card p-8 md:p-12">
        
        {/* Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          {/* Left: Upload */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
               <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/30">1</span>
               <h3 className="text-2xl font-bold text-white">Upload File</h3>
            </div>
            <div className="flex-1 h-[450px]"> {/* Increased Height */}
               <FileUploader onTextExtracted={(text) => setTextInput(text)} />
            </div>
          </div>

          {/* Right: Paste */}
          <div className="flex flex-col h-full">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <span className="bg-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/30">2</span>
                    <h3 className="text-2xl font-bold text-white">Paste Text</h3>
                </div>
                <span className={`text-sm font-bold px-4 py-1 rounded-full border ${textInput.length > 0 && textInput.length < 50 ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' : 'border-gray-600 text-gray-400 bg-gray-800'}`}>
                    {textInput.length} chars
                </span>
             </div>
             
             <textarea 
               className="modern-input h-[450px] resize-none text-lg leading-relaxed p-6"
               placeholder="Paste your lecture notes, article text, or documentation here..." 
               value={textInput}
               onChange={(e) => setTextInput(e.target.value)}
               disabled={isLoading}
             />
          </div>
        </div>

        {/* Footer Actions - CENTERED GENERATE BUTTON */}
        <div className="border-t border-white/10 pt-10 flex flex-col items-center gap-8">
            
            {/* Limit Selector */}
            <div className="w-full flex justify-center">
                 <CardLimitSelector 
                    currentLimit={cardLimit} 
                    onLimitChange={setCardLimit} 
                  />
            </div>

            {/* BIG CENTERED GENERATE BUTTON */}
            <div className="w-full max-w-md">
                {isLoading ? (
                  <LoadingSpinner message="AI is generating your deck..." size="lg" />
                ) : (
                  <button
                    className="btn-primary-glow w-full text-xl py-5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-300"
                    onClick={handleGenerate}
                    disabled={textInput.length < 50}
                  >
                    ✨ Generate Flashcards
                  </button>
                )}
            </div>
        </div>
      </div>

      <div className="mt-20">
        <SavedSets />
      </div>
    </div>
  )
}

export default UploadSection