
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/hooks/use-tasks';
import { CheckCircle2, Circle, Clock, AlertTriangle, Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, projectId }) => {
  const { toast } = useToast();
  const { useUpdateTask } = useTasks();
  const updateTaskMutation = useUpdateTask();
  
  const [columns, setColumns] = useState({
    'todo': {
      title: 'To Do',
      icon: <Circle className="h-4 w-4 text-slate-500" />,
      tasks: tasks.filter(task => task.status === 'todo'),
    },
    'in-progress': {
      title: 'In Progress',
      icon: <Clock className="h-4 w-4 text-brand-500" />,
      tasks: tasks.filter(task => task.status === 'in-progress'),
    },
    'review': {
      title: 'Review',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      tasks: tasks.filter(task => task.status === 'review'),
    },
    'done': {
      title: 'Done',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      tasks: tasks.filter(task => task.status === 'done'),
    },
  });

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination, or if the task is dropped back in its original position
    if (!destination || 
      (destination.droppableId === source.droppableId && 
       destination.index === source.index)) {
      return;
    }
    
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;
    
    // Get the new status from the destination column
    const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'review' | 'done';
    
    // If status hasn't changed, just reorder the tasks within the column
    if (newStatus === task.status) {
      // This would require a more complex state management for task ordering
      // For simplicity, we'll just return since the visual order has already changed via react-beautiful-dnd
      return;
    }
    
    // Update task status in the database
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus,
    });
    
    // Update the local state
    const updatedColumns = { ...columns };
    
    // Remove the task from the source column
    updatedColumns[source.droppableId].tasks = 
      updatedColumns[source.droppableId].tasks.filter(t => t.id !== draggableId);
    
    // Add the task to the destination column
    updatedColumns[destination.droppableId].tasks.splice(
      destination.index,
      0,
      { ...task, status: newStatus }
    );
    
    setColumns(updatedColumns);
  };

  return (
    <div className="overflow-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-[1000px]">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="w-64 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {column.icon}
                  <h3 className="text-sm font-medium ml-2">{column.title}</h3>
                  <span className="ml-2 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                
                <button className="text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-card/50 rounded-lg p-2 min-h-[500px]"
                  >
                    {column.tasks.map((task, index) => (
                      <KanbanCard key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

interface KanbanCardProps {
  task: Task;
  index: number;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, index }) => {
  // Priority colors
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-card border border-border p-3 rounded-md mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <h4 className="font-medium mb-1 line-clamp-2">{task.title}</h4>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
            {task.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            
            {task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <div key={assignee.id} className="h-6 w-6 rounded-full bg-muted overflow-hidden border border-background">
                    {assignee.avatar ? (
                      <img src={assignee.avatar} alt={assignee.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-xs">
                        {assignee.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center text-xs text-muted-foreground">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {task.dueDate && (
            <div className="text-xs text-muted-foreground mt-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
