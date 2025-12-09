class SpacedRepetition {
  /**
   * Process a card review and calculate next due date
   * Uses standard SM-2 Algorithm
   * @param {Object} card - The flashcard object
   * @param {number} quality - 0-5 rating (0=Blackout, 5=Perfect)
   */
  static calculateNextReview(card, quality) {
    // Default values if card is new
    const repetitions = card.repetitions || 0;
    const easeFactor = card.easeFactor || 2.5;
    const interval = card.interval || 0;

    let newRepetitions = repetitions;
    let newEaseFactor = easeFactor;
    let newInterval = interval;

    // Quality < 3 means incorrect response -> Reset interval
    if (quality < 3) {
      newRepetitions = 0;
      newInterval = 1; // Review again tomorrow (or immediately in some versions)
    } else {
      // Success case
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      newRepetitions = repetitions + 1;
    }

    // Update Ease Factor (Standard SM-2 Formula)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Ease factor shouldn't drop below 1.3
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    // Calculate next date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      ...card,
      repetitions: newRepetitions,
      easeFactor: newEaseFactor,
      interval: newInterval,
      lastReviewed: new Date().toISOString(),
      nextReviewDate: nextReviewDate.toISOString(),
      // Optional: Track history for charts/stats later
      reviewHistory: [
        ...(card.reviewHistory || []),
        { date: new Date().toISOString(), quality, interval: newInterval }
      ]
    };
  }

  /**
   * Check if a card needs to be reviewed today
   */
  static isDue(card) {
    // If it has never been reviewed, it is due immediately
    if (!card.nextReviewDate) return true;
    
    const now = new Date();
    const reviewDate = new Date(card.nextReviewDate);
    
    // Reset time components to compare just the calendar days
    // This ensures cards due "today at 5pm" show up "today at 9am" too
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());

    return due <= today;
  }

  static getDueCards(cards) {
    return cards.filter(card => this.isDue(card));
  }

  static sortByPriority(cards) {
    return [...cards].sort((a, b) => {
      const aDue = this.isDue(a);
      const bDue = this.isDue(b);
      
      // 1. Due cards come first
      if (aDue && !bDue) return -1;
      if (!aDue && bDue) return 1;
      
      // 2. If both due, oldest due date first
      if (a.nextReviewDate && b.nextReviewDate) {
        return new Date(a.nextReviewDate) - new Date(b.nextReviewDate);
      }
      
      // 3. New cards (no date) come before cards scheduled for future
      if (!a.nextReviewDate) return -1;
      return 0;
    });
  }

  static getStatistics(cards) {
    const dueCards = this.getDueCards(cards);
    const reviewedCards = cards.filter(c => c.lastReviewed);
    
    return {
      total: cards.length,
      due: dueCards.length,
      reviewed: reviewedCards.length,
      notReviewed: cards.length - reviewedCards.length,
      averageEaseFactor: reviewedCards.length > 0
        ? (reviewedCards.reduce((sum, c) => sum + (c.easeFactor || 2.5), 0) / reviewedCards.length).toFixed(2)
        : 2.5,
      totalReviews: cards.reduce((sum, c) => sum + (c.repetitions || 0), 0)
    };
  }
}

export default SpacedRepetition;