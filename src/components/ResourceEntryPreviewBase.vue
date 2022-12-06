<template>
  <div
    class="text-white  flex flex-col w-full h-full  pb-4"
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

  </div>
</template>
<script setup lang="ts">
import ResourceEntryPreviewImage from "./ResourceEntryPreviewImage.vue";
import ResourceEntryPreviewText from "./ResourceEntryPreviewText.vue";
import ResourceEntryPreviewFont from "./ResourceEntryPreviewFont.vue";
import ResourceEntryPreviewUnsupported from "./ResourceEntryPreviewUnsupported.vue";
import { ResourceEntry, ResourceEntryType } from "../stores/ChronoStore";

const componentMap: Record<ResourceEntryType, any> = {
  image: ResourceEntryPreviewImage,
  text: ResourceEntryPreviewText,
  font: ResourceEntryPreviewFont,
  audio: ResourceEntryPreviewUnsupported,
  data: ResourceEntryPreviewUnsupported,
};
defineProps<{
  value: ResourceEntry;
  onGetData: (resourceEntry: ResourceEntry) => Promise<Uint8Array>;
}>();


</script>
