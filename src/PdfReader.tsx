import { PDFDocument } from 'pdf-lib';
import type { Sheet } from './App';

export async function mergePdfs(sheets: Sheet[], title: string) {
    const inputUrls = buildUrls(sheets)
    return fin(inputUrls).then(doc => saveFile(doc, title))
}

async function fin(urls: string[]) {
    return loadUrls(urls).then(mergeDocs)
}

function buildUrls(sheets: Sheet[]) {
    return sheets.map(sheet => `${import.meta.env.VITE_BACKEND}/files/${sheet.id}`)
}

async function saveFile(doc: PDFDocument, title: string) {
    const blob = await doc.save()
        .then(output => new Uint8Array(output))
        .then(output => new Blob([output], { type: 'application/pdf' }));
    const a = document.createElement('a')
    a.download = title
    a.href = URL.createObjectURL(blob)
    a.addEventListener('click', () => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
}

async function mergeDocs(documents: PDFDocument[]) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfDoc of documents) {
        const copiedPages = await mergedPdf.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return mergedPdf
}

async function loadUrls(urls: string[]) {
    const documents = urls.map(url => fetch(url)
        .then(res => {
            if (res.ok)
                return res.arrayBuffer()
            else
                throw Error(`Issues with URL ${url}`)
        })
        .then(PDFDocument.load)
    )
    return await Promise.all(documents)
}