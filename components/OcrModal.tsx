
import React, { useState, useCallback, ChangeEvent, DragEvent, useRef, useEffect } from 'react';
import { extractTextFromImageViaGemini } from '../services/geminiService';
import { GEMINI_OCR_NO_TEXT_MARKER } from '../constants';
import StylizedCopyButtonIcon from './StylizedCopyButtonIcon';

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOcrTextToChat: (text: string) => void;
  isApiKeyMissing: boolean; 
}

// Icons
const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DocumentArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12.75h-6.75M6.75 12.75H4.5m15 0h-2.25m-7.5 0h7.5M12 17.25h-.375a3.375 3.375 0 01-3.375-3.375V12.75m3.75 0V6.75A2.25 2.25 0 009.75 4.5h-1.5A2.25 2.25 0 006 6.75v3.75m0 0H3.75m0 0h-.375a3.375 3.375 0 01-3.375-3.375V9.75m21 0h-3.75m0 0h-.375a3.375 3.375 0 01-3.375-3.375V6.75m3.75 0V3.75A2.25 2.25 0 0016.5 1.5h-1.5A2.25 2.25 0 0012.75 3.75v3.75m0 0h-1.5m13.5 9L12 9 7.5 14.25" />
  </svg>
);

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


interface Notification {
  message: string;
  khmerMessage: string;
  type: 'success' | 'error' | 'info';
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const OcrModal: React.FC<OcrModalProps> = ({ isOpen, onClose, onSendOcrTextToChat, isApiKeyMissing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasExtractionAttempted, setHasExtractionAttempted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDropZoneRef = useRef<HTMLDivElement>(null); 
  const notificationTimeoutRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const extractedTextAreaRef = useRef<HTMLTextAreaElement>(null);


  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";

  const resetStateAndFocus = useCallback((focusDropZone = true) => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setExtractedText('');
    setIsLoading(false);
    setNotification(null);
    setIsDragging(false);
    setHasExtractionAttempted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    if (focusDropZone) {
        setTimeout(() => fileDropZoneRef.current?.focus(), 50);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetStateAndFocus(false); // Don't focus dropzone on initial open
      setTimeout(() => closeButtonRef.current?.focus(), 50); // Focus close button on open
    }
    return () => { 
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [isOpen, resetStateAndFocus]);
  
  useEffect(() => {
    if (extractedText && extractedTextAreaRef.current) {
      extractedTextAreaRef.current.focus();
    }
  }, [extractedText]);


  const showNotification = (message: string, khmerMessage: string, type: Notification['type']) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ message, khmerMessage, type });
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification("Invalid file type. Please select an image.", "ប្រភេទឯកសារមិនត្រឹមត្រូវទេ។ សូមជ្រើសរើសរូបភាព។", "error");
        resetStateAndFocus();
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        showNotification(
          `File is too large. Max ${MAX_FILE_SIZE_MB}MB.`, 
          `ឯកសារធំពេក។ អតិបរមា ${MAX_FILE_SIZE_MB}MB។`, 
          "error"
        );
        resetStateAndFocus();
        return;
      }

      setSelectedFile(file);
      setExtractedText(''); 
      setNotification(null);
      setHasExtractionAttempted(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else { 
      resetStateAndFocus();
    }
  };

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    } else {
      handleFileChange(null); 
    }
  };

  const handleRemoveImage = () => {
    resetStateAndFocus();
  };

  const handleExtractText = async () => {
    if (!selectedFile || isLoading || isApiKeyMissing) return;

    setIsLoading(true);
    setExtractedText('');
    setNotification(null);
    setHasExtractionAttempted(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = (e.target?.result as string).split(',')[1];
        if (!base64Data) {
            throw new Error("Could not read image data.");
        }
        const resultText = await extractTextFromImageViaGemini(base64Data, selectedFile.type);
        
        if (resultText === GEMINI_OCR_NO_TEXT_MARKER || resultText.trim() === '') {
          setExtractedText(''); // Ensure it's empty
          showNotification("No text found in image.", "រកមិនឃើញអត្ថបទក្នុងរូបភាពទេ។", "info");
        } else {
          setExtractedText(resultText);
          showNotification("Text extracted successfully.", "ការដកស្រង់អត្ថបទបានជោគជ័យ។", "success");
        }
      };
      reader.onerror = () => {
        throw new Error("Error reading file for OCR.");
      }
      reader.readAsDataURL(selectedFile);

    } catch (error) {
      console.error("OCR Error in Modal:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      showNotification(`Failed to extract text: ${errorMessage}`, `ការដកស្រង់អត្ថបទបានបរាជ័យ៖ ${errorMessage}`, "error");
      setExtractedText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!extractedText.trim() || isLoading || isApiKeyMissing) return;
    navigator.clipboard.writeText(extractedText)
      .then(() => showNotification("Text copied to clipboard!", "អត្ថបទត្រូវបានចម្លងទៅក្ដារតម្បៀតខ្ទាស់!", "success"))
      .catch(() => showNotification("Failed to copy text.", "ការចម្លងអត្ថបទបានបរាជ័យ។", "error"));
  };

  const handleSendToChat = () => {
    if (!extractedText.trim() || isLoading || isApiKeyMissing) return;
    onSendOcrTextToChat(extractedText);
  };
  
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isApiKeyMissing || isLoading) return; 
    setIsDragging(true);
  };
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isApiKeyMissing || isLoading) return;
    setIsDragging(false);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isApiKeyMissing || isLoading) return; 
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
       if (fileInputRef.current) fileInputRef.current.files = files; 
    }
  };

  if (!isOpen) return null;

  const getNotificationStyles = () => {
    if (!notification) return 'opacity-0 max-h-0';
    let baseStyle = 'p-3 text-sm rounded-md my-3 transition-all duration-300 ease-in-out transform text-center ';
    switch (notification.type) {
      case 'success':
        return baseStyle + 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 opacity-100 max-h-20';
      case 'info':
        return baseStyle + 'bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 opacity-100 max-h-20';
      case 'error':
        return baseStyle + 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600 opacity-100 max-h-20';
      default:
        return 'opacity-0 max-h-0';
    }
  };
  
  const isExtractDisabled = isLoading || !selectedFile || isApiKeyMissing;
  const canPerformTextActions = extractedText.trim() !== '' && !isLoading && !isApiKeyMissing;

  // Determine if we are in a state to show the two-column layout (or single column before text is ready)
  const showContentArea = imagePreviewUrl && !isApiKeyMissing;
  const showTwoColumnLayout = showContentArea && (extractedText.trim() !== '' || (hasExtractionAttempted && notification?.type === 'info') || isLoading);


  return (
    <div 
      className={`fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-75 dark:bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${khmerFont} ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ocr-modal-title"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 id="ocr-modal-title" className="text-xl sm:text-2xl font-semibold text-indigo-700 dark:text-indigo-400">ដកស្រង់អត្ថបទពីរូបភាព (Image to Text OCR)</h2>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transform hover:scale-110 active:scale-95 transition-all"
            aria-label="Close OCR modal (បិទម៉ូឌុល OCR)"
            title="Close OCR modal (បិទម៉ូឌុល OCR)"
          >
            <XMarkIcon />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-1 sm:pr-2 space-y-4 custom-scrollbar">
          {isApiKeyMissing && (
             <div 
              className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-200 p-3 my-2 shadow-sm rounded-r-md"
              role="alert"
            >
              <div className="flex items-center">
                <WarningIcon className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
                <div className="text-sm">
                  <p className="font-semibold">OCR Disabled / OCR ត្រូវបានបិទ</p>
                  <p className={khmerFont}>មុខងារ OCR ត្រូវបានបិទដោយសារសោ API បាត់។</p>
                  <p>(OCR functionality is disabled because the API Key is missing.)</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area: Shown if no image preview and API key is NOT missing (or if API key IS missing, it will be styled as disabled) */}
          {(!imagePreviewUrl || isApiKeyMissing) && (
            <div
              ref={fileDropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !(isApiKeyMissing || isLoading) && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
                isApiKeyMissing || isLoading
                  ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 opacity-60 cursor-not-allowed'
                  : `cursor-pointer ${isDragging 
                      ? 'border-indigo-500 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-white dark:focus:ring-offset-gray-800`
              } transition-colors duration-200`}
              role={isApiKeyMissing || isLoading ? undefined : "button"} 
              tabIndex={isApiKeyMissing || isLoading ? -1 : 0} 
              aria-disabled={isApiKeyMissing || isLoading}
              onKeyDown={(e) => { if (!(isApiKeyMissing || isLoading) && (e.key === 'Enter' || e.key === ' ')) fileInputRef.current?.click(); }}
              title={isApiKeyMissing ? "OCR disabled: API Key missing (OCR ត្រូវបានបិទ៖ សោ API បាត់)" : "Drag and drop image or click to select (អូសហើយទម្លាក់រូបភាព ឬចុចដើម្បីជ្រើសរើស)"}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileInputChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden"
                aria-label="Upload image for OCR"
                disabled={isApiKeyMissing || isLoading}
              />
              <DocumentArrowUpIcon className={`mb-2 ${
                isApiKeyMissing || isLoading
                  ? 'text-gray-400 dark:text-gray-500' 
                  : isDragging 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} 
              />
              <p className={`text-sm ${isApiKeyMissing || isLoading ? 'text-gray-500 dark:text-gray-400' : (isDragging ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400')}`}>
                អូសហើយទម្លាក់រូបភាពនៅទីនេះ ឬ <span className={`font-semibold ${isApiKeyMissing || isLoading ? 'text-gray-500 dark:text-gray-400' :'text-indigo-600 dark:text-indigo-400'}`}>ចុចដើម្បីជ្រើសរើស</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP (អតិបរមា ${MAX_FILE_SIZE_MB}MB)</p>
            </div>
          )}
          
          {/* Main Content: Image Preview and Extracted Text (potentially two-column) */}
          {showContentArea && (
            <div className={`grid ${showTwoColumnLayout ? 'grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3' : 'grid-cols-1 gap-y-3'} items-start`}>
              {/* Left Column or Full Width (Image Preview and Extract Button) */}
              <div className="space-y-3">
                <div className="relative group w-full max-h-64 sm:max-h-72 md:max-h-80 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600 flex justify-center items-center bg-gray-100 dark:bg-gray-700/30 shadow-sm">
                  <img src={imagePreviewUrl!} alt="Selected preview" className="max-w-full max-h-64 sm:max-h-72 md:max-h-80 object-contain" />
                  <button 
                    onClick={handleRemoveImage}
                    disabled={isLoading} 
                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95"
                    aria-label="Remove selected image (លុបរូបភាពដែលបានជ្រើសរើស)"
                    title="Remove selected image (លុបរូបភាពដែលបានជ្រើសរើស)"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                {(!hasExtractionAttempted && !isLoading) && (
                  <button
                    onClick={handleExtractText}
                    disabled={isExtractDisabled} // Handles API key missing as well
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    title={isApiKeyMissing ? "Cannot extract: API Key missing / មិនអាចដកស្រង់៖ សោ API បាត់" : "Extract Text / ដកស្រង់អត្ថបទ"}
                  >
                   ដកស្រង់អត្ថបទ (Extract Text)
                  </button>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
                      <svg className="animate-spin h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">កំពុងដំណើរការ... (Processing...)</span>
                  </div>
                )}
              </div>
              
              {/* Right Column (Extracted Text Area and Actions) - Only shown if applicable */}
              {showTwoColumnLayout && (
                <div className="space-y-3 md:mt-0">
                  {extractedText.trim() && !isLoading && (
                    <>
                      <div>
                        <label htmlFor="extractedOcrText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          អត្ថបទដែលបានដកស្រង់ (Extracted Text):
                        </label>
                        <textarea
                          ref={extractedTextAreaRef}
                          id="extractedOcrText"
                          value={extractedText}
                          readOnly
                          rows={6}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600"
                          aria-label="Extracted text from image"
                          placeholder="Extracted text will appear here."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={handleCopyToClipboard}
                          disabled={!canPerformTextActions}
                          className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold py-3 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-teal-400 dark:focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                          aria-label="ចម្លងអត្ថបទ (Copy Text)"
                          title="ចម្លងអត្ថបទ (Copy Text)"
                        >
                          <StylizedCopyButtonIcon className="w-6 h-6 text-white flex-shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold leading-tight">ចម្លងអត្ថបទ</span>
                            <span className="text-xs font-medium leading-tight">(Copy Text)</span>
                          </div>
                        </button>
                        <button
                          onClick={handleSendToChat}
                          disabled={!canPerformTextActions}
                          className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-green-400 dark:focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                          aria-label="ផ្ញើទៅកាន់ការជជែក (Send to Chat)"
                          title="ផ្ញើទៅកាន់ការជជែក (Send to Chat)"
                        >
                          <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-white flex-shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold leading-tight">ផ្ញើទៅជជែក</span>
                            <span className="text-xs font-medium leading-tight">(Send to Chat)</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                  
                  {hasExtractionAttempted && !extractedText.trim() && !isLoading && notification?.type === 'info' && (
                     <div className="p-4 text-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
                      <p className="font-semibold text-lg">{notification.khmerMessage}</p>
                      <p className="text-sm">({notification.message})</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {notification && (
            <div 
              className={getNotificationStyles()}
              role="alert"
              aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
            >
              {notification.khmerMessage} ({notification.message})
            </div>
          )}
          
          {(selectedFile && !isApiKeyMissing) && (
            <button
              onClick={() => resetStateAndFocus()}
              className="w-full mt-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all flex items-center justify-center shadow hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Process another image (ដំណើរការរូបភាពផ្សេងទៀត)"
              title="Process another image (ដំណើរការរូបភាពផ្សេងទៀត)"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" aria-hidden="true"/>
              Process Another Image / ដំណើរការរូបភាពផ្សេងទៀត
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OcrModal;
    