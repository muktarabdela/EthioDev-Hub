import { MessageCircle, ArrowUp, Sparkles } from "lucide-react"

export default function ProjectCard({ project, index }) {
    return (
        <div className="group bg-[#e7e5e4] dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    {/* Project Icon */}
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.iconBg || "bg-primary/10 dark:bg-primary/20"}`}
                    >
                        {project.iconText ? (
                            <span className="text-primary font-bold">{project.iconText}</span>
                        ) : project.iconImage ? (
                            <img
                                src={project.iconImage || "/placeholder.svg"}
                                alt={project.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Sparkles className="w-6 h-6 text-primary" />
                        )}
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
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

                {/* Project Details */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {index + 1}. {project.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-3">{project.description}</p>
                    <div className="flex gap-2 flex-wrap">
                        {project.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

