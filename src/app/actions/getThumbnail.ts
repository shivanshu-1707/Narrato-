import * as PDFJS from 'pdfjs-dist';

PDFJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS.version}/build/pdf.worker.min.mjs`;
// 
export const generateThumbnail = async (pdfBuffer: Buffer): Promise<Blob | null> => {
  try {
    console.log("Starting Generation : ");
    const pdf = await PDFJS.getDocument(new Uint8Array(pdfBuffer)).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to get 2D canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const base64Image = canvas.toDataURL('image/png');
    const blob = await (await fetch(base64Image)).blob();
    console.log("Generation complete");
    canvas.remove();
    return blob;
  } catch (error) {
    console.error('Error converting PDF buffer to image buffer:', error);
    return null;
  }
};


