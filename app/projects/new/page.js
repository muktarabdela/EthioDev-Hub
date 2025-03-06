import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

async function checkAccess() {
    const supabase = createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'developer') {
        redirect('/');
    }

    return true;
}

export default async function NewProjectPage() {
    await checkAccess();

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Submit a New Project</h1>
                    <p className="text-muted-foreground">
                        Share your project with the Ethiopian developer community.
                    </p>
                </div>

                <form action="/api/projects" method="POST">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    placeholder="Enter your project title"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Project Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={6}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    placeholder="Describe your project, its features, and the problem it solves..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Project Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label
                                    htmlFor="github_url"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    GitHub Repository URL
                                </label>
                                <input
                                    type="url"
                                    id="github_url"
                                    name="github_url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://github.com/username/project"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="live_url"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Live Demo URL
                                </label>
                                <input
                                    type="url"
                                    id="live_url"
                                    name="live_url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://your-project.com"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" asChild>
                            <a href="/profile">Cancel</a>
                        </Button>
                        <Button type="submit">Submit Project</Button>
                    </div>
                </form>
            </div>
        </main>
    );
}

