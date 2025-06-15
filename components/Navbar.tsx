
import React, { useState, useEffect, useRef } from 'react';
import { ActiveView, Theme } from '../types'; 
import StackedDocumentsIcon from './StackedDocumentsIcon';

// Icons for Theme Toggle
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const ComputerDesktopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
  </svg>
);


interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenOcrModal: () => void;
  currentTheme: Theme;
  onSetTheme: (theme: Theme) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate, onOpenOcrModal, currentTheme, onSetTheme }) => {
  const khmerFont = "font-kantumruy";
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonId = "theme-toggle-button";


  const navItems = [
    { view: ActiveView.HOME, label: 'Home Page', khmerLabel: 'ទំព័រដើម' },
    { view: ActiveView.ABOUT, label: 'About', khmerLabel: 'អំពីយើង' },
    { view: ActiveView.PRICING, label: 'Pricing', khmerLabel: 'តម្លៃ' },
    { view: ActiveView.CHAT_APP, label: 'AI Plus Khmer Chat', khmerLabel: 'AI Plus Khmer Chat' },
  ];

  const themeOptions = [
    { theme: Theme.LIGHT, label: 'Light', khmerLabel: 'ភ្លឺ', Icon: SunIcon },
    { theme: Theme.DARK, label: 'Dark', khmerLabel: 'ងងឹត', Icon: MoonIcon },
    { theme: Theme.SYSTEM, label: 'System', khmerLabel: 'ប្រព័ន្ធ', Icon: ComputerDesktopIcon },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeDropdownRef.current && 
        !themeDropdownRef.current.contains(event.target as Node) &&
        themeButtonRef.current && 
        !themeButtonRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveThemeIcon = () => {
    const activeThemeOption = themeOptions.find(opt => opt.theme === currentTheme);
    return activeThemeOption ? <activeThemeOption.Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" /> : <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true"/>;
  };

  return (
    <nav className={`bg-indigo-700 dark:bg-indigo-800 text-white p-4 shadow-md ${khmerFont} sticky top-0 z-30`}>
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-2xl font-bold mb-2 sm:mb-0 text-white">
          AI Plus Khmer
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <ul className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <li key={item.view}>
                <button
                  onClick={() => onNavigate(item.view)}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95
                    ${activeView === item.view
                      ? 'bg-indigo-900 dark:bg-indigo-950 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600 dark:hover:bg-indigo-700 hover:text-white'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:ring-opacity-75`}
                  aria-current={activeView === item.view ? 'page' : undefined}
                  title={
                    activeView === item.view 
                      ? `Current page: ${item.label} (${item.khmerLabel})` 
                      : `${item.label} (${item.khmerLabel})`
                  }
                >
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.khmerLabel}</span>

                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onOpenOcrModal}
            className="p-2 text-indigo-100 hover:bg-indigo-600 dark:hover:bg-indigo-700 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:ring-opacity-75 transform hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out"
            aria-label="Image to Text OCR (ដកស្រង់អត្ថបទពីរូបភាព)"
            title="Image to Text OCR (ដកស្រង់អត្ថបទពីរូបភាព)"
          >
            <StackedDocumentsIcon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>
          
          {/* Theme Toggle Dropdown */}
          <div className="relative">
            <button
              ref={themeButtonRef}
              id={themeButtonId}
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className={`p-2 text-indigo-100 hover:bg-indigo-600 dark:hover:bg-indigo-700 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:ring-opacity-75 transform hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out
                ${isThemeDropdownOpen ? 'bg-indigo-600 dark:bg-indigo-700' : ''}
              `}
              aria-label="Toggle theme (ប្ដូរផ្ទៃ)"
              title="Toggle theme (ប្ដូរផ្ទៃ)"
              aria-haspopup="true"
              aria-expanded={isThemeDropdownOpen}
              aria-controls="theme-menu"
            >
              {getActiveThemeIcon()}
            </button>
            {isThemeDropdownOpen && (
              <div 
                ref={themeDropdownRef}
                id="theme-menu"
                className="theme-dropdown-menu absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby={themeButtonId}
              >
                {themeOptions.map((option) => (
                  <button
                    key={option.theme}
                    onClick={() => {
                      onSetTheme(option.theme);
                      setIsThemeDropdownOpen(false);
                      themeButtonRef.current?.focus(); // Return focus to the toggle button
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2
                      ${currentTheme === option.theme 
                        ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800`}
                    role="menuitemradio"
                    aria-checked={currentTheme === option.theme}
                    title={`Set theme to ${option.label} (កំណត់ផ្ទៃជា ${option.khmerLabel})`}
                  >
                    <option.Icon className={`w-5 h-5 ${currentTheme === option.theme ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`} aria-hidden="true" />
                    <span>{option.label} ({option.khmerLabel})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
