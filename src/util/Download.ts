import streamsaver from 'streamsaver'

export const downloadWithStreamsaver = async (filename: string, data: Uint8Array) => {
  const fileStream = streamsaver.createWriteStream(filename);
  const writer = fileStream.getWriter();
  writer.write(data);
  writer.close();
}