import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { generateAIResponse } from "./ai-service";

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
