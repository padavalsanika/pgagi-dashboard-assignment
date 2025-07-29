import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContentItemSchema, insertUserFavoriteSchema, insertUserContentOrderSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.put("/api/users/:id/preferences", async (req, res) => {
    try {
      const user = await storage.updateUserPreferences(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating preferences" });
    }
  });

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      
      const content = await storage.getContentItems(page, limit, category);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Error fetching content" });
    }
  });

  app.get("/api/content/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const content = await storage.searchContent(query, page, limit);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Error searching content" });
    }
  });

  app.get("/api/content/trending", async (req, res) => {
    try {
      const category = req.query.category as string;
      const content = await storage.getTrendingContent(category);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trending content" });
    }
  });

  // External API integration routes
  app.get("/api/news", async (req, res) => {
    try {
      const category = req.query.category as string || 'technology';
      const apiKey = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || 'demo_key';
      
      const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
        params: {
          category,
          apiKey,
          pageSize: 20,
          language: 'en'
        }
      });

      const articles = response.data.articles.map((article: any) => ({
        type: 'news',
        title: article.title,
        description: article.description,
        content: {
          source: article.source.name,
          author: article.author,
          url: article.url
        },
        imageUrl: article.urlToImage,
        sourceUrl: article.url,
        category,
        publishedAt: new Date(article.publishedAt)
      }));

      // Store articles in local storage
      for (const article of articles) {
        await storage.createContentItem(article);
      }

      res.json(articles);
    } catch (error) {
      console.error('News API error:', error);
      res.status(500).json({ message: "Error fetching news data" });
    }
  });

  app.get("/api/movies", async (req, res) => {
    try {
      const apiKey = process.env.TMDB_API_KEY || process.env.TMDB_KEY || 'demo_key';
      
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
        params: {
          api_key: apiKey,
          page: 1
        }
      });

      const movies = response.data.results.map((movie: any) => ({
        type: 'movie',
        title: movie.title,
        description: movie.overview,
        content: {
          tmdbId: movie.id,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          voteCount: movie.vote_count
        },
        imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        category: 'entertainment',
        publishedAt: new Date(movie.release_date)
      }));

      // Store movies in local storage
      for (const movie of movies) {
        await storage.createContentItem(movie);
      }

      res.json(movies);
    } catch (error) {
      console.error('TMDB API error:', error);
      res.status(500).json({ message: "Error fetching movie data" });
    }
  });

  app.get("/api/social", async (req, res) => {
    try {
      // Mock social media posts since real APIs require complex authentication
      const mockPosts = [
        {
          type: 'social',
          title: 'Tech Innovation Update',
          description: 'Latest developments in AI and machine learning',
          content: {
            author: { name: 'Tech Guru', handle: '@techguru', avatar: null },
            text: 'Just attended an amazing #TechConf2024! The future of AI is brighter than ever. Who else is excited about the new developments? 🚀 #AI #Innovation #TechTrends',
            likes: 42,
            retweets: 12,
            platform: 'twitter'
          },
          category: 'technology',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          type: 'social',
          title: 'AI Research Breakthrough',
          description: 'Neural network achieves new accuracy milestone',
          content: {
            author: { name: 'AI Innovations', handle: '@aiinnov', avatar: null },
            text: 'Breaking: New neural network architecture achieves 95% accuracy on complex reasoning tasks! This could be the breakthrough we\'ve been waiting for. 🧠⚡ #MachineLearning #AI #Research',
            likes: 156,
            retweets: 32,
            platform: 'twitter'
          },
          category: 'technology',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        }
      ];

      // Store social posts in local storage
      for (const post of mockPosts) {
        await storage.createContentItem(post);
      }

      res.json(mockPosts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching social media data" });
    }
  });

  // Favorites routes
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      const favorites = await storage.getUserFavorites(req.params.userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });

  app.post("/api/users/:userId/favorites", async (req, res) => {
    try {
      const favoriteData = insertUserFavoriteSchema.parse({
        userId: req.params.userId,
        contentId: req.body.contentId
      });
      const favorite = await storage.addToFavorites(favoriteData);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid favorite data" });
    }
  });

  app.delete("/api/users/:userId/favorites/:contentId", async (req, res) => {
    try {
      const removed = await storage.removeFromFavorites(req.params.userId, req.params.contentId);
      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.json({ message: "Favorite removed" });
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite" });
    }
  });

  app.get("/api/users/:userId/favorites/:contentId/check", async (req, res) => {
    try {
      const isFavorite = await storage.isFavorite(req.params.userId, req.params.contentId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Error checking favorite status" });
    }
  });

  // Content order routes
  app.get("/api/users/:userId/content-order", async (req, res) => {
    try {
      const order = await storage.getUserContentOrder(req.params.userId);
      res.json(order || { contentOrder: [] });
    } catch (error) {
      res.status(500).json({ message: "Error fetching content order" });
    }
  });

  app.put("/api/users/:userId/content-order", async (req, res) => {
    try {
      const orderData = insertUserContentOrderSchema.parse({
        userId: req.params.userId,
        contentOrder: req.body.contentOrder
      });
      const order = await storage.updateUserContentOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid order data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
