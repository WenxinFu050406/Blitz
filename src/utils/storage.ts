/**
 * Local Storage Backend Utility
 * 
 * This module provides a simple backend-like storage solution using localStorage.
 * It simulates database operations for the Blitz app.
 */

// Storage Keys
const STORAGE_KEYS = {
  LANDMARK_JOINS: 'blitz_landmark_joins',
  FRIEND_REQUESTS: 'blitz_friend_requests',
  USER_PREFERENCES: 'blitz_user_preferences',
  LANGUAGE: 'blitz_language',
  ENERGY_EXCHANGES: 'blitz_energy_exchanges',
  JOINED_GROUPS: 'blitz_joined_groups',
} as const;

// Generic storage functions
export const storage = {
  // Get data from localStorage
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  // Remove data from localStorage
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  // Clear all app data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  },
};

// Landmark Joins Backend
export const landmarkJoinsDB = {
  // Get all joined landmarks
  getAll(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.LANDMARK_JOINS, []);
  },

  // Check if user joined a landmark
  isJoined(landmarkId: string): boolean {
    const joins = this.getAll();
    return joins.includes(landmarkId);
  },

  // Join a landmark event
  join(landmarkId: string): void {
    const joins = this.getAll();
    if (!joins.includes(landmarkId)) {
      joins.push(landmarkId);
      storage.set(STORAGE_KEYS.LANDMARK_JOINS, joins);
    }
  },

  // Leave a landmark event
  leave(landmarkId: string): void {
    const joins = this.getAll();
    const updated = joins.filter(id => id !== landmarkId);
    storage.set(STORAGE_KEYS.LANDMARK_JOINS, updated);
  },

  // Toggle join status
  toggle(landmarkId: string): boolean {
    if (this.isJoined(landmarkId)) {
      this.leave(landmarkId);
      return false;
    } else {
      this.join(landmarkId);
      return true;
    }
  },
};

// Friend Requests Backend
export const friendRequestsDB = {
  // Get all sent friend requests
  getAll(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.FRIEND_REQUESTS, []);
  },

  // Check if request was sent to user
  isSent(userId: string): boolean {
    const requests = this.getAll();
    return requests.includes(userId);
  },

  // Send friend request
  send(userId: string): void {
    const requests = this.getAll();
    if (!requests.includes(userId)) {
      requests.push(userId);
      storage.set(STORAGE_KEYS.FRIEND_REQUESTS, requests);
    }
  },

  // Cancel friend request
  cancel(userId: string): void {
    const requests = this.getAll();
    const updated = requests.filter(id => id !== userId);
    storage.set(STORAGE_KEYS.FRIEND_REQUESTS, updated);
  },

  // Toggle request status
  toggle(userId: string): boolean {
    if (this.isSent(userId)) {
      this.cancel(userId);
      return false;
    } else {
      this.send(userId);
      return true;
    }
  },
};

// Energy Exchanges Backend
export const energyExchangesDB = {
  // Get all energy exchanges
  getAll(): Array<{id: string; amount: number; type: string; timestamp: number}> {
    return storage.get(STORAGE_KEYS.ENERGY_EXCHANGES, []);
  },

  // Add new exchange
  add(amount: number, type: string): void {
    const exchanges = this.getAll();
    exchanges.push({
      id: `exchange_${Date.now()}`,
      amount,
      type,
      timestamp: Date.now(),
    });
    storage.set(STORAGE_KEYS.ENERGY_EXCHANGES, exchanges);
  },

  // Get total exchanged points
  getTotalExchanged(): number {
    const exchanges = this.getAll();
    return exchanges.reduce((total, ex) => total + ex.amount, 0);
  },
};

// Joined Groups Backend
export const joinedGroupsDB = {
  // Get all joined groups
  getAll(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.JOINED_GROUPS, []);
  },

  // Check if user joined a group
  isJoined(groupId: string): boolean {
    const groups = this.getAll();
    return groups.includes(groupId);
  },

  // Join a group
  join(groupId: string): void {
    const groups = this.getAll();
    if (!groups.includes(groupId)) {
      groups.push(groupId);
      storage.set(STORAGE_KEYS.JOINED_GROUPS, groups);
    }
  },

  // Leave a group
  leave(groupId: string): void {
    const groups = this.getAll();
    const updated = groups.filter(id => id !== groupId);
    storage.set(STORAGE_KEYS.JOINED_GROUPS, updated);
  },

  // Toggle group join status
  toggle(groupId: string): boolean {
    if (this.isJoined(groupId)) {
      this.leave(groupId);
      return false;
    } else {
      this.join(groupId);
      return true;
    }
  },
};

// User Preferences Backend
export const userPreferencesDB = {
  // Get all preferences
  getAll(): Record<string, any> {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES, {});
  },

  // Get specific preference
  get<T>(key: string, defaultValue: T): T {
    const prefs = this.getAll();
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
  },

  // Set preference
  set(key: string, value: any): void {
    const prefs = this.getAll();
    prefs[key] = value;
    storage.set(STORAGE_KEYS.USER_PREFERENCES, prefs);
  },

  // Remove preference
  remove(key: string): void {
    const prefs = this.getAll();
    delete prefs[key];
    storage.set(STORAGE_KEYS.USER_PREFERENCES, prefs);
  },
};

// Export storage keys for direct access if needed
export { STORAGE_KEYS };
