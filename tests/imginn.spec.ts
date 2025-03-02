import { Page, Response, test } from '@playwright/test';
import { writeFileSync } from 'fs';

const host = 'https://imginn.com';
const outputDir = "C:\\Users\\huang\\Downloads\\";

const prefix = RegExp("^https://.+\\.imginn\\.com/")

async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function onResponse(dir: string) {
    return async (resp: Response) => {
        const url = resp.url()
        if (prefix.test(url)) {
            const q = url.lastIndexOf("?")
            const uri = url.substring(0, q)
            console.info("matched: ", uri)
            const slash = uri.lastIndexOf("/")
            const filename = uri.substring(slash + 1)
            try {
                const buf = await resp.body()
                writeFileSync(outputDir+dir+filename, buf.toSorted())
            } catch(e: any) {
                console.error(e)
            }
        }
    }        
}

async function download(page: Page, site: string, dir: string) {
    await page.goto(site, {waitUntil: 'domcontentloaded'})
    page.on("response", onResponse(dir));
    // for (;true;) {
        const moreBtn = page.locator("body > div.page-user.container > button.load-more")
        const style = await moreBtn.getAttribute("style")
        if (style && style != "display: block;") {
            // break
        }
        await moreBtn.click({timeout: 10000})
        await delay(100 * 1000)
    // }
    const items = await page.locator("body > div.page-user > div.items > div.item").all()
    for(const item of items) {
        await item.click();
        const slides = await page.locator("body > div.page-post > div.show > div.swiper-container > div.swiper-wrapper > div.swiper-slide").all()
        const slideSet = new Set<string>()
        for (const slide of slides) {
            const src = await slide.getAttribute("data-src")
            src && slideSet.add(src)
        }
        for (let i = 0; i < slideSet.size; i++) {
            const nextBtn = page.locator("body > div.page-post > div.show > div > div.swiper-button-next")
            const disabled = await nextBtn.getAttribute("aria-disabled")
            if (disabled && disabled == "true") {
                break
            }
            await nextBtn.click()
            await delay(10 * 1000)
        }
        await delay(10 * 1000)
    }
}

test('zennyrt', async ({ page }) => {
    await download(page, 'https://imginn.com/zennyrt/', "zennyrt\\")
});

test('khovansiki', async ({ page }) => {
    await download(page, 'https://imginn.com/khovansiki/', "khovansiki\\")
});

test('demirose', async ({ page }) => {
    await download(page, 'https://imginn.com/demirose.fanpage/', "demirose\\")
});

test('demirosefans09', async ({ page }) => {
    await download(page, 'https://imginn.com/demirosefans09/', "demirose\\")
});

test('demirosesworld', async ({ page }) => {
    await download(page, 'https://imginn.com/demirosesworld/', "demirose\\")
});

test('demi_rose_2022', async ({ page }) => {
    await download(page, 'https://imginn.com/demi_rose_2022/', "demirose\\")
});

test('demirose.onlyfans.d', async ({ page }) => {
    await download(page, 'https://imginn.com/demirose.onlyfans.d/', "demirose\\")
});

test('onlyfabs_promote', async ({ page }) => {
    await download(page, 'https://imginn.com/onlyfabs_promote/', "onlyfabs_promote\\")
});

test('xort_bc', async ({ page }) => {
    await download(page, 'https://imginn.com/xort_bc/', "onlyfabs_promote\\")
});
