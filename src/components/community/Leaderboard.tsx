import { useState } from "react";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Leaf,
  Zap,
  Bike,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../context/LanguageContext";
import { getTranslation } from "../../locales/translations";
import { useAuth } from "../../context/AuthContext";

interface LeaderboardProps {
  onBack: () => void;
}

type RankingScope = "neighborhood" | "city" | "province";
type RankingCategory =
  | "distance"
  | "carbon"
  | "energy"
  | "rides";

// Mock leaderboard data
const generateLeaderboard = (
  category: RankingCategory,
  scope: RankingScope,
) => {
  const riders = [
    {
      id: "1",
      name: "Alex Chen",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      location: "Downtown",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      location: "Mission District",
    },
    {
      id: "3",
      name: "Mike Park",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      location: "SoMa",
    },
    {
      id: "4",
      name: "Emma Wilson",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      location: "Castro",
    },
    {
      id: "5",
      name: "David Lee",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      location: "Nob Hill",
    },
    {
      id: "6",
      name: "Lisa Martinez",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      location: "Marina",
    },
    {
      id: "7",
      name: "Tom Anderson",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
      location: "Haight",
    },
    {
      id: "8",
      name: "Sophie Brown",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      location: "Richmond",
    },
    {
      id: "9",
      name: "Chris Wong",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
      location: "Sunset",
    },
    {
      id: "10",
      name: "Maria Garcia",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      location: "Excelsior",
    },
  ];

  const values = {
    distance: () => Math.floor(Math.random() * 800) + 200,
    carbon: () => Math.floor(Math.random() * 150) + 30,
    energy: () => Math.floor(Math.random() * 5000) + 1000,
    rides: () => Math.floor(Math.random() * 80) + 20,
  };

  const units = {
    distance: "km",
    carbon: "kg CO₂",
    energy: "pts",
    rides: "rides",
  };

  return riders
    .map((rider, index) => ({
      ...rider,
      rank: index + 1,
      value: values[category](),
      unit: units[category],
    }))
    .sort((a, b) => b.value - a.value);
};

export function Leaderboard({ onBack }: LeaderboardProps) {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const t = getTranslation(language).community;
  const [scope, setScope] =
    useState<RankingScope>("neighborhood");
  const [category, setCategory] =
    useState<RankingCategory>("distance");
  const [leaderboard, setLeaderboard] = useState(
    generateLeaderboard("distance", "neighborhood"),
  );

  const handleScopeChange = (newScope: RankingScope) => {
    setScope(newScope);
    setLeaderboard(generateLeaderboard(category, newScope));
  };

  const handleCategoryChange = (
    newCategory: RankingCategory,
  ) => {
    setCategory(newCategory);
    setLeaderboard(generateLeaderboard(newCategory, scope));
  };

  const scopes = [
    { id: "neighborhood", label: t.neighborhood, icon: "🏘️" },
    { id: "city", label: t.city, icon: "🏙️" },
    { id: "province", label: t.province, icon: "🗺️" },
  ];

  const categories = [
    {
      id: "distance",
      label: t.totalDistance,
      icon: TrendingUp,
      color: "from-cyan-500 to-teal-500",
    },
    {
      id: "carbon",
      label: t.carbonSaved,
      icon: Leaf,
      color: "from-green-500 to-teal-500",
    },
    {
      id: "energy",
      label: t.energyPoints,
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: "rides",
      label: t.weeklyRides,
      icon: Bike,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-orange-500";
    if (rank === 2) return "from-slate-300 to-slate-400";
    if (rank === 3) return "from-orange-400 to-red-500";
    return "from-slate-100 to-slate-200";
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-base text-slate-800">
              {t.leaderboard}
            </h2>
            <p className="text-xs text-slate-500">
              {language === "zh-CN"
                ? "查看骑手排名"
                : "View rider rankings"}
            </p>
          </div>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>

        {/* Scope Selector */}
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-600 mb-2">
            {t.rankingScope}
          </p>
          <div className="flex gap-2">
            {scopes.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  handleScopeChange(s.id as RankingScope)
                }
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 ${
                  scope === s.id
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector */}
        <div className="px-4 pb-4">
          <p className="text-xs text-slate-600 mb-2">
            {t.rankingCategory}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    handleCategoryChange(
                      cat.id as RankingCategory,
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
                    category === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {leaderboard.map((entry, index) => {
          const isCurrentUser =
            entry.name === currentUser?.name;
          return (
            <Card
              key={entry.id}
              className={`p-4 border shadow-sm transition-all ${
                isCurrentUser
                  ? "border-cyan-500 bg-cyan-50/50"
                  : "border-slate-100 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white">
                    {getRankEmoji(entry.rank)}
                  </span>
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm text-slate-800">
                      {entry.name}
                    </h4>
                    {isCurrentUser && (
                      <Badge className="bg-cyan-500 text-white text-xs h-5 px-1.5">
                        {t.you}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {entry.location}
                  </p>
                </div>

                {/* Value */}
                <div className="text-right">
                  <p className="text-base text-slate-800">
                    {entry.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {entry.unit}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Current User Position (if not in top 10) */}
      {!leaderboard.some(
        (entry) => entry.name === currentUser?.name,
      ) && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <Card className="p-4 border-cyan-500 bg-cyan-50/50 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-sm">
                <span className="text-slate-700">
                  #{Math.floor(Math.random() * 50) + 20}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm text-slate-800">
                    {currentUser?.name}
                  </h4>
                  <Badge className="bg-cyan-500 text-white text-xs h-5 px-1.5">
                    {t.you}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser?.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base text-slate-800">
                  {Math.floor(Math.random() * 200) + 50}
                </p>
                <p className="text-xs text-slate-500">
                  {category === "distance" && "km"}
                  {category === "carbon" && "kg CO₂"}
                  {category === "energy" && "pts"}
                  {category === "rides" && "rides"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}