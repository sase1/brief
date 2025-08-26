import { useState, useEffect } from "react";
import type { Article } from "@/types/article";

export const useNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    const fetchNews = () => {
        setLoading(true);
        fetch("/api/news")
            .then(res => res.json())
            .then((data: Article[]) => {
                setArticles(prev => {
                    const seen = new Set(prev.map(a => a.link));
                    const fresh = data.filter(a => !seen.has(a.link));

                    return [...fresh, ...prev].sort(
                        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                    );
                });
                setLoading(false);
                setLastUpdated(Date.now());
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchNews();
        const interval = setInterval(fetchNews, 1000 * 60 * 5);
        return () => clearInterval(interval);
    }, []);

    return { articles, loading, lastUpdated };
};