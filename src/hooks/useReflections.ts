import { useState, useEffect, useCallback } from 'react';
import { Reflection, MoodEntry } from '@/types/reflection';

const REFLECTIONS_KEY = 'calmmind_reflections';
const MOOD_ENTRIES_KEY = 'calmmind_mood_entries';

export function useReflections() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reflections from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REFLECTIONS_KEY);
      if (stored) {
        setReflections(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save reflections to localStorage whenever they change
  const saveReflections = useCallback((newReflections: Reflection[]) => {
    try {
      localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(newReflections));
      setReflections(newReflections);
    } catch (error) {
      console.error('Error saving reflections:', error);
    }
  }, []);

  const addReflection = useCallback((reflection: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReflection: Reflection = {
      ...reflection,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveReflections([newReflection, ...reflections]);
    return newReflection;
  }, [reflections, saveReflections]);

  const updateReflection = useCallback((id: string, updates: Partial<Reflection>) => {
    const updated = reflections.map(r => 
      r.id === id 
        ? { ...r, ...updates, updatedAt: new Date().toISOString() }
        : r
    );
    saveReflections(updated);
  }, [reflections, saveReflections]);

  const deleteReflection = useCallback((id: string) => {
    saveReflections(reflections.filter(r => r.id !== id));
  }, [reflections, saveReflections]);

  const getReflection = useCallback((id: string) => {
    return reflections.find(r => r.id === id);
  }, [reflections]);

  return {
    reflections,
    isLoading,
    addReflection,
    updateReflection,
    deleteReflection,
    getReflection,
  };
}

export function useMoodEntries() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MOOD_ENTRIES_KEY);
      if (stored) {
        setMoodEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  }, []);

  const addMoodEntry = useCallback((entry: MoodEntry) => {
    const newEntries = [entry, ...moodEntries].slice(0, 30); // Keep last 30 days
    try {
      localStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(newEntries));
      setMoodEntries(newEntries);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  }, [moodEntries]);

  return { moodEntries, addMoodEntry };
}
