import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

// Helper function to get the current session
export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Helper function to get user profile
export async function getUserProfile() {
    const session = await getSession();
    if (!session) return null;

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) throw error;
        return profile;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

