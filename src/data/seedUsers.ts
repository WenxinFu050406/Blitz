// Seed data for three test users - 2 English users and 1 Chinese user

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

export const seedUsers: SeedUserData[] = [
  // English User 1 - Mike Johnson (High activity, experienced rider)
  {
    email: "mike.johnson@blitz.com",
    password: "MikeBlitz2024!",
    username: "Mike Johnson",
    avatar: "👨",
    location: "San Francisco, CA",
    bio: "Trail finder and coffee lover ☕🚴‍♂️",
    language: "en",
    
    bikeModel: "BESV JF1",
    battery: 82,
    
    totalDistance: 2156.8,
    todayDistance: 15.7,
    totalRides: 243,
    totalTime: 156.3,
    avgSpeed: 13.8,
    carbonSaved: 252.4,
    energyPoints: 5820,
    calories: 42350,
    elevation: 15680,
    
    visitedLandmarks: ["1", "2", "3", "4"],
    
    carbonRank: 1,
    badge: "platinum",
    
    friendsCount: 52,
    posts: 31,
    
    achievements: ["first_ride", "100km", "500km", "1000km", "2000km", "carbon_hero", "social_butterfly", "early_bird"],
    notifications: 5,
    recentRides: [
      { date: "2024-11-19", distance: 15.7, time: 1.2, avgSpeed: 13.1, calories: 285 },
      { date: "2024-11-18", distance: 22.3, time: 1.6, avgSpeed: 13.9, calories: 412 },
      { date: "2024-11-17", distance: 18.5, time: 1.3, avgSpeed: 14.2, calories: 356 },
      { date: "2024-11-16", distance: 25.1, time: 1.8, avgSpeed: 13.9, calories: 478 },
      { date: "2024-11-15", distance: 19.8, time: 1.4, avgSpeed: 14.1, calories: 389 },
    ],
  },
  
  // English User 2 - Sarah Chen (Environmental advocate, moderate activity)
  {
    email: "sarah.chen@blitz.com",
    password: "SarahGreen2024!",
    username: "Sarah Chen",
    avatar: "👩",
    location: "Oakland, CA",
    bio: "Weekend warrior on two wheels | Green commuter 🌱",
    language: "en",
    
    bikeModel: "BESV TRS1 AM",
    battery: 65,
    
    totalDistance: 1434.2,
    todayDistance: 8.4,
    totalRides: 178,
    totalTime: 98.7,
    avgSpeed: 14.5,
    carbonSaved: 167.9,
    energyPoints: 3860,
    calories: 28120,
    elevation: 9340,
    
    visitedLandmarks: ["1", "3", "5"],
    
    carbonRank: 2,
    badge: "gold",
    
    friendsCount: 38,
    posts: 24,
    
    achievements: ["first_ride", "100km", "500km", "1000km", "eco_warrior", "weekend_rider"],
    notifications: 3,
    recentRides: [
      { date: "2024-11-19", distance: 8.4, time: 0.6, avgSpeed: 14.0, calories: 162 },
      { date: "2024-11-17", distance: 16.2, time: 1.1, avgSpeed: 14.7, calories: 298 },
      { date: "2024-11-16", distance: 12.8, time: 0.9, avgSpeed: 14.2, calories: 235 },
      { date: "2024-11-15", distance: 20.5, time: 1.4, avgSpeed: 14.6, calories: 378 },
      { date: "2024-11-14", distance: 14.3, time: 1.0, avgSpeed: 14.3, calories: 265 },
    ],
  },
  
  // Chinese User - 李明 (City commuter, lower activity)
  {
    email: "li.ming@blitz.com",
    password: "LiMing2024!",
    username: "李明",
    avatar: "🧑",
    location: "上海市",
    bio: "上班通勤 | BESV 爱好者 🚴",
    language: "zh",
    
    bikeModel: "BESV PSA1",
    battery: 58,
    
    totalDistance: 876.3,
    todayDistance: 5.2,
    totalRides: 132,
    totalTime: 67.4,
    avgSpeed: 13.0,
    carbonSaved: 102.6,
    energyPoints: 2340,
    calories: 17180,
    elevation: 5620,
    
    visitedLandmarks: ["1", "2"],
    
    carbonRank: 4,
    badge: "silver",
    
    friendsCount: 25,
    posts: 15,
    
    achievements: ["first_ride", "100km", "500km", "daily_commuter"],
    notifications: 2,
    recentRides: [
      { date: "2024-11-19", distance: 5.2, time: 0.4, avgSpeed: 13.0, calories: 98 },
      { date: "2024-11-18", distance: 6.8, time: 0.5, avgSpeed: 13.6, calories: 128 },
      { date: "2024-11-17", distance: 5.5, time: 0.4, avgSpeed: 13.8, calories: 105 },
      { date: "2024-11-16", distance: 7.2, time: 0.6, avgSpeed: 12.0, calories: 135 },
      { date: "2024-11-15", distance: 6.1, time: 0.5, avgSpeed: 12.2, calories: 115 },
    ],
  },
];

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
  console.log("\n=== Blitz App Test User Credentials ===\n");
  seedUsers.forEach((user, index) => {
    console.log(`User ${index + 1} (${user.language === 'en' ? 'English' : '中文'}):`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Bike Model: ${user.bikeModel}`);
    console.log(`  Total Distance: ${user.totalDistance} km`);
    console.log(`  Carbon Rank: #${user.carbonRank}`);
    console.log(`  Badge: ${user.badge}`);
    console.log("");
  });
};