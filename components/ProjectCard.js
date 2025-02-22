import { MessageCircle, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function ProjectCard({ project, index }) {
    return (
        <div className="group bg-white p-6 rounded-xl border hover:border-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex gap-4 items-start">
                    {/* Project Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.iconBg || 'bg-gray-100'}`}>
                        {project.iconText ? (
                            <span className="text-white font-bold">{project.iconText}</span>
                        ) : project.iconImage ? (
                            <img src={project.iconImage} alt={project.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span className="material-symbols-outlined text-white">{project.iconSymbol}</span>
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">
                            {index + 1}. {project.name}
                        </h2>
                        <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                        <div className="flex gap-2 flex-wrap">
                            {project.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{project.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-sm">{project.upvotes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 