import Link from 'next/link';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        EthioDev Hub
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
} 