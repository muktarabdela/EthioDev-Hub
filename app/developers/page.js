import Link from 'next/link';
import { createClient } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Github, Globe } from 'lucide-react';

async function getDevelopers() {
    const supabase = createClient();

    const { data: developers } = await supabase
        .from('profiles')
        .select(`
      id,
      name,
      role,
      bio,
      github_url,
      linkedin_url,
      contact_visible,
      projects(
        id,
        title,
        upvotes_count,
        comments_count
      )
    `)
        .eq('role', 'developer')
        .order('name');

    return developers || [];
}

export default async function DevelopersPage() {
    const developers = await getDevelopers();

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Ethiopian Developers</h1>
                    <p className="text-muted-foreground">
                        Connect with talented developers from Ethiopia
                    </p>
                </div>

                {/* Developers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {developers.map((developer) => {
                        const totalUpvotes = developer.projects.reduce(
                            (sum, project) => sum + project.upvotes_count,
                            0
                        );
                        const totalComments = developer.projects.reduce(
                            (sum, project) => sum + project.comments_count,
                            0
                        );

                        return (
                            <Card key={developer.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <Link
                                            href={`/developers/${developer.id}`}
                                            className="hover:text-primary"
                                        >
                                            {developer.name}
                                        </Link>
                                        <div className="flex items-center space-x-2">
                                            {developer.github_url && (
                                                <Link
                                                    href={developer.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-primary"
                                                >
                                                    <Github className="h-4 w-4" />
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
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </div>
                                    </CardTitle>
                                    {developer.bio && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {developer.bio}
                                        </p>
                                    )}
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                        <div>
                                            <p className="font-semibold">{developer.projects.length}</p>
                                            <p className="text-muted-foreground">Projects</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{totalUpvotes}</p>
                                            <p className="text-muted-foreground">Upvotes</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{totalComments}</p>
                                            <p className="text-muted-foreground">Comments</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
