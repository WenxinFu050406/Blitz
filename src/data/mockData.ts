// Mock data for Blitz app

export interface BikeDevice {
  model: string;
  battery: number;
  totalDistance: number;
  todayDistance: number;
  speed: number;
  status: "riding" | "parked" | "charging";
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  image: string;
  points: number;
  reward: string;
  visited: boolean;
  distance: string;
}

export interface CarbonData {
  userId: string;
  userName: string;
  avatar: string;
  carbonSaved: number;
  distance: number;
  rank: number;
  badge: "bronze" | "silver" | "gold" | "platinum" | "diamond";
}

export interface EnergyProject {
  id: string;
  name: string;
  description: string;
  energyRequired: number;
  participants: number;
  image: string;
  status: "active" | "completed";
}

export interface SupplyStation {
  id: string;
  name: string;
  type: "cafe" | "repair" | "charging" | "rest";
  distance: string;
  rating: number;
  image: string;
  supplies: string[];
  address: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  totalDistance: number;
  friendsCount: number;
  posts: number;
  bio: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export const bikeDevice: BikeDevice = {
  model: "BESV TRS1 AM",
  battery: 78,
  totalDistance: 1247.5,
  todayDistance: 12.3,
  speed: 0,
  status: "parked",
};

export const landmarks: Landmark[] = [
  {
    id: "1",
    name: "Central Tower",
    description:
      "Iconic downtown landmark with panoramic city views",
    image:
      "https://images.unsplash.com/photo-1583732353104-2791e5926db2?w=400",
    points: 50,
    reward: "City Explorer Badge",
    visited: true,
    distance: "2.3 km",
  },
  {
    id: "2",
    name: "Modern Art Museum",
    description:
      "Contemporary architecture and world-class exhibitions",
    image:
      "https://images.unsplash.com/photo-1548513911-04b11713e7ca?w=400",
    points: 30,
    reward: "Culture Enthusiast",
    visited: false,
    distance: "4.1 km",
  },
  {
    id: "3",
    name: "Riverside Park",
    description: "Beautiful green space along the river",
    image:
      "https://images.unsplash.com/photo-1613370625437-f2956da172ef?w=400",
    points: 20,
    reward: "Nature Lover",
    visited: true,
    distance: "1.8 km",
  },
];

export const carbonRankings: CarbonData[] = [
  {
    userId: "1",
    userName: "You",
    avatar: "👤",
    carbonSaved: 145.8,
    distance: 1247.5,
    rank: 1,
    badge: "platinum",
  },
  {
    userId: "4",
    userName: "Emma Wilson",
    avatar: "👧",
    carbonSaved: 115.2,
    distance: 987.3,
    rank: 2,
    badge: "silver",
  },
  {
    userId: "5",
    userName: "David Lee",
    avatar: "🧑",
    carbonSaved: 98.7,
    distance: 846.1,
    rank: 3,
    badge: "silver",
  },
];

export const energyProjects: EnergyProject[] = [
  {
    id: "1",
    name: "Solar Panel Installation",
    description:
      "Help install solar panels in rural communities",
    energyRequired: 5000,
    participants: 234,
    image:
      "https://images.unsplash.com/photo-1659290542421-dc71df5e7803?w=400",
    status: "active",
  },
  {
    id: "2",
    name: "Urban Tree Planting",
    description:
      "Plant 1000 trees in the city to improve air quality",
    energyRequired: 3000,
    participants: 567,
    image:
      "https://images.unsplash.com/photo-1613370625437-f2956da172ef?w=400",
    status: "active",
  },
];

export const supplyStations: SupplyStation[] = [
  {
    id: "1",
    name: "Bike Hub Cafe",
    type: "cafe",
    distance: "0.8 km",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1604552914267-90a8d81a4254?w=400",
    supplies: ["Coffee", "Snacks", "Water", "Bike Parking"],
    address: "123 Main Street",
  },
  {
    id: "2",
    name: "Quick Fix Station",
    type: "repair",
    distance: "1.2 km",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1636512957897-f3c28ba56e9f?w=400",
    supplies: ["Tools", "Air Pump", "Spare Parts", "Mechanic"],
    address: "456 Oak Avenue",
  },
  {
    id: "3",
    name: "Power Station",
    type: "charging",
    distance: "2.0 km",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1659290542421-dc71df5e7803?w=400",
    supplies: ["Fast Charging", "Lounge Area", "WiFi"],
    address: "789 Electric Road",
  },
];

export const communityPosts: Post[] = [
  {
    id: "3",
    userId: "4",
    userName: "Emma Wilson",
    userAvatar: "👧",
    content: "My BESV just hit 1000km! Best investment ever 🎉",
    image:
      "https://images.unsplash.com/photo-1636512957897-f3c28ba56e9f?w=600",
    likes: 45,
    comments: 8,
    timestamp: "1 day ago",
  },
];

export const currentUser: User = {
  id: "1",
  name: "Alex Rider",
  avatar: "👤",
  location: "San Francisco, CA",
  totalDistance: 1247.5,
  friendsCount: 42,
  posts: 28,
  bio: "Urban explorer | BESV enthusiast | Green commuter 🚴‍♂️🌱",
};

export const friends: User[] = [];

export const userStats = {
  totalRides: 156,
  totalDistance: 1247.5,
  totalTime: 87.5,
  avgSpeed: 14.3,
  carbonSaved: 145.8,
  energyPoints: 3240,
  calories: 24580,
  elevation: 8945,
};