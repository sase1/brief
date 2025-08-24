"use client";

import {Dispatch, SetStateAction} from "react";

interface FiltersBarProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    sourceFilter: string;
    setSourceFilter: Dispatch<SetStateAction<string>>;
    sources: string[];
    cityFilter: string;
    setCityFilter: Dispatch<SetStateAction<string>>;
    cities: string[];
    sortBy: "newest" | "oldest" | "title" | "source";
    setSortBy: Dispatch<SetStateAction<"newest" | "oldest" | "title" | "source">>;
    showReadLater: boolean;
    setShowReadLater: Dispatch<SetStateAction<boolean>>;
}

export default function FiltersBar({
                                       search,
                                       setSearch,
                                       sourceFilter,
                                       setSourceFilter,
                                       sources,
                                       sortBy,
                                       setSortBy,
                                       showReadLater,
                                       setShowReadLater,
                                       cityFilter,
                                       setCityFilter,
                                       cities
                                   }: FiltersBarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
            {/* Source Dropdown */}
            <select
                value={sourceFilter}
                onChange={(e) => {
                    setSourceFilter(e.target.value);
                }}
                className="p-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:cursor-pointer"
            >
                <option value="All" className="text-white">Сите извори</option>
                {sources.map((s, i) => (
                    <option key={i} value={s} className="text-white">{s}</option>
                ))}
            </select>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Пребарај вести од изворот..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-100 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex-1"
            />

            {/* Sort Dropdown */}
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="p-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:cursor-pointer"
            >
                <option value="newest">Најнови вести</option>
                <option value="oldest">Најстари вести</option>
                <option value="title">Азбучен редослед</option>
                <option value="source">Извор</option>
            </select>

            {/* City Dropdown */}
            <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="p-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:cursor-pointer"
            >
                <option value="All">Сите градови</option>
                {cities.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                ))}
            </select>

            {/* Read Later Toggle */}
            <button
                onClick={() => setShowReadLater(!showReadLater)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:cursor-pointer"
            >
                {showReadLater ? "Прикажи сите вести" : "Прикажи зачувани вести"}
            </button>
        </div>
    );
}
