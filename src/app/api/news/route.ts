import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { Article } from "@/types/article";
import { sources } from "@/data/newsSources";

const parser = new Parser<FeedItem>({
    customFields: {
        item: ["thumbnail", "description", "content:encoded"]
    }
});
let cachedNews: Article[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5;

interface FeedItem {
    enclosure?: { url?: string };
    ["media:content"]?: { url?: string };
    content?: string;
    description?: string;
    thumbnail?: string;
    ["content:encoded"]?: string;
}

function extractImage(item: FeedItem, sourceUrl: string): string {
    // 1. thumbnail
    if (item.thumbnail) return normalize(item.thumbnail);

    // 2. enclosure
    if (item.enclosure?.url) return normalize(item.enclosure.url);

    // 3. media:content
    if (item["media:content"]?.url) return normalize(item["media:content"].url);

    // 4. content:encoded
    if (item["content:encoded"]) {
        const match = item["content:encoded"].match(/<img[^>]+src=['"]?([^'"\s>]+)['"]?/i);
        if (match) return normalize(match[1]);
    }

    // 5. description
    if (item.description) {
        const match = item.description.match(/<img[^>]+src=['"]?([^'"\s>]+)['"]?/i);
        if (match) return normalize(match[1]);
    }

    // 6. content
    if (item.content) {
        const match = item.content.match(/<img[^>]+src=['"]?([^'"\s>]+)['"]?/i);
        if (match) return normalize(match[1]);
    }

    return "/placeholder.png";

    function normalize(url: string) {
        if (!url) return url;
        if (url.startsWith("/")) {
            const base = new URL(sourceUrl).origin;
            return base + url;
        }
        return url;
    }
}



// function extractImage(item: FeedItem, sourceUrl: string): string {
//     if (item.enclosure?.url) return item.enclosure.url;
//     if (item["media:content"]?.url) return item["media:content"].url;
//     if (item.content) {
//         const match = item.content.match(/<img.*?(src|srcset|data-src)="(.*?)"/i);
//         if (match) {
//             let url = match[2];
//             if (url.startsWith("/")) {
//                 const base = new URL(sourceUrl).origin;
//                 url = base + url;
//             }
//             return url;
//         }
//     }
//     return "/placeholder.png";
// }

async function fetchAllNews(): Promise<Article[]> {
    const results = await Promise.allSettled(
        sources.map(async (source) => {
            const feed = await parser.parseURL(source.url);
            return feed.items.map((item) => {
                const image = extractImage(item, source.url);
                let snippet = "";

                if (item.content) {
                    snippet = item.content.replace(/(<([^>]+)>)/gi, "");
                } else if (item.contentSnippet) {
                    snippet = item.contentSnippet;
                } else if (item.summary) {
                    snippet = item.summary;
                }

                return {
                    title: item.title ?? "",
                    link: item.link ?? "#",
                    source: source.name,
                    publishedAt: item.pubDate ?? new Date().toISOString(),
                    image: image ?? "", // ✅ force string
                    snippet: snippet.slice(0, 220),
                    category: item.categories?.[0] ?? source.category ?? "Општи",
                    city: source.city
                } as Article;
            });
        })
    );

    const allNews: Article[] = results
        .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
        .flatMap((r) => r.value);

    return allNews.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export async function GET() {
    const now = Date.now();

    if (cachedNews.length > 0 && now - lastFetchTime < CACHE_DURATION) {
        return NextResponse.json(cachedNews);
    }

    const news = await fetchAllNews();
    cachedNews = news;
    lastFetchTime = now;

    return NextResponse.json(news);
}

