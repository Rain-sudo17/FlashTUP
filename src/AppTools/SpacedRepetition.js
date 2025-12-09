class SpacedRepetition {
  static calculateNextReview(card, quality) {
    const repetitions = card.repetitions || 0
    const easeFactor = card.easeFactor || 2.5
    const interval = card.interval || 0

    let newRepetitions = repetitions
    let newEaseFactor = easeFactor
    let newInterval = interval

    if (quality < 3) {
      newRepetitions = 0
      newInterval = 1
    } else {
      if (repetitions === 0) {
        newInterval = 1
      } else if (repetitions === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(interval * easeFactor)
      }
      newRepetitions = repetitions + 1
    }

    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (newEaseFactor < 1.3) newEaseFactor = 1.3

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

    return {
      ...card,
      repetitions: newRepetitions,
      easeFactor: newEaseFactor,
      interval: newInterval,
      lastReviewed: new Date().toISOString(),
      nextReviewDate: nextReviewDate.toISOString(),
      reviewHistory: [
        ...(card.reviewHistory || []),
        { date: new Date().toISOString(), quality, interval: newInterval }
      ]
    }
  }

  static isDue(card) {
    if (!card.nextReviewDate) return true
    return new Date(card.nextReviewDate) <= new Date()
  }

  static getDueCards(cards) {
    return cards.filter(card => this.isDue(card))
  }

  static sortByPriority(cards) {
    return [...cards].sort((a, b) => {
      const aDue = this.isDue(a)
      const bDue = this.isDue(b)
      if (aDue && !bDue) return -1
      if (!aDue && bDue) return 1
      if (a.nextReviewDate && b.nextReviewDate) {
        return new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
      }
      if (!a.nextReviewDate) return -1
      return 0
    })
  }

  static getStatistics(cards) {
    const dueCards = this.getDueCards(cards)
    const reviewedCards = cards.filter(c => c.lastReviewed)
    return {
      total: cards.length,
      due: dueCards.length,
      reviewed: reviewedCards.length,
      notReviewed: cards.length - reviewedCards.length,
      averageEaseFactor: reviewedCards.length > 0
        ? (reviewedCards.reduce((sum, c) => sum + (c.easeFactor || 2.5), 0) / reviewedCards.length).toFixed(2)
        : 2.5,
      totalReviews: cards.reduce((sum, c) => sum + (c.repetitions || 0), 0)
    }
  }

  static getDifficulty(card) {
    const easeFactor = card.easeFactor || 2.5
    if (easeFactor >= 2.5) return 'easy'
    if (easeFactor >= 2.0) return 'medium'
    return 'hard'
  }

  static formatNextReview(card) {
    if (!card.nextReviewDate) return 'Not reviewed yet'
    const now = new Date()
    const reviewDate = new Date(card.nextReviewDate)
    const diffDays = Math.ceil((reviewDate - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day(s)`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `Due in ${diffDays} day(s)`
  }
}

export default SpacedRepetition