import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrqnipcezegavktcbnes.supabase.co';
const supabaseAnonKey = 'sb_publishable_W2OvpPeqiUaSeN2Fb9TBQA_YKtglZiL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);