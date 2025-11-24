import { env } from './env';

// Cache abstraction layer
export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// In-memory cache (fallback)
class MemoryCache implements CacheProvider {
  private cache = new Map<string, { value: unknown; expires: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }
}

// Redis cache
class RedisCache implements CacheProvider {
  private client: ReturnType<typeof import('redis').createClient> | null = null;
  private connected = false;

  async connect() {
    if (this.connected) return;

    try {
      const redis = await import('redis');
      const redisUrl = env.REDIS_URL;
      if (!redisUrl) {
        throw new Error('REDIS_URL is not configured');
      }
      this.client = redis.createClient({
        url: redisUrl,
      });

      await this.client.connect();
      this.connected = true;
      console.log('✅ Redis cache connected');
    } catch (error) {
      console.warn('⚠️  Redis connection failed, using memory cache:', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected || !this.client) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      await this.client.flushDb();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.connected || !this.client) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      let cursor = 0;
      const keysToDelete: string[] = [];
      
      do {
        const result = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100
        });
        
        cursor = result.cursor;
        keysToDelete.push(...result.keys);
      } while (cursor !== 0);
      
      if (keysToDelete.length > 0) {
        await this.client.del(keysToDelete);
      }
    } catch (error) {
      console.error('Redis pattern delete error:', error);
    }
  }
}

// Cache service
class CacheService {
  private provider: CacheProvider;
  private prefix = 'mma:';

  constructor() {
    this.provider = new MemoryCache();
  }

  async initialize() {
    if (env.REDIS_URL) {
      try {
        const redisCache = new RedisCache();
        await redisCache.connect();
        this.provider = redisCache;
      } catch (error) {
        console.warn('Using memory cache as fallback');
      }
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.provider.get<T>(this.getKey(key));
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    return this.provider.set(this.getKey(key), value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    return this.provider.del(this.getKey(key));
  }

  async clear(): Promise<void> {
    return this.provider.clear();
  }

  async exists(key: string): Promise<boolean> {
    return this.provider.exists(this.getKey(key));
  }

  // Cache with function
  async remember<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    await this.set(key, value, ttlSeconds);

    return value;
  }

  // Invalidate pattern (Redis SCAN or memory iteration)
  async invalidatePattern(pattern: string): Promise<void> {
    if (this.provider instanceof RedisCache) {
      // Redis-specific pattern deletion
      await (this.provider as RedisCache).deletePattern(this.getKey(pattern));
    } else if (this.provider instanceof MemoryCache) {
      // Memory cache pattern matching
      await (this.provider as MemoryCache).deletePattern(this.getKey(pattern));
    }
  }
}

export const cache = new CacheService();

// Initialize cache on module load
cache.initialize().catch(err => {
  console.error('Failed to initialize cache:', err);
});

