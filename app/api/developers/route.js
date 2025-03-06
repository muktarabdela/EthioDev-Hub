import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';

// GET /api/developers - Get all developers
export async function GET() {
  const supabase = createClient();
  
  try {
    const { data: developers, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        role,
        bio,
        github_url,
        linkedin_url,
        contact_visible,
        projects(count)
      `)
      .eq('role', 'developer')
      .order('name');

    if (error) throw error;

    return NextResponse.json(developers);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
} 