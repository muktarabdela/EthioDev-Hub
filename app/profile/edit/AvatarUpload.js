'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';

export default function AvatarUpload({ userId, avatarUrl }) {
    const [uploading, setUploading] = useState(false);
    const [avatar, setAvatar] = useState(avatarUrl);
    const [error, setError] = useState(null);
    const supabase = createClient();

    async function uploadAvatar(event) {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/avatar.${fileExt}`;

            // Upload the file to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update the user profile with the avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) {
                throw updateError;
            }

            setAvatar(publicUrl);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setError('Error uploading avatar. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    async function removeAvatar() {
        try {
            setUploading(true);
            setError(null);

            // Update the user profile to remove the avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', userId);

            if (updateError) {
                throw updateError;
            }

            setAvatar(null);
        } catch (error) {
            console.error('Error removing avatar:', error);
            setError('Error removing avatar. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {avatar ? (
                    <Image
                        src={avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-medium">
                        {/* Display first letter of user's name or a placeholder */}
                        ?
                    </div>
                )}
            </div>

            <div className="flex space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload').click()}
                    disabled={uploading}
                    className="flex items-center space-x-1"
                >
                    <Upload className="h-4 w-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                </Button>

                {avatar && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeAvatar}
                        disabled={uploading}
                        className="flex items-center space-x-1 text-red-500 border-red-200 hover:bg-red-50"
                    >
                        <X className="h-4 w-4" />
                        <span>Remove</span>
                    </Button>
                )}

                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
} 