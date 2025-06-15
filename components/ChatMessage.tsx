import React, { useEffect, useState, useRef } from 'react';
import { ChatMessage as ChatMessageType, SenderType } from '../types'; 
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CHAT_CLEARED_MESSAGE_TEXT } from '../constants'; 


interface ChatMessageProps {
  message: ChatMessageType & { isError?: boolean };
  onCopyText: (text: string) => void; 
}

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m9.75 9.25c.621 0 1.125-.504 1.125-1.125V7.875c0-.621-.504-1.125-1.125-1.125H15M9.375 15.375H15m-3.375-3.375h3.375M9.375 12h1.5m3 0h1.5m-4.5 3.375h1.5m3 0h1.5M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V21M3 3h12M3 7.5h12M3 12h12M3 16.5h12" />
  </svg>
);

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

const RetryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

interface MessageSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

function parseMessageContent(text: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n?```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    segments.push({
      type: 'code',
      content: match[2].trim(), 
      language: match[1] || 'plaintext',
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.substring(lastIndex) });
  }
  
  if (segments.length === 0 && text && text.trim().length > 0) {
     segments.push({ type: 'text', content: text });
  }

  return segments;
}


const ChatMessage: React.FC<ChatMessageProps> = ({ message, onCopyText }) => {
  const isUser = message.sender === SenderType.USER;
  const khmerFont = "font-kantumruy"; 
  const [copiedItemKey, setCopiedItemKey] = useState<string | null>(null); // Key for the item whose "Copied!" tooltip is active
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePerformCopy = (textToCopy: string, itemKey: string) => {
    onCopyText(textToCopy); // This handles the actual copy and global toast
    setCopiedItemKey(itemKey);
    setTimeout(() => {
      setCopiedItemKey(null);
    }, 2000); // Reset after 2 seconds
  };
  
  const messageSegments = parseMessageContent(message.text);
  const messageContentCopyKey = `message-content-${message.id}`;

  if (message.text === CHAT_CLEARED_MESSAGE_TEXT && message.sender === SenderType.AI) {
    return (
      <div 
        ref={messageRef}
        className={`flex justify-center my-4 transition-all duration-500 ease-out ${isVisible ? 'message-enter-active' : 'message-enter'}`}
        role="log"
        aria-live="polite"
      >
        <div className={`text-center px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-sm ${khmerFont}`}>
          {message.text.split('/').map((part, index) => (
            <span key={index} className="block">{part.trim()}</span>
          ))}
          <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-1">{message.timestamp}</p>
        </div>
      </div>
    );
  }

  const isAiError = message.sender === SenderType.AI && (message.isError || message.text.startsWith("Error:"));

  return (
    <div 
      ref={messageRef}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 group/message relative transition-all duration-500 ease-out ${isVisible ? 'message-enter-active' : 'message-enter'}`}
      role="listitem"
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-3.5 py-2.5 rounded-xl shadow-md backdrop-blur-sm backdrop-saturate-150 ${khmerFont} ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-br-none transform hover:scale-[1.02] hover:-translate-x-0.5'
            : isAiError
              ? 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-500 rounded-bl-none hover:shadow-lg transition-all duration-300 ease-out transform hover:scale-[1.02] hover:translate-x-0.5'
              : 'bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 text-gray-800 dark:text-slate-200 rounded-bl-none border border-gray-200/80 dark:border-slate-600/80 hover:shadow-lg transition-all duration-300 ease-out transform hover:scale-[1.02] hover:translate-x-0.5'
        } transition-all duration-300 ease-out`}
      >
        {isAiError && (
          <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
            <WarningIcon />
            <span className="text-sm font-medium">AI Error / បញ្ហា AI</span>
          </div>
        )}
        
        {messageSegments.map((segment, index) => {
          if (segment.type === 'text') {
            return <p key={`text-${index}`} className="text-sm whitespace-pre-wrap break-words">{segment.content}</p>;
          }
          if (segment.type === 'code') {
            const codeBlockCopyKey = `code-block-${index}-${message.id}`;
            return (
              <div 
                key={`code-${index}`} 
                className="group/codeblock relative rounded-md my-2 overflow-x-auto shadow-inner bg-slate-800 dark:bg-slate-900"
              >
                {segment.language && segment.language.toLowerCase() !== 'plaintext' && (
                   <span className="absolute top-1.5 left-2 text-xs text-slate-300 bg-black bg-opacity-40 px-1.5 py-0.5 rounded-sm select-none z-10">
                    {segment.language}
                  </span>
                )}
                <button
                  onClick={() => handlePerformCopy(segment.content, codeBlockCopyKey)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white rounded-md opacity-0 group-hover/codeblock:opacity-100 focus:opacity-100 transition-all duration-200 z-10 transform hover:scale-110 active:scale-95 hover:rotate-3"
                  aria-label="Copy code snippet (ចម្លងបំណែកកូដ)"
                  title={copiedItemKey === codeBlockCopyKey ? "Copied! (បានចម្លង!)" : "Copy code (ចម្លងកូដ)"}
                >
                  <CopyIcon className="w-4 h-4 transform transition-transform" />
                </button>
                <SyntaxHighlighter 
                  language={segment.language} 
                  style={atomOneDark}
                  customStyle={{ 
                    padding: '1em', 
                    paddingTop: (segment.language && segment.language.toLowerCase() !== 'plaintext') ? '2em' : '1em',
                    fontSize: '0.85em', 
                    borderRadius: '0.375rem', 
                    backgroundColor: 'transparent' // Parent div handles background
                  }}
                  showLineNumbers={segment.content.split('\n').length > 3}
                  lineNumberStyle={{ opacity: 0.5, fontSize: '0.8em', userSelect: 'none' }}
                  wrapLines={true}
                  lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                >
                  {segment.content}
                </SyntaxHighlighter>
              </div>
            );
          }
          return null; 
        })}

        {message.images && message.images.length > 0 && (
          <div className={`mt-2 grid gap-2 ${message.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {message.images.map((img, idx) => (
              <a 
                key={idx} 
                href={`data:${img.mimeType};base64,${img.base64Data}`} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={img.name || `View attached image ${idx + 1}`}
                className="block rounded-md overflow-hidden border border-gray-300 dark:border-gray-500 shadow-sm hover:shadow-md transition-shadow"
              >
                <img 
                  src={`data:${img.mimeType};base64,${img.base64Data}`} 
                  alt={img.name || `attached image ${idx + 1}`} 
                  className="max-h-40 w-full object-contain bg-gray-100 dark:bg-gray-600"
                />
              </a>
            ))}
          </div>
        )}
        
        <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-between'} mt-1.5 ${!isUser && (messageSegments.length > 0 || (message.images && message.images.length > 0)) ? 'pt-1.5 border-t border-opacity-50 ' + (isUser ? 'border-indigo-400 dark:border-indigo-400' 
            : isAiError ? 'border-red-400 dark:border-red-600'
            : 'border-gray-300 dark:border-slate-600') : ''}`}>
          <p className={`text-xs ${
            isUser 
              ? 'text-indigo-200 dark:text-indigo-300 opacity-90' 
              : isAiError
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-500 dark:text-slate-400'
          }`}>
            {message.timestamp}
          </p>
          {!isUser && (messageSegments.length > 0 || (message.images && message.images.length > 0)) && ( // Only show copy for AI if there's content
            <button
              onClick={() => handlePerformCopy(message.text, messageContentCopyKey)}
              className={`ml-2 p-1 rounded-md opacity-0 group-hover/message:opacity-100 focus:opacity-100 transition-all duration-200 ${
                isAiError 
                  ? 'text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                  : 'text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-600/30'
              } transform hover:scale-110 active:scale-95 hover:rotate-3`}
              aria-label="Copy entire message (ចម្លងសារទាំងមូល)"
              title={copiedItemKey === messageContentCopyKey ? "Copied! (បានចម្លង!)" : "Copy message (ចម្លងសារ)"}
            >
              <CopyIcon className="w-4 h-4 transform transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;