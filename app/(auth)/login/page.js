import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const handleLogin = async (formData) => {
        'use server';
        const email = formData.get('email');
        const password = formData.get('password');
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect('/login?message=Could not authenticate user');
        }

        return redirect('/');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 ">
            <div className="card w-full max-w-md bg-accent">
                <h1 className="text-2xl font-bold mb-6">Login to EthioDev Hub</h1>
                <form action={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-muted">Don't have an account? </span>
                    <Link href="/register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}
