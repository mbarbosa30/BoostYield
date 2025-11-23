import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const yieldPreferences = pgTable("yield_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  preferredYieldToken: text("preferred_yield_token").notNull().default('SAME'),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertYieldPreferenceSchema = createInsertSchema(yieldPreferences).pick({
  walletAddress: true,
  preferredYieldToken: true,
});

export type InsertYieldPreference = z.infer<typeof insertYieldPreferenceSchema>;
export type YieldPreference = typeof yieldPreferences.$inferSelect;

export const tokenSuggestions = pgTable("token_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenName: text("token_name").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  contractAddress: text("contract_address").notNull(),
  chainId: text("chain_id").notNull().default('42220'),
  projectDescription: text("project_description").notNull(),
  uniswapPoolInfo: text("uniswap_pool_info"),
  contactEmail: text("contact_email"),
  contactTelegram: text("contact_telegram"),
  submitterAddress: text("submitter_address").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertTokenSuggestionSchema = createInsertSchema(tokenSuggestions).omit({
  id: true,
  createdAt: true,
});

export type InsertTokenSuggestion = z.infer<typeof insertTokenSuggestionSchema>;
export type TokenSuggestion = typeof tokenSuggestions.$inferSelect;
