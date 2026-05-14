import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
}

export const Sidebar = ({ activeItem }: SidebarProps) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Courses', icon: BookOpen, path: '/dashboard/courses' },
    { name: 'Statistics', icon: BarChart3, path: '/dashboard/stats' },
    { name: 'Assignments', icon: FileText, path: '/dashboard/assignments' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/me') // Just checking if we have a logout API
    // Actually I'll use the same logic as Navbar
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <aside className="w-[300px] bg-bg-offwhite border-r-4 border-deep-indigo min-h-screen p-8 hidden lg:flex flex-col gap-10 sticky top-[72px] h-[calc(100vh-72px)] z-20">
      {/* Navigation Links */}
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const isActive = activeItem === item.name;
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`group flex items-center justify-between p-4 border-3 transition-all duration-200 font-heading font-bold uppercase tracking-wide relative overflow-hidden ${
                isActive 
                ? 'bg-primary text-white border-deep-indigo shadow-brutal translate-x-1 translate-y-1' 
                : 'bg-white text-deep-indigo border-deep-indigo hover:bg-secondary hover:translate-x-1 hover:translate-y-1'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <Icon size={22} className={isActive ? 'text-white' : 'text-primary'} />
                <span className="text-sm">{item.name}</span>
              </div>
              <ChevronRight 
                size={18} 
                className={`transition-transform duration-200 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} 
              />
              
              {!isActive && (
                <div className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="bg-warning p-6 border-3 border-deep-indigo shadow-brutal -rotate-1 group hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-deep-indigo" />
          <span className="font-heading font-black uppercase text-xs">Unlock Pro</span>
        </div>
        <p className="font-body text-[11px] font-bold leading-tight mb-4 text-deep-indigo/80">Get unlimited access to premium courses & certificates.</p>
        <button className="w-full bg-white border-2 border-deep-indigo py-2 font-heading font-black text-[10px] uppercase hover:bg-deep-indigo hover:text-white transition-colors">Upgrade Now</button>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 p-4 bg-white border-3 border-deep-indigo text-error font-heading font-bold uppercase hover:bg-error hover:text-white hover:shadow-brutal transition-all group mt-4"
      >
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Logout</span>
      </button>
    </aside>
  );
};

