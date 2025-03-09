'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Calendar, Building, User, Check, ExternalLink } from 'lucide-react';

export default function NotificationsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [contactRequests, setContactRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContactRequests();

        // Set up session listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchContactRequests();
            } else {
                router.push('/login');
            }
        });

        // Cleanup subscription
        return () => subscription.unsubscribe();
    }, []);

    async function fetchContactRequests() {
        try {
            setLoading(true);
            setError(null);

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            // Check if user is a developer
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profileError || profile.role !== 'developer') {
                router.push('/profile');
                return;
            }

            // Fetch contact requests
            const { data, error } = await supabase
                .from('contact_requests')
                .select('*')
                .eq('developer_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setContactRequests(data || []);
        } catch (err) {
            console.error('Error fetching contact requests:', err);
            setError('Failed to load contact requests. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(id) {
        try {
            const { error } = await supabase
                .from('contact_requests')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setContactRequests(
                contactRequests.map(request =>
                    request.id === id ? { ...request, is_read: true } : request
                )
            );
        } catch (err) {
            console.error('Error marking contact request as read:', err);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Contact Requests</h1>
                    <p className="text-muted-foreground">
                        View and manage contact requests from potential employers.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {contactRequests.length > 0 ? (
                    <div className="space-y-6">
                        {contactRequests.map((request) => (
                            <Card
                                key={request.id}
                                className={`${!request.is_read ? 'border-primary' : ''}`}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="flex items-center gap-2">
                                            <Mail className="h-5 w-5" />
                                            <span>Message from {request.name}</span>
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>{request.name}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />
                                            <a
                                                href={`mailto:${request.email}`}
                                                className="hover:text-primary"
                                            >
                                                {request.email}
                                            </a>
                                        </div>
                                        {request.company && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Building className="h-4 w-4 mr-2" />
                                                <span>{request.company}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="whitespace-pre-wrap">{request.message}</p>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a href={`mailto:${request.email}`} className="flex items-center gap-1">
                                                <ExternalLink className="h-4 w-4" />
                                                <span>Reply via Email</span>
                                            </a>
                                        </Button>

                                        {!request.is_read && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => markAsRead(request.id)}
                                                className="flex items-center gap-1"
                                            >
                                                <Check className="h-4 w-4" />
                                                <span>Mark as Read</span>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground mb-2">
                                No contact requests yet.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                When someone contacts you about a job opportunity, it will appear here.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
} 