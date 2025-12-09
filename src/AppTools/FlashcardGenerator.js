import TextProcessor from './TextProcessor'

class FlashcardGenerator {
  constructor(text) {
    this.text = TextProcessor.clean(text)
    this.sentences = TextProcessor.splitSentences(this.text)
    this.flashcards = []
    this.usedQuestions = new Set()
  }

  generate(limit = 20) {
    if (!this.text) return []

    // 1. Extract Definitions (Highest Quality)
    this.extractDefinitions()
    
    // 2. Extract Concept Checks (Reverse Definitions)
    this.createConceptChecks()

    // 3. Extract Cloze Deletions (Fill in blank)
    this.createClozeCards()

    // 4. Fallback: Chunking (If we need more cards)
    if (this.flashcards.length < limit) {
      this.chunkParagraphs()
    }

    // Shuffle and Limit
    const unique = this.removeDuplicates()
    return limit === -1 ? unique : unique.slice(0, limit)
  }

  addCard(card) {
    if (!card.question || !card.answer) return
    
    // Prevent cards that are just too long to be useful
    if (card.answer.length > 400) return 

    // Duplicate check
    if (!this.usedQuestions.has(card.question)) {
      this.flashcards.push({
        id: Date.now() + Math.random(),
        ...card,
        mastered: false,
        reviewLater: false
      })
      this.usedQuestions.add(card.question)
    }
  }

  removeDuplicates() {
    return this.flashcards.sort(() => Math.random() - 0.5)
  }

  // Strategy 1: Definitions
  extractDefinitions() {
    // Regex Logic:
    // 1. Term: 2-50 chars, can be capitalized or not (relaxed)
    // 2. Connector: is, are, refers to, defined as, means
    // 3. Definition: Capture until end of sentence
    const patterns = [
      /(?:^|\.\s+)([A-Z][a-zA-Z\s-]{2,50}?)\s+(?:is|are|means|refers to|can be defined as)\s+([^.!?]{10,250})/g,
      /(?:^|\.\s+)([A-Z][a-zA-Z\s-]{2,50}?):\s*([^.!?]{10,250})/g
    ]

    patterns.forEach(pattern => {
      let match
      // Reset regex index
      pattern.lastIndex = 0
      
      while ((match = pattern.exec(this.text)) !== null) {
        const term = match[1].trim()
        const def = match[2].trim()
        
        // Filter out false positives (e.g. "There is...")
        const invalidTerms = ['There', 'It', 'This', 'That', 'Here']
        if (!invalidTerms.includes(term)) {
            this.addCard({
              question: `What is the definition of "${term}"?`,
              answer: def,
              source: 'definition'
            })
        }
      }
    })
  }

  // Strategy 2: Cloze Deletion (Fill in the blank)
  createClozeCards() {
    const keywords = TextProcessor.extractKeywords(this.text, 1, 30)
    
    this.sentences.forEach(sentence => {
      // Skip very short or very long sentences
      if (sentence.length < 20 || sentence.length > 200) return

      for (const keyword of keywords) {
        // Ensure keyword is long enough to be significant
        if (keyword.length < 4) continue

        // Use word boundary \b to avoid replacing partial words (e.g. "act" in "action")
        const regex = new RegExp(`\\b${keyword}\\b`, 'i')
        
        if (regex.test(sentence)) {
            const question = sentence.replace(regex, '__________')
            
            this.addCard({
                question: `Complete the sentence:\n"${question}"`,
                answer: keyword,
                source: 'cloze'
            })
            // Only make one card per sentence to avoid spam
            break 
        }
      }
    })
  }

  // Strategy 3: Reverse Definition
  createConceptChecks() {
    // Similar to definitions but asks for the term
    const patterns = [
      /(?:^|\.\s+)([A-Z][a-zA-Z\s-]{2,50}?)\s+(?:is|are|means)\s+([^.!?]{10,250})/g
    ]
    
    patterns.forEach(pattern => {
      let match
      pattern.lastIndex = 0
      while ((match = pattern.exec(this.text)) !== null) {
        const term = match[1].trim()
        const def = match[2].trim()
        const invalidTerms = ['There', 'It', 'This', 'That', 'Here', 'The']

        if (!invalidTerms.includes(term) && def.length > 20) {
            this.addCard({
                question: `Which term describes this concept?\n"${def}..."`,
                answer: term,
                source: 'reverse'
            })
        }
      }
    })
  }

  // Strategy 4: Chunking (Fallback)
  chunkParagraphs() {
    const sentences = this.sentences
    // Group every 2 sentences
    for(let i = 0; i < sentences.length - 1; i += 2) {
      const chunk = `${sentences[i]} ${sentences[i+1]}`
      if (chunk.length < 30) continue
      
      this.addCard({
        question: `Explain the concepts discussed in this excerpt:\n"${sentences[i].substring(0, 60)}..."`,
        answer: chunk,
        source: 'chunk'
      })
    }
  }
}

export default FlashcardGenerator