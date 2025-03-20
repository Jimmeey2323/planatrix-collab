
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Transform Supabase data to our User type
const transformUser = (user: any): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    skills: user.skills,
    department: user.department,
    title: user.title,
    availability: user.availability,
    workload: user.workload,
  };
};

export const useUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const fetchUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }

    return data.map(transformUser);
  };

  // Fetch a single user by ID
  const fetchUserById = async (id: string): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return transformUser(data);
  };

  // Update a user profile
  const updateUser = async (user: Partial<User> & { id: string }): Promise<User> => {
    const updateData = {
      ...(user.name && { name: user.name }),
      ...(user.email && { email: user.email }),
      ...(user.avatar !== undefined && { avatar: user.avatar }),
      ...(user.role && { role: user.role }),
      ...(user.skills !== undefined && { skills: user.skills }),
      ...(user.department !== undefined && { department: user.department }),
      ...(user.title !== undefined && { title: user.title }),
      ...(user.availability !== undefined && { availability: user.availability }),
      ...(user.workload !== undefined && { workload: user.workload }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return transformUser(data);
  };

  // React Query hooks
  const useGetUsers = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    });
  };

  const useGetUser = (id: string) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: () => fetchUserById(id),
      enabled: !!id,
    });
  };

  const useUpdateUser = () => {
    return useMutation({
      mutationFn: updateUser,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['users', data.id] });
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useGetUsers,
    useGetUser,
    useUpdateUser,
  };
};
