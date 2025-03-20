
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Transform Supabase data to our Project type
const transformProject = (project: any): Project => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    team: project.team || [],
    tasks: project.tasks || [],
    dueDate: project.due_date,
    startDate: project.start_date,
    progress: project.progress,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    portfolio: project.portfolio_id,
    template: project.is_template,
    customFields: project.custom_fields,
    categories: project.categories,
    status: project.status,
  };
};

export const useProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all projects
  const fetchProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_members(user_id)
      `);

    if (error) {
      throw error;
    }

    // Fetch team members for each project
    const projectsWithTeam = await Promise.all(
      data.map(async (project) => {
        const { data: teamData, error: teamError } = await supabase
          .from('users')
          .select('*')
          .in('id', project.project_members.map((member: any) => member.user_id));

        if (teamError) {
          console.error("Error fetching team members:", teamError);
          return {
            ...project,
            team: []
          };
        }

        return {
          ...project,
          team: teamData
        };
      })
    );

    return projectsWithTeam.map(transformProject);
  };

  // Fetch a single project by ID
  const fetchProjectById = async (id: string): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_members(user_id)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Fetch team members
    const { data: teamData, error: teamError } = await supabase
      .from('users')
      .select('*')
      .in('id', data.project_members.map((member: any) => member.user_id));

    if (teamError) {
      console.error("Error fetching team members:", teamError);
      data.team = [];
    } else {
      data.team = teamData;
    }

    // Fetch tasks for the project
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', id);

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      data.tasks = [];
    } else {
      data.tasks = tasksData;
    }

    return transformProject(data);
  };

  // Create a new project
  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasks'>): Promise<Project> => {
    const now = new Date().toISOString();
    
    const newProject = {
      title: project.title,
      description: project.description,
      due_date: project.dueDate,
      start_date: project.startDate,
      progress: 0,
      created_at: now,
      updated_at: now,
      portfolio_id: project.portfolio,
      is_template: project.template || false,
      custom_fields: project.customFields,
      categories: project.categories,
      status: project.status || 'planned',
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add team members
    if (project.team && project.team.length > 0) {
      const projectMembers = project.team.map(user => ({
        project_id: data.id,
        user_id: user.id,
        role: user.role,
        joined_at: now
      }));

      const { error: memberError } = await supabase
        .from('project_members')
        .insert(projectMembers);

      if (memberError) {
        console.error("Error adding team members:", memberError);
      }
    }

    return {
      ...transformProject(data),
      team: project.team || [],
      tasks: []
    };
  };

  // Update an existing project
  const updateProject = async (project: Partial<Project> & { id: string }): Promise<Project> => {
    const updateData = {
      ...(project.title && { title: project.title }),
      ...(project.description && { description: project.description }),
      ...(project.dueDate !== undefined && { due_date: project.dueDate }),
      ...(project.startDate && { start_date: project.startDate }),
      ...(project.progress !== undefined && { progress: project.progress }),
      updated_at: new Date().toISOString(),
      ...(project.portfolio !== undefined && { portfolio_id: project.portfolio }),
      ...(project.template !== undefined && { is_template: project.template }),
      ...(project.customFields && { custom_fields: project.customFields }),
      ...(project.categories && { categories: project.categories }),
      ...(project.status && { status: project.status }),
    };

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update team members if provided
    if (project.team) {
      // First remove all existing members
      await supabase
        .from('project_members')
        .delete()
        .eq('project_id', project.id);

      // Then add the new members
      const now = new Date().toISOString();
      const projectMembers = project.team.map(user => ({
        project_id: project.id,
        user_id: user.id,
        role: user.role,
        joined_at: now
      }));

      if (projectMembers.length > 0) {
        const { error: memberError } = await supabase
          .from('project_members')
          .insert(projectMembers);

        if (memberError) {
          console.error("Error updating team members:", memberError);
        }
      }
    }

    return {
      ...transformProject(data),
      team: project.team || [],
      tasks: project.tasks || []
    };
  };

  // Delete a project
  const deleteProject = async (id: string): Promise<void> => {
    // First delete related records
    await supabase.from('project_members').delete().eq('project_id', id);
    await supabase.from('tasks').delete().eq('project_id', id);
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  };

  // React Query hooks
  const useGetProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
    });
  };

  const useGetProject = (id: string) => {
    return useQuery({
      queryKey: ['projects', id],
      queryFn: () => fetchProjectById(id),
      enabled: !!id,
    });
  };

  const useCreateProject = () => {
    return useMutation({
      mutationFn: createProject,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast({
          title: "Project created",
          description: "Your project has been created successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error creating project",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useUpdateProject = () => {
    return useMutation({
      mutationFn: updateProject,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['projects', data.id] });
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error updating project",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useDeleteProject = () => {
    return useMutation({
      mutationFn: deleteProject,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error deleting project",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useGetProjects,
    useGetProject,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
  };
};
