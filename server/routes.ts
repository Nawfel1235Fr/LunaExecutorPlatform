import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Product routes
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    try {
      const product = await storage.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    try {
      await storage.deleteProduct(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    const history = await storage.getChatHistory();
    res.json(history);
  });

  app.get("/api/user/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stats = await storage.getUserStats(req.user.id);
    res.json(stats);
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const chatMessage = await storage.saveChatMessage({
          userId: message.userId,
          content: message.content,
          timestamp: new Date(),
          isAdmin: message.isAdmin || false,
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(chatMessage));
          }
        });
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });
  });

  return httpServer;
}