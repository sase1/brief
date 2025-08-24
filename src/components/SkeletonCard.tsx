export default function SkeletonCard() {
    return (
        <div className="flex flex-col h-full border border-gray-700 rounded-2xl overflow-hidden bg-gray-800 animate-pulse">
            <div className="h-48 bg-gray-700 w-full"></div>
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="h-6 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded mb-1"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </div>
        </div>
    );
}
