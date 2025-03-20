
import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { Logo } from '@/assets/logo';

const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2 lg:gap-4">
          <Logo size="md" variant="default" className="mr-4" />
          
          <div className="hidden md:flex relative max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search projects, tasks..."
                className="w-[300px] lg:w-[400px] h-9 rounded-md border bg-background px-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500"></span>
          </button>
          
          <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
              <User className="h-5 w-5 text-brand-700" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
