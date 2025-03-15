import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';
import { BaseMessage } from '@langchain/core/messages';

// Mock financial data for investment options (similar to what was in the provided code)
const investmentOptions = {
  "SBI Bluechip Fund": { "type": "Mutual Fund", "risk": "Medium", "avg_return": "10%", "min_investment": 5000 },
  "HDFC Small Cap Fund": { "type": "Mutual Fund", "risk": "High", "avg_return": "12%", "min_investment": 5000 },
  "NIFTY 50 Index Fund": { "type": "Mutual Fund", "risk": "Low", "avg_return": "8%", "min_investment": 1000 },
  "Axis Long Term Equity Fund": { "type": "Mutual Fund", "risk": "Medium", "avg_return": "11%", "min_investment": 5000 }
};

// Custom prompt template for the financial assistant
const promptTemplate = `
You are a financial assistant designed for beginners. Your goal is to provide simple, accurate, and helpful advice about investing, budgeting, saving, and other financial topics. Use beginner-friendly language.

If the user asks for investment suggestions, use the investment options to recommend specific products. If you don't have enough info, respond with your best financial advice based on the query.

Conversation history: {history}
User profile: {userProfile}
Investment options: {investmentOptions}

User input: {input}
Answer:
`;

// Store chat histories for users
const chatHistories: Record<number, ChatMessageHistory> = {};

// Get or create chat history for a user
function getChatHistory(userId: number): ChatMessageHistory {
  if (!chatHistories[userId]) {
    chatHistories[userId] = new ChatMessageHistory();
  }
  return chatHistories[userId];
}

// Get user's financial profile from the storage
async function getUserProfile(userId: number) {
  // Import here to avoid circular dependency
  const { storage } = await import('./storage');
  
  const user = await storage.getUser(userId);
  
  // Use user's profile if available, otherwise use defaults
  return {
    "monthly_income": user?.monthlyIncome || 5000,
    "risk_tolerance": user?.riskTolerance || "medium"
  };
}

export async function generateAIResponse(message: string, userId: number): Promise<string> {
  try {
    // Access the API key from environment variables
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error("Missing Gemini API key");
      return "I'm having trouble connecting to my knowledge base. Please try again later.";
    }
    
    // Initialize the Gemini model
    const llm = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: "gemini-1.5-pro",
      temperature: 0.7,
      maxOutputTokens: 2048,
    });
    
    // Set up prompt template
    const prompt = PromptTemplate.fromTemplate(promptTemplate);
    
    // Create the chain
    const chain = prompt.pipe(llm);
    
    // Get chat history for this user
    const chatHistory = getChatHistory(userId);
    
    // Create runnable with history
    const runnableWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: () => chatHistory,
      inputMessagesKey: "input",
      historyMessagesKey: "history",
    });
    
    // Invoke the chain with history
    const response = await runnableWithHistory.invoke(
      {
        userProfile: JSON.stringify(defaultUserProfile),
        investmentOptions: JSON.stringify(investmentOptions),
        input: message,
        history: "" // This will be filled by RunnableWithMessageHistory
      },
      {
        configurable: {
          sessionId: `user${userId}`
        }
      }
    );
    
    // Return the response content - handle different response types
    if (typeof response === 'string') {
      return response;
    } else if (response && typeof response === 'object' && 'content' in response) {
      return response.content.toString();
    } else {
      return "I processed your request but encountered an unexpected response format.";
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
}