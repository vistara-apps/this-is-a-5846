import React from 'react'
import { Globe } from 'lucide-react'

export default function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  const languages = [
    { code: 'english', label: 'English', flag: '🇺🇸' },
    { code: 'spanish', label: 'Español', flag: '🇪🇸' }
  ]

  return (
    <div className="card-gradient rounded-lg p-lg">
      <h3 className="text-lg font-semibold text-white mb-md flex items-center gap-sm">
        <Globe className="w-5 h-5 text-accent" />
        Language
      </h3>
      
      <div className="grid grid-cols-2 gap-sm">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`p-md rounded-md border transition-colors ${
              selectedLanguage === lang.code
                ? 'bg-accent/20 border-accent text-white'
                : 'bg-white/10 border-white/30 text-white/80 hover:bg-white/20'
            }`}
          >
            <span className="text-xl mr-sm">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}