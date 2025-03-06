import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProjectCard } from '@/components/ProjectCard';
import Link from 'next/link';
import { NavBarDemo } from '@/components/Navbar';
import { Hero } from '@/components/ui/animated-hero';
import { Button } from '@/components/ui/Button';
import { Terminal, Rocket } from 'lucide-react';

const dummyProjects = [

  {
    name: "NYX",
    description: "Your AI-powered performance marketing co-pilot.",
    tags: ["Marketing", "Advertising", "AI"],
    comments: 27,
    upvotes: 376,
    iconBg: "bg-indigo-600",
    iconText: "NYX",
    contributors: 2
  },
  {
    name: "Trupeer Faces",
    description: "Studio-quality screen recording with avatars, completely AI",
    tags: ["Chrome Extensions", "AI", "Video"],
    comments: 13,
    upvotes: 295,
    iconImage: "https://placehold.co/32x32",
    contributors: 5
  },
  {
    name: "Perplexity Deep Research",
    description: "Save hours of time in-depth research and analysis",
    tags: ["AI", "Bots", "Search"],
    comments: 9,
    upvotes: 291,
    iconBg: "bg-black",
    iconSymbol: "data_object",
    contributors: 1
  }
];

async function getProjects() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      developer:profiles(id, name, role)
    `)
    .order('upvotes_count', { ascending: false })
    .limit(6);

  return projects || [];
}

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  // if (!session) {
  //   redirect('/login');
  // }

  // Fetch projects (you'll need to implement this in your database)
  const projects = await getProjects();

  return (
    <div className={`${!session ? "mt-10" : "mt-0"} min-h-screen max-w-6xl mx-auto bg-gradient-to-b bg-background`}>
      <NavBarDemo />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!session && (
          <div>
            <Hero />
          </div>
        )}

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
