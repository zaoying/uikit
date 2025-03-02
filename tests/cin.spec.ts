import { test } from '@playwright/test';
import { writeFileSync } from 'fs';
import { SaveAsPDF } from './download';

const site = 'https://cin.wtf/g/19611';
const outputDir = "C:\\Users\\huang\\Downloads\\";

test('download', async ({ page }) => {
    const filter = (url: string) => url.includes("kontol.online/api/")
    const downloader = await SaveAsPDF(page, filter, site, "domcontentloaded")
    await downloader.onStart(page)
    while(true) {
        const download = await page.waitForEvent('download');
        const filename = download.suggestedFilename()
        if (filename.endsWith(".pdf")) {
            const pdfBytes = await downloader.onEnd(page)
            writeFileSync(outputDir + filename, pdfBytes)
            break
        }
    }
});
