import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action="/api/auth/register" method="POST" className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-muted-foreground mb-1"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-muted-foreground mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-muted-foreground mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="••••••••"
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-muted-foreground mb-1"
                            >
                                I am a...
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">Select your role</option>
                                <option value="developer">Developer</option>
                                <option value="hr">HR/Recruiter</option>
                                <option value="user">Other</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
