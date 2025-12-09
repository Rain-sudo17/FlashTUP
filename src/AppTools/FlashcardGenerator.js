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

  // Helper to strip "noise" characters like bullets and quotes
  cleanTextArtifacts(text) {
    return text
      .replace(/["“”•]/g, "") // Remove quotes and bullets
      .replace(/^[\s\-\.]+|[\s\-\.]+$/g, "") // Remove leading/trailing hyphens or dots
      .trim();
  }

  // Strategy 1: Definitions
  extractDefinitions() {
    const patterns = [
      /(?:^|\.\s+)([A-Z][a-zA-Z\s-]{2,50}?)\s+(?:is|are|means|refers to|can be defined as)\s+([^.!?]{10,250})/g,
      /(?:^|\.\s+)([A-Z][a-zA-Z\s-]{2,50}?):\s*([^.!?]{10,250})/g
    ]

    patterns.forEach(pattern => {
      let match
      pattern.lastIndex = 0
      
      while ((match = pattern.exec(this.text)) !== null) {
        let term = this.cleanTextArtifacts(match[1]);
        let def = this.cleanTextArtifacts(match[2]);
        
        const invalidTerms = ['There', 'It', 'This', 'That', 'Here']
        if (!invalidTerms.includes(term)) {
            this.addCard({
              question: term, // Removed "What is the definition of..." wrapper
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
        if (keyword.length < 4) continue

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')
        
        if (regex.test(sentence)) {
            // 1. Clean the sentence first (remove bullets/quotes)
            let cleanSentence = this.cleanTextArtifacts(sentence);

            // 2. Create the blank
            const question = cleanSentence.replace(regex, '__________')
            
            // 3. Add Card (Removed "Complete the sentence" wrapper)
            this.addCard({
                question: question,
                answer: keyword,
                source: 'cloze'
            })
            break 
        }
      }
    })
  }

  // Strategy 3: Reverse Definition
  createConceptChecks() {
    const patterns = [
      /(?:^|\.\s+)([A-Z][a-zA-Z\s-]{2,50}?)\s+(?:is|are|means)\s+([^.!?]{10,250})/g
    ]
    
    patterns.forEach(pattern => {
      let match
      pattern.lastIndex = 0
      while ((match = pattern.exec(this.text)) !== null) {
        let term = this.cleanTextArtifacts(match[1]);
        let def = this.cleanTextArtifacts(match[2]);
        const invalidTerms = ['There', 'It', 'This', 'That', 'Here', 'The']

        if (!invalidTerms.includes(term) && def.length > 20) {
            this.addCard({
                question: def, // Removed "Which term describes..." wrapper
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
    for(let i = 0; i < sentences.length - 1; i += 2) {
      // Clean up the chunk text
      const rawChunk = `${sentences[i]} ${sentences[i+1]}`;
      const chunk = this.cleanTextArtifacts(rawChunk);

      if (chunk.length < 30) continue
      
      this.addCard({
        question: sentences[i].substring(0, 60) + "...", // Removed "Explain concepts..." wrapper
        answer: chunk,
        source: 'chunk'
      })
    }
  }
}

export default FlashcardGenerator