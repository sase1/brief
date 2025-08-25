import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { Article } from "@/types/article";
import { sources } from "@/data/newsSources";

const parser = new Parser();
let cachedNews: Article[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5;

interface FeedItem {
    enclosure?: { url?: string };
    ["media:content"]?: { url?: string };
    content?: string;
}

function extractImage(item: FeedItem, sourceUrl: string): string {
    if (item.enclosure?.url) return item.enclosure.url;
    if (item["media:content"]?.url) return item["media:content"].url;
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


//
// import { NextResponse } from "next/server";
// import Parser from "rss-parser";
// import type { Article } from "@/types/article";
// import { sources } from "@/data/newsSources";
// import pLimit from "p-limit";
//
// const parser = new Parser();
//
// // Cache
// let cachedNews: Article[] = [];
// let lastFetchTime = 0;
// const CACHE_DURATION = 1000 * 60 * 5; // 5 min
// const BATCH_INTERVAL = 5000; // 5 sec between batches
// const BATCH_SIZE = 30;
//
// // Concurrency limit
// const limit = pLimit(10);
//
// function extractImage(item: any, sourceUrl: string): string {
//     if (item.enclosure?.url) return item.enclosure.url;
//     if (item["media:content"]?.url) return item["media:content"].url;
//     if (item.content) {
//         const match = item.content.match(/<img.*?(src|srcset|data-src)="(.*?)"/i);
//         if (match) {
//             let url = match[2];
//             if (url.startsWith("/")) url = new URL(sourceUrl).origin + url;
//             return url;
//         }
//     }
//     return "/placeholder.png";
// }
//
// // Fetch a batch of sources
// async function fetchBatch(sourcesList: typeof sources) {
//     const results = await Promise.allSettled(
//         sourcesList.map((source) =>
//             limit(async () => {
//                 try {
//                     const feed = await parser.parseURL(source.url);
//                     return feed.items.map((item) => {
//                         const image = extractImage(item, source.url);
//                         const snippet = (item.content || item.contentSnippet || item.summary || "")
//                             .replace(/(<([^>]+)>)/gi, "")
//                             .slice(0, 220);
//                         return {
//                             title: item.title ?? "",
//                             link: item.link ?? "#",
//                             source: source.name,
//                             publishedAt: item.pubDate ?? new Date().toISOString(),
//                             image,
//                             snippet,
//                             category: item.categories?.[0] ?? source.category ?? "Општи",
//                             city: source.city,
//                         } as Article;
//                     });
//                 } catch (err) {
//                     console.error(`Failed to fetch ${source.name}`, err);
//                     return [];
//                 }
//             })
//         )
//     );
//
//     return results
//         .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
//         .flatMap((r) => r.value);
// }
//
// // Progressive fetching
// let batchIndex = 0;
// async function progressiveFetch() {
//     if (batchIndex >= sources.length) return;
//
//     const batchSources = sources.slice(batchIndex, batchIndex + BATCH_SIZE);
//     const batchArticles = await fetchBatch(batchSources);
//     cachedNews = [...cachedNews, ...batchArticles].sort(
//         (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
//     );
//     lastFetchTime = Date.now();
//     batchIndex += BATCH_SIZE;
//
//     // Schedule next batch
//     if (batchIndex < sources.length) {
//         setTimeout(progressiveFetch, BATCH_INTERVAL);
//     }
// }
//
// // Start fetching first batch
// if (cachedNews.length === 0) {
//     const initialSources = sources.slice(0, 50);
//     fetchBatch(initialSources).then((articles) => {
//         cachedNews = [...cachedNews, ...articles].sort(
//             (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
//         );
//         lastFetchTime = Date.now();
//         batchIndex = 50;
//         progressiveFetch(); // start remaining batches
//     });
// }
//
// export async function GET() {
//     return NextResponse.json(cachedNews);
// }

