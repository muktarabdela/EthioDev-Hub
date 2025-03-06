import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ProjectCard } from '@/components/ProjectCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Github, Globe } from 'lucide-react';

async function getDeveloper(id) {
  const supabase = createClient();

  const { data: developer } = await supabase
    .from('profiles')
    .select(`
      *,
      projects(
        *,
        developer:profiles(id, name, role)
      )
    `)
    .eq('id', id)
    .eq('role', 'developer')
    .single();

  if (!developer) {
    notFound();
  }

  return developer;
}

export default async function DeveloperPage({ params }) {
  const developer = await getDeveloper(params.id);
  const { projects } = developer;

  // Calculate total upvotes and comments
  const totalUpvotes = projects.reduce((sum, project) => sum + project.upvotes_count, 0);
  const totalComments = projects.reduce((sum, project) => sum + project.comments_count, 0);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Developer Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{developer.name}</h1>
          {developer.bio && (
            <p className="text-xl text-muted-foreground mb-6">
              {developer.bio}
            </p>
          )}
          <div className="flex items-center space-x-4">
            {developer.github_url && (
              <Link
                href={developer.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-6 w-6" />
              </Link>
            )}
            {developer.linkedin_url && (
              <Link
                href={developer.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Developer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{projects.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{totalUpvotes}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Total Upvotes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{totalComments}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Total Comments</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Projects</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No projects yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

