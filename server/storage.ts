import { 
  users, 
  accounts, 
  savingsGoals, 
  chatMessages,
  type User, 
  type InsertUser, 
  type Account, 
  type InsertAccount,
  type SavingsGoal,
  type InsertSavingsGoal,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Account operations
  getAccounts(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, updates: Partial<Account>): Promise<Account | undefined>;
  
  // Savings goals operations
  getSavingsGoals(userId: number): Promise<SavingsGoal[]>;
  getSavingsGoal(id: number): Promise<SavingsGoal | undefined>;
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: number, updates: Partial<SavingsGoal>): Promise<SavingsGoal | undefined>;
  
  // Chat messages operations
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private savingsGoals: Map<number, SavingsGoal>;
  private chatMessages: Map<number, ChatMessage>;
  
  private currentUserId: number;
  private currentAccountId: number;
  private currentGoalId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.savingsGoals = new Map();
    this.chatMessages = new Map();
    
    this.currentUserId = 1;
    this.currentAccountId = 1;
    this.currentGoalId = 1;
    this.currentMessageId = 1;
    
    // Add a demo user
    this.createUser({
      username: "alexmorgan",
      password: "password123",
      name: "Alex Morgan",
      email: "alex@example.com",
      monthlyIncome: 5000,
      riskTolerance: "medium"
    });
    
    // Add demo accounts
    this.createAccount({
      userId: 1,
      name: "Checking Account",
      type: "checking",
      number: "**** 4567",
      balance: 12458.32,
      lastTransaction: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    });
    
    this.createAccount({
      userId: 1,
      name: "Savings Account",
      type: "savings",
      number: "**** 7890",
      balance: 28745.16,
      lastTransaction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    });
    
    this.createAccount({
      userId: 1,
      name: "Credit Card",
      type: "credit",
      number: "**** 2345",
      balance: 1846.29,
      lastTransaction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    });
    
    // Add demo savings goals
    this.createSavingsGoal({
      userId: 1,
      name: "Emergency Fund",
      current: 6800,
      target: 10000,
    });
    
    this.createSavingsGoal({
      userId: 1,
      name: "Vacation",
      current: 1750,
      target: 5000,
    });
    
    this.createSavingsGoal({
      userId: 1,
      name: "New Car",
      current: 3600,
      target: 30000,
    });
    
    // Add initial chat message
    this.createChatMessage({
      userId: 1,
      role: "assistant",
      content: "Hello! I'm your financial assistant. I can help you with budgeting, saving strategies, investment insights, and more. How can I assist you today?"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    // Ensure monthlyIncome and riskTolerance are not undefined
    const monthlyIncome = insertUser.monthlyIncome ?? null;
    const riskTolerance = insertUser.riskTolerance ?? null;
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt, 
      monthlyIncome,
      riskTolerance
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Account methods
  async getAccounts(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(
      (account) => account.userId === userId
    );
  }
  
  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }
  
  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.currentAccountId++;
    const account: Account = { 
      ...insertAccount, 
      id,
      lastTransaction: insertAccount.lastTransaction || null 
    };
    this.accounts.set(id, account);
    return account;
  }
  
  async updateAccount(id: number, updates: Partial<Account>): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;
    
    const updatedAccount = { ...account, ...updates };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }
  
  // Savings goals methods
  async getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
    return Array.from(this.savingsGoals.values()).filter(
      (goal) => goal.userId === userId
    );
  }
  
  async getSavingsGoal(id: number): Promise<SavingsGoal | undefined> {
    return this.savingsGoals.get(id);
  }
  
  async createSavingsGoal(insertGoal: InsertSavingsGoal): Promise<SavingsGoal> {
    const id = this.currentGoalId++;
    const createdAt = new Date();
    const goal: SavingsGoal = { ...insertGoal, id, createdAt };
    this.savingsGoals.set(id, goal);
    return goal;
  }
  
  async updateSavingsGoal(id: number, updates: Partial<SavingsGoal>): Promise<SavingsGoal | undefined> {
    const goal = this.savingsGoals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updates };
    this.savingsGoals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  // Chat messages methods
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => {
        // Make sure timestamps exist before comparing
        if (!a.timestamp && !b.timestamp) return 0;
        if (!a.timestamp) return -1;
        if (!b.timestamp) return 1;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const timestamp = new Date();
    const messageId = crypto.randomUUID();
    const message: ChatMessage = { ...insertMessage, id, messageId, timestamp };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
