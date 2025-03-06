import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/ProjectCard';

async function getProfile() {
    const supabase = createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select(`
      *,
      projects(
        *,
        developer:profiles(id, name, role)
      )
    `)
        .eq('id', session.user.id)
        .single();

    return profile;
}

export default async function ProfilePage() {
    const profile = await getProfile();
    const { projects } = profile;

    // Calculate total upvotes and comments
    const totalUpvotes = projects?.reduce((sum, project) => sum + project.upvotes_count, 0) || 0;
    const totalComments = projects?.reduce((sum, project) => sum + project.comments_count, 0) || 0;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">My Profile</h1>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xl text-muted-foreground">
                                {profile.name}
                            </p>
                            <p className="text-muted-foreground capitalize">
                                {profile.role}
                            </p>
                        </div>
                        <Button asChild>
                            <a href="/profile/edit">Edit Profile</a>
                        </Button>
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">{projects?.length || 0}</CardTitle>
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

                {/* Profile Info */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Bio</dt>
                                <dd className="mt-1">
                                    {profile.bio || 'No bio added yet.'}
                                </dd>
                            </div>
                            {profile.role === 'developer' && (
                                <>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">GitHub</dt>
                                        <dd className="mt-1">
                                            {profile.github_url ? (
                                                <a
                                                    href={profile.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {profile.github_url}
                                                </a>
                                            ) : (
                                                'Not added'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">LinkedIn</dt>
                                        <dd className="mt-1">
                                            {profile.linkedin_url ? (
                                                <a
                                                    href={profile.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {profile.linkedin_url}
                                                </a>
                                            ) : (
                                                'Not added'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Contact Visibility</dt>
                                        <dd className="mt-1">
                                            {profile.contact_visible ? 'Public' : 'Private'}
                                        </dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </CardContent>
                </Card>

                {/* Projects Section */}
                {profile.role === 'developer' && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Projects</h2>
                            <Button asChild>
                                <a href="/projects/new">Add New Project</a>
                            </Button>
                        </div>
                        {projects?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">
                                        You haven't added any projects yet.
                                    </p>
                                    <Button asChild>
                                        <a href="/projects/new">Add Your First Project</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
} 