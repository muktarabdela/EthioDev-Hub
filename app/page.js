import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/ProjectCard';

const dummyProjects = [

  {
    id: 1,
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
    id: 2,
    name: "Trupeer Faces",
    description: "Studio-quality screen recording with avatars, completely AI",
    tags: ["Chrome Extensions", "AI", "Video"],
    comments: 13,
    upvotes: 295,
    iconImage: "https://placehold.co/32x32",
    contributors: 5
  },
  {
    id: 3,
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
  const { data: { session } } = await supabase.auth.getSession();
  console.log("session", session);
  try {
    // Redirect to login if not authenticated
    // if (!session) {
    //   redirect('/login');
    // }
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
                <Button size="lg" className="bg-primary text-white hover:bg-primary-dark">
                  Post Your Project
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-light">
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
            <div className="flex flex-col lg:flex-row gap-6">

              <div className="w-full lg:w-[70%]">
                <div className="flex flex-col gap-6 md:gap-8">
                  {dummyProjects.map((project, index) => (
                    <ProjectCard
                      key={project.name}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[30%] space-y-6 md:space-y-8">
                {/* Featured Developers Section */}
                <div className="bg-white p-4 md:p-6 rounded-xl border">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Featured Developers</h3>
                  <div className="space-y-3 md:space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full"></div>
                        <div>
                          <p className="text-sm md:text-base font-medium">Developer Name</p>
                          <p className="text-xs md:text-sm text-gray-500">3 projects</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
