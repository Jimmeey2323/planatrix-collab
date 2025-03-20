
import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Home, 
  LayoutDashboard, 
  LayoutGrid, 
  MessageSquare, 
  Settings, 
  Users 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <aside 
      className={`h-screen sticky top-0 border-r border-border bg-background flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-6 px-4 flex-1 flex flex-col">
        <div className="flex flex-col space-y-6">
          <NavItem 
            icon={<Home className="h-5 w-5" />}
            label="Home"
            to="/"
            collapsed={collapsed}
          />
          <NavItem 
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            to="/dashboard"
            collapsed={collapsed}
          />
          <NavItem 
            icon={<LayoutGrid className="h-5 w-5" />}
            label="Projects"
            to="/projects"
            collapsed={collapsed}
            active
          />
          <NavItem 
            icon={<Calendar className="h-5 w-5" />}
            label="Calendar"
            to="/calendar"
            collapsed={collapsed}
          />
          <NavItem 
            icon={<Clock className="h-5 w-5" />}
            label="Timeline"
            to="/timeline"
            collapsed={collapsed}
          />
          <NavItem 
            icon={<MessageSquare className="h-5 w-5" />}
            label="Messages"
            to="/messages"
            collapsed={collapsed}
          />
          <NavItem 
            icon={<Users className="h-5 w-5" />}
            label="Team"
            to="/team"
            collapsed={collapsed}
          />
        </div>
        
        <div className="mt-auto">
          <NavItem 
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            to="/settings"
            collapsed={collapsed}
          />
        </div>
      </div>
      
      <button 
        onClick={toggleSidebar} 
        className="h-10 w-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center absolute -right-5 top-20 shadow-md z-10"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-brand-700" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-brand-700" />
        )}
      </button>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  to, 
  collapsed,
  active = false
}) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center p-2 rounded-md transition-colors ${
        active 
          ? 'bg-brand-100 text-brand-700' 
          : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      {!collapsed && (
        <span className={`ml-3 font-medium text-sm ${active ? 'text-brand-700' : ''}`}>
          {label}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;
