'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { logResult, QuizRecord } from '@/utils/supabase';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

interface FishingGear {
  path_image: string;
  name: string;
  EN: string;
  FR: string;
}

interface FishingGearData {
  [key: string]: FishingGear;
}

interface QuizState {
  firstName: string;
  lastName: string;
  email: string;
  language: string;
  skippedPairs: string[][];
}

export default function QuizPage() {
  const { t, i18n } = useTranslation();
  const { email, updateProgress, setTotalPairs } = useUser();
  const [gearPairs, setGearPairs] = useState<string[][]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [fishingGearData, setFishingGearData] = useState<FishingGearData>({});
  const [quizState] = useState<QuizState>({
    firstName: '',
    lastName: '',
    email: '',
    language: i18n.language,
    skippedPairs: []
  });
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalPairsCount, setTotalPairsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const allPairsRef = useRef<string[][]>([]);

  // Generate all possible pairs of gear
  const generateGearPairs = (gearData: FishingGearData) => {
    const gearNumbers = Object.keys(gearData);
    const pairs: string[][] = [];
    
    for (let i = 0; i < gearNumbers.length; i++) {
      for (let j = i + 1; j < gearNumbers.length; j++) {
        pairs.push([gearNumbers[i], gearNumbers[j]].sort());
      }
    }
    
    return pairs;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoading) return;
      
      try {
        const response = await fetch('/data/fishing_gear.json');
        const data = await response.json();
        setFishingGearData(data);
        
        const allPairs = generateGearPairs(data);
        allPairsRef.current = allPairs.sort(() => Math.random() - 0.5);
        
        const maxTotalPairs = allPairs.length;
        setTotalPairsCount(maxTotalPairs);
        setTotalPairs(maxTotalPairs);
        
        let remainingPairs = [...allPairsRef.current];
        let completed = 0;
        
        if (email) {
          try {
            const combinationsResponse = await fetch(`/api/combinations?email=${encodeURIComponent(email)}`);
            if (combinationsResponse.ok) {
              const { existingCombinations } = await combinationsResponse.json();
              const existingSet = new Set(existingCombinations);
              completed = existingSet.size;
              
              remainingPairs = allPairsRef.current.filter(pair => {
                const gearNames = [
                  data[pair[0]].name,
                  data[pair[1]].name
                ].sort();
                return !existingSet.has(JSON.stringify(gearNames));
              });
            }
          } catch (e) {
            console.error("Error fetching combinations:", e);
          }
        }
        
        setAnsweredCount(completed);
        updateProgress(completed);
        setGearPairs(remainingPairs);
        setCurrentPairIndex(0);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [email, setTotalPairs, updateProgress, isInitialLoading]);

  const handleSelection = async (selection: 'A' | 'B' | 'unknown') => {
    // First check if we're already at the end or processing
    if (isSubmitting || currentPairIndex >= gearPairs.length) return;
    
    setIsSubmitting(true);
    
    try {
      const currentPair = gearPairs[currentPairIndex];
      
      if (selection === 'unknown') {
        const updatedPairs = [...gearPairs];
        const skippedPair = updatedPairs.splice(currentPairIndex, 1)[0];
        updatedPairs.push(skippedPair);
        
        setGearPairs(updatedPairs);
        setIsSubmitting(false);
        return;
      }
      
      const leftGear = fishingGearData[currentPair[0]].name;
      const rightGear = fishingGearData[currentPair[1]].name;
      
      const record: QuizRecord = {
        language: i18n.language === 'fr' ? 'Français' : 'English',
        email: email!,
        first_name: quizState.firstName,
        last_name: quizState.lastName,
        option_left: leftGear,
        option_right: rightGear,
        n_trials: answeredCount,
        result: selection === 'A' ? 'left' : 'right',
        source: new URLSearchParams(window.location.search).get('utm_source') || ''
      };
      
      await logResult(record);
      
      const newCount = answeredCount + 1;
      setAnsweredCount(newCount);
      updateProgress(newCount);
      
      // Always increment the index even if it's the last pair
      // This ensures we reach the completion state
      setCurrentPairIndex(currentPairIndex + 1);
    } catch (error) {
      console.error('Error handling selection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix the loading and empty state conditions
  if (isInitialLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading quiz...</p>
      </div>
    </div>;
  }

  // Make sure we show something even when no pairs are available
  if (gearPairs.length === 0 || currentPairIndex >= gearPairs.length) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {i18n.language === 'fr' 
              ? 'Quiz terminé !' 
              : 'Quiz completed!'}
          </h2>
          <p className="text-lg mb-6">
            {i18n.language === 'fr' 
              ? 'Merci pour votre participation à cette étude.' 
              : 'Thank you for your participation in this study.'}
          </p>
          <div className="text-gray-600 mb-8">
            <p>
              {i18n.language === 'fr' 
                ? `Vous avez classé ${answeredCount} combinaisons` 
                : `You ranked ${answeredCount} combinations`}
            </p>
            <div className="mt-2">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(answeredCount / totalPairsCount) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-sm">
                {answeredCount} / {totalPairsCount} ({Math.round((answeredCount / totalPairsCount) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPair = gearPairs[currentPairIndex];
  const gearA = fishingGearData[currentPair[0]];
  const gearB = fishingGearData[currentPair[1]];
  const progress = (answeredCount / totalPairsCount) * 100;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-1 text-sm text-gray-600">
          {answeredCount} / {totalPairsCount} ({Math.round(progress)}%)
        </div>
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
        {/* Gear A Card */}
        <div className="p-4 border rounded-lg shadow-sm flex flex-col gap-3">
          <button 
            onClick={() => handleSelection('A')}
            className={`px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors mb-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {t('quiz.a_more_dangerous')}
          </button>
          <Image 
            src={`/images/${gearA.path_image}`} 
            alt={gearA.name}
            width={300}
            height={200}
            className="w-full rounded-md max-h-48 object-contain"
          />
          <h3 className="text-lg font-semibold">{gearA.name}</h3>
          <p className="text-gray-700 text-sm">{gearA[i18n.language === 'fr' ? 'FR' : 'EN']}</p>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-3 py-4">
          <button 
            onClick={() => handleSelection('unknown')}
            className={`px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {t('quiz.dont_know')}
          </button>
        </div>

        {/* Gear B Card */}
        <div className="p-4 border rounded-lg shadow-sm flex flex-col gap-3">
          <button 
            onClick={() => handleSelection('B')}
            className={`px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors mb-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {t('quiz.b_more_dangerous')}
          </button>
          <Image 
            src={`/images/${gearB.path_image}`} 
            alt={gearB.name}
            width={300}
            height={200}
            className="w-full rounded-md max-h-48 object-contain"
          />
          <h3 className="text-lg font-semibold">{gearB.name}</h3>
          <p className="text-gray-700 text-sm">{gearB[i18n.language === 'fr' ? 'FR' : 'EN']}</p>
        </div>
      </div>
    </div>
  );
} 