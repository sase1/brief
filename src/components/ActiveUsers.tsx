"use client";

import { useEffect, useState } from "react";

export default function ActiveUsers() {
    const [users, setUsers] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<string>("");

    useEffect(() => {
        let userId = localStorage.getItem("visitorId");
        if (!userId) {
            userId = "user-" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("visitorId", userId);
        }
        setCurrentUser(userId);
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const heartbeat = () => {
            fetch(`/api/users/activeUsers?user=${currentUser}`, { method: "POST" });
        };

        heartbeat();
        const interval = setInterval(heartbeat, 10000);
        return () => clearInterval(interval);
    }, [currentUser]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await fetch("/api/users/activeUsers");
            const data = await res.json();
            setUsers(data.users);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg">
            <h2 className="font-semibold mb-2">Читатели моментално на сајтот: ({users.length})</h2>
            <ul>
                {users.map((u) => (
                    <li key={u}>{u}</li>
                ))}
            </ul>
        </div>
    );
}