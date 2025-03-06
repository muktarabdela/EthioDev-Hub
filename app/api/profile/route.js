import { NextResponse } from 'next/server';
import { createClient, requireAuth } from '@/lib/supabase';

// GET /api/profile - Get current user's profile
export async function GET() {
    try {
        const session = await requireAuth();
        const supabase = createClient();

        const { data: profile, error } = await supabase
            .from('profiles')
            .select(`
        *,
        projects(
          id,
          title,
          description,
          upvotes_count,
          comments_count,
          created_at
        )
      `)
            .eq('id', session.user.id)
            .single();

        if (error) throw error;

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch profile' },
            { status: error.message === 'Unauthorized' ? 403 : 500 }
        );
    }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request) {
    try {
        const session = await requireAuth();
        const { name, bio, github_url, linkedin_url, contact_visible } = await request.json();

        const supabase = createClient();

        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                name,
                bio,
                github_url,
                linkedin_url,
                contact_visible,
                updated_at: new Date().toISOString(),
            })
            .eq('id', session.user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update profile' },
            { status: error.message === 'Unauthorized' ? 403 : 500 }
        );
    }
} 