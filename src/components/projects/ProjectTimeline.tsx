import React, { useState } from 'react';
import { Project, Task } from '@/lib/types';
import { format, parseISO, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ProjectTimelineProps {
  project: Project;
  tasks: Task[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project, tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  const getTimelineDates = () => {
    if (view === 'month') {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    } else {
      return {
        start: currentDate,
        end: addDays(currentDate, 6),
      };
    }
  };
  
  const { start, end } = getTimelineDates();
  const days = eachDayOfInterval({ start, end });
  
  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(addDays(currentDate, -7));
    }
  };
  
  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };
  
  const timelineTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const taskDate = parseISO(task.dueDate);
    return taskDate >= start && taskDate <= end;
  });
  
  const projectStart = project.startDate ? parseISO(project.startDate) : start;
  const projectEnd = project.dueDate ? parseISO(project.dueDate) : end;
  
  return (
    <div className="border border-border rounded-lg bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-base font-medium">
            {view === 'month' 
              ? format(currentDate, 'MMMM yyyy')
              : `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
            }
          </h3>
          
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>
      
      <ScrollArea className="w-full overflow-auto pb-12">
        <div className="min-w-[800px]">
          <div className="flex border-b border-border sticky top-0 bg-card z-10">
            <div className="w-48 p-3 border-r border-border flex-shrink-0">
              <span className="text-sm font-medium">Task</span>
            </div>
            
            <div className="flex flex-1">
              {days.map((day) => (
                <div 
                  key={day.toString()} 
                  className={`flex-1 p-2 text-center border-r border-border ${
                    day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                  <div className="text-sm">{format(day, 'd')}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex border-b border-border">
            <div className="w-48 p-3 border-r border-border flex-shrink-0">
              <span className="text-sm font-medium">Project Timeline</span>
            </div>
            
            <div className="flex flex-1 relative">
              {projectStart <= end && projectEnd >= start && (
                <div 
                  className="absolute h-8 bg-brand-200 border border-brand-500 rounded-md flex items-center justify-center"
                  style={{
                    left: `${Math.max(0, (differenceInDays(projectStart, start) / days.length) * 100)}%`,
                    width: `${Math.min(100, (differenceInDays(projectEnd, projectStart) + 1) / days.length * 100)}%`,
                    top: '8px',
                  }}
                >
                  <span className="text-xs font-medium text-brand-800 truncate px-2">
                    {project.title}
                  </span>
                </div>
              )}
              
              {days.map((day) => (
                <div 
                  key={day.toString()} 
                  className={`flex-1 h-16 border-r border-border ${
                    day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/50' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          
          {timelineTasks.map((task) => {
            const taskDate = task.dueDate ? parseISO(task.dueDate) : null;
            if (!taskDate) return null;
            
            const dayIndex = days.findIndex(d => 
              d.getDate() === taskDate.getDate() && 
              d.getMonth() === taskDate.getMonth() && 
              d.getFullYear() === taskDate.getFullYear()
            );
            
            if (dayIndex === -1) return null;
            
            const statusColors = {
              'todo': 'bg-slate-100 border-slate-400 text-slate-800',
              'in-progress': 'bg-blue-100 border-blue-400 text-blue-800',
              'review': 'bg-amber-100 border-amber-400 text-amber-800',
              'done': 'bg-green-100 border-green-400 text-green-800',
            };
            
            return (
              <div key={task.id} className="flex border-b border-border">
                <div className="w-48 p-3 border-r border-border flex-shrink-0">
                  <span className="text-sm">{task.title}</span>
                </div>
                
                <div className="flex flex-1 relative">
                  <div 
                    className={`absolute h-8 ${statusColors[task.status]} border rounded-md flex items-center justify-center px-2`}
                    style={{
                      left: `${(dayIndex / days.length) * 100}%`,
                      width: `${(1 / days.length) * 100}%`,
                      top: '8px',
                    }}
                  >
                    <span className="text-xs font-medium truncate">
                      {task.title}
                    </span>
                  </div>
                  
                  {days.map((day) => (
                    <div 
                      key={day.toString()} 
                      className={`flex-1 h-16 border-r border-border ${
                        day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/50' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {timelineTasks.length === 0 && (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tasks scheduled</h3>
              <p className="text-muted-foreground mt-1">
                No tasks are scheduled for this time period.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
