import { 
  type User, 
  type InsertUser,
  type YieldPreference,
  type InsertYieldPreference,
  type TokenSuggestion,
  type InsertTokenSuggestion
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Yield preferences
  getYieldPreference(walletAddress: string): Promise<YieldPreference | undefined>;
  upsertYieldPreference(preference: InsertYieldPreference): Promise<YieldPreference>;
  
  // Token suggestions
  createTokenSuggestion(suggestion: InsertTokenSuggestion): Promise<TokenSuggestion>;
  getAllTokenSuggestions(): Promise<TokenSuggestion[]>;
  getTokenSuggestionsByStatus(status: string): Promise<TokenSuggestion[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private yieldPreferences: Map<string, YieldPreference>;
  private tokenSuggestions: Map<string, TokenSuggestion>;

  constructor() {
    this.users = new Map();
    this.yieldPreferences = new Map();
    this.tokenSuggestions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getYieldPreference(walletAddress: string): Promise<YieldPreference | undefined> {
    return this.yieldPreferences.get(walletAddress.toLowerCase());
  }

  async upsertYieldPreference(preference: InsertYieldPreference): Promise<YieldPreference> {
    const walletAddress = preference.walletAddress.toLowerCase();
    const existing = this.yieldPreferences.get(walletAddress);
    
    const id: string = existing?.id || randomUUID();
    
    const yieldPreference: YieldPreference = {
      id,
      walletAddress,
      preferredYieldToken: preference.preferredYieldToken,
      updatedAt: new Date(),
    };
    
    this.yieldPreferences.set(walletAddress, yieldPreference);
    return yieldPreference;
  }

  async createTokenSuggestion(suggestion: InsertTokenSuggestion): Promise<TokenSuggestion> {
    const id = randomUUID();
    const tokenSuggestion: TokenSuggestion = {
      id,
      tokenName: suggestion.tokenName,
      tokenSymbol: suggestion.tokenSymbol,
      contractAddress: suggestion.contractAddress,
      chainId: suggestion.chainId || '42220',
      projectDescription: suggestion.projectDescription,
      uniswapPoolInfo: suggestion.uniswapPoolInfo || null,
      contactEmail: suggestion.contactEmail || null,
      contactTelegram: suggestion.contactTelegram || null,
      submitterAddress: suggestion.submitterAddress,
      status: suggestion.status || 'pending',
      createdAt: new Date(),
    };
    this.tokenSuggestions.set(id, tokenSuggestion);
    return tokenSuggestion;
  }

  async getAllTokenSuggestions(): Promise<TokenSuggestion[]> {
    return Array.from(this.tokenSuggestions.values());
  }

  async getTokenSuggestionsByStatus(status: string): Promise<TokenSuggestion[]> {
    return Array.from(this.tokenSuggestions.values()).filter(
      (suggestion) => suggestion.status === status,
    );
  }
}

export const storage = new MemStorage();
