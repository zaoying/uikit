import { Response, test } from '@playwright/test';
import { writeFileSync } from 'fs';

const host = 'https://picuki.me';
const site = 'https://picuki.me/demi.rose03/';
const outputDir = "C:\\Users\\huang\\Downloads\\demi-rose\\";

async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function wait(imgSet: Set<string>) {
    return new Promise<void>(resolve => {
        let id: any;
        const check = () => {
            if (imgSet.size == 0) {
                resolve()
                id && clearInterval(id)
            }
        }
        id = setInterval(check, 1000)
    });
}

function onResponse(imgSet: Set<string>) {
    return async (resp: Response) => {
        const url = resp.url()
        if (imgSet.has(url)) {
            const q = url.lastIndexOf("?")
            const uri = url.substring(0, q)
            console.info(uri)
            const slash = uri.lastIndexOf("/")
            const filename = uri.substring(slash + 1)
            const buf = await resp.body()
            writeFileSync(outputDir+filename, buf)
            imgSet.delete(url)
        }
    }        
}

test('demi rose', async ({ page }) => {
    await page.goto(site, {waitUntil: 'domcontentloaded'})
    for (;true;) {
        const end = page.locator("#app > div.user-wrap > div.end")
        const style = await end.getAttribute("style")
        if (style && style != "display:none") {
            break
        }
        await page.mouse.wheel(0, 1000)
        await delay(10 * 1000)
    }
    const posts = []
    const links = await page.locator("#app > div.user-wrap > div.post-items > div.post-item > a").all()
    for(const link of links) {
        const href = await link.getAttribute("href");
        if (href) {
            posts.push(href)
        }
    }
    for (const href of posts) {
        await page.goto(host+href, {waitUntil: 'domcontentloaded'})
        const slides = await page.locator("#app > div.wrap > div.post-content > div.swiper-container > div.swiper-wrapper > div.swiper-slide").all()
        const slideSet = new Set<string>()
        for (const slide of slides) {
            const src = await slide.locator("div.media-wrap > img").getAttribute("src")
            src && slideSet.add(src)
        }
        page.on("response", onResponse(slideSet));
        do {
            const nextBtn = page.locator("#app > div.wrap > div.post-content > div.swiper-container > div.swiper-button-next")
            const classes = await nextBtn.getAttribute("class")
            if (!classes || classes.indexOf("swiper-button-disabled")) {
                break
            }
            await nextBtn.click()
        }while(true)
        await wait(slideSet)
    }
});
