export const convertUrlToFile = async (filename: string, url: string): Promise<File | undefined> => {
  const res = await fetch(url, {
    headers: {
      'Sec-Fetch-Dest': 'image',
    },
  });
  const statusCode = String(res.status);
  const hasError = statusCode.startsWith('4') || statusCode.startsWith('5');
  if (hasError) {
    return;
  }

  const buf = await res.arrayBuffer();
  /**
   * @todo add type inferrance
   */
  const file = new File([buf], filename, { type: 'image/jpeg' });
  return file;
};
