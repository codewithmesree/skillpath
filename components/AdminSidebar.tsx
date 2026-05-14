import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  activeItem?: string;
}

export const AdminSidebar = ({ activeItem }: AdminSidebarProps) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

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
              
              {/* Subtle background decoration for non-active items */}
              {!isActive && (
                <div className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto pt-6 border-t-2 border-deep-indigo/10">
        <button className="w-full flex items-center justify-center gap-3 p-4 bg-white border-3 border-deep-indigo text-error font-heading font-bold uppercase hover:bg-error hover:text-white hover:shadow-brutal transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-[10px] font-bold text-deep-indigo uppercase opacity-30 tracking-[0.2em]">SkillPath v1.0.4</p>
        </div>
      </div>
    </aside>
  );
};
