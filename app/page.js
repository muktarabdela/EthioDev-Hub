import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Fetch projects (you'll need to implement this in your database)
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Today's Top Projects</h1>
        <Link href="/projects/new" className="btn-primary">
          Submit Project
        </Link>
      </div>

      <div className="space-y-4">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="card p-6 text-center">
            <p className="text-muted">No projects yet. Be the first to submit one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
