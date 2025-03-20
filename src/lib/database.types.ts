
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string
          role: 'admin' | 'editor' | 'viewer'
          skills: string[] | null
          department: string | null
          title: string | null
          availability: number | null
          workload: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar?: string
          role?: 'admin' | 'editor' | 'viewer'
          skills?: string[] | null
          department?: string | null
          title?: string | null
          availability?: number | null
          workload?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string
          role?: 'admin' | 'editor' | 'viewer'
          skills?: string[] | null
          department?: string | null
          title?: string | null
          availability?: number | null
          workload?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          due_date: string | null
          start_date: string
          progress: number
          created_at: string
          updated_at: string
          portfolio_id: string | null
          is_template: boolean | null
          custom_fields: Json | null
          categories: string[] | null
          status: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          due_date?: string | null
          start_date: string
          progress?: number
          created_at?: string
          updated_at?: string
          portfolio_id?: string | null
          is_template?: boolean | null
          custom_fields?: Json | null
          categories?: string[] | null
          status?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          due_date?: string | null
          start_date?: string
          progress?: number
          created_at?: string
          updated_at?: string
          portfolio_id?: string | null
          is_template?: boolean | null
          custom_fields?: Json | null
          categories?: string[] | null
          status?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'todo' | 'in-progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          progress: number
          created_at: string
          updated_at: string
          parent_id: string | null
          project_id: string
          estimated_hours: number | null
          logged_hours: number | null
          recurrence: Json | null
          custom_fields: Json | null
          dependencies: string[] | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'todo' | 'in-progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
          parent_id?: string | null
          project_id: string
          estimated_hours?: number | null
          logged_hours?: number | null
          recurrence?: Json | null
          custom_fields?: Json | null
          dependencies?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'todo' | 'in-progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
          parent_id?: string | null
          project_id?: string
          estimated_hours?: number | null
          logged_hours?: number | null
          recurrence?: Json | null
          custom_fields?: Json | null
          dependencies?: string[] | null
        }
      }
      task_assignees: {
        Row: {
          task_id: string
          user_id: string
          assigned_at: string
        }
        Insert: {
          task_id: string
          user_id: string
          assigned_at?: string
        }
        Update: {
          task_id?: string
          user_id?: string
          assigned_at?: string
        }
      }
      project_members: {
        Row: {
          project_id: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
          joined_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          role?: 'admin' | 'editor' | 'viewer'
          joined_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          joined_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          user_id: string
          task_id: string | null
          project_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          task_id?: string | null
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          task_id?: string | null
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          name: string
          url: string
          type: string
          size: number
          uploaded_at: string
          uploaded_by: string
          task_id: string | null
          project_id: string | null
          comment_id: string | null
        }
        Insert: {
          id?: string
          name: string
          url: string
          type: string
          size: number
          uploaded_at?: string
          uploaded_by: string
          task_id?: string | null
          project_id?: string | null
          comment_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          url?: string
          type?: string
          size?: number
          uploaded_at?: string
          uploaded_by?: string
          task_id?: string | null
          project_id?: string | null
          comment_id?: string | null
        }
      }
      checklists: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          assignee_id: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          assignee_id?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
          assignee_id?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          action: string
          target_type: 'project' | 'task' | 'comment' | 'portfolio'
          target_id: string
          target_title: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          target_type: 'project' | 'task' | 'comment' | 'portfolio'
          target_id: string
          target_title: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          target_type?: 'project' | 'task' | 'comment' | 'portfolio'
          target_id?: string
          target_title?: string
          timestamp?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          title: string
          description: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      task_tags: {
        Row: {
          task_id: string
          tag: string
        }
        Insert: {
          task_id: string
          tag: string
        }
        Update: {
          task_id?: string
          tag?: string
        }
      }
      views: {
        Row: {
          id: string
          name: string
          type: 'kanban' | 'list' | 'timeline' | 'calendar' | 'dashboard'
          filters: Json | null
          sort_by: string | null
          group_by: string | null
          user_id: string
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'kanban' | 'list' | 'timeline' | 'calendar' | 'dashboard'
          filters?: Json | null
          sort_by?: string | null
          group_by?: string | null
          user_id: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'kanban' | 'list' | 'timeline' | 'calendar' | 'dashboard'
          filters?: Json | null
          sort_by?: string | null
          group_by?: string | null
          user_id?: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      google_integrations: {
        Row: {
          user_id: string
          calendar: boolean
          sheets: boolean
          gmail: boolean
          connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          calendar?: boolean
          sheets?: boolean
          gmail?: boolean
          connected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          calendar?: boolean
          sheets?: boolean
          gmail?: boolean
          connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
