import {useMemo} from "react";
import type {Article} from "@/types/article";
import {sources} from "@/data/newsSources";

interface UseFilteredArticlesProps {
    articles: Article[];
    search: string;
    sourceFilter: string;
    activeTab: string | null;
    showReadLater: boolean;
    readLater: string[];
    cityFilter: string;
}

export function useFilteredArticles({
                                        articles,
                                        search,
                                        sourceFilter,
                                        activeTab,
                                        showReadLater,
                                        readLater,
                                        cityFilter
                                    }: UseFilteredArticlesProps) {

    // const categories = useMemo(() => {
    //     const filteredArticles = sourceFilter === "All" ? articles : articles.filter(a => a.source === sourceFilter);
    //     const cats = filteredArticles.map(a => a.category ?? "Општи");
    //     return Array.from(new Set(cats));
    // }, [articles, sourceFilter]);

    const categories = useMemo(() => {
        const filteredArticles = articles.filter(a => {
            const matchesSource = sourceFilter === "All" || a.source === sourceFilter;
            const articleCity = sources.find(s => s.name === a.source)?.city || "Other";
            const matchesCity = cityFilter === "All" || articleCity === cityFilter;
            return matchesSource && matchesCity;
        });
        const cats = filteredArticles.map(a => a.category ?? "Општи");
        return Array.from(new Set(cats));
    }, [articles, sourceFilter, cityFilter]);

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
            const matchesSource = sourceFilter === "All" || a.source === sourceFilter;
            const articleCity = sources.find(s => s.name === a.source)?.city || "Other";
            const matchesCity = cityFilter === "All" || articleCity === cityFilter;
            const matchesCategory = !activeTab || a.category === activeTab;
            const matchesReadLater = !showReadLater || readLater.includes(a.link);
            return matchesSearch && matchesSource && matchesCity && matchesCategory && matchesReadLater;
        });
    }, [articles, search, sourceFilter, cityFilter, activeTab, showReadLater, readLater]);

    return {categories, filteredArticles};
}
