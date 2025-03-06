import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
        .select('*')
        .eq('id', session.user.id)
        .single();

    return profile;
}

export default async function EditProfilePage() {
    const profile = await getProfile();

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Edit Profile</h1>
                    <p className="text-muted-foreground">
                        Update your profile information and settings.
                    </p>
                </div>

                <form action="/api/profile" method="PUT">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={profile.name}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={profile.bio}
                                    rows={4}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {profile.role === 'developer' && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Developer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="github_url"
                                        className="block text-sm font-medium text-muted-foreground mb-1"
                                    >
                                        GitHub URL
                                    </label>
                                    <input
                                        type="url"
                                        id="github_url"
                                        name="github_url"
                                        defaultValue={profile.github_url}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="linkedin_url"
                                        className="block text-sm font-medium text-muted-foreground mb-1"
                                    >
                                        LinkedIn URL
                                    </label>
                                    <input
                                        type="url"
                                        id="linkedin_url"
                                        name="linkedin_url"
                                        defaultValue={profile.linkedin_url}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="contact_visible"
                                        name="contact_visible"
                                        defaultChecked={profile.contact_visible}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label
                                        htmlFor="contact_visible"
                                        className="ml-2 block text-sm text-muted-foreground"
                                    >
                                        Make my contact information visible to recruiters
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" asChild>
                            <a href="/profile">Cancel</a>
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </main>
    );
} 