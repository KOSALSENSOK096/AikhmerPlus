import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage as ChatMessageType, SenderType } from '../types';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import { sendMessageToGeminiStream, resetChatSession, initializeChatSession, getConnectionStatus } from '../services/geminiService';
import { CHAT_CLEARED_MESSAGE_TEXT } from '../constants';

const LOCAL_STORAGE_MESSAGES_KEY = 'aiPlusKhmerChatMessagesV2';


const createWelcomeMessage = (): ChatMessageType => ({
  id: 'welcome-0',
  text: "សួស្តី! សូមស្វាគមន៍មកកាន់ AI Plus Khmer Chat។ តើខ្ញុំអាចជួយអ្វីអ្នកបានថ្ងៃនេះ? (Hello! Welcome to AI Plus Khmer Chat. How can I assist you today?)",
  sender: SenderType.AI,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

// Icons for ChatView
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.223.091M15 3.75V4.5a2.25 2.25 0 0 0 2.25 2.25h1.5A2.25 2.25 0 0 0 21 4.5V3.75m-18 0h1.5a2.25 2.25 0 0 0 2.25-2.25V3.75m12 0H9m6 0a2.25 2.25 0 0 0-2.25-2.25h-1.5A2.25 2.25 0 0 0 9 3.75M3 15h18" />
  </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 sm:mr-1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-6-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
);

const ArrowDownCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

// Toast Icons
const CheckCircleSolidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const ExclamationCircleSolidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V4.75zM10 12a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
  </svg>
);

const InformationCircleSolidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V8.25a.75.75 0 00-1.5 0V13.25zm0-8.5A.75.75 0 0110 3.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V4.75z" clipRule="evenodd" />
  </svg>
);

// Dialog Icons
const XMarkDialogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1.5" {...props}>
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);
  
const CheckDialogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1.5" {...props}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
);


interface ChatViewProps {
  onLogout: () => void;
  isAuthenticated: boolean;
  isApiKeyMissing: boolean;
  ocrTextForChat?: string;
  clearOcrTextForChat?: () => void; 
}

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
    message: string;
    khmerMessage: string;
    type: ToastType;
}

const isValidImageData = (img: any): img is { base64Data: string; mimeType: string; name?: string } => {
  return img &&
    typeof img.base64Data === 'string' &&
    typeof img.mimeType === 'string' &&
    (typeof img.name === 'undefined' || typeof img.name === 'string');
};

const isValidMessage = (msg: any): msg is ChatMessageType => {
  return msg &&
    typeof msg.id === 'string' &&
    typeof msg.text === 'string' &&
    (msg.sender === SenderType.USER || msg.sender === SenderType.AI) &&
    typeof msg.timestamp === 'string' &&
    (typeof msg.images === 'undefined' || (Array.isArray(msg.images) && msg.images.every(isValidImageData)));
};


export const ChatView: React.FC<ChatViewProps> = ({ 
  onLogout, 
  isAuthenticated, 
  isApiKeyMissing,
  ocrTextForChat,
  clearOcrTextForChat
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const khmerFont = "font-kantumruy";
  
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const clearChatButtonRef = useRef<HTMLButtonElement>(null);
  const cancelClearChatButtonRef = useRef<HTMLButtonElement>(null);
  const prevOcrTextForChatRef = useRef<string | null | undefined>(undefined);


  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };
  
  const showToast = useCallback((message: string, khmerMessage: string, type: ToastType = 'info') => {
    if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, khmerMessage, type });
    toastTimeoutRef.current = window.setTimeout(() => {
        setToast(null);
    }, 3000);
  }, []);

  useEffect(() => {
    let initialMessages: ChatMessageType[];
    try {
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
      if (storedMessages) {
        const parsedMessages: any[] = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.every(isValidMessage)) {
          initialMessages = parsedMessages.length > 0 ? (parsedMessages as ChatMessageType[]) : [createWelcomeMessage()];
        } else { 
          console.warn("Invalid message structure in localStorage. Resetting chat.");
          initialMessages = [createWelcomeMessage()];
          localStorage.removeItem(LOCAL_STORAGE_MESSAGES_KEY); 
        }
      } else { 
        initialMessages = [createWelcomeMessage()];
      }
    } catch (e) {
      console.error("Failed to load messages from localStorage:", e);
      initialMessages = [createWelcomeMessage()];
      localStorage.removeItem(LOCAL_STORAGE_MESSAGES_KEY);
    }
    setMessages(initialMessages);
    if (isAuthenticated && !isApiKeyMissing) { 
        initializeChatSession(initialMessages);
    }
  }, [isAuthenticated, isApiKeyMissing]); 

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_MESSAGES_KEY);
      }
    } catch (e) {
      console.error("Failed to save messages to localStorage:", e);
    }
  }, [messages]);


  useEffect(() => {
    if (messages.length > 0) {
        const chatDiv = chatContainerRef.current;
        if (chatDiv) {
            const isNearBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 200; 
            const lastMessageIsUser = messages[messages.length - 1]?.sender === SenderType.USER;
            if (isNearBottom || lastMessageIsUser) {
                scrollToBottom(lastMessageIsUser ? 'smooth' : 'auto');
            }
        } else {
             scrollToBottom('auto'); 
        }
    }
  }, [messages]);


  useEffect(() => {
    const chatDiv = chatContainerRef.current;
    if (!chatDiv) return;
    const handleScroll = () => {
      const isScrolledUp = chatDiv.scrollTop < chatDiv.scrollHeight - chatDiv.clientHeight - (chatDiv.clientHeight * 0.3);
      setShowScrollToBottom(isScrolledUp);
    };
    chatDiv.addEventListener('scroll', handleScroll);
    return () => chatDiv.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showClearConfirm) {
        cancelClearChatButtonRef.current?.focus();
    }
  }, [showClearConfirm]);

  useEffect(() => {
    if (prevOcrTextForChatRef.current && !ocrTextForChat && clearOcrTextForChat) { 
      showToast("Text from OCR added to input.", "អត្ថបទពី OCR ត្រូវបានបន្ថែមទៅប្រអប់បញ្ចូល។", "info");
    }
    prevOcrTextForChatRef.current = ocrTextForChat;
  }, [ocrTextForChat, showToast, clearOcrTextForChat]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnectionStatus = () => {
      const status = getConnectionStatus();
      setIsConnected(status);
    };

    // Check immediately
    checkConnectionStatus();
    
    // Then check periodically
    const intervalId = setInterval(checkConnectionStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = useCallback(async (messageData: { text: string; images: { base64Data: string; mimeType: string; name: string }[] }) => {
    if ((!messageData.text.trim() && messageData.images.length === 0) || isLoading || isApiKeyMissing || !isConnected) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: messageData.text,
      images: messageData.images.map(img => ({ base64Data: img.base64Data, mimeType: img.mimeType, name: img.name })),
      sender: SenderType.USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setRetryAttempt(0);

    let aiResponseText = '';
    const aiMessageId = `ai-${Date.now()}`;
    
    const aiPlaceholderMessage: ChatMessageType = {
        id: aiMessageId,
        text: '', 
        sender: SenderType.AI,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    try {
      const stream = await sendMessageToGeminiStream(messageData.text, messageData.images);
      let firstChunkReceived = false;

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          aiResponseText += chunkText;
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
          ));
          if (!firstChunkReceived) firstChunkReceived = true;
          if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            if (scrollHeight - scrollTop - clientHeight < 200) { 
              scrollToBottom('smooth');
            }
          }
        }
      }
      
      if (!firstChunkReceived && aiResponseText === '') {
         setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: "AI did not provide a text response. / AI មិនបានផ្តល់ការឆ្លើយតបជាអត្ថបទទេ។" } : msg
        ));
      }
      
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        if (scrollHeight - scrollTop - clientHeight < 200) {
            scrollToBottom('smooth');
        }
      }

    } catch (err) {
      console.error("Error handling Gemini stream:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      
      // Check if it's a retry attempt from the service
      if (err instanceof Error && err.message.includes("Retrying request")) {
        const match = err.message.match(/attempt (\d+)/);
        if (match) {
          setRetryAttempt(parseInt(match[1]));
        }
      } else {
        // Remove the "Error:" prefix if it's already in the message
        const cleanErrorMessage = errorMessage.replace(/^Error: /, '');
        
        // Update the AI message with the error
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? {
            ...msg,
            text: cleanErrorMessage,
            isError: true
          } : msg
        ));
        
        // Set the error state
        setError(cleanErrorMessage);
        scrollToBottom('smooth');
        
        // If it's an overload error, we might want to retry after a delay
        if (err instanceof Error && (err.message.includes("503") || err.message.includes("overloaded"))) {
          setTimeout(() => {
            setError(null);
            setRetryAttempt(0);
          }, 5000);
        }
      }
    } finally {
      if (!error) {
        setIsLoading(false);
        setRetryAttempt(0);
      }
    }
  }, [isLoading, isApiKeyMissing, isConnected]); 

  const confirmClearChat = () => {
    resetChatSession(); 
    localStorage.removeItem(LOCAL_STORAGE_MESSAGES_KEY);
    
    const newWelcomeMessage = createWelcomeMessage(); 
    const clearedDisplayMessage: ChatMessageType = {
        id: `ai-cleared-${Date.now()}`,
        text: CHAT_CLEARED_MESSAGE_TEXT,
        sender: SenderType.AI, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const messagesForState = [newWelcomeMessage, clearedDisplayMessage];
    setMessages(messagesForState); 
    
    if (isAuthenticated && !isApiKeyMissing) {
       initializeChatSession([newWelcomeMessage]); 
    }

    showToast("Chat history cleared!", "ប្រវត្តិជជែកត្រូវបានសម្អាត!", "success");
    setShowClearConfirm(false); 
    clearChatButtonRef.current?.focus(); 
    scrollToBottom('auto');
  };
  
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast("Copied to clipboard!", "បានចម្លងទៅក្ដារតម្បៀតខ្ទាស់!", "success"))
      .catch(() => showToast("Failed to copy.", "ការចម្លងបានបរាជ័យ។", "error"));
  };
  
  const openClearConfirmDialog = () => {
    setShowClearConfirm(true);
  };

  const handleCancelClearChat = () => {
    setShowClearConfirm(false);
    clearChatButtonRef.current?.focus(); 
  }

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleSolidIcon className="mr-2 flex-shrink-0" />;
      case 'error':
        return <ExclamationCircleSolidIcon className="mr-2 flex-shrink-0" />;
      case 'info':
        return <InformationCircleSolidIcon className="mr-2 flex-shrink-0" />;
      default:
        return null;
    }
  };


  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${khmerFont} border-x border-gray-200 dark:border-gray-700`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm p-3 sm:p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center max-w-5xl mx-auto px-2 sm:px-0">
          <h1 className="text-lg sm:text-xl font-semibold text-indigo-700 dark:text-indigo-400">AI Plus Khmer Chat</h1>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              ref={clearChatButtonRef}
              onClick={openClearConfirmDialog}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 flex items-center"
              aria-label="Clear chat history (សម្អាតប្រវត្តិជជែក)"
              title="Clear chat history (សម្អាតប្រវត្តិជជែក)"
            >
              <TrashIcon /> Clear (សម្អាត)
            </button>
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 flex items-center"
              aria-label="Logout (ចេញពីប្រព័ន្ធ)"
              title="Logout (ចេញពីប្រព័ន្ធ)"
            >
              <LogoutIcon /> Logout (ចេញ)
            </button>
          </div>
        </div>
      </header>

      {isApiKeyMissing && (
        <div 
          className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-200 p-3 mx-0 sm:mx-0 my-0 shadow-sm"
          role="alert"
        >
          <div className="flex items-center">
            <WarningIcon className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
            <div className="text-sm">
              <p className="font-semibold">AI Features Disabled / មុខងារ AI ត្រូវបានបិទ</p>
              <p>The API Key is missing. You can type messages, but they won't be processed by the AI.</p>
              <p className={khmerFont}>សោ API បាត់។ អ្នកអាចវាយសារបាន ប៉ុន្តែពួកវានឹងមិនត្រូវបានដំណើរការដោយ AI ទេ។</p>
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="bg-red-100 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 p-2">
          <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400">
            <WarningIcon className="animate-pulse" />
            <span className={`text-sm ${khmerFont}`}>
              ការតភ្ជាប់បណ្តាញមានបញ្ហា។ កំពុងព្យាយាមភ្ជាប់ឡើងវិញ... (Network connection issues. Attempting to reconnect...)
            </span>
          </div>
        </div>
      )}

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 relative" role="log" aria-live="polite">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} onCopyText={handleCopyText} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1].sender === SenderType.USER && (
           <div className="flex justify-start mb-3">
             <div className="max-w-xs md:max-w-md lg:max-w-lg">
                <LoadingIndicator retryAttempt={retryAttempt} />
             </div>
           </div>
        )}
         {isLoading && messages.length > 0 && messages[messages.length - 1].sender === SenderType.AI && messages[messages.length-1].text === '' && (
           <div className="flex justify-start mb-3">
             <div className="max-w-xs md:max-w-md lg:max-w-lg">
                <LoadingIndicator />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
        <button
          onClick={() => scrollToBottom('smooth')}
          className={`scroll-to-bottom-button p-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${showScrollToBottom ? 'visible' : ''}`}
          aria-label="Scroll to bottom (រំកិលទៅក្រោម)"
          title="Scroll to bottom (រំកិលទៅក្រោម)"
          aria-hidden={!showScrollToBottom}
          tabIndex={showScrollToBottom ? 0 : -1}
        >
          <ArrowDownCircleIcon />
        </button>
      </div>

      {error && !isApiKeyMissing && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm text-center border-t border-red-200 dark:border-red-700" role="alert">
          {error}
        </div>
      )}
      
      {toast && (
        <div 
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 p-3 text-sm rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out flex items-center
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
            dark:bg-opacity-90`}
          role="alert"
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
        >
          {getToastIcon(toast.type)}
          <span>{toast.khmerMessage} ({toast.message})</span>
        </div>
      )}

      {showClearConfirm && (
        <div className="confirm-dialog-overlay" onClick={handleCancelClearChat}>
          <div 
            className="confirm-dialog bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl w-full max-w-md"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-chat-dialog-title"
            aria-describedby="clear-chat-dialog-description"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Escape') handleCancelClearChat(); }}
          >
            <h3 id="clear-chat-dialog-title" className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
              បញ្ជាក់ការសម្អាត (Confirm Clear)
            </h3>
            <p id="clear-chat-dialog-description" className="mb-6 text-gray-700 dark:text-gray-300">
              តើអ្នកពិតជាចង់សម្អាតប្រវត្តិជជែកទាំងអស់មែនទេ? សកម្មភាពនេះមិនអាចមិនធ្វើវិញបានទេ។
              (Are you sure you want to clear the entire chat history? This action cannot be undone.)
            </p>
            <div className="flex justify-end space-x-3">
              <button
                ref={cancelClearChatButtonRef}
                onClick={handleCancelClearChat}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors flex items-center"
              >
                <XMarkDialogIcon /> បោះបង់ (Cancel)
              </button>
              <button
                onClick={confirmClearChat}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors flex items-center"
              >
                <CheckDialogIcon /> សម្អាត (Clear)
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        isDisabled={isApiKeyMissing || !isConnected}
        initialTextFromOcr={ocrTextForChat}
        onOcrTextConsumed={clearOcrTextForChat}
        showToast={showToast}
        placeholderText={
          isApiKeyMissing
            ? "API Key មិនត្រឹមត្រូវ ឬបាត់បង់។ (API Key is invalid or missing.)"
            : !isConnected
            ? "មិនអាចភ្ជាប់ទៅកាន់សេវាកម្ម AI បានទេ។ (Cannot connect to AI service.)"
            : "សរសេរសារនៅទីនេះ... (Type your message here...)"
        }
      />
    </div>
  );
};
