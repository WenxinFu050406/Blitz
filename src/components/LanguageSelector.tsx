import { Languages } from 'lucide-react';
import { Language, useLanguage } from '../context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg backdrop-blur-sm transition-colors border-0">
          <span className="text-base">{currentLang?.flag}</span>
          <Languages className="w-3.5 h-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2.5 cursor-pointer ${
              language === lang.code ? 'bg-cyan-50 text-cyan-700' : ''
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-cyan-600 text-sm">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}