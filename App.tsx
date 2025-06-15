import React, { useState, useCallback, useEffect, useRef } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import { ChatView } from './components/ChatView';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import OcrModal from './components/OcrModal';
import { AuthView, ActiveView, Theme } from './types'; 
import { resetChatSession } from './services/geminiService';

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 flex-shrink-0" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.HOME);
  const [authView, setAuthView] = useState<AuthView>(AuthView.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);
  const [ocrTextForChat, setOcrTextForChat] = useState<string | null>(null); // New state for OCR text
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme as Theme) || Theme.SYSTEM;
  });

  const khmerFont = "font-kantumruy";
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // API Key Check
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAldNoXtHy331OHk88wcnTZ9JxQvh1xy6M';
    if (apiKey && apiKey.trim() !== "") {
      setIsApiKeyMissing(false);
    } else {
      setIsApiKeyMissing(true);
      console.warn("GEMINI_API_KEY environment variable is not set. AI features might be disabled or fail.");
    }

    // Theme application logic
    const root = window.document.documentElement;
    const isDark = theme === Theme.DARK || (theme === Theme.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    // Listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === Theme.SYSTEM) {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);

  }, [theme]);

  useEffect(() => {
    if (isOcrModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      previouslyFocusedElementRef.current?.focus();
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOcrModalOpen]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    setAuthView(AuthView.CHAT);
    setIsAuthLoading(false);
  }, []);

  const handleRegisterSuccess = useCallback(() => {
    setIsAuthenticated(true); 
    setAuthView(AuthView.CHAT);
    setIsAuthLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthView(AuthView.LOGIN);
    resetChatSession(); 
    setActiveView(ActiveView.CHAT_APP); 
  }, []);

  const navigateToRegister = useCallback(() => {
    setAuthView(AuthView.REGISTER);
  }, []);

  const navigateToLogin = useCallback(() => {
    setAuthView(AuthView.LOGIN);
  }, []);

  const handleNavigate = useCallback((view: ActiveView) => {
    setActiveView(view);
    if (view === ActiveView.CHAT_APP) {
      if (!isAuthenticated) {
        setAuthView(AuthView.LOGIN);
      } else {
        setAuthView(AuthView.CHAT);
      }
    }
  }, [isAuthenticated]);

  const handleOpenOcrModal = useCallback(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    setIsOcrModalOpen(true);
  }, []);

  const handleCloseOcrModal = useCallback(() => {
    setIsOcrModalOpen(false);
  }, []);

  const handleSendOcrTextToChat = useCallback((text: string) => {
    setOcrTextForChat(text);
    setActiveView(ActiveView.CHAT_APP); // Navigate to chat view
     if (!isAuthenticated) { // If not authenticated, ensure login view is shown within chat app context
        setAuthView(AuthView.LOGIN);
    } else {
        setAuthView(AuthView.CHAT);
    }
    setIsOcrModalOpen(false); // Close modal
  }, [isAuthenticated]);

  const clearOcrTextForChat = useCallback(() => {
    setOcrTextForChat(null);
  }, []);


  const renderChatAppContent = () => {
    if (!isAuthenticated) {
      if (authView === AuthView.LOGIN) {
        return <Login 
                  onLoginSuccess={handleLoginSuccess} 
                  navigateToRegister={navigateToRegister} 
                  isLoading={isAuthLoading}
                  setIsLoading={setIsAuthLoading} 
                />;
      }
      if (authView === AuthView.REGISTER) {
        return <Register 
                  onRegisterSuccess={handleRegisterSuccess} 
                  navigateToLogin={navigateToLogin} 
                  isLoading={isAuthLoading}
                  setIsLoading={setIsAuthLoading}
                />;
      }
    }
    if (isAuthenticated && authView === AuthView.CHAT) {
      return <ChatView 
                onLogout={handleLogout} 
                isAuthenticated={isAuthenticated} 
                isApiKeyMissing={isApiKeyMissing}
                ocrTextForChat={ocrTextForChat || undefined}
                clearOcrTextForChat={clearOcrTextForChat} 
              />;
    }
    // Default to Login if conditions not met, e.g., if navigating to CHAT_APP but not authenticated
    return <Login 
              onLoginSuccess={handleLoginSuccess} 
              navigateToRegister={navigateToRegister}
              isLoading={isAuthLoading}
              setIsLoading={setIsAuthLoading} 
            />;
  };

  const renderContent = () => {
    switch (activeView) {
      case ActiveView.HOME:
        return <HomePage />;
      case ActiveView.ABOUT:
        return <AboutPage />;
      case ActiveView.CHAT_APP:
        return renderChatAppContent();
      case ActiveView.PRICING: 
        return <PricingPage onNavigate={handleNavigate} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={`flex flex-col h-screen ${khmerFont} bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
      <Navbar 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        onOpenOcrModal={handleOpenOcrModal}
        currentTheme={theme}
        onSetTheme={handleSetTheme}
      />
      {isApiKeyMissing && (
        <div 
          className="bg-red-100 border-b-2 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 p-3 text-sm text-center shadow-lg flex items-center justify-center z-20"
          role="alert"
        >
          <WarningIcon className="text-red-600 dark:text-red-400" />
          <span className="font-medium">
            <strong>សោ API បាត់! (API Key Missing!)</strong> មុខងារ AI អាចនឹងមិនដំណើរការត្រឹមត្រូវទេ។ (AI features may not work correctly. Please ensure the API_KEY environment variable is set.)
          </span>
        </div>
      )}
      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>
      {isOcrModalOpen && (
        <OcrModal 
          isOpen={isOcrModalOpen} 
          onClose={handleCloseOcrModal} 
          onSendOcrTextToChat={handleSendOcrTextToChat}
          isApiKeyMissing={isApiKeyMissing} 
        />
      )}
    </div>
  );
};

export default App;
