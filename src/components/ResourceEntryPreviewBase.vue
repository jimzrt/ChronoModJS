<template>
  <div
    class="text-white bg-gray-700 flex flex-col w-full h-full overflow-scroll rounded-lg"
  >
    <span class="p-2">
      {{ value.path }}
    </span>
    <Component
      :is="componentMap[value.type]"
      :value="value"
      :onGetData="onGetData"
      class="flex-1"
    />
    <div class="flex gap-2 w-full p-2">
      <button @click="download">Extract...</button><button>Replace...</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import ResourceEntryPreviewImage from "./ResourceEntryPreviewImage.vue";
import ResourceEntryPreviewText from "./ResourceEntryPreviewText.vue";
import ResourceEntryPreviewFont from "./ResourceEntryPreviewFont.vue";
import ResourceEntryPreviewUnsupported from "./ResourceEntryPreviewUnsupported.vue";
import { ResourceEntry, ResourceEntryType } from "../stores/ChronoStore";
import { downloadWithStreamsaver } from "../util/Download";
import streamsaver from "streamsaver";
import { makeZip } from 'client-zip'

const componentMap: Record<ResourceEntryType, any> = {
  image: ResourceEntryPreviewImage,
  text: ResourceEntryPreviewText,
  font: ResourceEntryPreviewFont,
  audio: ResourceEntryPreviewUnsupported,
  data: ResourceEntryPreviewUnsupported,
};
const props = defineProps<{
  value: ResourceEntry;
  onGetData: (resourceEntry: ResourceEntry) => Promise<Uint8Array>;
}>();

// const download = async () => {
//   const data = await props.onGetData(props.value);
//   const blob = new Blob([data], { type: "application/octet-stream" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   const path = props.value.path;
//   const filename = path.split("/").pop() || "file";
//   link.download = filename;
//   link.click();
// };

const download = async () => {
  const data = await props.onGetData(props.value);
  const path = props.value.path;
  const filename = path.split("/").pop() || "file";

  downloadWithStreamsaver(filename, data);
};
</script>
