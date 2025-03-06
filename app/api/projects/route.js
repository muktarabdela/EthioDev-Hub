import { NextResponse } from 'next/server';
import { createClient, requireAuth, requireRole } from '@/lib/supabase';

// GET /api/projects - Get all projects
export async function GET() {
  const supabase = createClient();

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        developer:profiles(name, role)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request) {
  try {
    const { title, description, github_url, live_url } = await request.json();
    await requireRole(['developer']);

    const supabase = createClient();
    const session = await requireAuth();

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        github_url,
        live_url,
        developer_id: session.user.id,
      })
      .select(`
        *,
        developer:profiles(name, role)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}
