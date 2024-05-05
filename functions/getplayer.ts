import type { Context } from "@netlify/functions";
import puppeteer from "puppeteer";

type Results = {
    url: string;
    text: string;
}
export default async (req: Request, context: Context) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://news.ycombinator.com/");
    let results: Results[] = [];
    await page.evaluate(() => {
        let items = document.querySelectorAll('a.storylink');
        items.forEach((item) => {
            results.push({
                url: item.getAttribute('href') || '',
                text: item.textContent || '',
            });
        });
    })
    browser.close();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
}
