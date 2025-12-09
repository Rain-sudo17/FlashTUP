import React, { useState, useRef } from 'react'
import { useToast } from '../../context/ToastContext'
import TextProcessor from "../../AppTools/TextProcessor"
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import Tesseract from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

function FileUploader({ onTextExtracted }) {
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressStatus, setProgressStatus] = useState('')
  const fileInputRef = useRef(null)
  const { error: showError, success } = useToast()

  const validateFile = (file) => {
    if (!file) return false
    const validExtensions = ['.txt', '.pdf', '.docx', '.jpg', '.jpeg', '.png', '.bmp', '.webp']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!validExtensions.includes(fileExtension)) {
      showError('Unsupported file type.')
      return false
    }
    return true
  }

  // --- EXTRACTION STRATEGIES ---
  const extractText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = (e) => resolve(e.target.result); reader.onerror = reject; reader.readAsText(file);
    })
  }
  const extractPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer(); const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise; let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) { setProgressStatus(`Parsing Page ${i}/${pdf.numPages}`); const page = await pdf.getPage(i); const textContent = await page.getTextContent(); fullText += textContent.items.map((item) => item.str).join(' ') + '\n\n'; }
    return fullText;
  }
  const extractDocx = async (file) => {
    setProgressStatus('Reading Word Doc...'); const arrayBuffer = await file.arrayBuffer(); const result = await mammoth.extractRawText({ arrayBuffer }); return result.value;
  }
  const extractImage = async (file) => {
    setProgressStatus('Scanning Image...'); const result = await Tesseract.recognize(file, 'eng', { logger: m => { if (m.status === 'recognizing text') setProgressStatus(`Scanning: ${Math.round(m.progress * 100)}%`) } }); return result.data.text;
  }

  const processFile = async (file) => {
    if (!validateFile(file)) return
    setIsProcessing(true); setFileName(file.name); setProgressStatus('Starting...');
    try {
      let extractedText = ''
      const type = file.type; const name = file.name.toLowerCase();
      if (type === 'text/plain' || name.endsWith('.txt')) extractedText = await extractText(file);
      else if (type === 'application/pdf' || name.endsWith('.pdf')) extractedText = await extractPdf(file);
      else if (name.endsWith('.docx')) extractedText = await extractDocx(file);
      else if (type.startsWith('image/')) extractedText = await extractImage(file);

      const cleanedText = TextProcessor.clean(extractedText)
      if (cleanedText.length < 50) { showError('Text too short (min 50 chars).'); setFileName(''); return; }
      
      onTextExtracted(cleanedText)
      success(`Loaded: ${file.name}`)
    } catch (err) { console.error(err); showError('Failed to read file.'); setFileName(''); } 
    finally { setIsProcessing(false); setProgressStatus(''); }
  }

  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) processFile(file); }

  const getFileIcon = () => {
    if (fileName.endsWith('.pdf')) return '📕'
    if (fileName.endsWith('.docx')) return '📘'
    if (fileName.match(/\.(jpg|jpeg|png|webp)$/i)) return '🖼️'
    return '📄'
  }

  return (
    <div 
      className={`
        relative h-full w-full min-h-[350px] flex flex-col items-center justify-center 
        rounded-3xl shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden
        border-2 
        ${fileName 
          ? 'bg-[#0f172a] border-green-500/50 shadow-green-500/20' /* SUCCESS STATE */
          : 'bg-white/5 border-dashed border-white/10 hover:border-indigo-400/50 hover:bg-white/10 hover:shadow-indigo-500/20' /* DEFAULT STATE */
        }
      `}
      onClick={() => !isProcessing && fileInputRef.current?.click()}
    >
      <input type="file" accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,.webp" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} disabled={isProcessing} />
      
      {/* 1. Background Glow Effect (Optional visual flair) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      {/* 2. ICON CONTAINER */}
      <div className={`
        relative z-10 w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mb-6 shadow-xl transition-transform duration-300
        ${fileName 
            ? 'bg-green-500/10 text-green-400 scale-105' 
            : 'bg-[#0f172a] border border-white/5 text-indigo-400 group-hover:scale-110 group-hover:rotate-3'
        }
      `}>
        {isProcessing ? <div className="animate-spin text-5xl">⏳</div> : fileName ? getFileIcon() : '📂'}
      </div>
      
      {/* 3. TEXT CONTENT */}
      <div className="text-center px-6 relative z-10">
        <h3 className={`font-bold text-2xl mb-2 tracking-tight ${fileName ? 'text-green-400' : 'text-white'}`}>
            {isProcessing ? 'Processing File...' : fileName || 'Click to Upload'}
        </h3>
        <p className="text-indigo-200/60 text-sm font-medium uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
           {isProcessing ? progressStatus : !fileName ? 'PDF, Word, TXT & Images' : 'File Ready'}
        </p>
      </div>

      {/* 4. "Change File" Button (Only shows when file is loaded) */}
      {fileName && !isProcessing && (
         <div className="mt-8 relative z-10 animate-fadeIn">
            <span className="text-xs font-bold bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-white hover:bg-white/10 hover:scale-105 transition-all uppercase tracking-wider shadow-lg">
              Replace File
            </span>
         </div>
      )}
    </div>
  )
}

export default FileUploader