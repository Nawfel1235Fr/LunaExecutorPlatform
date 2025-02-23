import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

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

        // Broadcast message to all connected clients
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

  app.get("/api/chat/history", async (req, res) => {
    const history = await storage.getChatHistory();
    res.json(history);
  });

  app.get("/api/user/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stats = await storage.getUserStats(req.user.id);
    res.json(stats);
  });

  return httpServer;
}