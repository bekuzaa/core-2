import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Radio,
  Settings,
  BarChart3,
  Users,
  FolderOpen,
  FileText,
  Book,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Server,
  Activity,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUIStore, useAuthStore, useSystemStore } from '../store';
import toast from 'react-hot-toast';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { sidebarOpen, sidebarCollapsed, theme, toggleSidebar, toggleSidebarCollapsed, toggleTheme } = useUIStore();
  const { logout } = useAuthStore();
  const { systemInfo } = useSystemStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Processes', href: '/processes', icon: Radio },
    { name: 'Wizard', href: '/wizard', icon: Sparkles },
    { name: 'Metrics', href: '/metrics', icon: BarChart3 },
    { name: 'Sessions', href: '/sessions', icon: Users },
    { name: 'Files', href: '/files', icon: FolderOpen },
    { name: 'Logs', href: '/logs', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Docs', href: '/docs', icon: Book },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark-800 border-b border-dark-700 z-50 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/dashboard" className="ml-3 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-white font-semibold">datarhei Core</span>
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? '80px' : '280px' }}
        className="hidden lg:block fixed left-0 top-0 h-full bg-dark-800 border-r border-dark-700 z-40"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-dark-700">
            {!sidebarCollapsed && (
              <Link to="/dashboard" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-white font-bold text-lg">datarhei</span>
              </Link>
            )}
            {sidebarCollapsed && (
              <Link to="/dashboard" className="flex justify-center w-full">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                  <Server className="w-6 h-6 text-white" />
                </div>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`sidebar-link group ${active ? 'active' : ''}`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-400' : 'text-dark-400 group-hover:text-white'}`} />
                    {!sidebarCollapsed && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-dark-700">
            {/* System Status */}
            {!sidebarCollapsed && systemInfo && (
              <div className="px-4 py-3 border-b border-dark-700">
                <div className="flex items-center text-xs">
                  <Activity className="w-4 h-4 text-success-500 mr-2" />
                  <span className="text-dark-400">System Online</span>
                </div>
                <div className="mt-2 text-xs text-dark-500">
                  {systemInfo.name || 'datarhei Core'} v{systemInfo.version?.number || '16'}
                </div>
              </div>
            )}

            {/* Collapse Toggle */}
            <button
              onClick={toggleSidebarCollapsed}
              className="w-full h-12 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-dark-800 border-r border-dark-700 z-50"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-dark-700">
                  <Link to="/dashboard" className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <span className="ml-3 text-white font-bold text-lg">datarhei Core</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
                  <div className="space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`sidebar-link group ${active ? 'active' : ''}`}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-400' : 'text-dark-400 group-hover:text-white'}`} />
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-dark-700 p-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`lg:ml-${sidebarCollapsed ? '20' : '280'} transition-all duration-300 pt-16 lg:pt-0`}>
        {/* Header */}
        <header className="hidden lg:block h-16 bg-dark-800 border-b border-dark-700 px-6">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">
                {navigation.find(item => isActive(item.href))?.name || 'datarhei Core'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
