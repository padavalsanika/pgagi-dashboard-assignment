import { type User, type InsertUser, type ContentItem, type InsertContentItem, type UserFavorite, type InsertUserFavorite, type UserContentOrder, type InsertUserContentOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(userId: string, preferences: any): Promise<User | undefined>;

  // Content methods
  getContentItems(page?: number, limit?: number, category?: string): Promise<ContentItem[]>;
  getContentItem(id: string): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  searchContent(query: string, page?: number, limit?: number): Promise<ContentItem[]>;
  getTrendingContent(category?: string): Promise<ContentItem[]>;

  // Favorites methods
  getUserFavorites(userId: string): Promise<ContentItem[]>;
  addToFavorites(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFromFavorites(userId: string, contentId: string): Promise<boolean>;
  isFavorite(userId: string, contentId: string): Promise<boolean>;

  // Content order methods
  getUserContentOrder(userId: string): Promise<UserContentOrder | undefined>;
  updateUserContentOrder(order: InsertUserContentOrder): Promise<UserContentOrder>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contentItems: Map<string, ContentItem>;
  private userFavorites: Map<string, UserFavorite>;
  private userContentOrders: Map<string, UserContentOrder>;

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
    this.userFavorites = new Map();
    this.userContentOrders = new Map();
    
    // Create default user
    this.initializeDefaultUser();
  }

  private async initializeDefaultUser() {
    const defaultUser: User = {
      id: 'default-user-id',
      username: 'Sanika Padaval',
      email: 'sanika6701@gmail.com',
      password: 'demo-password',
      preferences: {
        categories: ['technology', 'finance'],
        notifications: { breaking: true, digest: false }
      },
      createdAt: new Date()
    };
    this.users.set('default-user-id', defaultUser);
    
    // Add sample content
    this.initializeSampleContent();
  }

  private async initializeSampleContent() {
    const sampleContent = [
      {
        id: randomUUID(),
        type: 'news',
        title: 'AI Breakthrough: New Language Model Achieves Human-Level Performance',
        description: 'Researchers have developed a groundbreaking AI system that demonstrates human-level reasoning capabilities across multiple domains.',
        content: {
          source: 'Tech News Daily',
          author: 'Dr. Sarah Chen',
          url: '#'
        },
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
        sourceUrl: '#',
        category: 'technology',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        type: 'movie',
        title: 'The Matrix Resurrections',
        description: 'Return to a world of two realities: one, everyday life; the other, what lies behind it.',
        content: {
          tmdbId: 624860,
          releaseDate: '2021-12-15',
          rating: 5.7,
          voteCount: 8420
        },
        imageUrl: 'https://images.unsplash.com/photo-1489599735734-79b4af4e8c3b?w=500&h=300&fit=crop',
        category: 'entertainment',
        publishedAt: new Date('2021-12-15'),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        type: 'social',
        title: 'Tech Innovation Update',
        description: 'Latest developments in AI and machine learning',
        content: {
          author: { name: 'Sanika Padaval', handle: '@sanika_tech', avatar: null },
          text: 'Excited to share my latest project on personalized content dashboards! Building with React, Redux, and modern web technologies. The future of content curation is here! 🚀 #WebDev #React #TechInnovation',
          likes: 42,
          retweets: 12,
          platform: 'twitter'
        },
        category: 'technology',
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        type: 'news',
        title: 'Global Markets Show Strong Recovery in Q4',
        description: 'Financial markets worldwide demonstrate resilience with significant gains across major indices.',
        content: {
          source: 'Financial Times',
          author: 'Michael Rodriguez',
          url: '#'
        },
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop',
        sourceUrl: '#',
        category: 'finance',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        type: 'movie',
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
        content: {
          tmdbId: 27205,
          releaseDate: '2010-07-16',
          rating: 8.8,
          voteCount: 35000
        },
        imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=300&fit=crop',
        category: 'entertainment',
        publishedAt: new Date('2010-07-16'),
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        type: 'news',
        title: 'Cryptocurrency Market Sees Major Breakthrough in DeFi Technology',
        description: 'New decentralized finance protocols show promise for transforming traditional banking systems.',
        content: {
          source: 'Crypto Weekly',
          author: 'Alex Thompson',
          url: '#'
        },
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop',
        sourceUrl: '#',
        category: 'finance',
        publishedAt: new Date(Date.now() - 30 * 60 * 1000),
        createdAt: new Date(),
        isTrending: true
      },
      {
        id: randomUUID(),
        type: 'social',
        title: 'Frontend Development Tips',
        description: 'Best practices for modern web development',
        content: {
          author: { name: 'Sanika Padaval', handle: '@sanika_dev', avatar: null },
          text: 'Just finished implementing a complex dashboard with React, Redux, and TypeScript! Key learnings: Always type your async thunks properly and use proper state management patterns. #React #TypeScript #WebDev',
          likes: 128,
          retweets: 34,
          platform: 'twitter'
        },
        category: 'technology',
        publishedAt: new Date(Date.now() - 45 * 60 * 1000),
        createdAt: new Date(),
        isTrending: true
      }
    ];

    for (const item of sampleContent) {
      this.contentItems.set(item.id, item as ContentItem);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      preferences: insertUser.preferences || {
        categories: ['technology', 'finance'],
        notifications: { breaking: true, digest: false }
      }
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.preferences = preferences;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getContentItems(page = 1, limit = 20, category?: string): Promise<ContentItem[]> {
    let items = Array.from(this.contentItems.values());
    
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    items.sort((a, b) => new Date(b.publishedAt || b.createdAt!).getTime() - new Date(a.publishedAt || a.createdAt!).getTime());
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return items.slice(start, end);
  }

  async getContentItem(id: string): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async createContentItem(insertItem: InsertContentItem): Promise<ContentItem> {
    const id = randomUUID();
    const item: ContentItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      publishedAt: insertItem.publishedAt || new Date(),
    };
    this.contentItems.set(id, item);
    return item;
  }

  async searchContent(query: string, page = 1, limit = 20): Promise<ContentItem[]> {
    const items = Array.from(this.contentItems.values());
    const searchTerms = query.toLowerCase().split(' ');
    
    const filtered = items.filter(item => {
      const searchText = `${item.title} ${item.description} ${item.category}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });
    
    filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt!).getTime() - new Date(a.publishedAt || a.createdAt!).getTime());
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return filtered.slice(start, end);
  }

  async getTrendingContent(category?: string): Promise<ContentItem[]> {
    let items = Array.from(this.contentItems.values());
    
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    // Simulate trending by recent items with higher engagement
    items.sort((a, b) => new Date(b.publishedAt || b.createdAt!).getTime() - new Date(a.publishedAt || a.createdAt!).getTime());
    
    return items.slice(0, 10);
  }

  async getUserFavorites(userId: string): Promise<ContentItem[]> {
    const favorites = Array.from(this.userFavorites.values()).filter(fav => fav.userId === userId);
    const contentIds = favorites.map(fav => fav.contentId);
    return contentIds.map(id => this.contentItems.get(id)).filter(Boolean) as ContentItem[];
  }

  async addToFavorites(insertFavorite: InsertUserFavorite): Promise<UserFavorite> {
    const id = randomUUID();
    const favorite: UserFavorite = {
      ...insertFavorite,
      id,
      createdAt: new Date(),
    };
    this.userFavorites.set(id, favorite);
    return favorite;
  }

  async removeFromFavorites(userId: string, contentId: string): Promise<boolean> {
    const favorites = Array.from(this.userFavorites.entries());
    const favoriteEntry = favorites.find(([_, fav]) => fav.userId === userId && fav.contentId === contentId);
    
    if (favoriteEntry) {
      this.userFavorites.delete(favoriteEntry[0]);
      return true;
    }
    return false;
  }

  async isFavorite(userId: string, contentId: string): Promise<boolean> {
    const favorites = Array.from(this.userFavorites.values());
    return favorites.some(fav => fav.userId === userId && fav.contentId === contentId);
  }

  async getUserContentOrder(userId: string): Promise<UserContentOrder | undefined> {
    return Array.from(this.userContentOrders.values()).find(order => order.userId === userId);
  }

  async updateUserContentOrder(insertOrder: InsertUserContentOrder): Promise<UserContentOrder> {
    const existing = await this.getUserContentOrder(insertOrder.userId);
    
    if (existing) {
      existing.contentOrder = insertOrder.contentOrder;
      existing.updatedAt = new Date();
      this.userContentOrders.set(existing.id, existing);
      return existing;
    } else {
      const id = randomUUID();
      const order: UserContentOrder = {
        ...insertOrder,
        id,
        updatedAt: new Date(),
      };
      this.userContentOrders.set(id, order);
      return order;
    }
  }
}

export const storage = new MemStorage();
