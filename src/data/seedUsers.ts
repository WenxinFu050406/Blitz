// Seed user data interface - empty by default
// Used for maintaining user data structure compatibility

export interface SeedUserData {
  // Account credentials
  email: string;
  password: string;
  username: string;
  
  // Profile info
  avatar: string;
  location: string;
  bio: string;
  language: 'en' | 'zh';
  
  // Device info
  bikeModel: string;
  battery: number;
  
  // Stats
  totalDistance: number;
  todayDistance: number;
  totalRides: number;
  totalTime: number; // hours
  avgSpeed: number; // km/h
  carbonSaved: number; // kg
  energyPoints: number;
  calories: number;
  elevation: number; // meters
  
  // Check-ins (landmark IDs that have been visited)
  visitedLandmarks: string[];
  
  // Rank info
  carbonRank: number;
  badge: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  
  // Social
  friendsCount: number;
  posts: number;
  
  // Additional user details
  achievements: string[];
  notifications: number;
  recentRides: Array<{
    date: string;
    distance: number;
    time: number;
    avgSpeed: number;
    calories: number;
  }>;
}

// Empty seed users array - no predefined test users
export const seedUsers: SeedUserData[] = [];

// Helper function to get user credentials for display
export const getUserCredentials = () => {
  return seedUsers.map(user => ({
    email: user.email,
    password: user.password,
    username: user.username,
    language: user.language,
  }));
};

// Display credentials in a formatted way
export const displayCredentials = () => {
  console.log("\n=== Blitz App - No Test Users ===\n");
  console.log("All test users have been removed.");
  console.log("Please register a new account to use the application.\n");
};
