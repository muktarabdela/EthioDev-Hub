import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
// POST /api/auth/register - Register a new user
export async function POST(request) {
    try {
        // Ensure the content type is application/json
        if (request.headers.get('content-type') !== 'application/json') {
            return NextResponse.json(
                { error: 'Content type must be application/json' },
                { status: 400 }
            );
        }

        const { email, password, name, role } = await request.json();

        // Validate required fields
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['developer', 'user', 'hr'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // First, create the user in Supabase Auth
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            console.error('SignUp Error:', signUpError);
            throw signUpError;
        }

        if (!user) {
            throw new Error('No user returned from signUp');
        }

        // Then, create the user profile in the users table
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: user.id,
                username: name.toLowerCase().replace(/\s+/g, '_'), // Convert name to username format
                bio: '', // Default empty bio
                skills: [], // Default empty skills array
                links: {} // Default empty links object
            });

        if (userError) {
            console.error('User Insert Error:', userError);
            // If user creation fails, we should delete the auth user
            await supabase.auth.admin.deleteUser(user.id);
            throw userError;
        }

        return NextResponse.json({
            message: 'Registration successful. Please check your email for verification.',
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to register user' },
            { status: 500 }
        );
    }
} 