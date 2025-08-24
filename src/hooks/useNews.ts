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
                setArticles(data);
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
