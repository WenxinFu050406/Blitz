import { useState } from "react";
import {
  Home,
  TrendingUp,
  Activity,
  Users,
  User,
} from "lucide-react";
import { MainPage } from "./components/MainPage";
import { StatisticsPage } from "./components/StatisticsPage";
import { ActivitiesPage } from "./components/ActivitiesPage";
import { CommunityPage } from "./components/CommunityPage";
import { MePage } from "./components/MePage";
import { AuthPage } from "./components/AuthPage";
import {
  LanguageProvider,
  useLanguage,
} from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getTranslation } from "./locales/translations";

type NavTab =
  | "home"
  | "statistics"
  | "activities"
  | "community"
  | "me";

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const { language } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const t = getTranslation(language);

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthPage
        onAuthSuccess={(userData, accessToken) =>
          login(userData, accessToken)
        }
      />
    );
  }

  const navItems = [
    { id: "home", icon: Home, label: t.nav.home },
    {
      id: "statistics",
      icon: TrendingUp,
      label: t.nav.statistics,
    },
    {
      id: "activities",
      icon: Activity,
      label: t.nav.activities,
    },
    { id: "community", icon: Users, label: t.nav.community },
    { id: "me", icon: User, label: t.nav.me },
  ] as const;

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto shadow-xl text-foreground">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && <MainPage onNavigateToMe={() => setActiveTab("me")} />}
        {activeTab === "statistics" && <StatisticsPage />}
        {activeTab === "activities" && <ActivitiesPage />}
        {activeTab === "community" && <CommunityPage />}
        {activeTab === "me" && <MePage />}
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-border bg-card">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "scale-105" : ""}`}
                />
                <span
                  className={`text-xs mt-1 ${isActive ? "font-bold" : ""}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}