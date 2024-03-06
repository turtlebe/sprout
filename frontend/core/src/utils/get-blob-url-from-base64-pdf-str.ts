export function generatePdf(pdfBase64Str: string) {
  const pdfDataUrl = 'data:application/pdf;base64,' + pdfBase64Str;
  const contentType = 'application/pdf';

  const byteCharacters = atob(pdfDataUrl.substr(`data:${contentType};base64,`.length));
  const byteArrays: Uint8Array[] = [];

  const sliceSize = 1024;
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}
