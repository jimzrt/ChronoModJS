<template>
  <!-- create a file input form, only accept .bin files -->
  <div class="flex gap-x-4 mb-4">
    <ResourceBinLoader />
    <ChronoExeLoader />
  </div>
  <div class="flex w-full gap-4" style="height: 700px">
    <!-- display resourceEntries -->
    <div
      class="flex flex-col w-[60%]"
      v-if="chronoStore.resourceEntries.length > 0"
    >
        <span class="p-2">{{filteredResourceEntries.length}}/{{chronoStore.resourceEntries.length}} Files</span>
      <input
        type="text"
        v-model="search"
        placeholder="Search"
        class="mb-2 p-2 sm:rounded-md"
      />
      <div
        class="bg-gray-700 w-full h-10 sm:rounded-t-md flex-shrink-0 flex px-4 sm:px-6 items-center"
      >
        <div
          class="w-[10%] flex gap-2 items-center cursor-pointer"
          @click="() => changeSort('index')"
        >
          <span>Idx</span>
          <span v-if="sortBy == 'index'"
            ><Component
              :is="sortDirection == 'asc' ? ChevronDownIcon : ChevronUpIcon"
              class="w-4"
          /></span>
        </div>
        <div
          class="w-[75%] flex gap-2 items-center cursor-pointer"
          @click="() => changeSort('path')"
        >
          <span>Path</span>
          <span v-if="sortBy == 'path'"
            ><Component
              :is="sortDirection == 'asc' ? ChevronDownIcon : ChevronUpIcon"
              class="w-4"
          /></span>
        </div>
        <div
          class="w-[15%] flex gap-2 items-center cursor-pointer"
          @click="() => changeSort('size')"
        >
          <span>Size</span>
          <span v-if="sortBy == 'size'"
            ><Component
              :is="sortDirection == 'asc' ? ChevronDownIcon : ChevronUpIcon"
              class="w-4"
          /></span>
        </div>
      </div>
      <div
        class="bg-white shadow overflow-hidden sm:rounded-b-md"
        v-bind="containerProps"
      >
        <ul role="list" class="divide-y divide-gray-200" v-bind="wrapperProps">
          <li v-for="item in list" :key="item.index" style="height: 60px">
            <div
              class="px-4 py-4 sm:px-6 h-full w-full"
              :class="item.data == selectedResourceEntry ? 'bg-gray-200' : ''"
              @click="() => (selectedResourceEntry = item.data)"
            >
              <ResourceCard :value="item.data" />
            </div>
          </li>
        </ul>
      </div>
      <div class="flex p-2 gap-2">
        <button
          @click="() => toggleShowImages()"
          class="flex gap-2 items-center"
          :class="showImages ? 'bg-green-400/40' : ''"
        >
          <span><PhotoIcon class="w-4" /></span><span>Images</span>
        </button>
        <button
          @click="() => toggleShowText()"
          class="flex gap-2 items-center"
          :class="showText ? 'bg-green-400/40' : ''"
        >
          <span><DocumentTextIcon class="w-4" /></span><span>Text</span>
        </button>
        <button
          @click="() => toggleShowAudio()"
          class="flex gap-2 items-center"
          :class="showAudio ? 'bg-green-400/40' : ''"
        >
          <span><SpeakerWaveIcon class="w-4" /></span><span>Audio</span>
        </button>
        <button
          @click="() => toggleShowData()"
          class="flex gap-2 items-center"
          :class="showData ? 'bg-green-400/40' : ''"
        >
          <span><CircleStackIcon class="w-4" /></span><span>Data</span>
        </button>
        <button
          @click="() => toggleShowFont()"
          class="flex gap-2 items-center"
          :class="showFont ? 'bg-green-400/40' : ''"
        >
          <span><LanguageIcon class="w-4" /></span><span>Font</span>
        </button>
        <button @click="() => extractAll()" class="flex gap-2 items-center">
          <span><ArrowDownTrayIcon class="w-4" /></span><span>Extract All</span>
        </button>
      </div>
    </div>
    <!-- preview resourceEntry -->
    <div v-if="selectedResourceEntry" class="w-[40%] h-full">
      <!-- <ResourcePreview :value="selectedResourceEntry" /> -->
      <ResourceEntryPreviewBase
        :value="selectedResourceEntry"
        :onGetData="(entry) => readDecodeAndDecompress(entry.offset, entry.size)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import ResourceCard from "./ResourceCard.vue";
import ResourceEntryPreviewBase from "./ResourceEntryPreviewBase.vue";
import { useVirtualList, useToggle, containsProp } from "@vueuse/core";
import { ResourceEntry, useChronoStore } from "../stores/ChronoStore";
import ResourceBinLoader from "./ResourceBinLoader.vue";
import ChronoExeLoader from "./ChronoExeLoader.vue";
import {
  PhotoIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  CircleStackIcon,
  LanguageIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import streamsaver from "streamsaver";
import { makeZip } from "client-zip";

defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const chronoStore = useChronoStore();

const search = ref("");

//const resourceEntries: ResourceEntry[] = reactive([]);
const selectedResourceEntry = ref<ResourceEntry | null>(null);

const [showImages, toggleShowImages] = useToggle(true);
const [showAudio, toggleShowAudio] = useToggle(true);
const [showText, toggleShowText] = useToggle(true);
const [showData, toggleShowData] = useToggle(true);
const [showFont, toggleShowFont] = useToggle(true);

const sortBy = ref<"index" | "path" | "size">("index");
const sortDirection = ref<"asc" | "desc">("asc");

const changeSort = (sort: "index" | "path" | "size") => {
  if (sortBy.value == sort) {
    sortDirection.value = sortDirection.value == "asc" ? "desc" : "asc";
  } else {
    sortBy.value = sort;
    sortDirection.value = "asc";
  }
};

const extractAll = async () => {
  const dataGenerator = async function* () {
    for (const entry of chronoStore.resourceEntries) {
      const data = await readDecodeAndDecompress(entry.offset, entry.size);
      yield { name: entry.path, input: data };
    }
  };
  // const metadataGenerator = function* () {
  //   for(const entry of chronoStore.resourceEntries) {
  //     yield { name: entry.path, size: entry.size };
  //   }
  // }
  // const packedSize = predictLength(metadataGenerator());
  streamsaver.mitm = 'mitm.html'
  const fileStream = streamsaver.createWriteStream("resourcebin.zip");
  await makeZip(dataGenerator()).pipeTo(fileStream);
};

const filteredResourceEntries = computed(() => {
  return chronoStore.resourceEntries
    .filter((entry) => {
      if (!showImages.value && entry.type === "image") return false;
      if (!showAudio.value && entry.type === "audio") return false;
      if (!showText.value && entry.type === "text") return false;
      if (!showData.value && entry.type === "data") return false;
      if (!showFont.value && entry.type === "font") return false;
      return (
        search.value === "" ||
        entry.path.toLowerCase().includes(search.value.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy.value == "index") {
        return sortDirection.value == "asc"
          ? a.index - b.index
          : b.index - a.index;
      } else if (sortBy.value == "path") {
        return sortDirection.value == "asc"
          ? a.path.localeCompare(b.path)
          : b.path.localeCompare(a.path);
      } else if (sortBy.value == "size") {
        return sortDirection.value == "asc" ? a.size - b.size : b.size - a.size;
      }
      return 0;
    });
});

const { list, containerProps, wrapperProps } = useVirtualList(
  filteredResourceEntries,
  {
    itemHeight: 60,
  }
);

watch(filteredResourceEntries, () => {
  if (containerProps.ref.value) {
    containerProps.ref.value.scrollTop = 0;
  }
});

const readDecodeAndDecompress = async (offset: number, size: number) => {
  return chronoStore.readDecodeAndDecompress(offset, size);
};
</script>
