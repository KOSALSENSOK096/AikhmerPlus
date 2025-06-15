import React from 'react';

interface LoadingIndicatorProps {
  retryAttempt?: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ retryAttempt }) => {
  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";
  
  const getLoadingMessage = () => {
    if (retryAttempt && retryAttempt > 0) {
      return `កំពុងព្យាយាមម្តងទៀត... (${retryAttempt}/3)\nRetrying... (${retryAttempt}/3)`;
    }
    return "កំពុងវាយបញ្ចូល...\nTyping...";
  };

  return (
    <div className={`flex items-center space-x-3 p-3.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-md backdrop-blur-sm backdrop-saturate-150 border border-gray-200/50 dark:border-slate-600/50 ${khmerFont}`}>
      <div className="flex space-x-1.5">
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '0.8s'}}></div>
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s', animationDuration: '0.8s'}}></div>
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.4s', animationDuration: '0.8s'}}></div>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
        {getLoadingMessage()}
      </span>
    </div>
  );
};

export default LoadingIndicator;