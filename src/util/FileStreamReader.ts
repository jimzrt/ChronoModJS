export const FileStreamReader = () => {
  const reader = new FileReader();
  const read = (blob: Blob, offset = 0, length = blob.size) =>
    new Promise<Uint8Array>((resolve) => {
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      if (offset === 0 && length === blob.size) {
        reader.readAsArrayBuffer(blob);
      } else {
        reader.readAsArrayBuffer(blob.slice(offset, offset + length));
      }
    });

    return { read };
};

export const StreamGenerator = (blob: Blob) => {
  const stream = blob.stream();
  const reader = stream.getReader();
  let currentOffset = 0;
  let dataBuffer = new Uint8Array(0);
  const read = async (offset: number, length: number) => {

    while(true){

      // // requested data begins before current buffer and ends before current buffer
      // if (offset < currentOffset && offset + length < currentOffset) {
      //   return dataBuffer.slice(offset - currentOffset, offset - currentOffset + length);
      // }

      // const { done, value } = await reader.read();
      // if (done || !value) {
      //   throw new Error("Offset out of range");
      // }

      // console.log("chunk size", value.byteLength);

      // // requested data is after current buffer
      // if (offset >= currentOffset + value.length) {
      //   //console.log("requested data is after current buffer");
      //   currentOffset += value.length;
      //   continue;
      // }

      // // requested data is within current buffer
      // if (offset >= currentOffset && offset + length <= currentOffset + value.length) {
      //   //console.log("requested data is within current buffer");
      //   const ret = value.slice(offset - currentOffset, offset - currentOffset + length);
      //   currentOffset += value.length;
      //   // put back the rest of the buffer
      //   dataBuffer = value.slice(offset - currentOffset + length);
      //   return ret;
      // }



      // // requested data begins before current buffer and ends within current buffer
      // if (offset < currentOffset && offset + length <= currentOffset + value.length) {
      //   console.log("requested data begins before current buffer and ends within current buffer");
      //   const ret = value.slice(0, offset + length);
      //   currentOffset += value.length;
      //   // put back the rest of the buffer
      //   dataBuffer = value.slice(offset + length);
      //   return ret;
      // }

      // // requested data begins in current buffer and ends after current buffer, so nothing is returned and we put back the rest of the buffer
      // if (offset >= currentOffset && offset + length > currentOffset + value.length) {
      //   console.log("requested data begins in current buffer and ends after current buffer");
      //   dataBuffer = value.slice(offset - currentOffset + length);
      //   currentOffset += value.length;
      //   continue;
      // }

      // // requested data begins before current buffer and ends after current buffer, so nothing is returned and we append to the buffer
      // if (offset < currentOffset && offset + length > currentOffset + value.length) {
      //   console.log("requested data begins before current buffer and ends after current buffer");
      //   dataBuffer = new Uint8Array(dataBuffer.length + value.length);
      //   dataBuffer.set(dataBuffer.slice(offset - currentOffset));
      //   dataBuffer.set(value, dataBuffer.length);
      //   currentOffset += value.length;
      //   continue;
      // }

      throw new Error("Not implemented");

    }
  }
  return { read };
}