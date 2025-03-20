
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Task, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Transform Supabase data to our Task type
const transformTask = (task: any, assignees: User[] = []): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    assignees: assignees,
    tags: task.tags || [],
    progress: task.progress,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    parentId: task.parent_id,
    dependencies: task.dependencies,
    estimatedHours: task.estimated_hours,
    loggedHours: task.logged_hours,
    recurrence: task.recurrence,
    customFields: task.custom_fields,
  };
};

export const useTasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks for a project
  const fetchTasksByProject = async (projectId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      throw error;
    }

    // Fetch assignees for each task
    const tasksWithAssignees = await Promise.all(
      data.map(async (task) => {
        // Get task assignees
        const { data: assigneeLinks, error: assigneeError } = await supabase
          .from('task_assignees')
          .select('user_id')
          .eq('task_id', task.id);

        if (assigneeError) {
          console.error("Error fetching assignees:", assigneeError);
          return { ...task, assignees: [] };
        }

        if (assigneeLinks.length === 0) {
          return { ...task, assignees: [] };
        }

        // Get user details for assignees
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .in('id', assigneeLinks.map(link => link.user_id));

        if (usersError) {
          console.error("Error fetching users:", usersError);
          return { ...task, assignees: [] };
        }

        // Get task tags
        const { data: tags, error: tagsError } = await supabase
          .from('task_tags')
          .select('tag')
          .eq('task_id', task.id);

        if (tagsError) {
          console.error("Error fetching tags:", tagsError);
          task.tags = [];
        } else {
          task.tags = tags.map(t => t.tag);
        }

        return { ...task, assignees: users };
      })
    );

    return tasksWithAssignees.map(task => transformTask(task, task.assignees));
  };

  // Fetch a single task by ID
  const fetchTaskById = async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Get task assignees
    const { data: assigneeLinks, error: assigneeError } = await supabase
      .from('task_assignees')
      .select('user_id')
      .eq('task_id', id);

    if (assigneeError) {
      console.error("Error fetching assignees:", assigneeError);
      data.assignees = [];
    } else if (assigneeLinks.length === 0) {
      data.assignees = [];
    } else {
      // Get user details for assignees
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', assigneeLinks.map(link => link.user_id));

      if (usersError) {
        console.error("Error fetching users:", usersError);
        data.assignees = [];
      } else {
        data.assignees = users;
      }
    }

    // Get task tags
    const { data: tags, error: tagsError } = await supabase
      .from('task_tags')
      .select('tag')
      .eq('task_id', id);

    if (tagsError) {
      console.error("Error fetching tags:", tagsError);
      data.tags = [];
    } else {
      data.tags = tags.map(t => t.tag);
    }

    // Get task subtasks
    const { data: subtasks, error: subtasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('parent_id', id);

    if (subtasksError) {
      console.error("Error fetching subtasks:", subtasksError);
      data.subtasks = [];
    } else {
      data.subtasks = subtasks.map(st => transformTask(st, []));
    }

    return transformTask(data, data.assignees);
  };

  // Create a new task
  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { projectId: string }): Promise<Task> => {
    const now = new Date().toISOString();
    
    const newTask = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      progress: task.progress || 0,
      created_at: now,
      updated_at: now,
      parent_id: task.parentId,
      project_id: task.projectId,
      estimated_hours: task.estimatedHours,
      logged_hours: task.loggedHours,
      recurrence: task.recurrence,
      custom_fields: task.customFields,
      dependencies: task.dependencies,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add assignees
    if (task.assignees && task.assignees.length > 0) {
      const taskAssignees = task.assignees.map(user => ({
        task_id: data.id,
        user_id: user.id,
        assigned_at: now
      }));

      const { error: assigneeError } = await supabase
        .from('task_assignees')
        .insert(taskAssignees);

      if (assigneeError) {
        console.error("Error adding assignees:", assigneeError);
      }
    }

    // Add tags
    if (task.tags && task.tags.length > 0) {
      const taskTags = task.tags.map(tag => ({
        task_id: data.id,
        tag
      }));

      const { error: tagError } = await supabase
        .from('task_tags')
        .insert(taskTags);

      if (tagError) {
        console.error("Error adding tags:", tagError);
      }
    }

    return {
      ...transformTask(data),
      assignees: task.assignees || [],
      tags: task.tags || []
    };
  };

  // Update an existing task
  const updateTask = async (task: Partial<Task> & { id: string }): Promise<Task> => {
    const updateData = {
      ...(task.title && { title: task.title }),
      ...(task.description && { description: task.description }),
      ...(task.status && { status: task.status }),
      ...(task.priority && { priority: task.priority }),
      ...(task.dueDate !== undefined && { due_date: task.dueDate }),
      ...(task.progress !== undefined && { progress: task.progress }),
      updated_at: new Date().toISOString(),
      ...(task.parentId !== undefined && { parent_id: task.parentId }),
      ...(task.estimatedHours !== undefined && { estimated_hours: task.estimatedHours }),
      ...(task.loggedHours !== undefined && { logged_hours: task.loggedHours }),
      ...(task.recurrence && { recurrence: task.recurrence }),
      ...(task.customFields && { custom_fields: task.customFields }),
      ...(task.dependencies && { dependencies: task.dependencies }),
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', task.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update assignees if provided
    if (task.assignees) {
      // First remove all existing assignees
      await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', task.id);

      // Then add the new assignees
      if (task.assignees.length > 0) {
        const now = new Date().toISOString();
        const taskAssignees = task.assignees.map(user => ({
          task_id: task.id,
          user_id: user.id,
          assigned_at: now
        }));

        const { error: assigneeError } = await supabase
          .from('task_assignees')
          .insert(taskAssignees);

        if (assigneeError) {
          console.error("Error updating assignees:", assigneeError);
        }
      }
    }

    // Update tags if provided
    if (task.tags) {
      // First remove all existing tags
      await supabase
        .from('task_tags')
        .delete()
        .eq('task_id', task.id);

      // Then add the new tags
      if (task.tags.length > 0) {
        const taskTags = task.tags.map(tag => ({
          task_id: task.id,
          tag
        }));

        const { error: tagError } = await supabase
          .from('task_tags')
          .insert(taskTags);

        if (tagError) {
          console.error("Error updating tags:", tagError);
        }
      }
    }

    return {
      ...transformTask(data),
      assignees: task.assignees || [],
      tags: task.tags || []
    };
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    // First delete related records
    await supabase.from('task_assignees').delete().eq('task_id', id);
    await supabase.from('task_tags').delete().eq('task_id', id);
    await supabase.from('checklists').delete().eq('task_id', id);
    
    // Update subtasks to remove parent reference or delete them
    const { data: subtasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('parent_id', id);
    
    if (subtasks && subtasks.length > 0) {
      await supabase
        .from('tasks')
        .update({ parent_id: null })
        .eq('parent_id', id);
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  };

  // React Query hooks
  const useGetProjectTasks = (projectId: string) => {
    return useQuery({
      queryKey: ['tasks', 'project', projectId],
      queryFn: () => fetchTasksByProject(projectId),
      enabled: !!projectId,
    });
  };

  const useGetTask = (id: string) => {
    return useQuery({
      queryKey: ['tasks', id],
      queryFn: () => fetchTaskById(id),
      enabled: !!id,
    });
  };

  const useCreateTask = () => {
    return useMutation({
      mutationFn: createTask,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['tasks', 'project', variables.projectId] });
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error creating task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useUpdateTask = () => {
    return useMutation({
      mutationFn: updateTask,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['tasks', data.id] });
        // Also invalidate project tasks
        const { data: taskData } = supabase
          .from('tasks')
          .select('project_id')
          .eq('id', data.id)
          .single();
          
        if (taskData) {
          queryClient.invalidateQueries({ queryKey: ['tasks', 'project', taskData.project_id] });
        }
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useDeleteTask = () => {
    return useMutation({
      mutationFn: deleteTask,
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error deleting task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useGetProjectTasks,
    useGetTask,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
  };
};
