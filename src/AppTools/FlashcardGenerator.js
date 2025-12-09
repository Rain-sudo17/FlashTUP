import TextProcessor from './TextProcessor'

class FlashcardGenerator {
  constructor(text) {
    this.text = TextProcessor.clean(text)
    this.sentences = TextProcessor.splitSentences(this.text)
    this.flashcards = []
    this.usedQuestions = new Set()
  }

  generate(limit = 20) {
    // 1. Extract Definitions (The "What is" style)
    this.extractDefinitions()
    
    // 2. Extract Cloze Deletions (The "Fill in the blank" style)
    this.createClozeCards()
    
    // 3. Extract Concept Checks (Reverses the question)
    this.createConceptChecks()

    // 4. Fallback: Chunking
    if (this.flashcards.length < limit) {
      this.chunkParagraphs()
    }

    // Shuffle and Limit
    const unique = this.removeDuplicates()
    return limit === -1 ? unique : unique.slice(0, limit)
  }

  addCard(card) {
    // Basic validation to prevent bad cards
    if (!card.question || !card.answer || card.answer.length > 300) return

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
    const seen = new Set()
    return this.flashcards.filter(card => {
      const duplicate = seen.has(card.question)
      seen.add(card.question)
      return !duplicate
    }).sort(() => Math.random() - 0.5) // Shuffle results
  }

  // Strategy 1: "What is X?"
  extractDefinitions() {
    const patterns = [
      /([A-Z][a-zA-Z\s]{2,40}?)\s+(?:is|are|means|refers to)\s+([^.!?]{15,250})/g,
      /([A-Z][a-zA-Z\s]{2,40}?):\s*([^.!?]{15,250})/g
    ]
    patterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(this.text)) !== null) {
        const term = match[1].trim()
        const def = match[2].trim()
        this.addCard({
          question: `What is the definition of "${term}"?`,
          answer: def,
          source: 'definition'
        })
      }
    })
  }

  // Strategy 2: "_________ is the process of..." (Cloze)
  createClozeCards() {
    const keywords = TextProcessor.extractKeywords(this.text, 1, 20)
    
    this.sentences.forEach(sentence => {
      keywords.forEach(keyword => {
        // If sentence contains keyword and is of good length
        if (sentence.toLowerCase().includes(keyword.toLowerCase()) && sentence.length < 150) {
          // Replace keyword with underscores
          const question = sentence.replace(
            new RegExp(`\\b${keyword}\\b`, 'i'), 
            '__________'
          )
          
          if (question.includes('__________')) {
            this.addCard({
              question: `Complete the sentence:\n"${question}"`,
              answer: keyword,
              source: 'cloze'
            })
          }
        }
      })
    })
  }

  // Strategy 3: Reverse Definition ("X is described as...")
  createConceptChecks() {
    const patterns = [
      /([A-Z][a-zA-Z\s]{2,40}?)\s+(?:is|are|means)\s+([^.!?]{15,250})/g
    ]
    patterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(this.text)) !== null) {
        const term = match[1].trim()
        const def = match[2].trim()
        
        // Don't create if definition is too long
        if (def.length < 100) {
            this.addCard({
            question: `Which term describes this concept?\n"${def}"`,
            answer: term,
            source: 'reverse'
            })
        }
      }
    })
  }

  chunkParagraphs() {
    const sentences = this.sentences
    for(let i=0; i<sentences.length; i+=2) {
      if(sentences[i] && sentences[i+1]) {
        this.addCard({
          question: `Explain the concepts discussed in this section:\n"${sentences[i].substring(0, 50)}..."`,
          answer: `${sentences[i]} ${sentences[i+1]}`,
          source: 'chunk'
        })
      }
    }
  }
}

export default FlashcardGenerator