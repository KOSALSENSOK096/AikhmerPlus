import React, { useState, useRef, ChangeEvent, useEffect, KeyboardEvent } from 'react';
import type { ToastMessage, ToastType } from './ChatView'; // Import Toast types

interface ChatInputProps {
  onSendMessage: (messageData: { text: string; images: { base64Data: string; mimeType: string; name: string }[] }) => void;
  isLoading: boolean;
  isDisabled?: boolean;
  placeholderText?: string;
  initialTextFromOcr?: string;
  onOcrTextConsumed?: () => void;
  showToast?: (message: string, khmerMessage: string, type?: 'success' | 'error' | 'info') => void;
}

interface SelectedImage {
  id: string;
  name:string;
  dataUrl: string; 
  base64Data: string; 
  mimeType: string;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const PaperClipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.687 7.687a1.5 1.5 0 0 0 2.122 2.122l7.687-7.687-2.122-2.122Z" />
  </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const MAX_IMAGE_ATTACHMENTS = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isDisabled = false,
  placeholderText = "សរសេរសារនៅទីនេះ... (Type your message here...)",
  initialTextFromOcr,
  onOcrTextConsumed,
  showToast
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachedImages, setAttachedImages] = useState<{ base64Data: string; mimeType: string; name: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";
  const apiUnavailableMessageId = "api-unavailable-message";

  const isInputDisabled = isLoading || isDisabled;
  const MAX_TEXTAREA_HEIGHT = 120; // Approx 5-6 lines

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > MAX_TEXTAREA_HEIGHT) {
        textareaRef.current.style.height = `${MAX_TEXTAREA_HEIGHT}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  useEffect(() => {
    if (initialTextFromOcr && textareaRef.current) {
      setInputValue(initialTextFromOcr);
      textareaRef.current.focus();
      const len = initialTextFromOcr.length;
      textareaRef.current.setSelectionRange(len, len);
      
      if (onOcrTextConsumed) {
        onOcrTextConsumed(); 
      }
    }
  }, [initialTextFromOcr, onOcrTextConsumed]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let filesAddedCount = 0;
       
      if (attachedImages.length + files.length > MAX_IMAGE_ATTACHMENTS) {
        if (showToast) {
          showToast(
            `Cannot attach more than ${MAX_IMAGE_ATTACHMENTS} images.`, 
            `មិនអាចភ្ជាប់រូបភាពលើសពី ${MAX_IMAGE_ATTACHMENTS} បានទេ។`, 
            "error"
          );
        } else {
          console.warn(`Cannot select more than ${MAX_IMAGE_ATTACHMENTS} images.`);
        }
        if (event.target) event.target.value = ""; 
        return;
      }

      files.forEach(file => {
        if (attachedImages.length + filesAddedCount >= MAX_IMAGE_ATTACHMENTS) {
          if (showToast && files.length > (MAX_IMAGE_ATTACHMENTS - attachedImages.length)) { // Only show if some files were skipped due to count
             showToast(
              `Maximum ${MAX_IMAGE_ATTACHMENTS} images allowed. Some files were not added.`,
              `អនុញ្ញាតតែ ${MAX_IMAGE_ATTACHMENTS} រូបភាពអតិបរមា។ ឯកសារខ្លះមិនត្រូវបានបន្ថែមទេ។`,
              "info"
            );
          }
          return; // Stop processing more files if limit reached
        }

        if (!file.type.startsWith('image/')) {
          if (showToast) {
            showToast(
              `File '${file.name}' is not an image and was skipped.`, 
              `ឯកសារ '${file.name}' មិនមែនជារូបភាព ហើយត្រូវបានរំលង។`,
              "error"
            );
          }
          return; // Skip non-image files
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          if (showToast) {
            showToast(
              `File '${file.name}' is too large (max ${MAX_FILE_SIZE_MB}MB) and was skipped.`, 
              `ឯកសារ '${file.name}' ធំពេក (អតិបរមា ${MAX_FILE_SIZE_MB}MB) ហើយត្រូវបានរំលង។`,
              "error"
            );
          }
          return; // Skip files that are too large
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const base64Data = dataUrl.split(',')[1];
          setAttachedImages(prev => [...prev, {
            base64Data,
            mimeType: file.type,
            name: file.name,
          }]);
          filesAddedCount++;
        };
        reader.readAsDataURL(file);
      });
      if (event.target) {
        event.target.value = ""; 
      }
      textareaRef.current?.focus(); // Focus textarea after adding files
    }
  };

  const removeImage = (imageId: string) => {
    setAttachedImages(prev => prev.filter(img => img.name !== imageId));
    textareaRef.current?.focus(); // Focus textarea after removing an image
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputValue.trim();
    const imagesToSend = attachedImages.map(img => ({ base64Data: img.base64Data, mimeType: img.mimeType, name: img.name }));

    if ((textToSend || imagesToSend.length > 0) && !isInputDisabled) {
      onSendMessage({ text: textToSend, images: imagesToSend });
      setInputValue('');
      setAttachedImages([]);
      if (textareaRef.current) {
         textareaRef.current.focus();
         textareaRef.current.style.height = 'auto'; // Reset height
         textareaRef.current.style.overflowY = 'hidden';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter will naturally create a new line
  };
  
  let displayPlaceholder = placeholderText;
  if (isInputDisabled) {
    displayPlaceholder = "API Key is missing. Input disabled. / សោ API បាត់។ ការបញ្ចូលត្រូវបានបិទ។";
  } else if (isLoading) {
    displayPlaceholder = "AI កំពុងរង់ចាំ... (AI is waiting...)";
  }

  const sendButtonTitle = isInputDisabled 
    ? "Cannot send: API Key missing. / មិនអាចផ្ញើ៖ សោ API បាត់។"
    : isLoading 
      ? "Sending... (កំពុងផ្ញើ...)" 
      : "Send message (ផ្ញើសារ) / Enter to send, Shift+Enter for new line";

  const attachButtonTitle = isInputDisabled
    ? "Cannot attach: API Key missing. / មិនអាចភ្ជាប់៖ សោ API បាត់។"
    : `Attach image files (Max ${MAX_IMAGE_ATTACHMENTS}, ${MAX_FILE_SIZE_MB}MB each) / ភ្ជាប់ឯកសាររូបភាព (អតិបរមា ${MAX_IMAGE_ATTACHMENTS}, ${MAX_FILE_SIZE_MB}MB ក្នុងមួយឯកសារ)`;

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 ${khmerFont}`}>
      {attachedImages.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/30 overflow-x-auto">
          {attachedImages.map(image => (
            <div key={image.name} className="relative group flex-shrink-0">
              <img 
                src={`data:${image.mimeType};base64,${image.base64Data}`} 
                alt={image.name} 
                className="h-16 w-16 object-cover rounded-md border border-gray-300 dark:border-gray-500 shadow-sm"
              />
              <button
                onClick={() => removeImage(image.name)}
                disabled={isInputDisabled}
                className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95"
                aria-label={`Remove image ${image.name} (លុបរូបភាព ${image.name})`}
                title={`Remove image ${image.name} (លុបរូបភាព ${image.name})`}
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
       {isInputDisabled && (
          <p id={apiUnavailableMessageId} className="text-xs text-red-600 dark:text-red-400 mb-2 text-center">
            មុខងារវាយបញ្ចូលត្រូវបានបិទ។ សូមប្រាកដថា API key ត្រូវបានកំណត់។ (Input disabled. Please ensure API key is set.)
          </p>
        )}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isInputDisabled}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-150 hover:scale-110 active:scale-95 self-end"
          aria-label={attachButtonTitle}
          title={attachButtonTitle}
        >
          <PaperClipIcon />
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden"
            multiple 
            aria-hidden="true" 
            tabIndex={-1}
            disabled={isInputDisabled}
          />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={displayPlaceholder}
          className={`flex-grow p-3.5 rounded-xl shadow-md focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 dark:focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-gray-100 disabled:opacity-70 disabled:cursor-not-allowed resize-none overflow-y-hidden backdrop-blur-sm backdrop-saturate-150
            ${isInputDisabled ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400 dark:ring-red-500 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 placeholder-red-600 dark:placeholder-red-500 focus:ring-red-500' : 'border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-500'}
          `}
          style={{minHeight: '2.5rem'}}
          disabled={isInputDisabled}
          aria-label="Message input (ប្រអប់បញ្ចូលសារ), Shift+Enter for new line"
          aria-describedby={isInputDisabled ? apiUnavailableMessageId : undefined}
          aria-busy={isLoading}
          title="Type your message (វាយសាររបស់អ្នក). Shift+Enter for a new line."
        />
        <button
          type="submit"
          disabled={isInputDisabled || (!inputValue.trim() && attachedImages.length === 0)}
          className="p-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 hover:rotate-1 self-end"
          aria-label={sendButtonTitle}
          title={sendButtonTitle}
          aria-busy={isLoading}
        >
          {isLoading && !isInputDisabled ? ( 
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <SendIcon className="transform transition-transform group-hover:rotate-12" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
