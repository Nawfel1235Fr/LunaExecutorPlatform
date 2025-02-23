import { User, InsertUser, ChatMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { randomBytes } from "crypto";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(id: number): Promise<void>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  saveChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage>;
  getChatHistory(limit?: number): Promise<ChatMessage[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private currentId: number;
  private currentChatId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.currentId = 1;
    this.currentChatId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const verificationToken = randomBytes(32).toString("hex");
    const user: User = {
      ...insertUser,
      id,
      isVerified: false,
      isAdmin: false,
      verificationToken,
    };
    this.users.set(id, user);
    return user;
  }

  async verifyUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    if (user) {
      user.isVerified = true;
      user.verificationToken = null;
      this.users.set(id, user);
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async saveChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const chatMessage = { ...message, id };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(limit = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
