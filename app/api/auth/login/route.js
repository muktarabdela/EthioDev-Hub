import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request) {
    try {
        if (request.headers.get('content-type') !== 'application/json') {
            return NextResponse.json(
                { error: 'Content type must be application/json' },
                { status: 400 }
            );
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return NextResponse.json({
            message: 'Login successful',
            session: data.session
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to login' },
            { status: 500 }
        );
    }
} 