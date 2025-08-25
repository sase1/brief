"use client";

import {useEffect, useState, useMemo} from "react";
import NewsCard from "@/components/NewsCard";
import SkeletonCard from "@/components/SkeletonCard";
import FiltersBar from "@/components/FilterBars";
import StatusBar from "@/components/StatusBar";
import CategoryTabs from "@/components/CategoryTabs";
import {formatRelativeTime, groupRelatedNews, sortArticles} from "@/utils/utils";
import {useReadLater} from "@/hooks/useReader";
import {useClock} from "@/hooks/useClock";
import {useWeather} from "@/hooks/useWeather";
import {useNews} from "@/hooks/useNews";
import {useFilteredArticles} from "@/hooks/useFilteredArticles";
import ActiveUsers from "@/components/ActiveUsers";
import NewsCardGroup from "@/components/NewsCardGroup";
import {sources} from "@/data/newsSources";

const ITEMS_PER_PAGE = 20;

export default function NewsList() {
    const [search, setSearch] = useState("");
    const [sourceFilter, setSourceFilter] = useState("All");
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const { articles, loading, lastUpdated } = useNews();
    const currentTime = useClock();
    const weather = useWeather(41.9981, 21.4254);
    // const sources = useMemo(() =>
    //         Array.from(new Set(articles.map(a => a.source))).sort((a, b) => a.localeCompare(b)),
    //     [articles]
    // );


    const [showReadLater, setShowReadLater] = useState(false);
    const { readLater, toggleReadLater } = useReadLater();
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "source">("newest");

    const [cityFilter, setCityFilter] = useState("All");

    const { categories, filteredArticles } = useFilteredArticles({
        articles,
        search,
        sourceFilter,
        activeTab,
        showReadLater,
        readLater,
        cityFilter,
    });

    const sortedArticles = useMemo(() => sortArticles(filteredArticles, sortBy), [filteredArticles, sortBy]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const groupedArticles = useMemo(() => groupRelatedNews(sortedArticles), [sortedArticles]);

    // const cities = useMemo(() =>
    //         Array.from(new Set(articles.map(a => a.city))).sort((a, b) => a.localeCompare(b)),
    //     [articles]
    // );

    const cities = useMemo(() =>
            Array.from(
                new Set(
                    articles
                        .map(a => a.city) // default to "Other" if missing
                        .filter(Boolean)             // remove empty strings
                )
            ).sort((a, b) => a.localeCompare(b)),
        [articles]);

    useEffect(() => {
        setActiveTab(null); // reset selected tab
        setPage(1);         // reset pagination
    }, [cityFilter]);


    const filteredSources = useMemo(() => {
        if (cityFilter === "All") {
            return Array.from(new Set(articles.map(a => a.source))).sort((a, b) =>
                a.localeCompare(b)
            );
        }

        return Array.from(
            new Set(
                articles
                    .filter(a => a.city === cityFilter)
                    .map(a => a.source)
            )
        ).sort((a, b) => a.localeCompare(b));
    }, [articles, cityFilter]);


    // inside NewsList.tsx
    useEffect(() => {
        if (cityFilter === "All") return;

        // find the city of the currently selected source
        const sourceCity = sources.find(s => s.name === sourceFilter)?.city;

        // if current source is not from the chosen city → reset to "All"
        if (sourceCity && sourceCity !== cityFilter) {
            setSourceFilter("All");
        }
    }, [cityFilter, sourceFilter]);

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <ActiveUsers/>
            {mounted && (
                <StatusBar
                    currentTime={currentTime}
                    weather={weather}
                    lastUpdated={lastUpdated}
                    formatRelativeTime={formatRelativeTime}
                />
            )}

            <FiltersBar
                search={search}
                setSearch={setSearch}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                // sources={sources}
                sources={filteredSources}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showReadLater={showReadLater}
                setShowReadLater={setShowReadLater}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                cities={cities}
            />

            <CategoryTabs
                categories={categories}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setPage={setPage}
            />

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading
                    ? Array.from({length: ITEMS_PER_PAGE}).map((_, i) => <SkeletonCard key={i}/>)
                    : groupedArticles.slice(0, page * ITEMS_PER_PAGE).map((group, idx) => (
                        <NewsCardGroup
                            key={idx}
                            group={group}
                            readLater={readLater}
                            toggleReadLater={toggleReadLater}
                        />
                    ))
                }
            </div>

            {page * ITEMS_PER_PAGE < filteredArticles.length && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setPage(page + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg hover:scale-105 transition transform"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
