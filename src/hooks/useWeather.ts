import { useState, useEffect } from "react";

export const useWeather = (lat: number, lon: number) => {
    const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await res.json();
                setWeather({ temp: data.current_weather.temperature, desc: data.current_weather.description });
            } catch (err) {
                console.error("Weather fetch failed", err);
            }
        };
        fetchWeather();
    }, [lat, lon]);

    return weather;
};
