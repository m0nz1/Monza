import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  title: string;
  about: string;
  photo_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  email: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number; // 1–100
  category: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  type: 'app' | 'website';
  tech_stack: string[];
  image_url: string;
  live_url: string;
  github_url: string;
  sort_order: number;
};
