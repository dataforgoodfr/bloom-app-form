'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function CompletionPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('completion.title')}
        </h1>
        
        <div className="text-lg text-gray-600 space-y-4">
          <p>{t('completion.thank_you')}</p>
          <p>{t('completion.contact_soon')}</p>
        </div>

        <Button 
          onClick={() => router.push('/home')}
          className="mt-8"
        >
          {t('completion.back_home')}
        </Button>
      </div>
    </div>
  );
} 