import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { Article } from "@/types/article";
import { sources } from "@/data/newsSources";

const parser = new Parser();


// Cache storage
let cachedNews: Article[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

function extractImage(item: any, sourceUrl: string): string {
    // 1. enclosure
    if (item.enclosure?.url) return item.enclosure.url;

    // 2. media:content
    if (item["media:content"]?.url) return item["media:content"].url;

    // 3. Try to parse image from HTML content
    if (item.content) {
        const match = item.content.match(/<img.*?(src|srcset|data-src)="(.*?)"/i);
        if (match) {
            let url = match[2];
            if (url.startsWith("/")) {
                const base = new URL(sourceUrl).origin;
                url = base + url;
            }
            return url;
        }
    }

    // 4. fallback default
    return "/placeholder.png";
}

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
