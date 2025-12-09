class TextProcessor {
  /**
   * Clean and normalize text input
   */
  static clean(text) {
    if (!text) return ''

    // Remove excessive whitespace
    text = text.replace(/[ \t]+/g, ' ')
    text = text.replace(/\n{3,}/g, '\n\n')
    
    // Remove control characters
    text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    
    // Comprehensive encoding fixes
    const encodingFixes = {
      'â€™': "'", 'â€œ': '"', 'â€': '"',
      'â€"': '—', 'â€"': '–', 'â€¢': '•',
      'Ã©': 'é', 'Ã¡': 'á', 'Ã­': 'í',
      'Ã³': 'ó', 'Ãº': 'ú', 'Ã±': 'ñ',
      'â€¦': '...'
    }
    
    Object.entries(encodingFixes).forEach(([bad, good]) => {
      text = text.replace(new RegExp(bad, 'g'), good)
    })
    
    // Normalize quotes
    text = text.replace(/['']/g, "'").replace(/[""]/g, '"')
    
    return text.trim()
  }

  /**
   * Split text into sentences (Improved robustness)
   */
  static splitSentences(text) {
    if (!text) return []

    // Protect common abbreviations before splitting
    const protectedText = text.replace(/(Dr|Mr|Mrs|Ms|Prof|Sr|Jr|vs|e\.g|i\.e|Fig)\./g, '$1_DOT_')

    const sentences = protectedText
      .split(/(?<=[.!?])\s+|\n+/)
      .map(s => s.replace(/_DOT_/g, '.').trim()) // Restore dots
      .filter(s => {
        if (s.length < 10) return false // Too short
        if (!/[a-zA-Z]/.test(s)) return false // No letters
        if (s.split(/\s+/).length < 3) return false // Too few words
        return true
      })

    return sentences
  }

  /**
   * Extract keywords (Expanded Stoplist)
   */
  static extractKeywords(text, minFrequency = 1, limit = 30) {
    if (!text) return []

    const commonWords = new Set([
      'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 
      'of', 'and', 'or', 'but', 'with', 'from', 'by', 'this', 'that',
      'these', 'those', 'will', 'can', 'could', 'would', 'should',
      'have', 'has', 'had', 'been', 'about', 'which', 'when', 'what',
      'where', 'who', 'how', 'why', 'there', 'their', 'they', 'them',
      'does', 'did', 'not', 'also', 'than', 'then', 'just', 'only',
      'very', 'much', 'many', 'some', 'any', 'into', 'over', 'under'
    ])
    
    // Extract words (3+ chars)
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    
    const frequency = {}
    words.forEach(word => {
      if (!commonWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1
      }
    })

    return Object.entries(frequency)
      .filter(([word, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .slice(0, limit)
      .map(([word]) => this.capitalize(word))
  }

  static capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

export default TextProcessor