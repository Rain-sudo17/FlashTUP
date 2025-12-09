import React, { useState, useRef } from 'react'
import { useToast } from '../context/ToastContext'

function ImageUploader({ onImageAdded, cardIndex }) {
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { success, error } = useToast()

  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      error('Invalid image type (JPG, PNG, GIF, WebP only)')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      error('Image must be less than 2MB')
      return
    }

    setIsUploading(true)
    try {
      const base64 = await convertToBase64(file)
      // Simulating compression or processing
      setPreview(base64)
      onImageAdded(base64, cardIndex)
      success('Image added!')
    } catch (err) {
      error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
    })
  }

  const handleRemove = () => {
    setPreview(null)
    onImageAdded(null, cardIndex)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="mt-2">
      {!preview ? (
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            hidden 
          />
          <button 
            className="btn btn-sm btn-gray"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? '⏳...' : '📷 Add Image'}
          </button>
        </div>
      ) : (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="h-20 w-auto rounded border border-gray-500" />
          <button 
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            onClick={handleRemove}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUploader