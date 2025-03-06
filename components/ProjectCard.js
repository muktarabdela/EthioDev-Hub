import { MessageCircle, ArrowUp, Sparkles } from "lucide-react"

export function ProjectCard({ project, index }) {
    return (
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300">
            {/* Main content wrapper */}
            <div className="flex justify-between gap-4">
                {/* Left section with project info */}
                <div className="flex items-start gap-4 flex-1">
                    {/* Project Icon */}
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${project.iconBg || "bg-primary/10 dark:bg-primary/20"}`}
                    >
                        {project.iconText ? (
                            <span className="text-primary font-bold text-sm">{project.iconText}</span>
                        ) : project.iconImage ? (
                            <img
                                src={project.iconImage || "/placeholder.svg"}
                                alt={project.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Sparkles className="w-5 h-5 text-primary" />
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                            {index + 1}. {project.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{project.description}</p>
                        <div className="flex gap-2 flex-wrap mt-3">
                            {project.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Developer Info */}
                        <div className="flex items-center gap-2 mt-4">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src={project.developer?.avatar || "/default-avatar.png"}
                                    alt={project.developer?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {project.developer?.name || 'Anonymous Developer'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right section with actions */}
                <div className="flex flex-col items-end gap-3">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{project.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ArrowUp className="w-4 h-4" />
                            <span className="text-sm">{project.upvotes}</span>
                        </div>
                    </div>

                    {/* Hire button */}
                    <button className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        hire {project.developer?.name || 'developer'}
                    </button>
                </div>
            </div>
        </div>
    )
}

