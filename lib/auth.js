import { createServerSupabaseClient } from './supabase';
import { cookies } from 'next/headers';

export async function createClient() {
    return createServerSupabaseClient();
}

export async function getSession() {
    const supabase = await createClient();
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getUserProfile() {
    const session = await getSession();
    if (!session) return null;

    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    return profile;
}

export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return session;
}

export async function requireRole(allowedRoles) {
    const session = await requireAuth();
    const profile = await getUserProfile();

    if (!profile || !allowedRoles.includes(profile.role)) {
        throw new Error('Unauthorized');
    }

    return { session, profile };
}
