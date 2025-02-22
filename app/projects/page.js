import Link from "next/link";

const dummyProjects = [
    {
        id: 1,
        name: "NYX",
        description: "Your AI-powered performance marketing co-pilot.",
        tags: ["Marketing", "Advertising", "Artificial Intelligence"],
        stats: { comments: 27, upvotes: 376 },
        icon: { bg: "bg-indigo-600", text: "NYX" }
    },
    {
        id: 2,
        name: "Trupeer Faces",
        description: "Studio-quality screen recording with avatars, completely AI",
        tags: ["Chrome Extensions", "Artificial Intelligence", "Video"],
        stats: { comments: 13, upvotes: 295 },
        icon: { image: "https://placehold.co/32x32" }
    },
    {
        id: 3,
        name: "Perplexity Deep Research",
        description: "Save hours of time in-depth research and analysis",
        tags: ["Artificial Intelligence", "Bots", "Search"],
        stats: { comments: 9, upvotes: 291 },
        icon: { bg: "bg-black", icon: "data_object" }
    },
    {
        id: 4,
        name: "ElevenLabs Studio",
        description: "Structure, edit, and generate long-form audio with precision",
        tags: ["Marketing", "Artificial Intelligence", "Audio"],
        stats: { comments: 5, upvotes: 235 },
        icon: { bg: "bg-gray-900", icon: "pause" }
    }
];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold mb-6">Top Products Launching Today</h1>

                    <div className="space-y-6">
                        {dummyProjects.map((project, index) => (
                            <div key={project.id} className="flex items-center justify-between group hover:bg-gray-50 p-4 rounded-lg transition-colors">
                                <div className="flex gap-4 items-start">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.icon.bg || 'bg-gray-100'}`}>
                                        {project.icon.text ? (
                                            <span className="text-white font-bold">{project.icon.text}</span>
                                        ) : project.icon.image ? (
                                            <img src={project.icon.image} alt={project.name} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <span className="material-symbols-outlined text-white">{project.icon.icon}</span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">
                                            {index + 1}. {project.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined">comment</span>
                                        <span>{project.stats.comments}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined">trending_up</span>
                                        <span>{project.stats.upvotes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
