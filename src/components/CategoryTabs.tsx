"use client";

interface CategoryTabsProps {
    categories: string[];
    activeTab: string | null;
    setActiveTab: (tab: string | null) => void;
    setPage: (page: number) => void;
}

export default function CategoryTabs({categories, activeTab, setActiveTab, setPage}: CategoryTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 border-b border-gray-700 mb-6 pb-7 overflow-y-auto max-h-46">
            <button
                className={`px-4 py-2 -mb-px font-semibold rounded-t-lg transition hover:cursor-pointer ${
                    activeTab === null
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-800 text-gray-400 hover:text-white hover:from-blue-500 hover:to-purple-500 hover:bg-gradient-to-r"
                }`}
                onClick={() => {
                    setActiveTab(null);
                    setPage(1);
                }}
            >
                Сите категории
            </button>

            {categories.map((cat, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 -mb-px font-semibold rounded-t-lg transition hover:cursor-pointer ${
                        activeTab === cat
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : "bg-gray-800 text-gray-400 hover:text-white hover:from-blue-500 hover:to-purple-500 hover:bg-gradient-to-r"
                    }`}
                    onClick={() => {
                        setActiveTab(cat);
                        setPage(1);
                    }}
                >
                    {cat}
                </button>
            ))}
            <button
                className={`px-4 py-2 -mb-px font-semibold rounded-t-lg transition hover:cursor-pointer ${
                    activeTab === null
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-800 text-gray-400 hover:text-white hover:from-blue-500 hover:to-purple-500 hover:bg-gradient-to-r"
                }`}
                onClick={() => {
                    setActiveTab(null);
                    setPage(1);
                }}
            >
                Сите категории
            </button>
        </div>
    );
}
