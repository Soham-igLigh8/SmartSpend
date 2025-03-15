import { pgTable, text, serial, integer, boolean, timestamp, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  monthlyIncome: real("monthly_income"),
  riskTolerance: text("risk_tolerance"), // "low", "medium", "high"
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // checking, savings, credit, investment
  number: text("number").notNull(),
  balance: real("balance").notNull(),
  lastTransaction: timestamp("last_transaction"),
});

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  current: real("current").notNull(),
  target: real("target").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  messageId: uuid("message_id").notNull().defaultRandom(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schema definitions
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  messageId: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;

export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Chat request schema
export const chatRequestSchema = z.object({
  message: z.string().min(1),
  userId: z.number()
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// User profile update schema
export const userProfileUpdateSchema = z.object({
  monthlyIncome: z.number().optional(),
  riskTolerance: z.enum(['low', 'medium', 'high']).optional(),
});

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;
