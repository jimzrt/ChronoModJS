import pako from "pako";
import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { FileStreamReader } from "../util/FileStreamReader";

export type ResourceEntryType =
  | "image"
  | "text"
  | "audio"
  | "data"
  | "font"
export type ResourceEntry = {
  index: number;
  path: string;
  offset: number;
  size: number;
  type: ResourceEntryType;
};


export const useChronoStore = defineStore('counter', () => {
  const blob = ref<Blob|null>(null)
  const keyBuffer = ref<Uint32Array|null>(null)
  const resourceEntries = reactive<ResourceEntry[]>([])
  const reader = FileStreamReader();

  const decode = (offset: number, length: number, in_buffer: Uint8Array) => {
    let tmp = 0x19000000 + offset;
    for (let index = 0; index < length; ++index) {
      tmp = Math.imul(tmp, 0x41c64e6d) + 0x3039;
      in_buffer[index] = in_buffer[index] ^ (tmp >> 24);
    }
  };

  const readAndDecode = async (
    offset: number,
    length: number
  ): Promise<Uint8Array> => {
    if (blob.value === null) return new Uint8Array(length);
    if (blob.value.size < offset + length) return new Uint8Array(length);


    const buffer = await reader.read(blob.value, offset, length);
    decode(offset, length, buffer);
    return buffer;
  };

  const readDecodeAndDecompress = async (
    offset: number,
    length: number
  ): Promise<Uint8Array> => {
    const buffer = await readAndDecode(offset, length);
    const uncompressedBuffer = pako.inflate(buffer.slice(4));
    return uncompressedBuffer;
  };

  const getUncompressedSize = async (resourceEntry: ResourceEntry) => {
    const buffer = await readAndDecode(resourceEntry.offset, 4);
    const view = new DataView(buffer.buffer);
    return view.getUint32(0, false);
  }

  return { blob, keyBuffer, resourceEntries, getUncompressedSize, decode,  readAndDecode, readDecodeAndDecompress }
})
