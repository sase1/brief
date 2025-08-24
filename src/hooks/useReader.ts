import { useState } from "react";

export const useReadLater = () => {
    const [readLater, setReadLater] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("readLater") || "[]");
        }
        return [];
    });

    const toggleReadLater = (link: string) => {
        let updated: string[];
        if (readLater.includes(link)) {
            updated = readLater.filter(l => l !== link);
        } else {
            updated = [...readLater, link];
        }
        setReadLater(updated);
        localStorage.setItem("readLater", JSON.stringify(updated));
    };

    return { readLater, toggleReadLater };
};
