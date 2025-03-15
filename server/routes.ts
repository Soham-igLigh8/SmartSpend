import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Simulated Gemini API integration with LangChain
async function generateAIResponse(message: string, userId: number) {
  // In a real implementation, this would call the Gemini API via LangChain
  // For simplicity, we'll simulate responses based on keywords
  
  let response = "I'm processing your financial query. Could you provide more details?";
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("invest") || lowerMessage.includes("investing")) {
    response = "Based on your financial profile, I recommend considering a mix of low-cost index funds and ETFs. Start with a small amount that you can afford to invest regularly. Remember to focus on long-term growth and diversification.";
  } else if (lowerMessage.includes("budget") || lowerMessage.includes("spending")) {
    response = "Looking at your spending patterns, your housing costs are at 32% of your income, which is within the recommended 30-35% range. However, your dining out expenses are trending higher than average at 24%. Consider setting a specific budget for eating out to help meet your savings goals faster.";
  } else if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
    response = "Based on your income and expenses, I suggest setting up automatic transfers of $850 per month to your savings account. This would help you reach your emergency fund goal in about 4 months. Would you like me to suggest a savings schedule?";
  } else if (lowerMessage.includes("debt") || lowerMessage.includes("loan")) {
    response = "I see you have a current credit card balance of $1,846.29. If you pay only the minimum payment, it will take approximately 7 years to clear this debt. I recommend increasing your monthly payment to at least $300 to clear it within 7 months and save on interest.";
  } else if (lowerMessage.includes("retire") || lowerMessage.includes("retirement")) {
    response = "For retirement planning, I recommend aiming to save 15% of your pre-tax income. Based on your current income and age, you should aim for a retirement savings of approximately $1.2 million by age 65. Would you like me to create a detailed retirement savings plan?";
  } else if (lowerMessage.includes("index fund")) {
    response = "Index funds are investment funds that aim to replicate the performance of a specific market index, like the S&P 500. They work by investing in all (or a representative sample) of the securities in the target index, in the same proportions as their weight in the index.\n\nKey benefits:\n• Low fees compared to actively managed funds\n• Built-in diversification\n• Passive management strategy requiring less oversight\n\nFor beginners, consider funds that track broad market indexes like the S&P 500, Total Stock Market, or International Stock indexes. Would you like some specific fund recommendations based on your risk tolerance?";
  }
  
  return response;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Error handling middleware
  const handleError = (err: any, res: express.Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: err.message || "Internal server error" });
  };

  // User endpoints
  apiRouter.get("/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err: any) {
      handleError(err, res);
    }
  });
  
  // Account endpoints
  apiRouter.get("/accounts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const accounts = await storage.getAccounts(userId);
      res.json(accounts);
    } catch (err: any) {
      handleError(err, res);
    }
  });
  
  // Savings goals endpoints
  apiRouter.get("/savings-goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goals = await storage.getSavingsGoals(userId);
      res.json(goals);
    } catch (err: any) {
      handleError(err, res);
    }
  });
  
  // Chat message endpoints
  apiRouter.get("/chat/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (err: any) {
      handleError(err, res);
    }
  });
  
  apiRouter.post("/chat", async (req, res) => {
    try {
      const { message, userId } = chatRequestSchema.parse(req.body);
      
      // Create and store user message
      const userMessage = insertChatMessageSchema.parse({
        userId,
        role: "user",
        content: message
      });
      
      await storage.createChatMessage(userMessage);
      
      // Generate AI response
      const aiResponseContent = await generateAIResponse(message, userId);
      
      // Create and store assistant message
      const assistantMessage = insertChatMessageSchema.parse({
        userId,
        role: "assistant",
        content: aiResponseContent
      });
      
      const savedAssistantMessage = await storage.createChatMessage(assistantMessage);
      
      // Return all chat messages for the user
      const allMessages = await storage.getChatMessages(userId);
      res.json(allMessages);
    } catch (err: any) {
      handleError(err, res);
    }
  });

  // Register API routes under /api prefix
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
