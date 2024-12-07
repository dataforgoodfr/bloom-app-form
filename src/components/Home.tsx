'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = () => {
    router.push('/quiz');
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-3xl font-bold text-center leading-tight">
          {t('welcome')}
        </h1>
        <div className="text-lg text-gray-600 space-y-4">
          {t('hero').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-center">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex justify-center">
          <button 
            onClick={handleClick}
            className="px-8 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('start')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 