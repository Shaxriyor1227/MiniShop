class MemoryCache {
  constructor(defaultTtlMs = 60 * 1000) {
    this.store = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  }

  set(key, data, ttlMs = this.defaultTtlMs) {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs
    });
  }

  delete(key) {
    this.store.delete(key);
  }

  invalidatePrefix(prefix) {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  clear() {
    this.store.clear();
  }

  size() {
    return this.store.size;
  }
}

const memoryCache = new MemoryCache(60 * 1000); // 60 seconds TTL

module.exports = memoryCache;
