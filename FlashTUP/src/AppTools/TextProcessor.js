class TextProcessor {
  /**
   * Clean and normalize text input
   */
  static clean(text) {
    if (!text) return ''

    // Remove excessive whitespace but preserve structure
    text = text.replace(/[ \t]+/g, ' ') // Spaces and tabs
    text = text.replace(/\n{3,}/g, '\n\n') // Max 2 newlines
    
    // Remove special control characters
    text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    
    // Fix encoding issues
    const encodingFixes = {
      'â€™': "'", 'â€œ': '"', 'â€': '"',
      'â€"': '—', 'â€"': '–', 'â€¢': '•',
      'Ã©': 'é', 'Ã¡': 'á', 'Ã­': 'í',
      'Ã³': 'ó', 'Ãº': 'ú', 'Ã±': 'ñ'
    }
    
    Object.entries(encodingFixes).forEach(([bad, good]) => {
      text = text.replace(new RegExp(bad, 'g'), good)
    })
    
    // Normalize quotes
    text = text.replace(/['']/g, "'")
    text = text.replace(/[""]/g, '"')
    
    return text.trim()
  }

  /**
   * Split text into sentences
   */
  static splitSentences(text) {
    if (!text) return []

    // More flexible splitting
    const sentences = text
      .split(/(?<=[.!?])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => {
        // More lenient requirements
        if (s.length < 10) return false
        if (!/[a-zA-Z]/.test(s)) return false
        
        const wordCount = s.split(/\s+/).length
        if (wordCount < 2) return false
        
        return true
      })

    console.log(`📝 Split into ${sentences.length} valid sentences`)
    return sentences
  }

  /**
   * Extract keywords
   */
  static extractKeywords(text, minFrequency = 1, limit = 30) {
    if (!text) return []

    const commonWords = new Set([
      'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 
      'of', 'and', 'or', 'but', 'with', 'from', 'by', 'this', 'that',
      'these', 'those', 'will', 'can', 'could', 'would'
    ])
    
    // Extract words (3+ characters, more lenient)
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    
    const frequency = {}
    words.forEach(word => {
      if (!commonWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1
      }
    })

    const keywords = Object.entries(frequency)
      .filter(([word, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => this.capitalize(word))

    console.log(`🔑 Extracted ${keywords.length} keywords`)
    return keywords
  }

  /**
   * Extract important phrases
   */
  static extractPhrases(text, limit = 10) {
    if (!text) return []

    const sentences = this.splitSentences(text)
    const phrases = new Set()

    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/)
      
      // Extract 2-word phrases (Capitalized)
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`
        if (phrase.length > 8 && /^[A-Z]/.test(phrase)) {
          phrases.add(phrase)
        }
      }
    })

    const result = Array.from(phrases).slice(0, limit)
    console.log(`💬 Extracted ${result.length} phrases`)
    return result
  }

  static extractListItems(text) {
    if (!text) return []
    const bulletPattern = /^[\s]*[•\-\*\d+\.]\s+(.+)$/gm
    const matches = []
    let match
    while ((match = bulletPattern.exec(text)) !== null) {
      const item = match[1].trim()
      if (item.length > 10) matches.push(item)
    }
    console.log(`📋 Extracted ${matches.length} list items`)
    return matches
  }

  static capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

export default TextProcessor