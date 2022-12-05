export const FileStreamReader = () => {
  const reader = new FileReader();
  return (blob: Blob, offset = 0, length = blob.size) =>
    new Promise<Uint8Array>((resolve) => {
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      if (offset === 0 && length === blob.size) {
        reader.readAsArrayBuffer(blob);
      } else {
        reader.readAsArrayBuffer(blob.slice(offset, offset + length));
      }
    });
};