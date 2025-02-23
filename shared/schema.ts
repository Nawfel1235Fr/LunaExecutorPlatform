import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
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
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isAdmin: boolean("is_admin").notNull().default(false),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
