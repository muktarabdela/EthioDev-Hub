'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import {
    Bell,
    Menu,
    X,
    User,
    LogOut,
    Code,
    Search,
    Users,
    Home
} from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const supabase = createClient();
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function getSession() {
            // Get the user's session from local storage
            const session = localStorage.getItem('session');
            // const { data: { session } } = await supabase.auth?.getSession();
            console.log(session);
            setSession(session);

            if (session) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session?.user?.id)
                    .single();
                setProfile(profile);

                // If user is a developer, check for unread contact requests
                if (profile?.role === 'developer') {
                    const { count, error } = await supabase
                        .from('contact_requests')
                        .select('*', { count: 'exact', head: true })
                        .eq('developer_id', session.user.id)
                        .eq('is_read', false);

                    if (!error) {
                        setUnreadCount(count || 0);
                    }
                }
            }
        }

        getSession();
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                            <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">EthioDev Hub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link
                            href="/projects"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/projects')
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                <Search className="h-4 w-4" />
                                <span>Explore</span>
                            </div>
                        </Link>
                        {profile?.role === 'developer' && (
                            <Link
                                href="/projects/new"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/projects/new')
                                    ? 'text-primary bg-primary/5'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-1">
                                    <Code className="h-4 w-4" />
                                    <span>Post Project</span>
                                </div>
                            </Link>
                        )}
                        <Link
                            href="/developers"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/developers')
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>Developers</span>
                            </div>
                        </Link>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-2">
                        {session ? (
                            <>
                                {profile?.role === 'developer' && (
                                    <Link
                                        href="/profile/notifications"
                                        className="relative p-2 text-gray-700 hover:text-primary rounded-full hover:bg-gray-100"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className="hidden md:flex items-center space-x-2 p-2 text-gray-700 hover:text-primary rounded-md hover:bg-gray-100"
                                >
                                    <User className="h-5 w-5" />
                                    <span className="text-sm font-medium">Profile</span>
                                </Link>
                                <form action="/auth/signout" method="post" className="hidden md:block">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 text-gray-700"
                                    >
                                        <LogOut className="h-4 w-4 mr-1" />
                                        Sign Out
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-700 hover:text-primary hover:bg-gray-100"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register" className="hidden md:block">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-primary hover:bg-primary-dark text-white"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="container mx-auto px-4 py-3 space-y-1">
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }`}
                            onClick={closeMobileMenu}
                        >
                            <div className="flex items-center space-x-2">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link
                            href="/projects"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/projects')
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }`}
                            onClick={closeMobileMenu}
                        >
                            <div className="flex items-center space-x-2">
                                <Search className="h-5 w-5" />
                                <span>Explore</span>
                            </div>
                        </Link>
                        {profile?.role === 'developer' && (
                            <Link
                                href="/projects/new"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/projects/new')
                                    ? 'text-primary bg-primary/5'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                    }`}
                                onClick={closeMobileMenu}
                            >
                                <div className="flex items-center space-x-2">
                                    <Code className="h-5 w-5" />
                                    <span>Post Project</span>
                                </div>
                            </Link>
                        )}
                        <Link
                            href="/developers"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/developers')
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }`}
                            onClick={closeMobileMenu}
                        >
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Developers</span>
                            </div>
                        </Link>

                        {session ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile')
                                        ? 'text-primary bg-primary/5'
                                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                        }`}
                                    onClick={closeMobileMenu}
                                >
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </div>
                                </Link>
                                <form action="/auth/signout" method="post" className="px-3 py-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-gray-300 text-gray-700"
                                    >
                                        <LogOut className="h-5 w-5 mr-2" />
                                        Sign Out
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 px-3 py-2">
                                <Link href="/login" onClick={closeMobileMenu}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center border-gray-300 text-gray-700"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register" onClick={closeMobileMenu}>
                                    <Button
                                        variant="default"
                                        className="w-full justify-center bg-primary hover:bg-primary-dark text-white"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}