import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoodyxpvpipyotfsxfsh.supabase.co';
const supabaseKey = 'sb_publishable_28ZXE3ArK3TFnzCDFyxAew_0e2mat4p';

export const supabase = createClient(supabaseUrl, supabaseKey);
