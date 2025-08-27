import { NextRequest, NextResponse } from "next/server";

const activeUsers: Record<string, number> = {};
const EXPIRATION_TIME = 60 * 1000;

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
    Object.keys(activeUsers).forEach((user) => {
        if (now - activeUsers[user] > EXPIRATION_TIME) {
            delete activeUsers[user];
        }
    });

    return NextResponse.json({ users: Object.keys(activeUsers) });
}
