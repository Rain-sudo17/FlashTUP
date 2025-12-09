import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import StorageManager from '../AppTools/StorageManager';
import FlashcardGenerator from '../AppTools/FlashcardGenerator';
import { useToast } from './ToastContext';

const FlashcardContext = createContext();

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within FlashcardProvider');
  }
  return context;
};

export const FlashcardProvider = ({ children }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSetName, setCurrentSetName] = useState('');
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [savedSets, setSavedSets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const storageManager = new StorageManager('flashcardSets');
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadSavedSets();
  }, []);

  const loadSavedSets = useCallback(() => {
    try {
      const sets = storageManager.getAllSets();
      setSavedSets(sets);
    } catch (err) {
      console.error('Failed to load saved sets:', err);
    }
  }, []);

  const generateFlashcards = useCallback(async (text, limit = 20) => {
    if (!text || text.length < 50) {
      showError('Please provide more content (at least 50 characters)');
      return false;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generator = new FlashcardGenerator(text);
      const cards = generator.generate(limit);

      if (cards.length === 0) {
        throw new Error('Could not generate flashcards. Please provide more detailed content.');
      }

      setFlashcards(cards);
      setCurrentSetName(`Study Set - ${new Date().toLocaleDateString()}`);
      setCurrentIndex(0);
      setIsStudyMode(true);
      success(`Generated ${cards.length} flashcards successfully!`);
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [success, showError]);

  const updateCard = useCallback((index, updates) => {
    setFlashcards(prev => {
      const newCards = [...prev];
      if (index >= 0 && index < newCards.length) {
        newCards[index] = { ...newCards[index], ...updates };
      }
      return newCards;
    });
  }, []);

  const updateAllCards = useCallback((newCards) => {
    setFlashcards(newCards);
  }, []);

  const saveCurrentSet = useCallback(() => {
    const setName = prompt('Enter a name for this flashcard set:', currentSetName);
    if (!setName) return false;

    const setData = {
      name: setName,
      date: new Date().toISOString(),
      cards: flashcards,
      stats: {
        total: flashcards.length,
        mastered: flashcards.filter(c => c.mastered).length,
        review: flashcards.filter(c => c.reviewLater).length
      }
    };

    const result = storageManager.saveSet(setData);
    if (result) {
      setCurrentSetName(setName);
      loadSavedSets();
      success('Flashcard set saved successfully!');
      return true;
    } else {
      showError('Failed to save flashcard set');
      return false;
    }
  }, [currentSetName, flashcards, success, showError, loadSavedSets]);

  const loadSet = useCallback((index) => {
    const set = storageManager.getSet(index);
    if (set) {
      setFlashcards(set.cards);
      setCurrentSetName(set.name);
      setCurrentIndex(0);
      setIsStudyMode(true);
      success(`Loaded "${set.name}"`);
    } else {
      showError('Failed to load flashcard set');
    }
  }, [success, showError]);

  const deleteSet = useCallback((index) => {
    if (window.confirm('Are you sure you want to delete this flashcard set?')) {
      const result = storageManager.deleteSet(index);
      if (result) {
        loadSavedSets();
        success('Flashcard set deleted');
      } else {
        showError('Failed to delete flashcard set');
      }
    }
  }, [success, showError, loadSavedSets]);

  const resetStudy = useCallback(() => {
    setIsStudyMode(false);
    setFlashcards([]);
    setCurrentIndex(0);
    setCurrentSetName('');
  }, []);

  const value = {
    flashcards,
    currentIndex,
    currentSetName,
    isStudyMode,
    savedSets,
    isLoading,
    setCurrentIndex,
    generateFlashcards,
    updateCard,
    updateAllCards,
    saveCurrentSet,
    loadSet,
    deleteSet,
    resetStudy,
    loadSavedSets
  };
  
  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};