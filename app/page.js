import { supabase, getSession } from '@/lib/supabase';
import { ProjectCard } from '@/components/ProjectCard';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';

async function getProjects() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        developer:profiles!projects_developer_id_fkey(id, name, role)
      `)
      .order('upvotes_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return projects || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export default async function Home() {
  let session = null;

  try {
    session = await getSession();
  } catch (error) {
    console.error('Error fetching session:', error);
  }

  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-20 text-center bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Showcase Your Projects.{' '}
              <span className="text-primary">Get Hired!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Ethiopia's premier platform for developers to showcase their work,
              connect with peers, and get discovered by potential employers.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/projects/new">
                <Button size="lg">
                  Post Your Project
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Projects Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Trending Projects
                </h2>
                <p className="text-muted-foreground">
                  Discover the most popular projects from Ethiopian developers
                </p>
              </div>
              <Link href="/projects">
                <Button variant="outline">
                  View All Projects
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {projects.length}+
                </h3>
                <p className="text-muted-foreground">
                  Projects Showcased
                </p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-primary mb-2">
                  100+
                </h3>
                <p className="text-muted-foreground">
                  Active Developers
                </p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-primary mb-2">
                  50+
                </h3>
                <p className="text-muted-foreground">
                  Companies Hiring
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Showcase Your Work?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of talented developers and get your work in front of
              potential employers.
            </p>
            <Link href="/register">
              <Button size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
