'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function CommentForm({ projectId, onCommentAdded }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const supabase = createClient();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Redirect to login
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                return;
            }

            const { data, error } = await supabase
                .from('comments')
                .insert({
                    content: content.trim(),
                    project_id: projectId,
                    user_id: session.user.id
                })
                .select(`
          id,
          content,
          created_at,
          user:profiles(id, name, role)
        `)
                .single();

            if (error) throw error;

            setContent('');

            if (onCommentAdded && data) {
                onCommentAdded(data);
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mt-6">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground mb-1">
                            Add a Comment
                        </label>
                        <textarea
                            id="comment"
                            rows={3}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Share your thoughts about this project..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Comment'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 