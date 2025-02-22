import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const handleRegister = async (formData) => {
        'use server';
        const email = formData.get('email');
        const password = formData.get('password');
        const supabase = createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return redirect('/register?message=Could not create user');
        }

        return redirect('/login?message=Check your email to confirm your account');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="card w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
                <form action={handleRegister} className="space-y-4">
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
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-muted">Already have an account? </span>
                    <Link href="/login" className="text-primary hover:underline">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
