import { Page, Response, test } from '@playwright/test';
import { writeFileSync } from 'fs';

const outputDir = "C:\\Users\\huang\\Downloads\\";

const prefix = RegExp("\\.jpg|JPG|jpeg|JPEG|png|PNG|bmp|BMP$")

async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function onResponse(dir: string) {
    return async (resp: Response) => {
        const url = resp.url()
        if (prefix.test(url)) {
            console.info("matched: ", url)
            const slash = url.lastIndexOf("/")
            const filename = url.substring(slash + 1)
            try {
                const buf = await resp.body()
                writeFileSync(outputDir+dir+filename, buf)
            } catch(e: any) {
                console.error(e)
            }
        }
    }        
}
async function download(page: Page, site: string, dir: string) {
    await page.goto(site, {waitUntil: 'domcontentloaded'})
    page.on("response", onResponse(dir));
    await delay(300 * 1000);
}

test('Nabokova', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-632.html', "Nabokova\\")
});

test('Breckie', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-11774.html', "Breckie\\")
});

test('pattama', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-602.html', "pattama\\")
});

test('Ashley', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-456.html', "Ashley\\")
});

test('Gatita', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-388.html', "Gatita\\")
});

test('Khovanski', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-564.html', "Khovanski\\")
});

test('Jeon', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-11522.html', "Jeon\\")
});

test('Elysia', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-11618.html', "Elysia\\")
});

test('Anastasia', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-262.html', "Anastasia\\")
});

test('Kiko', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-11586.html', "Kiko\\")
});

test('Demi', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-688.html', "Demi\\")
});

test('Cecilia', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-1006.html', "Cecilia\\")
});

test('Cortez', async ({ page }) => {
    await download(page, 'https://www.sparkladies.com/article-374.html', "Cortez\\")
});