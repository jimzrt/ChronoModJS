import streamsaver from 'streamsaver'

export const downloadWithStreamsaver = async (filename: string, data: Uint8Array) => {
  const fileStream = streamsaver.createWriteStream(filename);
  const writer = fileStream.getWriter();
  writer.write(data);
  writer.close();
}

export const downloadWithBlob = (filename: string, data: Uint8Array) => {
  const blob = new Blob([data]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}