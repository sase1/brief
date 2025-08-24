// import { NextRequest, NextResponse } from "next/server";
//
// let activeUsers: string[] = [];
//
// export async function POST(req: NextRequest) {
//     const url = new URL(req.url);
//     const user = url.searchParams.get("user");
//     if (user && !activeUsers.includes(user)) {
//         activeUsers.push(user);
//     }
//     return NextResponse.json({ success: true });
// }
//
// export async function GET() {
//     return NextResponse.json({ users: activeUsers });
// }



import { NextRequest, NextResponse } from "next/server";

// Store users with last active timestamp
let activeUsers: Record<string, number> = {};

// Expire users who haven't pinged in the last 15 seconds
const EXPIRATION_TIME = 55 * 1000; // 15 seconds

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const user = url.searchParams.get("user");
    if (user) {
        activeUsers[user] = Date.now();
    }
    return NextResponse.json({ success: true });
}

export async function GET() {
    const now = Date.now();

    // Remove expired users
    Object.keys(activeUsers).forEach((user) => {
        if (now - activeUsers[user] > EXPIRATION_TIME) {
            delete activeUsers[user];
        }
    });

    return NextResponse.json({ users: Object.keys(activeUsers) });
}
