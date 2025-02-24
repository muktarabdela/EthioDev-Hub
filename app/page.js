import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { NavBarDemo } from '@/components/Navbar';
import { Hero } from '@/components/ui/animated-hero';
import { Button } from '@/components/ui/button';
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

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  // if (!session) {
  //   redirect('/login');
  // }

  // Fetch projects (you'll need to implement this in your database)
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className={`${!session ? "mt-10" : "mt-0"} min-h-screen max-w-6xl mx-auto bg-gradient-to-b bg-background`}>
      <NavBarDemo />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!session && (
          <div>
            <Hero />
          </div>
        )}

        {/* Featured Projects Section */}
        <section className="py-8 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-200">
                Latest Innovations
              </h2>
              <p className="mt-2 text-base md:text-lg text-muted-foreground text-gray-300">
                Explore cutting-edge projects from our developer community
              </p>

              <p className="mt-10 text-base md:text-lg text-muted-foreground">
                <h3 className="text-2xl font-bold text-gray-100">Today's Top Projects</h3>
              </p>
            </div>
            <Button asChild className="gap-2 group" size="md lg:size-lg">
              <Link href="/projects/new">
                Launch Project
                <Rocket className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
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

            {/* Sidebar Content */}
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

              {/* Trending Tags Section */}
              <div className="bg-white p-4 md:p-6 rounded-xl border">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'Web3', 'Mobile', 'SaaS', 'Open Source'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs md:text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Projects Section */}
        {/* <section className="py-16 border-t border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Today's Top Projects</h3>
            <Link
              href="/projects"
              className="text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
            >
              View All
              <Terminal className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects?.map((project, index) => (
              <div
                key={project.id}
                className="bg-background p-6 rounded-xl border hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                    <div className="h-10 w-10 flex items-center justify-center text-primary">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{project.name}</h4>
                    <p className="text-muted-foreground mt-2 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </main>
    </div>
  );
}
