
import React, { useState, useRef, useEffect } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  navigateToRegister: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, navigateToRegister, isLoading, setIsLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";
  const generalErrorId = "login-general-error";

  const validateEmail = (email: string): boolean => {
    // Basic email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let currentError = '';
    let focused = false;

    if (!email.trim()) {
      currentError = 'សូមបំពេញគ្រប់ช่องទាំងអស់។ (Please fill in all fields.)';
      emailInputRef.current?.focus();
      focused = true;
    } else if (!password.trim()) {
      currentError = 'សូមបំពេញគ្រប់ช่องទាំងអស់។ (Please fill in all fields.)';
      if (!focused) passwordInputRef.current?.focus();
      focused = true;
    } else if (!validateEmail(email)) {
      currentError = 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវទេ។ (Invalid email format.)';
      if (!focused) emailInputRef.current?.focus();
      focused = true;
    } else if (password.length < 6) {
      currentError = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។ (Password must be at least 6 characters long.)';
      if (!focused) passwordInputRef.current?.focus();
      focused = true;
    }
    
    if (currentError) {
      setError(currentError);
      return;
    }
    
    setIsLoading(true);
    // Mock login success after a short delay
    setTimeout(() => {
      onLoginSuccess();
    }, 1000); 
  };

  const isEmailInvalid = () => {
    if (!error) return false;
    const lowerError = error.toLowerCase();
    if (lowerError.includes('email') || lowerError.includes('អ៊ីមែល')) return true;
    if ((lowerError.includes('fill') || lowerError.includes('បំពេញ')) && !email.trim()) return true;
    return false;
  };

  const isPasswordInvalid = () => {
    if (!error) return false;
    const lowerError = error.toLowerCase();
    if (lowerError.includes('password') || lowerError.includes('ពាក្យសម្ងាត់')) return true;
    if ((lowerError.includes('fill') || lowerError.includes('បំពេញ')) && !password.trim()) return true;
    return false;
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-900 p-4 ${khmerFont}`}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          ចូលគណនី (Login)
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div 
              id={generalErrorId}
              className="p-3 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 rounded-lg shadow border border-red-300 dark:border-red-700"
              role="alert"
            >
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email)
            </label>
            <input
              ref={emailInputRef}
              id="email-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:shadow-lg sm:text-sm transition-all duration-150 ease-in-out bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="you@example.com"
              aria-describedby={error ? generalErrorId : undefined}
              aria-invalid={isEmailInvalid()}
            />
          </div>
          <div>
            <label htmlFor="password-login"className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ពាក្យសម្ងាត់ (Password)
            </label>
            <input
              ref={passwordInputRef}
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:shadow-lg sm:text-sm transition-all duration-150 ease-in-out bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
              aria-describedby={error ? generalErrorId : undefined}
              aria-invalid={isPasswordInvalid()}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'ចូលគណនី (Login)'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          មិនទាន់មានគណនី? (Don't have an account yet?)
          <button
            onClick={!isLoading ? navigateToRegister : undefined}
            disabled={isLoading}
            className="ml-1 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus:outline-none focus:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-transform duration-150 transform hover:scale-105 active:scale-95"
          >
            បង្កើតគណនី (Create Account)
          </button>
        </p>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Plus Khmer Chat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
