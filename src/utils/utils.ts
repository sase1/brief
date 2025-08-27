import type { Article } from "@/types/article";

export const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return "штотуку";
    if (minutes === 1) return " пред 1 минута";
    return `пред ${minutes} минути`;
};


export const sortArticles = (
    articles: Article[],
    sortBy: "newest" | "oldest" | "title" | "source"
) => {
    const copy = [...articles];
    switch (sortBy) {
        case "oldest":
            return copy.sort(
                (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
            );
        case "title":
            return copy.sort((a, b) => a.title.localeCompare(b.title));
        case "source":
            return copy.sort((a, b) => a.source.localeCompare(b.source));
        default: // newest
            return copy.sort(
                (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
    }
};


export function groupRelatedNews(articles: Article[]): Article[][] {
    const map = new Map<string, Article[]>();

    for (const article of articles) {
        const snippet = article.title.toLowerCase().slice(0, 12);

        if (!map.has(snippet)) {
            map.set(snippet, []);
        }

        map.get(snippet)!.push(article);
    }

    return Array.from(map.values());
}
