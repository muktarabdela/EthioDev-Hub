import { supabase, getSession as getSupabaseSession, getUserProfile as getSupabaseUserProfile } from './supabase';

export async function createClient() {
    return supabase;
}

export async function getSession() {
    return getSupabaseSession();
}

export async function getUserProfile() {
    return getSupabaseUserProfile();
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
