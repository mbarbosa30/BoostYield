import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertYieldPreferenceSchema, insertTokenSuggestionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get yield preference for a wallet
  app.get("/api/yield-preference/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const preference = await storage.getYieldPreference(walletAddress);
      
      if (!preference) {
        return res.status(404).json({ error: 'Preference not found' });
      }
      
      res.json(preference);
    } catch (error) {
      console.error('Error fetching yield preference:', error);
      res.status(500).json({ error: 'Failed to fetch yield preference' });
    }
  });

  // Upsert yield preference
  app.post("/api/yield-preference", async (req, res) => {
    try {
      const validatedData = insertYieldPreferenceSchema.parse(req.body);
      const preference = await storage.upsertYieldPreference(validatedData);
      res.json(preference);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error upserting yield preference:', error);
      res.status(500).json({ error: 'Failed to update yield preference' });
    }
  });

  // Submit token suggestion
  app.post("/api/token-suggestion", async (req, res) => {
    try {
      const validatedData = insertTokenSuggestionSchema.parse(req.body);
      const suggestion = await storage.createTokenSuggestion(validatedData);
      res.status(201).json(suggestion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating token suggestion:', error);
      res.status(500).json({ error: 'Failed to submit token suggestion' });
    }
  });

  // Get all token suggestions (for future admin panel)
  app.get("/api/token-suggestions", async (req, res) => {
    try {
      const { status } = req.query;
      
      const suggestions = status && typeof status === 'string'
        ? await storage.getTokenSuggestionsByStatus(status)
        : await storage.getAllTokenSuggestions();
        
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching token suggestions:', error);
      res.status(500).json({ error: 'Failed to fetch token suggestions' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
