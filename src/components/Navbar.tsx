'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { email, progress, totalPairs, clearUser } = useUser();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  const progressPercentage = ((progress / totalPairs) * 100).toFixed(1);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/home" 
            className="text-xl font-bold hover:text-blue-600 transition-colors cursor-pointer"
          >
            Fishing Quiz
          </Link>
          
          <div className="flex items-center gap-6">
            {/* User info and progress */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="hidden md:inline">
                Logged in as <span className="font-medium">{email}</span>
              </span>
              
              {pathname === '/quiz' && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="whitespace-nowrap">
                    {progress}/{totalPairs} ({progressPercentage}%)
                  </span>
                </div>
              )}
            </div>

            {/* Language selector and logout */}
            <div className="flex items-center gap-4">
              <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t('language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="fr">FR</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleLogout} variant="outline">
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 