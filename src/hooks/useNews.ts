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
                    const seen = new Set(prev.map(a => a.link)); // assume link is unique
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



// import { useEffect, useState } from "react";
// import type { Article } from "@/types/article";
//
// export function useNews() {
//     const [articles, setArticles] = useState<Article[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [lastUpdated, setLastUpdated] = useState<number | null>(null);
//
//     useEffect(() => {
//         const fetchNews = async () => {
//             try {
//                 const res = await fetch("/api/news");
//                 const data: Article[] = await res.json();
//
//                 // merge new articles without duplicates
//                 setArticles((prev) => {
//                     const ids = new Set(prev.map((a) => a.link)); // use link as unique key
//                     const newArticles = data.filter((a) => !ids.has(a.link));
//                     return [...prev, ...newArticles].sort(
//                         (a, b) =>
//                             new Date(b.publishedAt).getTime() -
//                             new Date(a.publishedAt).getTime()
//                     );
//                 });
//
//                 setLastUpdated(Date.now());
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Failed to fetch news", err);
//             }
//         };
//
//         // initial fetch
//         fetchNews();
//
//         // poll every 3 seconds for new batches
//         const interval = setInterval(fetchNews, 3000);
//
//         return () => clearInterval(interval);
//     }, []);
//
//     return { articles, loading, lastUpdated };
// }


