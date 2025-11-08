// Icons inline to avoid lucide-react fetch issues
const Users = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const UserPlus = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const UserMinus = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const Play = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Clock = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrendingUp = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const AlertTriangle = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const CheckCircle = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const DollarSign = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Eye = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
import { Card } from '../ui/card';

// Recharts temporarily commented out due to build issues
// Simple chart placeholders will be used instead
// import { 
//   LineChart, 
//   Line, 
//   BarChart, 
//   Bar, 
//   PieChart, 
//   Pie, 
//   Cell, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer, 
//   AreaChart, 
//   Area 
// } from 'recharts';

// Simple chart placeholder component
const SimpleChart = ({ type, data, title }: { type: string; data: any[]; title: string }) => (
  <div className="w-full h-64 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
    <div className="text-center">
      <div className="text-4xl mb-2">📊</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-1">{type} Chart</p>
    </div>
  </div>
);

export function DashboardOverview() {
  // Dados mockados - substituir por dados reais do backend
  const stats = {
    activeSubscribers: 12458,
    newSubscribers: 342,
    cancellations: 28,
    totalViews: 847392,
    hoursWatched: 234819,
    engagement: 78.4,
    conversionRate: 24.6,
    mrr: 186750,
    serverErrors: 3,
    playerIssues: 1
  };

  const growthData = [
    { month: 'Jan', users: 8500, revenue: 127500, minutes: 1850000 },
    { month: 'Fev', users: 9200, revenue: 138000, minutes: 2100000 },
    { month: 'Mar', users: 9800, revenue: 147000, minutes: 2350000 },
    { month: 'Abr', users: 10500, revenue: 157500, minutes: 2580000 },
    { month: 'Mai', users: 11200, revenue: 168000, minutes: 2890000 },
    { month: 'Jun', users: 12458, revenue: 186870, minutes: 3120000 }
  ];

  const topContent = [
    { title: 'Breaking Bad', views: 45890, hours: 12834, rating: 9.5 },
    { title: 'Stranger Things', views: 42340, hours: 11245, rating: 9.2 },
    { title: 'The Witcher', views: 38920, hours: 10567, rating: 8.9 },
    { title: 'Game of Thrones', views: 36780, hours: 10234, rating: 9.3 },
    { title: 'The Office', views: 34560, hours: 9821, rating: 9.1 },
    { title: 'Friends', views: 32890, hours: 9456, rating: 8.8 },
    { title: 'Dark', views: 31245, hours: 8934, rating: 9.0 },
    { title: 'Peaky Blinders', views: 29870, hours: 8567, rating: 8.9 },
    { title: 'The Crown', views: 28560, hours: 8234, rating: 8.7 },
    { title: 'Narcos', views: 27340, hours: 7890, rating: 8.8 }
  ];

  const deviceData = [
    { name: 'Smart TV', value: 45, color: '#DC2626' },
    { name: 'Mobile', value: 30, color: '#EA580C' },
    { name: 'Desktop', value: 20, color: '#CA8A04' },
    { name: 'Tablet', value: 5, color: '#65A30D' }
  ];

  const planDistribution = [
    { name: 'Básico', users: 4500, revenue: 67500 },
    { name: 'Premium', users: 5800, revenue: 139200 },
    { name: 'Ultra', users: 2158, revenue: 86320 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
          Dashboard Overview
        </h1>
        <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
          Visão geral da plataforma Redfliz
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Subscribers */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                Assinantes Ativos
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[28px]">
                {stats.activeSubscribers.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp size={14} />
                  <span className="font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                    +{stats.newSubscribers}
                  </span>
                </div>
                <span className="text-white/40 font-['Inter:Regular',sans-serif] text-[12px]">
                  este mês
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-600/20 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
          </div>
        </Card>

        {/* New Subscribers */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                Novos Registros
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[28px]">
                {stats.newSubscribers}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-500">
                  <UserPlus size={14} />
                  <span className="font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                    Hoje
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-600/20 rounded-lg">
              <UserPlus className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Cancellations */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                Cancelamentos
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[28px]">
                {stats.cancellations}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  <UserMinus size={14} />
                  <span className="font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                    2.3% taxa
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <UserMinus className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>

        {/* MRR */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                MRR (Receita Mensal)
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[28px]">
                R$ {(stats.mrr / 1000).toFixed(0)}k
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp size={14} />
                  <span className="font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                    +12.5%
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement & Views */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Eye className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Total de Visualizações
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {(stats.totalViews / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Clock className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Horas Assistidas
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {(stats.hoursWatched / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Play className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Taxa de Engajamento
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.engagement}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-red-950/30 to-red-900/20 border-red-600/30 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-white font-['Inter:Bold',sans-serif] text-[16px] mb-2">
                Alertas de Sistema
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 font-['Inter:Medium',sans-serif] text-[14px]">
                    Erros de servidor
                  </span>
                  <span className="text-red-500 font-['Inter:Bold',sans-serif] text-[14px]">
                    {stats.serverErrors}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 font-['Inter:Medium',sans-serif] text-[14px]">
                    Problemas no player
                  </span>
                  <span className="text-yellow-500 font-['Inter:Bold',sans-serif] text-[14px]">
                    {stats.playerIssues}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-green-900/20 border-green-600/30 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-white font-['Inter:Bold',sans-serif] text-[16px] mb-2">
                Conversão Trial → Pago
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 font-['Inter:Medium',sans-serif] text-[14px]">
                    Taxa de conversão
                  </span>
                  <span className="text-green-500 font-['Inter:Bold',sans-serif] text-[14px]">
                    {stats.conversionRate}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-green-600 h-full transition-all"
                    style={{ width: `${stats.conversionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Growth */}
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
            Crescimento de Usuários
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#DC2626" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Growth */}
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
            Receita Mensal (R$)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#A855F7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Device Distribution & Plan Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
            Distribuição por Dispositivo
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.name} ${entry.value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
            Distribuição de Planos
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={planDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="users" fill="#DC2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top 10 Content */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Top 10 Filmes/Séries Mais Assistidos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  #
                </th>
                <th className="text-left py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Título
                </th>
                <th className="text-right py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Visualizações
                </th>
                <th className="text-right py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Horas
                </th>
                <th className="text-right py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Avaliação
                </th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((item, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-white/40 font-['Inter:Bold',sans-serif] text-[14px]">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-['Inter:Medium',sans-serif] text-[14px]">
                      {item.title}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-white/70 font-['Inter:Semi_Bold',sans-serif] text-[14px]">
                      {item.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-white/70 font-['Inter:Semi_Bold',sans-serif] text-[14px]">
                      {item.hours.toLocaleString()}h
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-yellow-500 text-[14px]">★</span>
                      <span className="text-white font-['Inter:Bold',sans-serif] text-[14px]">
                        {item.rating}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Minutes Watched Trend */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Minutos Assistidos (Tendência)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="minutes" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
