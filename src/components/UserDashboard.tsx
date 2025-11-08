import React, { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import redflixLogo from 'figma:asset/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png';

// Icons inline to avoid lucide-react dependency
const Film = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const Tv = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const Users = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Star = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const BarChart3 = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const Wallet = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
  </svg>
);

const ChevronRight = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Heart = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const Target = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const Settings = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const LogOut = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Bell = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
);

const Search = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const Award = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Simple chart components to replace recharts
const ResponsiveContainer = ({ children, width, height }: any) => (
  <div style={{ width, height }}>{children}</div>
);

const BarChart = ({ children, data }: any) => (
  <div className="relative w-full h-full flex items-end justify-around px-4 pb-12">
    {data.map((item: any, idx: number) => (
      <div key={idx} className="flex flex-col items-center gap-2 flex-1">
        <div className="flex gap-1 items-end h-[180px]">
          <div 
            className="w-3 bg-[#e8e8e8] rounded-t"
            style={{ height: `${(item.lastWeek / 140) * 100}%` }}
          />
          <div 
            className="w-3 bg-[#E50914] rounded-t"
            style={{ height: `${(item.thisWeek / 140) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-[#9f9f9f] -rotate-45 mt-2 whitespace-nowrap">{item.day}</p>
      </div>
    ))}
  </div>
);

const XAxis = ({ dataKey, tick, angle, textAnchor, height }: any) => null;
const YAxis = ({ tick, tickFormatter }: any) => null;
const Tooltip = ({ contentStyle }: any) => null;
const Bar = ({ dataKey, fill, radius }: any) => null;

interface UserDashboardProps {
  onBack: () => void;
  userName?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onAccountClick?: () => void;
}

export function UserDashboard({
  onBack,
  userName = "Maria Silva",
  userAvatar,
  onProfileClick,
  onAccountClick,
}: UserDashboardProps) {
  const [activeSection, setActiveSection] = useState<
    | "overview"
    | "projects"
    | "transactions"
    | "bills"
    | "expenses"
    | "goals"
    | "settings"
  >("overview");

  // Dados de estatísticas do usuário
  const userStats = {
    totalBalance: 240399,
    hoursWatched: 87,
    seriesInProgress: 5,
    moviesCompleted: 23,
    favoriteGenres: [
      { name: "Ação", value: 35, color: "#E50914" },
      { name: "Drama", value: 28, color: "#C41A23" },
      { name: "Comédia", value: 22, color: "#8B1419" },
      { name: "Ficção", value: 15, color: "#5C0D0F" },
    ],
    weeklyData: [
      { day: "17 Dom", thisWeek: 137, lastWeek: 107 },
      { day: "18 Seg", thisWeek: 92, lastWeek: 81 },
      { day: "19 Ter", thisWeek: 64, lastWeek: 107 },
      { day: "20 Qua", thisWeek: 114, lastWeek: 107 },
      { day: "21 Qui", thisWeek: 113, lastWeek: 90 },
      { day: "22 Sex", thisWeek: 131, lastWeek: 53 },
      { day: "23 Sáb", thisWeek: 110, lastWeek: 87 },
    ],
    topContent: [
      { title: "Stranger Things", hours: 24 },
      { title: "The Crown", hours: 18 },
      { title: "Breaking Bad", hours: 16 },
      { title: "Black Mirror", hours: 12 },
      { title: "The Witcher", hours: 10 },
    ],
  };

  const recentTransactions = [
    {
      title: "Stranger Things",
      subtitle: "Netflix Originals",
      amount: "T4:E6",
      date: "17 Mai 2023",
      icon: Tv,
    },
    {
      title: "The Crown",
      subtitle: "Drama Histórico",
      amount: "T5:E3",
      date: "17 Mai 2023",
      icon: Film,
    },
    {
      title: "Breaking Bad",
      subtitle: "Crime",
      amount: "T2:E8",
      date: "17 Mai 2023",
      icon: Tv,
    },
    {
      title: "Peaky Blinders",
      subtitle: "Drama",
      amount: "T1:E2",
      date: "17 Mai 2023",
      icon: Film,
    },
    {
      title: "Dark",
      subtitle: "Sci-Fi",
      amount: "T3:E1",
      date: "17 Mai 2023",
      icon: Tv,
    },
  ];

  const continueWatching = [
    {
      title: "Stranger Things",
      progress: 67,
      episode: "T4:E6",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    },
    {
      title: "The Crown",
      progress: 45,
      episode: "T5:E3",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
    },
    {
      title: "Breaking Bad",
      progress: 89,
      episode: "T2:E8",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    },
    {
      title: "Peaky Blinders",
      progress: 23,
      episode: "T1:E2",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    },
  ];

  const expensesBreakdown = [
    {
      name: "Séries",
      cost: 2500,
      percentage: 15,
      trend: "up",
      icon: Tv,
    },
    {
      name: "Filmes",
      cost: 350,
      percentage: 8,
      trend: "down",
      icon: Film,
    },
    {
      name: "Documentários",
      cost: 50,
      percentage: 12,
      trend: "down",
      icon: Film,
    },
    {
      name: "Anime",
      cost: 80,
      percentage: 15,
      trend: "down",
      icon: Tv,
    },
    {
      name: "Kids",
      cost: 420,
      percentage: 25,
      trend: "up",
      icon: Users,
    },
    {
      name: "Outros",
      cost: 650,
      percentage: 23,
      trend: "up",
      icon: Star,
    },
  ];

  return (
    <div className="bg-[#f4f5f7] min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-[#191919] w-[256px] h-screen fixed left-0 top-0 flex flex-col px-[28px] py-[48px] gap-[228px]">
        {/* Logo & Menu */}
        <div className="flex flex-col gap-[40px]">
          <button
            onClick={onBack}
            className="flex items-center justify-center"
          >
            <ImageWithFallback
              src={redflixLogo}
              alt="RedFlix"
              className="w-32 h-auto object-contain"
              priority={true}
            />
          </button>

          {/* Menu Items */}
          <div className="flex flex-col gap-[16px]">
            <button
              onClick={() => setActiveSection("overview")}
              className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px] transition-all ${
                activeSection === "overview"
                  ? "bg-[#E50914]"
                  : ""
              }`}
            >
              <BarChart3
                className="w-[24px] h-[24px]"
                style={{
                  stroke:
                    activeSection === "overview"
                      ? "white"
                      : "rgba(255,255,255,0.7)",
                }}
              />
              <span
                className={`font-['Inter:${activeSection === "overview" ? "Semi_Bold" : "Regular"}',sans-serif] text-[16px] leading-[24px] ${
                  activeSection === "overview"
                    ? "text-white"
                    : "text-[rgba(255,255,255,0.7)]"
                }`}
              >
                Visão Geral
              </span>
            </button>

            <button
              onClick={() => setActiveSection("projects")}
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px]"
            >
              <Wallet
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Minha Lista
              </span>
            </button>

            <button className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px]">
              <ChevronRight
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Continue Assistindo
              </span>
            </button>

            <button className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px]">
              <Film
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Histórico
              </span>
            </button>

            <button className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px]">
              <Heart
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Favoritos
              </span>
            </button>

            <button className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px]">
              <Target
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Metas
              </span>
            </button>

            <button 
              onClick={onAccountClick}
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px] hover:bg-[#E50914]/10 transition-colors"
            >
              <Settings
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Minha Conta
              </span>
            </button>

            <button className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px]">
              <Settings
                className="w-[24px] h-[24px]"
                style={{ stroke: "rgba(255,255,255,0.7)" }}
              />
              <span className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[rgba(255,255,255,0.7)]">
                Configurações
              </span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={onBack}
            className="bg-[#E50914] opacity-75 flex items-center gap-[12px] px-[16px] py-[12px] rounded-[4px] w-full"
          >
            <LogOut className="w-[20px] h-[20px] text-white" />
            <span className="font-['Inter:Semi_Bold',sans-serif] text-[16px] leading-[24px] text-white">
              Sair
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[256px] flex-1">
        {/* Header */}
        <div className="border-b border-[#e8e8e8] px-[24px] py-[20px] bg-white flex items-center justify-between">
          <div className="flex items-center gap-[24px]">
            <h1 className="font-['Inter:Bold',sans-serif] text-[20px] leading-[28px] text-[#191919]">
              Painel de Usuário
            </h1>
            <div className="flex items-center gap-[4px] text-[#9f9f9f]">
              <ChevronRight className="w-[24px] h-[24px]" />
              <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[20px]">
                Mai 19, 2023
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[40px]">
            <button className="relative">
              <Bell className="w-[24px] h-[24px] text-[#666666]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full" />
            </button>

            <div className="flex items-center gap-[170px] bg-white shadow-[0px_26px_26px_0px_rgba(106,22,58,0.04)] rounded-[12px] px-[32px] py-[12px]">
              <p className="font-['Inter:Regular',sans-serif] text-[16px] leading-[24px] text-[#9f9f9f]">
                Buscar aqui
              </p>
              <Search className="w-[24px] h-[24px] text-[#525256]" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-[32px]">
          {/* Top Content - 3 Cards */}
          <div className="flex gap-[24px] mb-[32px]">
            {/* Total Balance Card */}
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Inter:Regular',sans-serif] text-[22px] leading-[32px] text-[#878787]">
                Horas Totais
              </p>
              <div className="bg-white shadow-[0px_20px_25px_0px_rgba(76,103,100,0.1)] rounded-[8px] px-[24px] py-[20px]">
                <div className="border-b border-[#f3f3f3] pb-[12px] flex items-center justify-between mb-[20px]">
                  <p className="font-['Inter:Extra_Bold',sans-serif] text-[22px] leading-[32px] text-[#191919] capitalize">
                    {userStats.hoursWatched}h
                  </p>
                  <p className="font-['Inter:Medium',sans-serif] text-[14px] leading-[20px] text-[#525256] capitalize text-right">
                    Este Mês
                  </p>
                </div>

                <div className="bg-[#E50914] rounded-[4px] p-[16px] capitalize">
                  <div className="flex flex-col gap-[12px] text-white">
                    <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[20px] opacity-70">
                      Plano Ativo
                    </p>
                    <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px]">
                      Premium 4K
                    </p>
                    <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[20px] opacity-70">
                      **** **** **** 2598
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-[12px]">
                    <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-white capitalize text-right">
                      R$55,90
                    </p>
                    <div className="bg-white rounded-[20px] p-[4px]">
                      <ArrowUpRight className="w-[16px] h-[16px] text-[#E50914]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-[20px]">
                  <button className="flex items-center gap-[4px] opacity-50">
                    <ChevronRight className="w-[16px] h-[16px] text-[#d1d1d1] rotate-180" />
                    <p className="font-['Inter:Medium',sans-serif] text-[14px] leading-[20px] text-[#d1d1d1] capitalize">
                      Anterior
                    </p>
                  </button>

                  <div className="flex gap-[16px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#E50914]" />
                    <div className="w-[8px] h-[8px] rounded-full bg-[#d1d1d1]" />
                    <div className="w-[8px] h-[8px] rounded-full bg-[#d1d1d1]" />
                  </div>

                  <button className="flex items-center gap-[4px]">
                    <p className="font-['Inter:Medium',sans-serif] text-[14px] leading-[20px] text-[#191919] capitalize">
                      Próximo
                    </p>
                    <ChevronRight className="w-[16px] h-[16px] text-[#191919]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Goals Card */}
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Inter:Regular',sans-serif] text-[22px] leading-[32px] text-[#878787]">
                Metas do Mês
              </p>
              <div className="bg-white shadow-[0px_20px_25px_0px_rgba(76,103,100,0.1)] rounded-[8px] px-[24px] py-[20px]">
                <div className="border-b border-[#f3f3f3] pb-[12px] flex items-center justify-between mb-[20px]">
                  <div className="flex items-center gap-[9px]">
                    <p className="font-['Inter:Extra_Bold',sans-serif] text-[22px] leading-[32px] text-[#191919] capitalize">
                      {userStats.moviesCompleted} filmes
                    </p>
                  </div>
                  <p className="font-['Inter:Medium',sans-serif] text-[14px] leading-[20px] text-[#525256] capitalize text-right">
                    Mai, 2023
                  </p>
                </div>

                <div className="flex gap-[16px] h-[124px]">
                  <div className="flex flex-col gap-[24px] justify-center flex-1">
                    <div className="flex gap-[4px]">
                      <Award className="w-[24px] h-[24px] text-[#525256]" />
                      <div>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#878787]">
                          Meta Alcançada
                        </p>
                        <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#191919] capitalize">
                          {userStats.moviesCompleted} filmes
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-[4px]">
                      <Target className="w-[24px] h-[24px] text-[#525256]" />
                      <div>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#878787]">
                          Meta do Mês
                        </p>
                        <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#191919] capitalize">
                          30 filmes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-[6px]">
                    <div className="relative w-[128px] h-[64px]">
                      <svg
                        width="128"
                        height="68"
                        viewBox="0 0 128 68"
                        fill="none"
                      >
                        <rect
                          width="128"
                          height="64"
                          fill="white"
                        />
                        <path
                          d="M104.729 23.2707C107.229 20.7713 107.247 16.6905 104.511 14.4532C96.4186 7.83682 86.8012 3.28164 76.4858 1.22978C64.071 -1.23968 51.2027 0.0277395 39.5083 4.87175C27.8138 9.71576 17.8183 17.9188 10.7859 28.4436C4.94273 37.1885 1.36322 47.21 0.319709 57.6105C-0.0331616 61.1275 2.86538 64 6.4 64C9.93462 64 12.7588 61.1236 13.1995 57.6165C14.1877 49.7521 16.9928 42.1937 21.4288 35.5548C27.0547 27.135 35.051 20.5726 44.4066 16.6974C53.7622 12.8222 64.0568 11.8083 73.9886 13.7838C81.8196 15.3415 89.1478 18.7026 95.4076 23.5648C98.1991 25.733 102.23 25.77 104.729 23.2707Z"
                          fill="#E50914"
                        />
                        <path
                          d="M121.6 64C125.135 64 128.033 61.1276 127.68 57.6106C127.057 51.3979 125.527 45.2981 123.128 39.5083C119.912 31.7434 115.198 24.6881 109.255 18.7452C103.312 12.8022 96.2566 8.08801 88.4917 4.87171C80.7269 1.65541 72.4046 -3.67377e-07 64 0C55.5954 3.67377e-07 47.2731 1.65541 39.5083 4.87171C31.7434 8.08801 24.6881 12.8022 18.7452 18.7452C12.8022 24.6881 8.08801 31.7434 4.87171 39.5083C2.47348 45.2981 0.943094 51.3979 0.319734 57.6106C-0.0331434 61.1276 2.86538 64 6.4 64C9.93462 64 12.7588 61.1237 13.1995 57.6166C13.7688 53.0863 14.9427 48.6427 16.6974 44.4066C19.2704 38.1947 23.0418 32.5505 27.7961 27.7961C32.5505 23.0418 38.1947 19.2704 44.4066 16.6974C50.6185 14.1243 57.2763 12.8 64 12.8C70.7237 12.8 77.3815 14.1243 83.5934 16.6974C89.8053 19.2704 95.4495 23.0418 100.204 27.7961C104.958 32.5505 108.73 38.1947 111.303 44.4066C113.057 48.6427 114.231 53.0862 114.801 57.6166C115.241 61.1236 118.065 64 121.6 64Z"
                          fill="#E8E8E8"
                        />
                        <path
                          d="M69.7222 60.1874C69.9033 60.7593 70.0015 61.3681 70.0015 61.9999C70.0015 65.3136 67.3152 67.9999 64.0015 67.9999C60.6878 67.9999 58.0015 65.3136 58.0015 61.9999C58.0016 58.6862 60.6879 55.9999 64.0015 55.9999C64.8275 55.9999 65.6145 56.1667 66.3306 56.4686L93.9986 32.0009L69.7222 60.1874Z"
                          fill="#E50914"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center justify-between w-[144px]">
                      <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#d1d1d1] text-center">
                        0
                      </p>
                      <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] leading-[24px] text-[#191919] text-center">
                        {userStats.moviesCompleted}
                      </p>
                      <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#d1d1d1] text-right">
                        30
                      </p>
                    </div>
                    <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#191919]">
                      Meta vs Alcançado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Bill */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[128px]">
                <p className="font-['Inter:Regular',sans-serif] text-[22px] leading-[32px] text-[#878787]">
                  Continue Assistindo
                </p>
                <button className="flex items-center gap-[8px]">
                  <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#878787]">
                    Ver Tudo
                  </p>
                  <ChevronRight className="w-[16px] h-[16px] text-[#878787]" />
                </button>
              </div>

              <div className="bg-white shadow-[0px_20px_25px_0px_rgba(76,103,100,0.1)] rounded-[8px] p-[24px]">
                {continueWatching
                  .slice(0, 2)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between ${index === 0 ? "pb-[20px] pt-[8px] border-b border-[#f3f3f3]" : "pt-[20px] pb-[4px]"}`}
                    >
                      <div className="flex items-center gap-[12px]">
                        <div className="bg-[rgba(210,210,210,0.25)] rounded-[8px] p-[8px] flex flex-col items-center justify-center gap-[2px]">
                          <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#666666] text-center">
                            {index === 0 ? "Mai" : "Jun"}
                          </p>
                          <p className="font-['Inter:Extra_Bold',sans-serif] text-[22px] leading-[32px] text-[#191919] capitalize text-center">
                            {index === 0 ? "15" : "16"}
                          </p>
                        </div>

                        <div>
                          <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#525256] capitalize">
                            {item.title}
                          </p>
                          <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#9f9f9f]">
                            Último episódio - {item.episode}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-[#e8e8e8] rounded-[8px] px-[12px] py-[8px]">
                        <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#525256] capitalize text-center">
                          {item.progress}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Bottom Content - 3 Sections */}
          <div className="flex gap-[24px]">
            {/* Recent Transaction */}
            <div className="flex flex-col gap-[8px] flex-1">
              <div className="flex items-center justify-between">
                <p className="font-['Inter:Regular',sans-serif] text-[22px] leading-[32px] text-[#878787]">
                  Assistidos Recentemente
                </p>
                <button className="flex items-center gap-[8px]">
                  <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#878787]">
                    Ver Tudo
                  </p>
                  <ChevronRight className="w-[16px] h-[16px] text-[#878787]" />
                </button>
              </div>

              <div className="bg-white shadow-[0px_20px_25px_0px_rgba(76,103,100,0.1)] rounded-[8px] px-[24px] pb-[34px] pt-[16px]">
                <div className="flex gap-[20px] mb-[12px]">
                  <button className="pb-[8px] border-b-2 border-[#E50914]">
                    <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#E50914] capitalize">
                      Todos
                    </p>
                  </button>
                  <button className="pb-[8px]">
                    <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#525256] capitalize">
                      Séries
                    </p>
                  </button>
                  <button className="pb-[8px]">
                    <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#525256] capitalize">
                      Filmes
                    </p>
                  </button>
                </div>

                <div className="flex flex-col">
                  {recentTransactions.map(
                    (transaction, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-[28px] py-[24px] ${index < recentTransactions.length - 1 ? "border-b border-[#f3f3f3]" : ""}`}
                      >
                        <div className="flex items-center gap-[16px] flex-1">
                          <div className="bg-[rgba(210,210,210,0.25)] rounded-[8px] p-[8px]">
                            {React.createElement(
                              transaction.icon,
                              {
                                className:
                                  "w-[24px] h-[24px] text-[#666666]",
                              },
                            )}
                          </div>
                          <div>
                            <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] leading-[24px] text-[#191919]">
                              {transaction.title}
                            </p>
                            <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#9f9f9f]">
                              {transaction.subtitle}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] leading-[24px] text-[#525256]">
                            {transaction.amount}
                          </p>
                          <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#9f9f9f]">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-col gap-[8px] flex-1">
              <p className="font-['Inter:Regular',sans-serif] text-[22px] leading-[32px] text-[#878787]">
                Estatísticas
              </p>

              <div className="bg-white shadow-[0px_20px_25px_0px_rgba(76,103,100,0.1)] rounded-[8px] px-[24px] pb-[40px] pt-[16px]">
                <div className="flex items-center justify-between mb-[14px]">
                  <div className="flex items-center gap-[12px]">
                    <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] leading-[24px] text-[#191919]">
                      Comparação Semanal
                    </p>
                    <ChevronDown className="w-[24px] h-[24px] text-[#525256]" />
                  </div>

                  <div className="flex items-center gap-[24px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[16px] h-[8px] rounded-[2px] bg-[#E50914]" />
                      <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#525256]">
                        Esta semana
                      </p>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[16px] h-[8px] rounded-[2px] bg-[#e8e8e8]" />
                      <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#525256]">
                        Semana passada
                      </p>
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={userStats.weeklyData}>
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#9f9f9f", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fill: "#9f9f9f" }}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #f3f3f3",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="lastWeek"
                      fill="#e8e8e8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="thisWeek"
                      fill="#E50914"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Expenses Breakdown */}
          <div className="mt-[24px]">
            <div className="flex items-end justify-between mb-[8px]">
              <p className="font-['Inter:Regular',sans-serif] text-[22px] leading-[32px] text-[#878787]">
                Categorias Assistidas
              </p>
              <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#9f9f9f] text-right">
                *Comparado ao mês passado
              </p>
            </div>

            <div className="bg-white shadow-[0px_20px_25px_0px_rgba(76,103,100,0.1)] rounded-[8px] px-[24px] py-[20px]">
              <div className="grid grid-cols-3 gap-y-[24px] gap-x-[40px] relative">
                {expensesBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-[16px] px-[16px] py-[8px] rounded-[8px]"
                  >
                    <div className="bg-[rgba(210,210,210,0.25)] rounded-[8px] p-[8px] h-[56px] flex items-center justify-center">
                      {React.createElement(item.icon, {
                        className:
                          "w-[24px] h-[24px] text-[#878787]",
                      })}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-[2px] mb-[4px]">
                        <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#878787]">
                          {item.name}
                        </p>
                        <p className="font-['Inter:Bold',sans-serif] text-[16px] leading-[24px] text-[#191919] capitalize">
                          {item.cost}h
                        </p>
                      </div>

                      <div className="flex items-center gap-[8px]">
                        <p className="font-['Inter:Medium',sans-serif] text-[12px] leading-[16px] text-[#9f9f9f]">
                          {item.percentage}%*
                        </p>
                        {item.trend === "up" ? (
                          <ChevronRight className="w-[16px] h-[16px] text-[#E73D1C] -rotate-90" />
                        ) : (
                          <ChevronRight className="w-[16px] h-[16px] text-[#4DAF6E] rotate-90" />
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-[24px] h-[24px] text-[#9f9f9f] opacity-50 mt-[5px]" />
                  </div>
                ))}

                {/* Grid Lines */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width="100%"
                  height="176"
                >
                  <line
                    x1="0"
                    y1="85.5"
                    x2="100%"
                    y2="85.5"
                    stroke="#D1D1D1"
                    strokeOpacity="0.2"
                  />
                  <line
                    x1="33%"
                    y1="0.5"
                    x2="33%"
                    y2="175.5"
                    stroke="#D1D1D1"
                    strokeOpacity="0.2"
                  />
                  <line
                    x1="66%"
                    y1="0.5"
                    x2="66%"
                    y2="175.5"
                    stroke="#D1D1D1"
                    strokeOpacity="0.2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}