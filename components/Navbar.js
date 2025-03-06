'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { createClientSideClient } from '@/lib/auth-client';

export async function Navbar() {
    const supabase = createClientSideClient();
    const pathname = usePathname();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const { data: profile } = session ? await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single() : { data: null };

    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        EthioDev Hub
                    </Link>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/projects"
                            className={`text-sm ${pathname === '/projects'
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            Explore
                        </Link>
                        {profile?.role === 'developer' && (
                            <Link
                                href="/projects/new"
                                className={`text-sm ${pathname === '/projects/new'
                                    ? 'text-primary font-medium'
                                    : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                Post Project
                            </Link>
                        )}
                        <Link
                            href="/developers"
                            className={`text-sm ${pathname === '/developers'
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            Developers
                        </Link>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <Link href="/profile">
                                <Button variant="ghost" size="sm">
                                    Profile
                                </Button>
                            </Link>
                            <form action="/auth/signout" method="post">
                                <Button variant="outline" size="sm">
                                    Sign Out
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="default" size="sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}