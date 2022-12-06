<template>
  <!-- resource card with tailwind -->
  <div class="flex flex-wrap w-full h-full text-black items-center text-sm lg:text-base">
    <div class="w-14">{{props.value.index}}</div>
    <div class="flex-1 flex gap-2 items-center">
      <span><Component :is="componentMap[props.value.type]" class="w-4"/></span>
      <span class="hidden lg:block">{{ props.value.path }}</span>
      <span class="block lg:hidden">{{ extractFileName(props.value.path) }}</span>
    </div>
    <div class="w-[4.5rem]">{{ formatSize(props.value.size) }}</div>
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

const extractFileName = (path: string) => {
  const split = path.split("/")
  if(split.length > 1){
    return "../" + split[split.length - 1]
  }
  return split[split.length - 1]
};

const props = defineProps<{ value: ResourceEntry }>();
const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};
</script>
