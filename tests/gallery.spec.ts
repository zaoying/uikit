import { test } from '@playwright/test';
import { writeFileSync } from 'fs';
import { SaveAsPDF } from './download';

const outputDir = "C:\\Users\\huang\\Downloads\\";

async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

test('jukujo1', async ({ page }) => {
    const site = 'https://ahri-gallery.com/index.php?route=comic/reader&gk_id=a492VqUcuufQW4M06K%2FSdguAQMYj716qmAY1m1c1fj%2Bn6dNjT0l%2FYYMWBajbPsMogYeS0JHwggOvNv4zNhsAXic%2BTzxeXPpQgH85tcn1u52QF%2FIEm67q79y9wrAwAbBrva61Q4Jj1B35ww&c_id=cb563a1a54f1e28f079df8631df3ed85';
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "jukujo1.pdf", pdfBytes)
});

test('jukujo2', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=73cbeCdh52xqzcBbUYEHrRYTi2e7y8h4kI6FVKgSPPDPaFiecXMSRYWvkDrnpm3%2Bx%2BCOwmWPSfKBWJqre%2B9pEpR0fBJfXVvyMRIa3NHDoK7pCrbVvzJyVvn9BwiwuWD23P2oXsi64SF%2B6Q&c_id=0e1f0fff3bfa8e4079f76247eba61555"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "jukujo2.pdf", pdfBytes)
});

test('jukujo3', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=55cfzxMajR3%2FEGYzbVCs9J%2BQ0dd%2FDuHJuAYeYteWoU0NkJB1OANJ8OfScT9rW88LSdZKJmVE2ZLYItpli8PopJG9U0iE2HO82AYHu%2FbuzX9ON3uZAdlAmBUBIagSq9TxHqfGg22wANkolA&c_id=227a214d17ff199305ff531ff3e512d2"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "jukujo3.pdf", pdfBytes)
});

test('jukujo4', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=a4b0pDQsb46bS58Bjlg2%2BgtppIZqFkEz5zYAXTyzeIr4%2Ffy8MsfHP2Bci%2F7NYlyq0NpyBYzlaN1PBIYGCuJ5O76Z%2BDk2ru1sNxi1Vr6g5IVIaOvBj3uAWlUuuX1ci81UIZg1BQBPji%2FNmg&c_id=ed4fb0be53defca079de3eb82d954313"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "jukujo4.pdf", pdfBytes)
});

test('jukujo5', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=ee0eSFouUatOfB5G94d74u0N5BANQpILzaJPJ%2BWj9M8gR0Jw98cBdyOolALHWTuWSBeGASMpeQL9UWEY2RrUYp%2B9QiPflSp17ttcam7NuwZU%2F2N%2BctOb8AobSvKgqY1xoxPvSvvNmo19zA&c_id=f0321a4657563ab984f66386ea65e862"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "jukujo5.pdf", pdfBytes)
});

test('magic1', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=66a8LJ0N5RrrhnENrHG3%2FP5oH86VV4smUhGiL4GvpXD0yxC3Y307%2Fu%2FQPn7XBoXiPBtbz%2F5hA4s4S9asSWW9T8ActDokFRQzXU6NDU21sFhEFh9aThhoNoK%2FJqYF%2FM8k2rzQOBpej%2F7KQw&c_id=490246fee494ef27884e587bc3c1f334"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "magic1.pdf", pdfBytes)
});

test('magic2', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=8a90KaglfxLA%2FhspOhOPtywUFoXI7tmG5SXp3I4AY2RQ%2FgXkzfsqupJ1sTA07oP9OLLxzOBZFTERhHUUox26PrrsE5p0cgn7EnXwywnq0yUMGbxzrZDi5KuJKrtJi3wzRkpHBBj4BJYYsQ&c_id=a2a693de39b7468eff4433f9c4a4601f"
    const filter = (url: string) => url.startsWith("https://2.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "magic2.pdf", pdfBytes)
});

test('magic3', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=5f80PObFUjAtyCpAKgGjYKUOyGuiLdrnvg2jfy1jjjMLhhBaArFlGA9JwSkFbaznFM3D9%2BR%2FyXGbSIgQFC9KQAtZwjj9A7vhWHl%2F9qnvNyUPVaNY95ExpyCxVDc9GlUirIbeMd6lHJx27Q&c_id=8244197723603e9fca23cdec162ccf9d"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "magic3.pdf", pdfBytes)
});

test('mother', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=4645nbdBRx5CzXgj3a%2FmHC6iEKTK8zUKQyYlsDIMVdGHLeZkt6stMg4WowBaPIEthp8GolfUpKySrDtQ9PWqh6c4C2%2FqaEkgpMXBUNChHVQsCzPbLoaikfw2HEhh1ptwX7cbiMajmb1jdA&c_id=bb1c76411f62e839ec5957fe11c634c2"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "mother.pdf", pdfBytes)
});

test('mother1', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=a75dlwgw6O7R0uETawFckNc3AmGTfqqCTRAzPrhbr7fYUB1AktuUWCdGXH6gqa6luIt4kTAU8lhctSb4zv6jaYxczh2UJTShooEMGG1uOmehMsdwaaROvOq%2BsiV7vRte7%2FBGf7Whg7z%2B&c_id=0b93c362aa2261b849369950d06e7c03"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "mother1.pdf", pdfBytes)
});

test('mother2', async ({ page }) => {
    const site = "https://ahri-gallery.com/index.php?route=comic/reader&gk_id=47a1eKNczH1EC7mfKFmsVmq3vKhBZ6B3bTuihNbukrvvflx0Y5748ohosfB4ocdwt9PMk1F0xCwwVBHKN3Obyl0Q5x5p%2F1Apsro0ar5ZUtHPcDprjojU7IoxqwuFHIUcvY3Zzd4KjXLQSQ&c_id=7ae295c526159ea22d333b8afb86bd83"
    const filter = (url: string) => url.startsWith("https://1.ahri-gallery.com/image/thumbnail/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await delay(20 * 1000)
    let pages = await page.locator("#page_num1 > div > a").all()
    console.info("pages: ", pages.length)
    pages = pages.slice(1, pages.length)
    for (const p of pages) {
        await p.click()
        await delay(20 * 1000)
    }
    const pdfBytes = await downloader.onEnd(page)
    writeFileSync(outputDir + "mother2.pdf", pdfBytes)
});
