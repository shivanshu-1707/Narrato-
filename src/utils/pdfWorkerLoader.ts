import * as pdfjsLib from "pdfjs-dist"

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdf.worker.min.js",
  import.meta.url
).toString();

export default pdfjsLib;
