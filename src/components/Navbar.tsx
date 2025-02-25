'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
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
  const { email, clearUser } = useUser();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/home" 
            className="text-xl font-bold hover:text-blue-600 transition-colors cursor-pointer"
          >
            Your perception of fishing gear impact
          </Link>
          
          <div className="flex items-center gap-6">
            {/* User info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="hidden md:inline">
                Logged in as <span className="font-medium">{email}</span>
              </span>
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