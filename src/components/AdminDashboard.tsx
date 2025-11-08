import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import redflixLogo from 'figma:asset/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png';

// Icons inline to avoid lucide-react dependency
const Users = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const TrendingUp = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Play = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const DollarSign = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const AlertCircle = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Settings = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m5.196-14.196l-4.243 4.243m-5.657 5.657l-4.243 4.243m16.97-.485l-4.243-4.243m-5.657-5.657l-4.243-4.243"></path>
  </svg>
);

const Video = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const MessageSquare = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Bell = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const BarChart3 = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const UserCheck = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <polyline points="16 11 18 13 22 9"></polyline>
  </svg>
);

const CreditCard = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const Package = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const Megaphone = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 14v-3z"></path>
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
  </svg>
);

const Palette = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"></circle>
    <circle cx="17.5" cy="10.5" r=".5"></circle>
    <circle cx="8.5" cy="7.5" r=".5"></circle>
    <circle cx="6.5" cy="12.5" r=".5"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
  </svg>
);

const Github = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const ChevronLeft = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
import { DashboardOverview } from './admin/DashboardOverview';
import { UsersManagement } from './admin/UsersManagement';
import { FinancialPanel } from './admin/FinancialPanel';
import { ContentManagement } from './admin/ContentManagement';
import { Analytics } from './admin/Analytics';
import { SupportPanel } from './admin/SupportPanel';
import { SystemSettings } from './admin/SystemSettings';
import GitHubSyncPanel from './GitHubSyncPanel';

interface AdminDashboardProps {
  onClose?: () => void;
}

type AdminSection = 
  | 'overview'
  | 'users'
  | 'financial'
  | 'content'
  | 'analytics'
  | 'support'
  | 'notifications'
  | 'advertising'
  | 'settings'
  | 'branding'
  | 'github';

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'content', label: 'Conteúdo', icon: Video },
    { id: 'analytics', label: 'Estatísticas', icon: TrendingUp },
    { id: 'github', label: 'GitHub Sync', icon: Github },
    { id: 'support', label: 'Suporte', icon: MessageSquare },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'advertising', label: 'Publicidade', icon: Megaphone },
    { id: 'settings', label: 'Sistema', icon: Settings },
    { id: 'branding', label: 'Branding', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'financial':
        return <FinancialPanel />;
      case 'content':
        return <ContentManagement />;
      case 'analytics':
        return <Analytics />;
      case 'github':
        return <GitHubSyncPanel />;
      case 'support':
        return <SupportPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 overflow-hidden">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#141414] border-r border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-white" size={20} />
              </button>
            )}
          </div>
          
          {/* Logo RedFlix */}
          <div className="flex justify-center mb-3">
            <ImageWithFallback
              src={redflixLogo}
              alt="RedFlix"
              className="w-28 h-auto object-contain"
              priority={true}
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-white font-['Inter:Bold',sans-serif] text-[16px]">
              Admin Panel
            </h1>
            <p className="text-white/50 font-['Inter:Regular',sans-serif] text-[11px]">
              Dashboard de Gerenciamento
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-120px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as AdminSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-['Inter:Medium',sans-serif] text-[14px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 h-screen overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
