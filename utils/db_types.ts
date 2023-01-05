export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      channels: {
        Row: {
          id: number;
          inserted_at: string;
          slug: string;
          created_by: string;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          slug: string;
          created_by: string;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          slug?: string;
          created_by?: string;
        };
      };
      messages: {
        Row: {
          id: number;
          inserted_at: string;
          message: string | null;
          user_id: string;
          channel_id: number | null;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          message?: string | null;
          user_id?: string;
          channel_id?: number | null;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          message?: string | null;
          user_id?: string;
          channel_id?: number | null;
        };
      };
      notes: {
        Row: {
          id: number;
          title: string | null;
          description: string | null;
          tag: string | null;
          created_at: string | null;
          user_uid: string;
        };
        Insert: {
          id?: number;
          title?: string | null;
          description?: string | null;
          tag?: string | null;
          created_at?: string | null;
          user_uid: string;
        };
        Update: {
          id?: number;
          title?: string | null;
          description?: string | null;
          tag?: string | null;
          created_at?: string | null;
          user_uid?: string;
        };
      };
      todos: {
        Row: {
          id: number;
          user_id: string;
          task: string | null;
          is_completed: boolean | null;
          inserted_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          task?: string | null;
          is_completed?: boolean | null;
          inserted_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          task?: string | null;
          is_completed?: boolean | null;
          inserted_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string | null;
          status: Database["public"]["Enums"]["user_status"] | null;
          name: string | null;
          photoURL: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          status?: Database["public"]["Enums"]["user_status"] | null;
          name?: string | null;
          photoURL?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          status?: Database["public"]["Enums"]["user_status"] | null;
          name?: string | null;
          photoURL?: string | null;
          created_at?: string;
        };
      };
      "users-old": {
        Row: {
          id: number;
          name: string | null;
          photoURL: string | null;
          email: string | null;
          uid: string | null;
          created_at: string | null;
          status: Database["public"]["Enums"]["user_status"] | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
          photoURL?: string | null;
          email?: string | null;
          uid?: string | null;
          created_at?: string | null;
          status?: Database["public"]["Enums"]["user_status"] | null;
        };
        Update: {
          id?: number;
          name?: string | null;
          photoURL?: string | null;
          email?: string | null;
          uid?: string | null;
          created_at?: string | null;
          status?: Database["public"]["Enums"]["user_status"] | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_status: "ONLINE" | "OFFLINE";
    };
  };
}
