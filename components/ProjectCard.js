import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectCard({ project }) {
    return (
        <div className="card">
            <div className="flex items-start gap-6">
                {/* Voting Section */}
                <div className="flex flex-col items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className="font-semibold">{project.upvotes}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Project Details */}
                <div className="flex-1">
                    <Link href={`/projects/${project.id}`}>
                        <h2 className="text-xl font-semibold hover:text-primary transition-colors">
                            {project.title}
                        </h2>
                    </Link>
                    <p className="text-muted mt-2">{project.description}</p>

                    {/* Tags */}
                    <div className="mt-4 flex gap-2">
                        {project.tags?.map((tag) => (
                            <span key={tag} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-2 text-muted">
                    <MessageCircle className="w-5 h-5" />
                    <span>{project.comments_count}</span>
                </div>
            </div>
        </div>
    );
} 