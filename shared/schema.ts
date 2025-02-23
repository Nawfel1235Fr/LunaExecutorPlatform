import { pgTable, text, serial, boolean, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  verificationToken: text("verification_token"),
  memberSince: timestamp("member_since").notNull().defaultNow(),
  lastLogin: timestamp("last_login").notNull().defaultNow(),
  taskCount: integer("task_count").notNull().default(0),
  successRate: integer("success_rate").notNull().default(100),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  date: timestamp("date").notNull().defaultNow(),
  executionsCount: integer("executions_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  version: text("version"),
  downloadUrl: text("download_url"),
  badge: text("badge"),
  badgeVariant: text("badge_variant"),
  buttonText: text("button_text"),
  buttonVariant: text("button_variant"),
  features: text("features").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
  })
  .extend({
    password: z.string().min(8),
    email: z.string().email(),
  });

export const insertProductSchema = createInsertSchema(products)
  .extend({
    features: z.array(z.string()),
    price: z.number().min(0),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type UserStat = typeof userStats.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;