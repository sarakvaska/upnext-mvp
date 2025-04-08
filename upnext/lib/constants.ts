// Replace these with your actual Supabase project credentials
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const SCREEN_PADDING = 16;
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-m4v',
]; 