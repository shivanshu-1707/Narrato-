export function getFileIcon(mimeType:string):string{
  const icons: { [key: string]: string } = {
    'application/pdf': '/pdf.svg',        // PDF icon
    'application/vnd.ms-powerpoint': '/ppt.svg', // PPT icon
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '/ppt.svg', // PPTX icon
  };
  return icons[mimeType];
}