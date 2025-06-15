import { GoogleGenAI, type Chat, GenerateContentResponse, Part, GenerateContentParameters, Content } from "@google/genai";
import { GEMINI_MODEL_NAME, KHMER_CHAT_SYSTEM_PROMPT, GEMINI_OCR_PROMPT, GEMINI_OCR_NO_TEXT_MARKER, CHAT_CLEARED_MESSAGE_TEXT } from '../constants';
import { ChatMessage as ChatMessageType, SenderType } from '../types';

interface ImageData {
  base64Data: string;
  mimeType: string;
  name?: string;
}

let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null; 

interface ConnectionStatus {
  isConnected: boolean;
  lastCheckTime: number;
  consecutiveFailures: number;
}

let connectionStatus: ConnectionStatus = {
  isConnected: true,
  lastCheckTime: Date.now(),
  consecutiveFailures: 0
};

const MAX_CONSECUTIVE_FAILURES = 3;
const CONNECTION_CHECK_INTERVAL = 30000; // 30 seconds
const CONNECTION_RESET_THRESHOLD = 300000; // 5 minutes

const getAiInstance = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = 'AIzaSyAldNoXtHy331OHk88wcnTZ9JxQvh1xy6M';
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const transformMessagesToGeminiHistory = (messages: ChatMessageType[]): Content[] => {
  return messages
    .filter(msg => {
      const hasContent = msg.text.trim() !== '' || (msg.images && msg.images.length > 0);
      return msg.text !== CHAT_CLEARED_MESSAGE_TEXT && hasContent;
    })
    .map(msg => {
      const parts: Part[] = [];
      if (msg.text.trim()) {
        parts.push({ text: msg.text });
      }
      msg.images?.forEach(img => {
        parts.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.base64Data
          }
        });
      });

      return {
        role: msg.sender === SenderType.USER ? 'user' : 'model',
        parts: parts,
      };
    })
    .filter(content => content.parts.length > 0); 
};

export const initializeChatSession = (historyMessages: ChatMessageType[] = []): void => {
  const currentAi = getAiInstance();
  const transformedHistory = transformMessagesToGeminiHistory(historyMessages);
  
  const MAX_HISTORY_ITEMS = 50; 
  let truncatedHistory = transformedHistory.length > MAX_HISTORY_ITEMS 
    ? transformedHistory.slice(-MAX_HISTORY_ITEMS) 
    : transformedHistory;

  if (transformedHistory.length > MAX_HISTORY_ITEMS) {
    console.warn(`Original history length ${transformedHistory.length} exceeded max ${MAX_HISTORY_ITEMS}, truncating.`);
  }

  let historyForChatCreation = truncatedHistory;

  if (historyForChatCreation.length > 0 && historyForChatCreation[0].role === 'model') {
    const firstUserTurnIndex = historyForChatCreation.findIndex(h => h.role === 'user');
    if (firstUserTurnIndex === -1) {
      // Original history contained only model turns (e.g., just a welcome message).
      // This is a common case for new/cleared chats.
      console.log("Chat history provided to initializeChatSession contained only model turns. Initializing Gemini chat with an empty history array, as required by the API.");
      historyForChatCreation = [];
    } else if (firstUserTurnIndex > 0) {
      // User turns exist, but not at the beginning. Slice to start from the first user turn.
      console.warn(`Original chat history (after potential truncation) did not start with a user turn. Slicing history to begin with the first user turn. Original segment length: ${truncatedHistory.length}, New segment length: ${historyForChatCreation.slice(firstUserTurnIndex).length}`);
      historyForChatCreation = historyForChatCreation.slice(firstUserTurnIndex);
    }
    // If firstUserTurnIndex is 0, it's already correct.
  }


  chatInstance = currentAi.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: KHMER_CHAT_SYSTEM_PROMPT,
    },
    history: historyForChatCreation, // Use the adjusted history
  });
  console.log("Chat session initialized/updated with history items:", historyForChatCreation.length);
};


const getInitializedChatInstance = (): Chat => {
  if (!chatInstance) {
    console.warn("Chat instance was not initialized. Initializing with empty history as a fallback. Call initializeChatSession on app load.");
    initializeChatSession([]); 
  }
  return chatInstance!;
};

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendMessageWithRetry = async (
  chat: Chat,
  parts: Part[],
  retryCount = 0
): Promise<AsyncIterableIterator<GenerateContentResponse>> => {
  try {
    return await chat.sendMessageStream({ message: parts });
  } catch (error) {
    if (error instanceof Error && 
        (error.message.includes("503") || error.message.includes("overloaded")) && 
        retryCount < MAX_RETRIES) {
      // Calculate delay with exponential backoff
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retrying request after ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return sendMessageWithRetry(chat, parts, retryCount + 1);
    }
    throw error;
  }
};

const checkConnection = async (): Promise<boolean> => {
  try {
    // Only check if enough time has passed since last check
    if (Date.now() - connectionStatus.lastCheckTime < CONNECTION_CHECK_INTERVAL) {
      return connectionStatus.isConnected;
    }

    const currentAi = getAiInstance();
    // Try a minimal API call to check connection
    await currentAi.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ text: "test" }],
    });

    // Reset status on successful connection
    connectionStatus = {
      isConnected: true,
      lastCheckTime: Date.now(),
      consecutiveFailures: 0
    };
    return true;
  } catch (error) {
    console.warn("Connection check failed:", error);
    connectionStatus.consecutiveFailures++;
    connectionStatus.isConnected = false;
    connectionStatus.lastCheckTime = Date.now();
    return false;
  }
};

const handleConnectionFailure = async (): Promise<void> => {
  if (connectionStatus.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.warn(`Multiple connection failures detected (${connectionStatus.consecutiveFailures}). Resetting chat instance...`);
    resetChatSession();
    // Wait before next attempt
    await sleep(5000);
  }
};

export const sendMessageToGeminiStream = async (
  messageText: string,
  images?: ImageData[]
): Promise<AsyncIterableIterator<GenerateContentResponse>> => {
  try {
    // Check connection status if last check was too long ago
    if (Date.now() - connectionStatus.lastCheckTime > CONNECTION_RESET_THRESHOLD) {
      await checkConnection();
    }

    if (!connectionStatus.isConnected) {
      throw new Error("មិនអាចភ្ជាប់ទៅកាន់សេវាកម្ម AI បានទេ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។ (Cannot connect to AI service. Please check your internet connection.)");
    }

    const chat = getInitializedChatInstance(); 
    const parts: Part[] = [];

    const trimmedMessageText = messageText.trim();
    if (trimmedMessageText !== '') {
      parts.push({ text: trimmedMessageText });
    }

    if (images && images.length > 0) {
      images.forEach(image => {
        parts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.base64Data
          },
        });
      });
    }
    
    if (parts.length === 0) {
      console.error("Critical Error: Attempting to send an empty content (no text and no images) to Gemini.");
      throw new Error("Attempted to send an empty message content to the AI. Please provide text or an image.");
    }

    return await sendMessageWithRetry(chat, parts);
  } catch (error) {
    // Handle connection-related errors
    if (error instanceof Error && (
      error.message.includes("network") ||
      error.message.includes("connection") ||
      error.message.includes("timeout")
    )) {
      await handleConnectionFailure();
    }

    console.error("Error sending message to Gemini:", error);
    
    // Reset chat instance if there are API key or quota issues
    if (chatInstance && error instanceof Error && (
      error.message.includes("API key not valid") || 
      error.message.includes("quota") ||
      error.message.includes("503") ||
      error.message.includes("overloaded")
    )) {
      chatInstance = null;
      connectionStatus.isConnected = false;
      connectionStatus.consecutiveFailures++;
    }

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("Attempted to send an empty message content")) {
        throw error;
      }
      
      // Handle overloaded model error
      if (error.message.includes("503") || error.message.includes("overloaded")) {
        throw new Error("AI ជាប់រវល់ខ្លាំងពេក។ សូមព្យាយាមម្តងទៀតក្នុងពេលបន្តិចទៀត។ (The AI is currently overloaded. Please try again in a moment.)");
      }
      
      // Handle rate limit errors
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        throw new Error("សូមរង់ចាំមួយភ្លែត។ មានការស្នើសុំច្រើនពេក។ (Please wait a moment. Too many requests.)");
      }
      
      // Handle invalid API key
      if (error.message.includes("API key not valid")) {
        throw new Error("សោ API មិនត្រឹមត្រូវ។ សូមពិនិត្យការកំណត់របស់អ្នក។ (Invalid API key. Please check your settings.)");
      }
      
      // Handle quota exceeded
      if (error.message.includes("quota")) {
        throw new Error("កូតាប្រើប្រាស់អស់ហើយ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។ (Usage quota exceeded. Please try again later.)");
      }
      
      // Generic error with the original message
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    
    // Unknown error
    throw new Error("មានបញ្ហាមិនស្គាល់កើតឡើង។ សូមព្យាយាមម្តងទៀត។ (An unknown error occurred. Please try again.)");
  }
};

export const resetChatSession = (): void => {
  chatInstance = null;
  console.log("Chat session instance has been nulled. It will be re-initialized on next use or by explicit call.");
};

export const extractTextFromImageViaGemini = async (
  base64ImageData: string,
  mimeType: string
): Promise<string> => {
  try {
    const currentAi = getAiInstance();
    const imagePart: Part = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData
      },
    };
    const textPart: Part = { text: GEMINI_OCR_PROMPT };

    const params: GenerateContentParameters = {
      model: GEMINI_MODEL_NAME, 
      contents: [textPart, imagePart], // Changed this line
    };
    
    const response: GenerateContentResponse = await currentAi.models.generateContent(params);
    const extractedText = response.text;

    if (extractedText && extractedText.trim() !== '') {
      return extractedText.trim();
    }
    return GEMINI_OCR_NO_TEXT_MARKER; 

  } catch (error) {
    console.error("Error extracting text from image via Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini OCR Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during Gemini OCR processing.");
  }
};

// Add connection status getter
export const getConnectionStatus = (): boolean => {
  return connectionStatus.isConnected;
};
