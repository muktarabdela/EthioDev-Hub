import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';

// POST /api/auth/register - Register a new user
export async function POST(request) {
    try {
        const { email, password, name, role } = await request.json();

        if (!['developer', 'user', 'hr'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Create the user in Supabase Auth
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) throw signUpError;

        // Create the user profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                name,
                role,
            });

        if (profileError) {
            // If profile creation fails, we should delete the auth user
            await supabase.auth.admin.deleteUser(user.id);
            throw profileError;
        }

        return NextResponse.json({
            message: 'Registration successful. Please check your email for verification.',
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to register user' },
            { status: 500 }
        );
    }
} 