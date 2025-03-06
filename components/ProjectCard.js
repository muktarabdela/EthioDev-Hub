import Link from 'next/link';
import { ThumbsUp, MessageSquare, Github, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function ProjectCard({ project }) {
    const {
        id,
        title,
        description,
        github_url,
        live_url,
        upvotes_count,
        comments_count,
        developer,
    } = project;

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-1">
                        <Link href={`/projects/${id}`} className="hover:underline">
                            {title}
                        </Link>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        {github_url && (
                            <Link href={github_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon">
                                    <Github className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {live_url && (
                            <Link href={live_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon">
                                    <Globe className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
                <Link href={`/developers/${developer.id}`} className="text-sm text-muted-foreground hover:underline">
                    by {developer.name}
                </Link>
            </CardHeader>
            <CardContent>
                <CardDescription className="line-clamp-3">
                    {description}
                </CardDescription>
            </CardContent>
            <CardFooter className="mt-auto">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {upvotes_count}
                    </div>
                    <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {comments_count}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export { ProjectCard };

