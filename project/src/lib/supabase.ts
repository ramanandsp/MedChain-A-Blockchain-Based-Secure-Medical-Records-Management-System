import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  wallet_address?: string;
  health_goals?: string;
  created_at: string;
  updated_at: string;
};

export type HealthReport = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  extracted_text?: string;
  ai_analysis?: Record<string, unknown>;
  uploaded_at: string;
  analyzed_at?: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
};

export type HealthRecommendation = {
  id: string;
  user_id: string;
  report_id?: string;
  category: 'diet' | 'exercise' | 'lifestyle' | 'preventive';
  recommendations: Record<string, unknown>;
  created_at: string;
};
