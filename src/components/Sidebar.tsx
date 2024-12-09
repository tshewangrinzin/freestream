import { Home, TrendingUp, Clock, ThumbsUp, Film } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export default function Sidebar({ isCollapsed, isMobile, onClose }: SidebarProps) {
  const menuItems = [
    { icon: <Home className={`${!isMobile && isCollapsed ? 'w-8 h-8' : 'w-6 h-6'}`} />, label: 'Home' },
    { icon: <TrendingUp className={`${!isMobile && isCollapsed ? 'w-8 h-8' : 'w-6 h-6'}`} />, label: 'Trending' },
    { icon: <Film className={`${!isMobile && isCollapsed ? 'w-8 h-8' : 'w-6 h-6'}`} />, label: 'New Releases' },
    { icon: <ThumbsUp className={`${!isMobile && isCollapsed ? 'w-8 h-8' : 'w-6 h-6'}`} />, label: 'Top Rated' },
    { icon: <Clock className={`${!isMobile && isCollapsed ? 'w-8 h-8' : 'w-6 h-6'}`} />, label: 'Watch Later' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-2 transition-all duration-300 ease-in-out transform z-50 ${
        isMobile 
          ? `w-64 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`
          : `${isCollapsed ? 'w-20' : 'w-64'} translate-x-0`
      }`}
    >
      <nav className={`space-y-${!isMobile && isCollapsed ? '0.5' : '2'}`}>
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-4 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out ${
              !isMobile && isCollapsed ? 'justify-center' : ''
            }`}
            title={!isMobile && isCollapsed ? item.label : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (isMobile) onClose();
            }}
          >
            {item.icon}
            <span className={`transition-all duration-300 ease-in-out text-base ${
              !isMobile && isCollapsed 
                ? 'opacity-0 w-0 overflow-hidden'
                : 'opacity-100 w-auto'
            }`}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}