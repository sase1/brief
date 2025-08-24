"use client";
import { useEffect, useState } from "react";

interface StatusBarProps {
    currentTime: Date;
    weather: { temp: number; desc: string } | null;
    lastUpdated: number | null;
    formatRelativeTime: (timestamp: number) => string;
}

export default function StatusBar({
                                      currentTime,
                                      weather,
                                      lastUpdated,
                                      formatRelativeTime,
                                  }: StatusBarProps) {
    const [now, setNow] = useState(Date.now());

    // Update 'now' every minute to refresh relative time
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white font-semibold gap-2">
            {/* Clock */}
            <div className="text-xl">
                🕒 {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </div>

            {/* Weather */}
            {weather && (
                <div className="text-xl">
                    🌤 {weather.temp}°C {weather.desc}
                </div>
            )}

            {/* Last Updated */}
            {lastUpdated && (
                <div className="text-sm italic text-gray-200 mt-2 md:mt-0">
                    Обновени вести {formatRelativeTime(lastUpdated)}
                </div>
            )}
        </div>
    );
}
