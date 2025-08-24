// components/NewsCard.tsx
import type {Article} from "@/types/article";

interface NewsCardProps {
    article: Article;
    readLater: string[];
    toggleReadLater: (link: string) => void;
}

export default function NewsCard({article, readLater, toggleReadLater}: NewsCardProps) {
    return (
        <div
            className="flex flex-col h-full border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 hover:scale-[1.02] relative bg-gray-800">
      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
        {article.source}
      </span>
            <span
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs absolute bottom-2 right-2">
        {article.category}
      </span>

            <button
                onClick={() => toggleReadLater(article.link)}
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold z-1 transition hover:cursor-pointer 
        ${readLater.includes(article.link)
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-700 text-white hover:bg-gray-600"}`}
            >
                {readLater.includes(article.link) ? "📌 Зачувано" : "📌 Прочитај подоцна"}
            </button>

            <div className="h-48 w-full overflow-hidden flex-shrink-0">
                <img
                    src={article.image || "/placeholder.png"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
                />
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-lg block mb-2 text-blue-400 hover:text-blue-200 hover:underline transition-colors"
                    >
                        {article.title}
                    </a>
                    {article.snippet && <p className="text-sm text-gray-300 mb-2">{article.snippet}...</p>}
                </div>
                <p className="text-xs text-gray-500 mt-auto">
                    {new Date(article.publishedAt).toLocaleString("mk-MK")}
                </p>
            </div>
        </div>
    );
}
