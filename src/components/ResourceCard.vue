<template>
  <!-- resource card with tailwind -->
  <div class="flex justify-between text-black">
    <div class="w-[10%]">{{props.value.index}}</div>
    <div class="w-[75%] flex gap-2 items-center"><span><Component :is="componentMap[props.value.type]" class="w-4"/></span><span>{{ props.value.path }}</span></div>
    <div class="w-[15%]">{{ formatSize(props.value.size) }}</div>
  </div>
</template>
<script setup lang="ts">
import { ResourceEntry, ResourceEntryType } from "../stores/ChronoStore";
import { PhotoIcon, SpeakerWaveIcon, DocumentTextIcon, CircleStackIcon, LanguageIcon } from "@heroicons/vue/24/outline";

const componentMap: Record<ResourceEntryType, any> = {
  image: PhotoIcon,
  text: DocumentTextIcon,
  font: LanguageIcon,
  audio: SpeakerWaveIcon,
  data: CircleStackIcon,
};

const props = defineProps<{ value: ResourceEntry }>();
const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};
</script>
