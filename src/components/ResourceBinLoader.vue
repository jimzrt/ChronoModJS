<template>
  <input
    v-if="!resourceBinLoaded"
    type="file"
    accept=".bin"
    @change="onResourceBinFileChange"
  />
  <span v-else>Resource.bin loaded</span>
</template>
<script setup lang="ts">
import { computed, reactive } from "vue";
import { ResourceEntryType, useChronoStore } from "../stores/ChronoStore";
import { StreamGenerator } from "../util/FileStreamReader";
import pako from "pako";

const chronoStore = useChronoStore();
const resourceBinLoaded = computed(() => chronoStore.blob !== null);

const onResourceBinFileChange = async (e: Event) => {
  // get the file from the event
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  // empty the resourceEntries
  chronoStore.resourceEntries.splice(0, chronoStore.resourceEntries.length);
  chronoStore.blob = file;

  if (!(await validateHeader())) {
    alert("Invalid file");
    chronoStore.blob = file;
    return;
  }

  await loadResourceEntries();
};

const loadResourceEntries = async () => {
  const buffer = await chronoStore.readAndDecode(0, 16);
 // const streamGenerator = StreamGenerator(chronoStore.blob!);

  // get the size from the header
  const size_in_header = new DataView(buffer.buffer).getUint32(4, true);
  // get the offset from the header
  const offset_header = new DataView(buffer.buffer).getUint32(8, true);
  // get the compressed length from the header
  const compressed_length_header = new DataView(buffer.buffer).getUint32(
    12,
    true
  );
  console.log("size in header: " + size_in_header);
  console.log("offset: " + offset_header);
  console.log("compressed length: " + compressed_length_header);

  const header_buffer = await chronoStore.readAndDecode(
    offset_header,
    compressed_length_header
  );
  const uncompressed_length_header = new DataView(
    header_buffer.buffer
  ).getUint32(0, false);
  console.log("uncompressed length: " + uncompressed_length_header);

  const uncompressed_buffer = pako.inflate(header_buffer.slice(4));

  const entry_count = new DataView(uncompressed_buffer.buffer).getUint32(
    0,
    true
  );
  console.log("entry count: " + entry_count);
  let offset = 4;
  for (let i = 0; i < entry_count; ++i) {
    const path_name_offset = new DataView(uncompressed_buffer.buffer).getUint32(
      offset,
      true
    );
    offset += 4;
    const entry_offset = new DataView(uncompressed_buffer.buffer).getUint32(
      offset,
      true
    );
    offset += 4;
    const entry_size = new DataView(uncompressed_buffer.buffer).getUint32(
      offset,
      true
    );
    offset += 4;
    const pathLength = uncompressed_buffer.indexOf(0, path_name_offset);
    const path = new TextDecoder().decode(
      uncompressed_buffer.slice(path_name_offset, pathLength)
    );
    const entryExtension = path.split(".").pop();
    let entryType: ResourceEntryType = "data";
    switch (entryExtension) {
      case "bmp":
      case "png":
        entryType = "image";
        break;
      case "lst":
      case "txt":
        entryType = "text";
        break;
      case "sab":
        entryType = "audio";
        break;
      case "dat":
      case "bin":
      case "BIN":
      case "config":
      case "scn":
      case "cel":
      default:
        entryType = "data";
    }
    if (path.toLocaleLowerCase().startsWith("string_")) {
      entryType = "font";
    }
    const resourceEntry = {
      index: i + 1,
      path,
      offset: entry_offset,
      size: entry_size,
      type: entryType,
    };
    chronoStore.resourceEntries.push(resourceEntry);

    // const buffer = await streamGenerator.read(entry_offset, 4);
    // chronoStore.decode(entry_offset, 4, buffer);
    // const view = new DataView(buffer.buffer);
    // const size = view.getUint32(0, false);
    // finalSize += size;
    // const size2 =  await chronoStore.getUncompressedSize(resourceEntry);
    // console.log("size: " + size + " size2: " + size2);


     // finalSize += await chronoStore.getUncompressedSize(resourceEntry);

    //   const buffer = await decode_input(resourceEntry.offset, 4);
    // const view = new DataView(buffer.buffer);
    // return view.getUint32(0, false);


  }
};

const validateHeader = async () => {
  if (!chronoStore.blob === null) return false;
  const magic_header = "ARC1";
  const buffer = await chronoStore.readAndDecode(0, 16);
  // convert the buffer to a string
  const header = new TextDecoder().decode(buffer.slice(0, 4));
  // check if the header matches the magic header
  if (header !== magic_header) {
    return false;
  }

  return true;
};
</script>
