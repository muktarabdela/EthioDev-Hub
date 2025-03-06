import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Github, Globe, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';

async function getProject(id) {
    const supabase = createClient();

    const { data: project } = await supabase
        .from('projects')
        .select(`
      *,
      developer:profiles(
        id,
        name,
        role,
        bio,
        github_url,
        linkedin_url,
        contact_visible
      ),
      comments(
        id,
        content,
        created_at,
        user:profiles(id, name, role)
      )
    `)
        .eq('id', id)
        .single();

    if (!project) {
        notFound();
    }

    return project;
}

export default async function ProjectPage({ params }) {
    const project = await getProject(params.id);
    const { developer, comments } = project;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Project Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                        <Link
                            href={`/developers/${developer.id}`}
                            className="hover:text-primary"
                        >
                            by {developer.name}
                        </Link>
                        <span>•</span>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(project.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Project Actions */}
                <div className="flex items-center space-x-4 mb-8">
                    <Button className="flex items-center space-x-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{project.upvotes_count} Upvotes</span>
                    </Button>
                    {project.github_url && (
                        <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="flex items-center space-x-2">
                                <Github className="h-4 w-4" />
                                <span>View on GitHub</span>
                            </Button>
                        </Link>
                    )}
                    {project.live_url && (
                        <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Live Demo</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Project Description */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>About the Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{project.description}</p>
                    </CardContent>
                </Card>

                {/* Developer Info */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>About the Developer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start space-x-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{developer.name}</h3>
                                {developer.bio && (
                                    <p className="text-muted-foreground mb-4">{developer.bio}</p>
                                )}
                                <div className="flex space-x-4">
                                    {developer.github_url && (
                                        <Link
                                            href={developer.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            <Github className="h-5 w-5" />
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
                                                className="h-5 w-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Comments</CardTitle>
                            <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                <span>{project.comments_count}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <Link
                                                    href={`/developers/${comment.user.id}`}
                                                    className="font-medium hover:text-primary"
                                                >
                                                    {comment.user.name}
                                                </Link>
                                                <span className="text-muted-foreground text-sm">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

