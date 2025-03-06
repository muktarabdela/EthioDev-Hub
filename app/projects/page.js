import { createClient } from '@/lib/auth';
import { ProjectCard } from '@/components/ProjectCard';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

async function getProjects(searchParams) {
  const supabase = createClient();

  let query = supabase
    .from('projects')
    .select(`
      *,
      developer:profiles(id, name, role)
    `);

  // Apply sorting
  const sort = searchParams?.sort || 'latest';
  switch (sort) {
    case 'popular':
      query = query.order('upvotes_count', { ascending: false });
      break;
    case 'discussed':
      query = query.order('comments_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: projects } = await query;
  return projects || [];
}

export default async function ProjectsPage({ searchParams }) {
  const projects = await getProjects(searchParams);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Projects</h1>
          <p className="text-muted-foreground">
            Discover amazing projects from Ethiopian developers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={searchParams?.sort === 'latest' ? 'default' : 'outline'}
                    asChild
                  >
                    <a href="/projects?sort=latest">Latest</a>
                  </Button>
                  <Button
                    variant={searchParams?.sort === 'popular' ? 'default' : 'outline'}
                    asChild
                  >
                    <a href="/projects?sort=popular">Popular</a>
                  </Button>
                  <Button
                    variant={searchParams?.sort === 'discussed' ? 'default' : 'outline'}
                    asChild
                  >
                    <a href="/projects?sort=discussed">Most Discussed</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No projects found. Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
