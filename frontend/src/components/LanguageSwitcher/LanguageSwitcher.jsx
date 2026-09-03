import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import './LanguageSwitcher.css';

const languages = [
  { code: 'uz', name: "O'zbekcha", short: 'UZB', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'en', name: 'English', short: 'ENG', flag: '🇬🇧' },
];

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => i18n.language?.startsWith(l.code)) || languages[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Segmented Pills Variant (ideal for inside Profile Menu & Drawers)
  if (variant === 'pills') {
    return (
      <div className="lang-pills-container">
        {languages.map((lang) => {
          const isSelected = currentLang.code === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              className={`lang-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{lang.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Clean Dropdown Variant
  return (
    <div className="lang-switcher-container" ref={dropdownRef}>
      <button
        type="button"
        className={`lang-trigger-capsule ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Til / Язык / Language"
        aria-expanded={isOpen}
      >
        <Globe size={14} className="lang-globe-icon" />
        <span className="lang-code">{currentLang.short}</span>
        <ChevronDown size={12} className={`lang-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu card">
          <div className="lang-options-list">
            {languages.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  <span className="lang-option-flag">{lang.flag}</span>
                  <span className="lang-option-name">{lang.name}</span>
                  <span className="lang-option-code">({lang.short})</span>
                  {isSelected && <Check size={14} className="lang-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
