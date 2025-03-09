import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        // Get request body
        const body = await request.json();
        const { developer_id, name, email, message, company } = body;

        // Validate required fields
        if (!developer_id || !name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if the developer exists and has contact_visible enabled
        const { data: developer, error: developerError } = await supabase
            .from('profiles')
            .select('contact_visible')
            .eq('id', developer_id)
            .eq('role', 'developer')
            .single();

        if (developerError || !developer) {
            return NextResponse.json(
                { error: 'Developer not found' },
                { status: 404 }
            );
        }

        if (!developer.contact_visible) {
            return NextResponse.json(
                { error: 'Developer is not accepting contact requests' },
                { status: 403 }
            );
        }

        // Insert contact request
        const { data, error } = await supabase
            .from('contact_requests')
            .insert({
                developer_id,
                user_id: session?.user?.id || null,
                name,
                email,
                message,
                company: company || null
            });

        if (error) {
            console.error('Error creating contact request:', error);
            return NextResponse.json(
                { error: 'Failed to create contact request' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Contact request sent successfully' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 