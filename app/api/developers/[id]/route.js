import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';

// GET /api/developers/[id] - Get a developer's profile
export async function GET(request, { params }) {
    const supabase = createClient();

    try {
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
            .eq('id', params.id)
            .eq('role', 'developer')
            .single();

        if (error) throw error;
        if (!profile) {
            return NextResponse.json(
                { error: 'Developer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch developer profile' },
            { status: 500 }
        );
    }
} 