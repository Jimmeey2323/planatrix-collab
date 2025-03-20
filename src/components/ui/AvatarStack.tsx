
import React from 'react';
import { User as UserIcon, Plus } from 'lucide-react';
import { User } from '@/lib/types';

interface AvatarStackProps {
  users: User[];
  limit?: number;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarStack: React.FC<AvatarStackProps> = ({ 
  users, 
  limit = 3,
  size = 'md' 
}) => {
  // Size mappings
  const sizeMap = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };
  
  const avatarSize = sizeMap[size];
  const borderSize = size === 'sm' ? 'border' : 'border-2';
  
  const visibleUsers = users.slice(0, limit);
  const remainingCount = users.length - limit;
  
  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user, index) => (
        <div
          key={user.id}
          className={`${avatarSize} rounded-full ${borderSize} border-background bg-muted flex items-center justify-center text-foreground overflow-hidden relative z-[${10 - index}]`}
          title={user.name}
        >
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon className="h-3/5 w-3/5" />
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div 
          className={`${avatarSize} rounded-full ${borderSize} border-background bg-muted flex items-center justify-center text-foreground font-medium`}
          title={`${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
      
      <div 
        className={`${avatarSize} rounded-full ${borderSize} border-background bg-brand-50 flex items-center justify-center text-brand-600 cursor-pointer hover:bg-brand-100 transition-colors`}
        title="Add team member"
      >
        <Plus className="h-3/5 w-3/5" />
      </div>
    </div>
  );
};

export default AvatarStack;
