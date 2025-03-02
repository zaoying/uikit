import UPNG from '@pdf-lib/upng';
import { Page } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { Response } from 'playwright-core';
import webp from 'webp-wasm';

interface Interceptor {
    onRequest(req: Request): Promise<void>;
    onResponse(resp: Response): Promise<void>;
}

type Condition = "load"|"domcontentloaded"|"networkidle"|"commit";

type Filter = (url: string) => boolean


async function addJPG(pdfDoc: PDFDocument, pageMap: Map<number,number>, pageNum: number, jpg: ArrayBuffer) {
    const jpgImage = await pdfDoc.embedJpg(jpg)
    const jpgDims = jpgImage.scale(0.6)

    const index = pdfDoc.getPageCount()
    const page = pdfDoc.addPage()
    page.drawImage(jpgImage, {
        x: page.getWidth() / 2 - jpgDims.width / 2,
        y: 50,
        width: jpgDims.width,
        height: jpgDims.height,
    })
    pageMap.set(pageNum, index);
}

async function addPNG(pdfDoc: PDFDocument, pageMap: Map<number,number>, pageNum: number, png: ArrayBuffer) {
    const image = await pdfDoc.embedPng(png)
    const dims = image.scale(0.6)

    const index = pdfDoc.getPageCount()
    const page = pdfDoc.addPage()
    page.drawImage(image, {
        x: page.getWidth() / 2 - dims.width / 2,
        y: 50,
        width: dims.width,
        height: dims.height,
    })
    pageMap.set(pageNum, index);
}

async function addWebP(pdfDoc: PDFDocument, pageMap: Map<number,number>, pageNum: number, buf: ArrayBuffer) {
   webp.decode(buf, async function(err: Error, img: any) {
        const temp = UPNG.encode([img.data], img.width, img.height, 0)
        const image = await pdfDoc.embedPng(temp)
        const dims = image.scale(0.6)

        const index = pdfDoc.getPageCount()
        const page = pdfDoc.addPage()
        page.drawImage(image, {
            x: page.getWidth() / 2 - dims.width / 2,
            y: 50,
            width: dims.width,
            height: dims.height,
        })
        pageMap.set(pageNum, index);
    })
}

export type ImageFormat = "JPG" | "PNG" | "BMP" | "WEBP" | "UNKNOWN";

type OnImageReceived = (format: ImageFormat, filename: string, body: Buffer) => Promise<void>

export function ImageInterceptor(filter: Filter, callback: OnImageReceived): Interceptor {
    return {
        async onRequest(req) {
            
        },
        async onResponse(resp) {            
            const url = resp.url()
            console.info(url)
            if (filter(url)) {
                const slash = url.lastIndexOf("/")
                const filename = url.substring(slash + 1)
                const dot = url.lastIndexOf(".")
                const suffix = url.substring(dot + 1)
                try{
                    const buf = await resp.body()
                    switch (suffix) {
                        case "jpg":
                        case "JPG":
                        case "jpeg":
                        case "JPEG":
                            await callback("JPG", filename, buf)
                            break;
                        case "png":
                        case "PNG":
                            await callback("PNG", filename, buf)
                            break;
                        case "bmp":
                        case "BMP":
                            await callback("BMP", filename, buf)
                            break;
                        case "webp":
                        case "WEBP":
                            await callback("WEBP", filename, buf)
                            break
                        default:
                            break;
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
}
async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const sort = async (pageMap: Map<number, number>, src: PDFDocument) => {
    const sorted = await PDFDocument.create()
    for (let i = 1; i <= pageMap.size; i ++ ) {
        const pageNum = pageMap.get(i)
        if (pageNum) {
            const [clone] = await sorted.copyPages(src, [pageNum])
            sorted.addPage(clone)
        }
        
    }
    return sorted
}

export async function SaveAsPDF(page: Page, filter: Filter, target: string, cond?: Condition) {
    const pdfDoc = await PDFDocument.create();
    const pageMap = new Map<number, number>()
    const interceptor = ImageInterceptor(filter, async (format, filename, body) => {
        const segments = filename.split("/");
        const segs = segments[segments.length - 1].split(".")
        const pageNum = Number.parseInt(segs[0])
        switch (format) {
            case "JPG":
                await addJPG(pdfDoc, pageMap, pageNum, body)
                break;
            case "PNG":
                await addPNG(pdfDoc, pageMap, pageNum, body)
                break;
            case "WEBP":
                await addWebP(pdfDoc, pageMap, pageNum, body)
                break;
            default:
                break;
        }
    })

    await page.goto(target, {waitUntil: cond});
    page.on("response", interceptor.onResponse);

    return {
        ...interceptor,
        async onStart(page: Page) {
            await page.getByRole("button", {name: "Download All"}).click()
        },
        async onEnd(page: Page) {
            await delay(30000)
            const sorted = await sort(pageMap, pdfDoc)
            return sorted.save()
        },
    }
}
