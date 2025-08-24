// components/NewsCardGroup.tsx
import { useState } from "react";
import type { Article } from "@/types/article";
import NewsCard from "./NewsCard";

interface NewsCardGroupProps {
    group: Article[];
    readLater: string[];
    toggleReadLater: (link: string) => void;
}

export default function NewsCardGroup({ group, readLater, toggleReadLater }: NewsCardGroupProps) {
    const [expanded, setExpanded] = useState(false);
    const mainArticle = group[0];

    return (
        <div className="flex flex-col gap-2">
            <NewsCard article={mainArticle} readLater={readLater} toggleReadLater={toggleReadLater} />

            {group.length > 1 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-gray-400 hover:text-white self-start ml-2"
                >
                    {group.length-1} слични вести {expanded ? "« Сокриј" : "» Пokaжи"}
                </button>
            )}

            {expanded && (
                <div className="flex flex-col gap-2 ml-4 border-l border-gray-700 pl-2">
                    {group.slice(1).map((article, idx) => (
                        <a
                            key={idx}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-300 hover:text-blue-400"
                        >
                            [{article.source}] {article.title}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
