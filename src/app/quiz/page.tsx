'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FishingGear {
  path_image: string;
  name: string;
  EN: string;
  FR: string;
}

interface FishingGearData {
  [key: string]: FishingGear;
}

export default function QuizPage() {
  const { t, i18n } = useTranslation();
  const [gearPairs, setGearPairs] = useState<string[][]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [fishingGearData, setFishingGearData] = useState<FishingGearData>({});

  // Generate all possible pairs of gear
  const generateGearPairs = (gearData: FishingGearData) => {
    const gearNumbers = Object.keys(gearData);
    const pairs: string[][] = [];
    
    for (let i = 0; i < gearNumbers.length; i++) {
      for (let j = i + 1; j < gearNumbers.length; j++) {
        pairs.push([gearNumbers[i], gearNumbers[j]]);
      }
    }
    
    // Shuffle the pairs
    return pairs.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    // Load fishing gear data
    fetch('/data/fishing_gear.json')
      .then(response => response.json())
      .then(data => {
        setFishingGearData(data);
        setGearPairs(generateGearPairs(data));
      })
      .catch(error => console.error('Error loading fishing gear data:', error));
  }, []);

  const handleSelection = (selection: 'A' | 'B' | 'equal' | 'unknown') => {
    // Here you'll handle the user's selection
    // For now, just move to next pair
    setCurrentPairIndex(prev => prev + 1);
  };

  if (gearPairs.length === 0) return <div>Loading...</div>;

  // Make sure we don't try to access pairs beyond the array length
  if (currentPairIndex >= gearPairs.length) {
    return <div>Quiz completed!</div>;
  }

  const currentPair = gearPairs[currentPairIndex];
  const gearA = fishingGearData[currentPair[0]];
  const gearB = fishingGearData[currentPair[1]];
  const totalPairs = gearPairs.length;
  const progress = (currentPairIndex / totalPairs) * 100;

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
          {currentPairIndex + 1} / {totalPairs}
        </div>
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
        {/* Gear A Card */}
        <div className="p-4 border rounded-lg shadow-sm flex flex-col gap-3">
          <img 
            src={`/images/${gearA.path_image}`} 
            alt={gearA.name} 
            className="w-full h-auto rounded-md max-h-48 object-contain"
          />
          <h3 className="text-lg font-semibold">{gearA.name}</h3>
          <p className="text-gray-700 text-sm">{gearA[i18n.language === 'fr' ? 'FR' : 'EN']}</p>
          <button 
            onClick={() => handleSelection('A')}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('quiz.a_more_dangerous')}
          </button>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-3 py-4">
          <button 
            onClick={() => handleSelection('equal')}
            className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            {t('quiz.equally_dangerous')}
          </button>
          <button 
            onClick={() => handleSelection('unknown')}
            className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
          >
            {t('quiz.dont_know')}
          </button>
        </div>

        {/* Gear B Card */}
        <div className="p-4 border rounded-lg shadow-sm flex flex-col gap-3">
          <img 
            src={`/images/${gearB.path_image}`} 
            alt={gearB.name} 
            className="w-full h-auto rounded-md max-h-48 object-contain"
          />
          <h3 className="text-lg font-semibold">{gearB.name}</h3>
          <p className="text-gray-700 text-sm">{gearB[i18n.language === 'fr' ? 'FR' : 'EN']}</p>
          <button 
            onClick={() => handleSelection('B')}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('quiz.b_more_dangerous')}
          </button>
        </div>
      </div>
    </div>
  );
} 