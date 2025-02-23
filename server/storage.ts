import { users, chatMessages, userStats, products, User, InsertUser, ChatMessage, UserStat, Product, InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(id: number): Promise<void>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  saveChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage>;
  getChatHistory(limit?: number): Promise<ChatMessage[]>;
  getUserStats(userId: number): Promise<UserStat[]>;
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      memberSince: new Date(),
      lastLogin: new Date(),
      taskCount: 0,
      successRate: 100,
    }).returning();
    return user;
  }

  async verifyUser(id: number): Promise<void> {
    await db.update(users)
      .set({ isVerified: true, verificationToken: null })
      .where(eq(users.id, id));
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async saveChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const [chatMessage] = await db.insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  async getChatHistory(limit = 50): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  async getUserStats(userId: number): Promise<UserStat[]> {
    return await db.select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .orderBy(asc(userStats.date));
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products)
      .values({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const [product] = await db.update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage = new DatabaseStorage();