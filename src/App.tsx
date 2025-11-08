// RedFlix v2.2.5 - SupportPanel (5), UsersManagement (14), ContentManagement (8) Fixed - All 27 admin components clean
import { useState, useEffect } from 'react';
import svgPaths from './imports/svg-ynd0965yz';
import redflixLogo from 'figma:asset/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png';
import { Movie } from './utils/tmdb';
import { MovieCard } from './components/MovieCard';
import { ContinueWatchingCard } from './components/ContinueWatchingCard';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { HeroSlider } from './components/HeroSlider';
import { MovieDetails } from './components/MovieDetails';
import { PersonDetails } from './components/PersonDetails';
import { ChannelsPage } from './components/ChannelsPage';
import { KidsPage } from './components/KidsPage';
import { SoccerPage } from './components/SoccerPage';
import { LanguageBrowsePage } from './components/LanguageBrowsePage';
import { MyListPage } from './components/MyListPage';
import { ContinueWatchingPage } from './components/ContinueWatchingPage';
import { HistoryPage } from './components/HistoryPage';
import { FavoritosPage } from './components/FavoritosPage';
import { RedFlixOriginalsPage } from './components/RedFlixOriginalsPage';
import { MoviesPage } from './components/MoviesPage';
import { SeriesPage } from './components/SeriesPage';
import { BombandoPage } from './components/BombandoPage';
import { IPTVPage } from './components/IPTVPage';
import { SearchOverlay } from './components/SearchOverlay';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ContentRow } from './components/ContentRow';
import { InfiniteContentRow } from './components/InfiniteContentRow';
import { HorizontalCarousel } from './components/HorizontalCarousel';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './components/AdminDashboard';
import { NetflixHeader } from './components/NetflixHeader';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ChoosePlan } from './components/ChoosePlan';
import { ProfileSelection } from './components/ProfileSelection';
import { ProfileManagement } from './components/ProfileManagement';
import { UserDashboard } from './components/UserDashboard';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { AccountSettings } from './components/AccountSettings';
import { Toaster, toast } from 'sonner';
import { quickLoadContent } from './utils/quickContentLoader';
import { initializeImageCache } from './utils/imageCache';
import { preloadContentImages, preloadCriticalImages } from './utils/imagePreloader';
import { preloadHeroContent, preloadCriticalResources, prefetchMainRoutes } from './utils/resourcePreloader';
import './utils/testImagePreload'; // Load test functions globally
import { FeaturedBanners } from './components/FeaturedBanners';
import { StreamingLogos } from './components/StreamingLogos';
import { StreamingMarquee } from './components/StreamingMarquee';
import { Top10Section } from './components/Top10Section';
import { BottomNavBar } from './components/BottomNavBar';
import { MobileFilters } from './components/MobileFilters';
import { MyProfile } from './components/MyProfile';
import { ImageCacheDiagnostic } from './components/ImageCacheDiagnostic';
import { ImagePreloadMonitor } from './components/ImagePreloadMonitor';
import { AccountPage } from './components/AccountPage';

function Group() {
  return (
    <div className="absolute inset-[8.333%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path d={svgPaths.p261e0f00} fill="var(--fill-0, #DC2626)" id="Vector" />
          <path d="M10 13V16" id="Vector_2" stroke="var(--stroke-0, #2D2E47)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame308({ active = false, collapsed = false }: { active?: boolean; collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="solar:home-2-linear">
        <Group />
      </div>
      {!collapsed && <p className={`font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${active ? 'text-red-600' : 'text-[#fefefe]'}`}>Início</p>}
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-4.167%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <g id="Group">
            <path d={svgPaths.p1d7c1c80} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p274d3200} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame310({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="iconamoon:discover">
        <Group1 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Descobrir</p>}
    </div>
  );
}

function Frame309({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="fluent:fire-16-regular">
        <div className="absolute inset-[6.25%_15.61%_6.25%_18.76%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
            <path d={svgPaths.p19c1fbc0} fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Em Alta</p>}
    </div>
  );
}

function Frame312({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="tabler:stopwatch">
        <div className="absolute inset-[12.5%_20.83%_16.67%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-4.41%_-5.36%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 19">
              <path d={svgPaths.p2511f680} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Em Breve</p>}
    </div>
  );
}

function Frame311({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0">
      <Frame308 active={true} collapsed={collapsed} />
      <Frame310 collapsed={collapsed} />
      <Frame309 collapsed={collapsed} />
      <Frame312 collapsed={collapsed} />
    </div>
  );
}

function Frame2654({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#bebebe] text-[12px] w-[min-content]">MENU</p>}
      <Frame311 collapsed={collapsed} />
    </div>
  );
}

function Frame313({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="fluent:clock-12-regular">
        <div className="absolute inset-[8.333%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p841ef00} fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Histórico</p>}
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[11.46%_19.79%_11.44%_19.79%]" data-name="Group">
      <div className="absolute inset-[-4.05%_-5.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
          <g id="Group">
            <path d={svgPaths.p23141a00} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame314({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="mage:bookmark-question-mark">
        <Group2 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Favoritos</p>}
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]" data-name="Group">
      <div className="absolute inset-[-3.947%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="Group">
            <path d={svgPaths.p328ee780} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pec31540} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3cd7cf00} id="Vector_3" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame315({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="tabler:calendar-time">
        <Group3 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Ver Depois</p>}
    </div>
  );
}

function ChannelsMenuItem({ collapsed = false, onClick }: { collapsed?: boolean; onClick: () => void }) {
  return (
    <div 
      className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={onClick}
    >
      <div className="relative shrink-0 size-[24px]">
        <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="#FEFEFE" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Canais</p>}
    </div>
  );
}

function Frame316({ collapsed = false, onChannelsClick }: { collapsed?: boolean; onChannelsClick: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0">
      <Frame313 collapsed={collapsed} />
      <Frame314 collapsed={collapsed} />
      <Frame315 collapsed={collapsed} />
      <ChannelsMenuItem collapsed={collapsed} onClick={onChannelsClick} />
    </div>
  );
}

function Frame2821({ collapsed = false, onChannelsClick }: { collapsed?: boolean; onChannelsClick: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#bebebe] text-[12px] w-[min-content]">BIBLIOTECA</p>}
      <Frame316 collapsed={collapsed} onChannelsClick={onChannelsClick} />
    </div>
  );
}

function Frame317({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="fluent:person-support-24-regular">
        <div className="absolute inset-[4.16%_16.65%_8.32%_16.68%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(254, 254, 254, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
              <path d={svgPaths.p3ec9480} fill="var(--fill-0, #FEFEFE)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Ajuda</p>}
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.33%_10.72%]" data-name="Group">
      <div className="absolute inset-[-3.75%_-3.98%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 22">
          <g id="Group">
            <path d={svgPaths.p36eed880} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeWidth="1.5" />
            <path d={svgPaths.p2959f370} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame318({ collapsed = false, onAdminClick }: { collapsed?: boolean; onAdminClick?: () => void }) {
  return (
    <div 
      onClick={onAdminClick}
      className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}
    >
      <div className="relative shrink-0 size-[24px]" data-name="solar:settings-linear">
        <Group4 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Admin Panel</p>}
    </div>
  );
}

function Frame319({ collapsed = false, onAdminClick }: { collapsed?: boolean; onAdminClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0">
      <Frame317 collapsed={collapsed} />
      <Frame318 collapsed={collapsed} onAdminClick={onAdminClick} />
    </div>
  );
}

function Frame2822({ collapsed = false, onAdminClick }: { collapsed?: boolean; onAdminClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#bebebe] text-[12px] w-[min-content]">OUTROS</p>}
      <Frame319 collapsed={collapsed} onAdminClick={onAdminClick} />
    </div>
  );
}

function Frame3370({ collapsed = false, onChannelsClick, onAdminClick }: { collapsed?: boolean; onChannelsClick: () => void; onAdminClick: () => void }) {
  return (
    <div className={`absolute content-stretch flex flex-col gap-[34px] items-start left-[24px] top-[104px] transition-all duration-300 ${collapsed ? 'w-[48px]' : 'w-[146px]'}`}>
      <Frame2654 collapsed={collapsed} />
      <Frame2821 collapsed={collapsed} onChannelsClick={onChannelsClick} />
      <Frame2822 collapsed={collapsed} onAdminClick={onAdminClick} />
    </div>
  );
}

function Frame2789({ activeCategory, onCategoryChange }: { activeCategory: string; onCategoryChange: (category: string) => void }) {
  const categories = ['Início', 'Filmes', 'Séries', 'Animes', 'Canais', 'Futebol', 'Kids'];
  
  return (
    <div className="content-stretch flex gap-[24px] items-center leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre px-[30px] my-[6px] my-[7px] mx-[0px] px-[130px] py-[0px]">
      {categories.map((category) => (
        <p 
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${
            activeCategory === category 
              ? "font-['Inter:Bold',sans-serif] font-bold" 
              : "font-['Inter:Medium',sans-serif] font-medium"
          }`}
        >
          {category}
        </p>
      ))}
    </div>
  );
}

function Frame2790({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div 
      className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer"
      onClick={onSearchClick}
    >
      <div className="relative shrink-0 size-[24px]" data-name="majesticons:search-line">
        <div className="absolute inset-[16.66%_16.67%_16.67%_16.66%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <path d={svgPaths.pad20300} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2791({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div 
      className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer transition-all hover:scale-110"
      onClick={onSearchClick}
    >
      <Frame2790 onSearchClick={onSearchClick} />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[8.33%_16.67%_8.33%_16.66%]" data-name="Group">
      <div className="absolute inset-[-5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
          <g id="Group">
            <path d={svgPaths.p204109f0} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p3d802230} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2792() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
      <div className="relative shrink-0 size-[44px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
          <circle cx="22" cy="22" fill="var(--fill-0, #B8DFF2)" id="Ellipse 182" r="22" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="ri:arrow-drop-down-line">
        <div className="absolute inset-[38.93%_32.32%_37.5%_32.32%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 6">
            <path d={svgPaths.p3d5b69c0} fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame2793() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity" data-name="akar-icons:bell">
        <Group5 />
      </div>
      <Frame2792 />
    </div>
  );
}

function Frame3368({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div className="content-stretch flex gap-[34px] items-center relative shrink-0">
      <Frame2791 onSearchClick={onSearchClick} />
      <Frame2793 />
    </div>
  );
}

function Frame3369({ activeCategory, onCategoryChange, onSearchClick }: { 
  activeCategory: string; 
  onCategoryChange: (category: string) => void;
  onSearchClick: () => void;
}) {
  return (
    <div className="content-stretch flex items-center justify-between top-[12px] w-full px-[0px] py-[5px] my-[-30px] mx-[0px] m-[0px]">
      <div className="flex items-center gap-[24px] mx-[0px] my-[30px] px-[30px] px-[50px] py-[5px]">
        <Frame2789 activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
      </div>
      <Frame3368 onSearchClick={onSearchClick} />
    </div>
  );
}


export default function App() {
  // Auth & Navigation States
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'choosePlan' | 'profileSelection' | 'profileManagement' | 'home'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Content States
  const [allContent, setAllContent] = useState<Movie[]>([]);
  const [topShows, setTopShows] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState('Início');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<{ id: number; name: string } | null>(null);
  
  // Função wrapper para validar antes de abrir MovieDetails
  const handleMovieClick = (movie: Movie | null) => {
    if (!movie) {
      setSelectedMovie(null);
      return;
    }
    
    // Validar ID
    if (!movie.id || movie.id <= 0 || isNaN(movie.id)) {
      console.warn('⚠️ Invalid movie ID, skipping:', movie);
      return;
    }
    
    setSelectedMovie(movie);
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showChannels, setShowChannels] = useState(false);
  const [showKidsPage, setShowKidsPage] = useState(false);
  const [showSoccerPage, setShowSoccerPage] = useState(false);
  const [showLanguagePage, setShowLanguagePage] = useState(false);
  const [showMyListPage, setShowMyListPage] = useState(false);
  const [showContinueWatchingPage, setShowContinueWatchingPage] = useState(false);
  const [showHistoryPage, setShowHistoryPage] = useState(false);
  const [showFavoritosPage, setShowFavoritosPage] = useState(false);
  const [showRedFlixOriginalsPage, setShowRedFlixOriginalsPage] = useState(false);
  const [showMoviesPage, setShowMoviesPage] = useState(false);
  const [showSeriesPage, setShowSeriesPage] = useState(false);
  const [showBombandoPage, setShowBombandoPage] = useState(false);
  const [showIPTVPage, setShowIPTVPage] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // Minha Lista & Likes States (com localStorage)
  const [myList, setMyList] = useState<number[]>(() => {
    const saved = localStorage.getItem('redflix_mylist');
    return saved ? JSON.parse(saved) : [];
  });
  const [likedList, setLikedList] = useState<number[]>(() => {
    const saved = localStorage.getItem('redflix_liked');
    return saved ? JSON.parse(saved) : [];
  });
  const [watchLaterList, setWatchLaterList] = useState<number[]>(() => {
    const saved = localStorage.getItem('redflix_watchlater');
    return saved ? JSON.parse(saved) : [];
  });
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [currentUser] = useState({ name: 'Usuário', avatar: '' });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<number>(0);
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');
  const [bottomNavTab, setBottomNavTab] = useState<string>('home');
  const [mobileFilter, setMobileFilter] = useState<string>('series');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // TOP 10 States
  const [top10BrasilSeries, setTop10BrasilSeries] = useState<Movie[]>([]);
  const [top10Trending, setTop10Trending] = useState<Movie[]>([]);

  // Inicializar sistema de cache de imagens
  useEffect(() => {
    console.log('🚀 Initializing RedFlix Image Cache System...');
    initializeImageCache();
    
    // Limpar cache expirado de imagens do servidor (executar uma vez por sessão)
    const { clearExpiredServerCache, getImageCacheStats } = require('./utils/imageProxy');
    
    // Executar limpeza após 2 segundos (não bloquear carregamento inicial)
    setTimeout(async () => {
      try {
        await clearExpiredServerCache();
        
        // Log de estatísticas do cache
        const stats = await getImageCacheStats();
        if (stats) {
          console.log('📊 Image Cache Stats:', stats);
          const sizeMB = stats.storage?.totalSize 
            ? (stats.storage.totalSize / 1024 / 1024).toFixed(2) 
            : '0';
          console.log(`💾 Storage: ${stats.storage?.filesCount || 0} files, ${sizeMB} MB`);
          console.log(`🗂️ KV Cache: ${stats.cache?.activeEntries || 0} active entries`);
        }
      } catch (error) {
        // Ignorar erros de limpeza
        console.debug('Cache cleanup skipped:', error);
      }
    }, 2000);
  }, []);

  // Preload de recursos críticos na inicialização
  useEffect(() => {
    preloadCriticalResources();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setLoadingProgress(10);
        setError(null);
        
        console.log('🎬 Starting FAST content load...');
        
        // MODO SIMPLIFICADO: Apenas Quick Load (instantâneo e garantido)
        console.log('⚡ Loading content with guaranteed fallback...');
        setLoadingProgress(30);
        
        const quickContent = await quickLoadContent();
        
        // O quickLoadContent SEMPRE retorna conteúdo (tem fallback interno)
        if (quickContent && quickContent.length > 0) {
          console.log('✅ Content loaded successfully:', quickContent.length, 'items!');
          setLoadingProgress(90);
          
          setAllContent(quickContent);
          setTopShows(quickContent);
          setContinueWatching(quickContent.slice(0, 5));
          
          // TOP 10 Brasil em séries
          const localSeriesTop10 = quickContent
            .filter(item => item.media_type === 'tv' || item.name)
            .slice(0, 10);
          setTop10BrasilSeries(localSeriesTop10);
          
          // TOP 10 em alta
          const localTrendingTop10 = quickContent.slice(0, 10);
          setTop10Trending(localTrendingTop10);
          
          setLoadingProgress(100);
          setLoading(false);
          
          console.log('🎉 FAST LOAD complete! (< 1 second)');
          
          // Preload imagens em background
          setTimeout(() => {
            const heroContent = quickContent.slice(0, 5);
            const firstRowContent = quickContent.slice(5, 20);
            preloadCriticalImages(heroContent, firstRowContent);
            preloadHeroContent(heroContent);
          }, 1000);
          
          return; // SUCESSO
        }
        
        // Se por algum motivo absurdo o quickContent falhar (impossível)
        console.error('❌ Quick Load returned empty - this should never happen!');
        setError('Erro ao carregar conteúdo. Recarregue a página.');
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error loading content:', error);
        // Mesmo em erro, tentar carregar fallback interno diretamente
        console.log('🔄 Attempting emergency fallback...');
        try {
          const emergencyContent = await quickLoadContent();
          if (emergencyContent && emergencyContent.length > 0) {
            setAllContent(emergencyContent);
            setTopShows(emergencyContent);
            setContinueWatching(emergencyContent.slice(0, 5));
            setTop10BrasilSeries(emergencyContent.filter(i => i.media_type === 'tv').slice(0, 10));
            setTop10Trending(emergencyContent.slice(0, 10));
            setLoading(false);
            console.log('✅ Emergency fallback successful!');
            return;
          }
        } catch (emergencyError) {
          console.error('❌ Emergency fallback also failed:', emergencyError);
        }
        setError('Erro ao carregar conteúdo. Recarregue a página.');
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Efeito para esconder/mostrar barra superior ao rolar
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Mostrar barra ao rolar
      setShowTopBar(true);
      
      // Limpar timeout anterior
      clearTimeout(timeoutId);
      
      // Esconder após 2 segundos de inatividade
      timeoutId = setTimeout(() => {
        if (currentScrollY > 100) {
          setShowTopBar(false);
        }
      }, 2000);
      
      setLastScrollY(currentScrollY);
    };
    
    // Mostrar barra ao mover o mouse
    const handleMouseMove = () => {
      setShowTopBar(true);
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (window.scrollY > 100) {
          setShowTopBar(false);
        }
      }, 2000);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      console.log('🔍 Busca vazia - resetando resultados');
      setShowSearchResults(false);
      return;
    }
    
    console.log('🔍 Buscando por:', query);
    
    // Filtrar conteúdo baseado na query
    const searchResults = allContent.filter(item => {
      const title = (item.title || item.name || '').toLowerCase();
      const overview = (item.overview || '').toLowerCase();
      const searchTerm = query.toLowerCase();
      
      return title.includes(searchTerm) || overview.includes(searchTerm);
    });
    
    console.log(`✅ ${searchResults.length} resultados encontrados para "${query}"`);
    
    // Mostrar página de resultados
    setShowSearchResults(true);
  };

  // Funções para gerenciar Minha Lista e Likes
  const handleAddToList = (movie: Movie) => {
    const isAdding = !myList.includes(movie.id);
    const title = movie.title || movie.name || 'Item';
    
    setMyList((prev) => {
      const newList = prev.includes(movie.id) 
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem('redflix_mylist', JSON.stringify(newList));
      return newList;
    });
    
    if (isAdding) {
      toast.success(`${title} adicionado à Minha Lista`, {
        duration: 2000,
        position: 'bottom-center',
      });
    } else {
      toast(`${title} removido da Minha Lista`, {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  const handleLike = (movie: Movie) => {
    const isLiking = !likedList.includes(movie.id);
    const title = movie.title || movie.name || 'Item';
    
    setLikedList((prev) => {
      const newList = prev.includes(movie.id)
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem('redflix_liked', JSON.stringify(newList));
      return newList;
    });
    
    if (isLiking) {
      toast.success(`Você curtiu ${title}`, {
        duration: 2000,
        position: 'bottom-center',
        icon: '👍',
      });
    } else {
      toast(`Curtida removida de ${title}`, {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  const handleWatchLater = (movie: Movie) => {
    const isAdding = !watchLaterList.includes(movie.id);
    const title = movie.title || movie.name || 'Item';
    
    setWatchLaterList((prev) => {
      const newList = prev.includes(movie.id)
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem('redflix_watchlater', JSON.stringify(newList));
      return newList;
    });
    
    if (isAdding) {
      toast.success(`${title} adicionado a Assistir Depois`, {
        duration: 2000,
        position: 'bottom-center',
        icon: '🕒',
      });
    } else {
      toast(`${title} removido de Assistir Depois`, {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  // Categorizar conteúdo (usar media_type ou verificar title vs name)
  const movies = allContent.filter(item => {
    // Se tiver media_type, usar ele
    if (item.media_type === 'movie') return true;
    if (item.media_type === 'tv') return false;
    // Senão, usar heurística: filmes têm 'title' e séries têm 'name'
    return item.title !== undefined && item.name === undefined;
  });
  
  const series = allContent.filter(item => {
    if (item.media_type === 'tv') return true;
    if (item.media_type === 'movie') return false;
    return item.name !== undefined && item.title === undefined;
  });

  // Filtrar por categoria ativa (Filmes ou Séries) e por plataforma (se selecionada)
  let filteredContent = activeCategory === 'Filmes' ? movies : 
                         activeCategory === 'Séries' ? series : 
                         allContent;
  
  // Se uma plataforma foi selecionada, filtrar por ela
  // Nota: Este filtro é simulado, pois os dados do TMDB não incluem provider_id por padrão
  // Em produção, você precisaria fazer uma chamada à API do TMDB para obter essa informação
  if (selectedProvider > 0) {
    console.log(`🎯 Filtrando conteúdo pela plataforma: ${selectedProviderName} (Provider ID: ${selectedProvider})`);
    // Aqui você implementaria a lógica real de filtro quando tiver os dados de providers
    // Por enquanto, vamos mostrar todo o conteúdo com uma mensagem de log
  }

  // Mapear genre_ids para nomes de categorias (IDs do TMDB)
  const genreMap: Record<number, string> = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Document��rio',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'Cinema TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste',
    // Gêneros de TV
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };

  // Agrupar conteúdo por gênero
  const contentByGenre: Record<string, Movie[]> = {};
  
  filteredContent.forEach(item => {
    if (item.genre_ids && item.genre_ids.length > 0) {
      item.genre_ids.forEach(genreId => {
        const genreName = genreMap[genreId] || 'Outros';
        if (!contentByGenre[genreName]) {
          contentByGenre[genreName] = [];
        }
        if (!contentByGenre[genreName].find(m => m.id === item.id)) {
          contentByGenre[genreName].push(item);
        }
      });
    } else {
      if (!contentByGenre['Outros']) {
        contentByGenre['Outros'] = [];
      }
      if (!contentByGenre['Outros'].find(m => m.id === item.id)) {
        contentByGenre['Outros'].push(item);
      }
    }
  });

  // Ordenar categorias por quantidade de itens
  // Na página Início: top 10 categorias
  // Na página Filmes/Séries: TODAS as categorias
  const sortedGenres = Object.entries(contentByGenre)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, activeCategory === 'Início' ? 10 : undefined); // Sem limite para Filmes/Séries

  // Navigation Handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('profileSelection');
  };

  const handleSignup = () => {
    setCurrentScreen('signup');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleContinueToPlans = () => {
    setCurrentScreen('choosePlan');
  };

  const handleContinueToProfile = () => {
    setCurrentScreen('profileSelection');
  };

  const handleSelectProfile = () => {
    setCurrentScreen('home');
  };

  // Handle category changes from header
  const handleCategoryChange = (category: string) => {
    switch (category) {
      case 'home':
        setActiveCategory('Início');
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        break;
      case 'redflix-originals':
        setShowRedFlixOriginalsPage(true);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowMyListPage(false);
        setShowContinueWatchingPage(false);
        setShowHistoryPage(false);
        setShowFavoritosPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'Filmes':
        setShowMoviesPage(true);
        setShowSeriesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setBottomNavTab('home');
        break;
      case 'Séries':
        setShowSeriesPage(true);
        setShowMoviesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setBottomNavTab('home');
        break;
      case 'canais':
        setShowChannels(true);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        break;
      case 'futebol':
        setShowSoccerPage(true);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        break;
      case 'kids':
        setShowKidsPage(true);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('games');
        break;
      case 'languages':
        setShowLanguagePage(true);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'user-dashboard':
        setShowUserDashboard(true);
        setBottomNavTab('profile');
        break;
      case 'my-profile':
        setShowMyProfile(true);
        setBottomNavTab('profile');
        break;
      case 'account-settings':
        setShowAccountSettings(true);
        setBottomNavTab('profile');
        break;
      case 'account':
        setShowAccountPage(true);
        setBottomNavTab('profile');
        break;
      case 'trending':
        setActiveCategory('Início');
        setBottomNavTab('trending');
        break;
      case 'bombando':
        setShowBombandoPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setBottomNavTab('home');
        break;
      case 'iptv':
        setShowIPTVPage(true);
        setShowBombandoPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setBottomNavTab('home');
        break;
      case 'my-list':
        setShowMyListPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'continue-watching':
        setShowContinueWatchingPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'favorites':
        setShowFavoritosPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'history':
        setShowHistoryPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      default:
        setActiveCategory(category);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowMyListPage(false);
        setShowContinueWatchingPage(false);
        setShowHistoryPage(false);
        setShowFavoritosPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        // Atualizar bottom nav baseado na categoria
        if (category === 'Início' || category === 'home') {
          setBottomNavTab('home');
        }
    }
  };

  // Screen Routing
  if (currentScreen === 'login') {
    return <Login onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (currentScreen === 'signup') {
    return <Signup onBack={handleBackToLogin} onContinue={handleContinueToPlans} />;
  }

  if (currentScreen === 'choosePlan') {
    return <ChoosePlan onBack={() => setCurrentScreen('signup')} onContinue={handleContinueToProfile} />;
  }

  if (currentScreen === 'profileSelection') {
    return (
      <ProfileSelection 
        onSelectProfile={handleSelectProfile}
        onSelectKidsProfile={() => {
          handleSelectProfile();
          setShowKidsPage(true);
          setBottomNavTab('games');
        }}
        onManageProfiles={() => setCurrentScreen('profileManagement')}
      />
    );
  }

  if (currentScreen === 'profileManagement') {
    return (
      <ProfileManagement 
        onBack={() => setCurrentScreen('profileSelection')}
        onSave={(profiles) => {
          console.log('Perfis salvos:', profiles);
          // Aqui você pode salvar os perfis no localStorage ou backend
        }}
      />
    );
  }

  // Show My Profile
  if (showMyProfile) {
    return (
      <MyProfile 
        onClose={() => setShowMyProfile(false)} 
        currentUser={currentUser}
        onManageProfiles={() => {
          setShowMyProfile(false);
          setCurrentScreen('profileManagement');
        }}
      />
    );
  }

  // Show user dashboard
  if (showUserDashboard) {
    return (
      <>
        <NetflixHeader
          activeCategory="user-dashboard"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <UserDashboard 
          onBack={() => setShowUserDashboard(false)}
          onProfileClick={() => {
            setShowUserDashboard(false);
            setShowMyProfile(true);
          }}
          onAccountClick={() => {
            setShowUserDashboard(false);
            setShowAccountPage(true);
          }}
        />
      </>
    );
  }

  // Show admin dashboard
  if (showAdminDashboard) {
    return (
      <>
        <NetflixHeader
          activeCategory="admin"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      </>
    );
  }

  // Show account settings
  if (showAccountSettings) {
    return (
      <>
        <NetflixHeader
          activeCategory="account-settings"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <AccountSettings onClose={() => setShowAccountSettings(false)} />
      </>
    );
  }

  // Show My Profile page
  if (showMyProfile) {
    return (
      <>
        <NetflixHeader
          activeCategory="my-profile"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <MyProfile 
          onClose={() => setShowMyProfile(false)}
          currentUser={currentUser}
        />
      </>
    );
  }

  // Show Account Page
  if (showAccountPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="account"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <AccountPage 
          onClose={() => setShowAccountPage(false)}
          currentUser={currentUser}
          onLogout={() => {
            setShowAccountPage(false);
            setCurrentScreen('login');
            setIsAuthenticated(false);
          }}
        />
      </>
    );
  }

  // Show Search Results page
  if (showSearchResults && searchQuery.trim()) {
    return (
      <>
        <SearchResultsPage
          searchQuery={searchQuery}
          allContent={allContent}
          onClose={() => {
            setShowSearchResults(false);
            setSearchQuery('');
          }}
          onMovieClick={handleMovieClick}
          onSearchClick={() => {
            setShowSearchResults(false);
            setShowSearchOverlay(true);
          }}
        />
      </>
    );
  }

  // Show channels page if channels is selected
  if (showChannels) {
    return (
      <>
        <NetflixHeader
          activeCategory="canais"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <ChannelsPage onClose={() => setShowChannels(false)} />
      </>
    );
  }

  // Show kids page if kids is selected
  if (showKidsPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="kids"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <KidsPage onClose={() => setShowKidsPage(false)} />
      </>
    );
  }

  // Show soccer page if soccer is selected
  if (showSoccerPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="futebol"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <SoccerPage onClose={() => setShowSoccerPage(false)} />
      </>
    );
  }

  // Show language browse page if selected
  if (showLanguagePage) {
    return (
      <>
        <NetflixHeader 
          activeCategory="languages"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <LanguageBrowsePage 
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show My List page
  if (showMyListPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="my-list"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <MyListPage 
          onClose={() => setShowMyListPage(false)}
          onMovieClick={handleMovieClick}
          myList={myList}
          onRemoveFromList={(movieId) => {
            setMyList(myList.filter(id => id !== movieId));
            localStorage.setItem('redflix_mylist', JSON.stringify(myList.filter(id => id !== movieId)));
          }}
        />
      </>
    );
  }

  // Show Continue Watching page
  if (showContinueWatchingPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="continue-watching"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <ContinueWatchingPage 
          onClose={() => setShowContinueWatchingPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show History page
  if (showHistoryPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="history"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <HistoryPage 
          onClose={() => setShowHistoryPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show Favoritos page
  if (showFavoritosPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="favorites"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <FavoritosPage 
          onClose={() => setShowFavoritosPage(false)}
          onMovieClick={handleMovieClick}
          likedList={likedList}
          onRemoveLike={(movieId) => {
            setLikedList(likedList.filter(id => id !== movieId));
            localStorage.setItem('redflix_likedlist', JSON.stringify(likedList.filter(id => id !== movieId)));
          }}
        />
      </>
    );
  }

  // Show RedFlix Originals page
  if (showRedFlixOriginalsPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="redflix-originals"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <RedFlixOriginalsPage 
          onClose={() => setShowRedFlixOriginalsPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show Movies page
  if (showMoviesPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="Filmes"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <MoviesPage 
          onClose={() => setShowMoviesPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show Series page
  if (showSeriesPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="Séries"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <SeriesPage 
          onClose={() => setShowSeriesPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show Bombando page
  if (showBombandoPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="bombando"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <BombandoPage />
      </>
    );
  }

  // Show IPTV page
  if (showIPTVPage) {
    return (
      <>
        <IPTVPage 
          onClose={() => setShowIPTVPage(false)}
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
        />
      </>
    );
  }

  // Show person details if a person is selected
  if (selectedPerson) {
    return (
      <PersonDetails 
        personId={selectedPerson.id} 
        personName={selectedPerson.name}
        onClose={() => setSelectedPerson(null)}
        onContentClick={(id, mediaType) => {
          setSelectedPerson(null);
          // Criar um objeto Movie básico para abrir o MovieDetails
          handleMovieClick({
            id,
            title: mediaType === 'movie' ? '' : undefined,
            name: mediaType === 'tv' ? '' : undefined,
            poster_path: '',
            backdrop_path: '',
            overview: '',
            vote_average: 0,
            media_type: mediaType,
            first_air_date: mediaType === 'tv' ? '' : undefined,
            release_date: mediaType === 'movie' ? '' : undefined
          });
        }}
      />
    );
  }

  // Show movie details if a movie is selected
  if (selectedMovie) {
    return (
      <MovieDetails 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)}
        onActorClick={(actorId, actorName) => {
          console.log('🎬 App: Recebeu clique no ator:', actorName, 'ID:', actorId);
          handleMovieClick(null);
          setSelectedPerson({ id: actorId, name: actorName });
        }}
      />
    );
  }

  return (
    <div className="bg-[#141414] relative w-full min-h-screen overflow-x-hidden" data-name="Movie Dashboard">
      {/* Performance Monitor - Ativar com: localStorage.setItem('redflix-show-performance', 'true') */}
      <PerformanceMonitor />
      
      {/* Error Banner */}
      {error && (
        <div className="fixed top-20 right-8 bg-red-600 text-white p-4 z-50 transition-all duration-300 rounded-lg shadow-2xl max-w-md">
          <p className="font-['Inter:Medium',sans-serif]">Erro: {error}</p>
          <p className="text-sm mt-2">Verifique o console para mais detalhes e certifique-se de que sua chave da API TMDB está configurada corretamente.</p>
        </div>
      )}
      
      {/* Netflix Header */}
      <NetflixHeader
        activeCategory={activeCategory === 'Início' ? 'home' : activeCategory === 'Séries' ? 'Séries' : activeCategory === 'Filmes' ? 'Filmes' : activeCategory}
        onCategoryChange={handleCategoryChange}
        onSearchClick={() => setShowSearchOverlay(true)}
        onProfileClick={() => setCurrentScreen('login')}
        currentUser={currentUser}
      />
      
      {/* Show Channels Page in fullscreen mode */}
      {activeCategory === 'Canais' ? (
        <ChannelsPage />
      ) : (
        <>
          {/* Hero Slider */}
          <HeroSlider 
            onMovieClick={setSelectedMovie} 
            sidebarCollapsed={false}
            onAddToList={handleAddToList}
            onLike={handleLike}
            onWatchLater={handleWatchLater}
            myList={myList}
            likedList={likedList}
            watchLaterList={watchLaterList}
          />
          
          {/* TOP 10 Section - EMBAIXO DO BANNER PRINCIPAL */}
          {activeCategory === 'Início' && !loading && (
            <div 
              className="absolute z-10 left-0 right-0"
              style={{ 
                top: 'calc(100vh + 75px)'
              }}
            >
              <div className="bg-gradient-to-b from-black via-black to-transparent pb-12">
                {/* TOP 10 Brasil */}
                {top10BrasilSeries.length > 0 && (
                  <Top10Section
                    title="Brasil: top 10 em séries hoje"
                    movies={top10BrasilSeries}
                    onMovieClick={setSelectedMovie}
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Featured Banners - Logo abaixo do TOP 10 */}
          <div 
            className="absolute z-10 left-0 right-0" 
            style={{ 
              top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
                ? 'calc(100vh + 625px)' 
                : '100vh'
            }}
          >
            <FeaturedBanners />
            <StreamingLogos 
              onPlatformSelect={(providerId, platformName) => {
                setSelectedProvider(providerId);
                setSelectedProviderName(platformName);
                if (providerId === 0) {
                  console.log('🔄 Filtro de plataforma removido - mostrando todo o conteúdo');
                } else {
                  console.log(`✅ Plataforma selecionada: ${platformName} (Provider ID: ${providerId})`);
                }
              }}
            />
          </div>

          {/* Streaming Marquee - Logos animados passando pela tela */}
          <div 
            className="absolute z-10 left-0 right-0"
            style={{ 
              top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
                ? 'calc(100vh + 1175px)' 
                : 'calc(100vh + 550px)'
            }}
          >
            <StreamingMarquee />
          </div>
          
          {/* Content Rows by Category */}
          <div 
            className="absolute pb-24 md:pb-20 px-0 md:px-4 lg:px-12 left-0 right-0" 
            style={{ 
              top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
                ? 'calc(100vh + 1625px)' 
                : 'calc(100vh + 1000px)' 
            }}
          >
            {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
              <p className="text-white text-center mb-4 font-['Inter:Medium',sans-serif]">
                Carregando catálogo...
              </p>
              <div className="w-full bg-[#333333] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-white/50 text-center mt-2 text-sm font-['Inter:Regular',sans-serif]">
                {loadingProgress}%
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] mt-12 w-full">
              {Array.from({ length: 84 }).map((_, i) => (
                <div key={i} className="bg-[#2a2a2a] h-[302px] relative rounded-[10px] w-full animate-pulse" />
              ))}
            </div>
          </div>
        ) : filteredContent.length > 0 ? (
          <div>
            {/* Header com contador */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
                  {activeCategory === 'Filmes' ? 'Filmes' : 
                   activeCategory === 'Séries' ? 'Séries' : 
                   'Catálogo Completo'}
                </h2>
                <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
                  {activeCategory === 'Filmes' ? `${movies.length} filmes disponíveis` : 
                   activeCategory === 'Séries' ? `${series.length} séries disponíveis` : 
                   `${allContent.length} títulos no catálogo`}
                </p>
              </div>
              
              {/* Platform Filter Badge */}
              {selectedProvider > 0 && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-[#E50914] to-[#B20710] px-4 py-2 rounded-full shadow-lg">
                  <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[13px]">
                    🎬 {selectedProviderName}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProvider(0);
                      setSelectedProviderName('');
                    }}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all duration-200"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Se estiver em "Início", mostrar as categorias principais com limite */}
            {activeCategory === 'Início' && sortedGenres.length > 0 ? (
              <div className="space-y-4 md:space-y-8">
                {/* Destaques do dia - CARROSSEL HORIZONTAL */}
                {allContent && allContent.length >= 18 && (
                  <HorizontalCarousel 
                    title="Destaques do Dia"
                    content={allContent.slice(0, 18)}
                    onMovieClick={setSelectedMovie}
                    maxItems={18}
                    onAddToList={handleAddToList}
                    onLike={handleLike}
                    onWatchLater={handleWatchLater}
                    myList={myList}
                    likedList={likedList}
                    watchLaterList={watchLaterList}
                  />
                )}
                
                {/* Em Alta Agora - CARROSSEL HORIZONTAL */}
                {allContent && allContent.length >= 36 && (
                  <HorizontalCarousel 
                    title="Em Alta Agora"
                    content={allContent.slice(18, 36)}
                    onMovieClick={setSelectedMovie}
                    maxItems={18}
                    onAddToList={handleAddToList}
                    onLike={handleLike}
                    onWatchLater={handleWatchLater}
                    myList={myList}
                    likedList={likedList}
                    watchLaterList={watchLaterList}
                  />
                )}
                
                {/* Adicionados Recentemente - CARROSSEL HORIZONTAL */}
                {allContent && allContent.length >= 54 && (
                  <HorizontalCarousel 
                    title="Adicionados Recentemente"
                    content={allContent.slice(36, 54)}
                    onMovieClick={setSelectedMovie}
                    maxItems={18}
                    onAddToList={handleAddToList}
                    onLike={handleLike}
                    onWatchLater={handleWatchLater}
                    myList={myList}
                    likedList={likedList}
                    watchLaterList={watchLaterList}
                  />
                )}
                
                {/* Mais Assistidos - CARROSSEL HORIZONTAL */}
                {allContent && allContent.length >= 72 && (
                  <HorizontalCarousel 
                    title="Mais Assistidos"
                    content={allContent.slice(54, 72)}
                    onMovieClick={setSelectedMovie}
                    maxItems={18}
                    onAddToList={handleAddToList}
                    onLike={handleLike}
                    onWatchLater={handleWatchLater}
                    myList={myList}
                    likedList={likedList}
                    watchLaterList={watchLaterList}
                  />
                )}
                
                {/* Fileiras por gênero - CARROSSEL HORIZONTAL por categoria */}
                {sortedGenres.map(([genre, content]) => (
                  <HorizontalCarousel 
                    key={genre}
                    title={genre}
                    content={content}
                    onMovieClick={setSelectedMovie}
                    maxItems={15}
                    onAddToList={handleAddToList}
                    onLike={handleLike}
                    onWatchLater={handleWatchLater}
                    myList={myList}
                    likedList={likedList}
                    watchLaterList={watchLaterList}
                  />
                ))}
              </div>
            ) : (
              /* Visualização COMPLETA para Filmes ou Séries - SEM LIMITE */
              <div>
                {sortedGenres.length > 0 ? (
                  <div className="space-y-12">
                    {/* Mostrar TODO o conteúdo por categoria com scroll infinito */}
                    {sortedGenres.map(([genre, content]) => (
                      <InfiniteContentRow 
                        key={genre}
                        title={`${genre}`}
                        content={content}
                        onMovieClick={setSelectedMovie}
                        initialLoadCount={18}
                        loadMoreCount={18}
                        onAddToList={handleAddToList}
                        onLike={handleLike}
                        myList={myList}
                        likedList={likedList}
                      />
                    ))}
                  </div>
                ) : (
                  /* Fallback: grid completa de todo o conteúdo com lazy loading */
                  <div>
                    <InfiniteContentRow 
                      title={activeCategory === 'Filmes' ? 'Todos os Filmes' : 'Todas as Séries'}
                      content={filteredContent}
                      onMovieClick={setSelectedMovie}
                      initialLoadCount={24}
                      loadMoreCount={24}
                      onAddToList={handleAddToList}
                      onLike={handleLike}
                      myList={myList}
                      likedList={likedList}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-white/70 text-center text-lg font-['Inter:Medium',sans-serif]">
              Nenhum conteúdo encontrado
            </p>
            <p className="text-white/50 text-center text-sm mt-2 font-['Inter:Regular',sans-serif]">
              {activeCategory === 'Filmes' ? 'Não há filmes disponíveis' :
               activeCategory === 'Séries' ? 'Não há séries disponíveis' :
               'Verifique se o arquivo filmes.txt está disponível no repositório'}
            </p>
          </div>
        )}
      </div>
        </>
      )}
      

      
      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        onSearch={handleSearch}
        initialValue={searchQuery}
      />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {/* Bottom Navigation Bar - Mobile Only */}
      {isAuthenticated && currentScreen === 'home' && !showAdminDashboard && (
        <BottomNavBar 
          activeTab={bottomNavTab}
          onTabChange={(tab) => {
            setBottomNavTab(tab);
            if (tab === 'home') {
              setActiveCategory('Início');
              setShowKidsPage(false);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            } else if (tab === 'games') {
              setShowKidsPage(true);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            } else if (tab === 'trending') {
              setActiveCategory('trending');
              setShowKidsPage(false);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            } else if (tab === 'profile') {
              setShowMyProfile(true);
              setShowKidsPage(false);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            }
          }}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster position="bottom-center" theme="dark" richColors />
      
      {/* Image Preload Monitor - Debug only */}
      <ImagePreloadMonitor />
    </div>
  );
}
