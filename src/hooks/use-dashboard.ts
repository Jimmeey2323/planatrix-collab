
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Dashboard, Activity, Project, Task, User, ProjectMetrics, TeamMetrics } from '@/lib/types';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

export const useDashboard = () => {
  // Fetch dashboard data
  const fetchDashboard = async (): Promise<Dashboard> => {
    // Fetch recent projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(3);

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      throw projectsError;
    }

    // Fetch upcoming tasks (due in the next 7 days)
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const todayStr = format(today, 'yyyy-MM-dd');
    const nextWeekStr = format(nextWeek, 'yyyy-MM-dd');

    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .gte('due_date', todayStr)
      .lte('due_date', nextWeekStr)
      .neq('status', 'done')
      .order('due_date', { ascending: true })
      .limit(5);

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }

    // Fetch team activity
    const { data: activityData, error: activityError } = await supabase
      .from('activities')
      .select(`
        id,
        user_id,
        action,
        target_type,
        target_id,
        target_title,
        timestamp
      `)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (activityError) {
      console.error("Error fetching activity:", activityError);
      throw activityError;
    }

    // Get user details for activities
    const userIds = [...new Set(activityData.map(activity => activity.user_id))];
    let users: Record<string, User> = {};

    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      if (usersError) {
        console.error("Error fetching users:", usersError);
      } else {
        users = usersData.reduce((acc, user) => {
          acc[user.id] = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          };
          return acc;
        }, {} as Record<string, User>);
      }
    }

    // Transform activity data
    const activities: Activity[] = activityData.map(activity => ({
      id: activity.id,
      user: users[activity.user_id] || {
        id: activity.user_id,
        name: 'Unknown User',
        email: '',
        avatar: '',
        role: 'viewer',
      },
      action: activity.action,
      target: {
        type: activity.target_type,
        id: activity.target_id,
        title: activity.target_title,
      },
      timestamp: activity.timestamp,
    }));

    // Fetch overdue tasks
    const { data: overdueData, error: overdueError } = await supabase
      .from('tasks')
      .select('*')
      .lt('due_date', todayStr)
      .neq('status', 'done')
      .order('due_date', { ascending: false })
      .limit(5);

    if (overdueError) {
      console.error("Error fetching overdue tasks:", overdueError);
      throw overdueError;
    }

    // Calculate project metrics
    const { data: allProjects, error: allProjectsError } = await supabase
      .from('projects')
      .select('status, progress');

    if (allProjectsError) {
      console.error("Error fetching project metrics:", allProjectsError);
      throw allProjectsError;
    }

    const projectMetrics: ProjectMetrics = {
      totalProjects: allProjects.length,
      completedProjects: allProjects.filter(p => p.status === 'completed').length,
      activeProjects: allProjects.filter(p => p.status === 'active').length,
      onHoldProjects: allProjects.filter(p => p.status === 'on-hold').length,
      upcomingDeadlines: 0, // Will be calculated
      overdueTasks: overdueData.length,
      averageTaskCompletion: allProjects.reduce((sum, p) => sum + p.progress, 0) / (allProjects.length || 1),
    };

    // Calculate team metrics
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, name, email, avatar, role, workload');

    if (allUsersError) {
      console.error("Error fetching team metrics:", allUsersError);
      throw allUsersError;
    }

    const teamMetrics: TeamMetrics = {
      totalMembers: allUsers.length,
      averageWorkload: allUsers.reduce((sum, u) => sum + (u.workload || 0), 0) / (allUsers.length || 1),
      topContributors: allUsers.sort((a, b) => (b.workload || 0) - (a.workload || 0)).slice(0, 3).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        role: u.role,
      })),
      resourceUtilization: 0, // Placeholder, would need more data to calculate
    };

    // Transform and return the dashboard data
    return {
      recentProjects: projectsData as Project[],
      upcomingTasks: tasksData as Task[],
      teamActivity: activities,
      overdueTasks: overdueData as Task[],
      projectMetrics,
      teamMetrics,
    };
  };

  // React Query hook
  const useGetDashboard = () => {
    return useQuery({
      queryKey: ['dashboard'],
      queryFn: fetchDashboard,
    });
  };

  return {
    useGetDashboard,
  };
};
