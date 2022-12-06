<template>
  <div class="min-h-full">
    <Popover
      as="header"
      class="pb-24 bg-slate-600"
      v-slot="{ open }: { open: boolean }"
    >
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div
          class="relative py-5 flex items-center justify-center lg:justify-between"
        >
          <!-- Logo -->
          <div class="flex-shrink-0 static">
            <a href="#">
              <span class="sr-only">Logo</span>
              <img class="h-8 w-auto" src="./assets/logo.ico" alt="Logo" />
            </a>
          </div>
          <div class="flex flex-wrap">
          <ResourceBinLoader />
          <ChronoExeLoader />
        </div>
          <!-- Right section on desktop -->
          <div class="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
            <Menu as="div" class="ml-4 relative flex-shrink-0">
              <div>
                <MenuButton class="bg-white">
                  <span class="sr-only">Open user menu</span>
                  <!-- <img class="h-8 w-8 rounded-full" :src="user.imageUrl" alt="" /> -->
                  <span>Patch</span>
                </MenuButton>
              </div>
              <transition
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in patchMenu"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <div
                      @click="item.onClick"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                    >
                      {{ item.name }}
                    </div>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>

            <Menu as="div" class="ml-4 relative flex-shrink-0">
              <div>
                <MenuButton class="bg-white">
                  <span class="sr-only">Open user menu</span>
                  <!-- <img class="h-8 w-8 rounded-full" :src="user.imageUrl" alt="" /> -->
                  <span class="px-2 py-1">Tools</span>
                </MenuButton>
              </div>
              <transition
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in toolsMenu"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <div
                      @click="item.onClick"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                    >
                      {{ item.name }}
                    </div>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Search -->
          <div class="flex-1 min-w-4 pr-2 lg:hidden">
            <div class="max-w-xs w-full mx-auto">
              <label for="desktop-search" class="sr-only">Search</label>
              <div class="relative text-white focus-within:text-gray-600">
                <div
                  class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="desktop-search"
                  class="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                  v-model="search"
                />
              </div>
            </div>
          </div>

          <!-- Menu button -->
          <div class=" flex-shrink-0 lg:hidden">
            <!-- Mobile menu button -->
            <PopoverButton
              class="bg-transparent p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon
                v-if="!open"
                class="block h-6 w-6"
                aria-hidden="true"
              />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </PopoverButton>
          </div>
        </div>
        <div
          class="hidden lg:block border-t border-white border-opacity-20 py-5"
        >
          <div class="grid grid-cols-3 gap-8 items-center">
            <div class="col-span-2">
              <!-- <nav class="flex space-x-4">
                <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'text-white' : 'text-indigo-100', 'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10']" :aria-current="item.current ? 'page' : undefined">
                  {{ item.name }}
                </a>
              </nav> -->
              <div class="max-w-lg w-full flex">
                <div
                  class="flex-1 relative text-white focus-within:text-gray-600"
                >
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="mobile-search"
                    class="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                    v-model="search"
                  />
                </div>
                <span class="p-2 text-gray-100"
                  >{{ filteredResourceEntries.length }}/{{
                    chronoStore.resourceEntries.length
                  }}
                  Files</span
                >
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <TransitionRoot as="template" :show="open">
        <div class="lg:hidden">
          <TransitionChild
            as="template"
            enter="duration-150 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <PopoverOverlay class="z-20 fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <TransitionChild
            as="template"
            enter="duration-150 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <PopoverPanel
              focus
              class="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top"
              v-slot="{ close }: { close: () => void }"
            >
              <div
                class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200"
              >
                <div class="pt-3 pb-2">
                  <div class="flex items-center justify-between px-4">
                    <div>
                      <img
                        class="h-8 w-auto"
                        src="./assets/logo.ico"
                        alt="logo"
                      />
                    </div>
                    <div class="-mr-2">
                      <PopoverButton
                        class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      >
                        <span class="sr-only">Close menu</span>
                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                      </PopoverButton>
                    </div>
                  </div>
                  <div class="py-2 mt-2">
                    <div
                      class="flex items-center px-5 border-b border-gray-200 py-2 bg-gray-100"
                    >
                      <span class="font-semibold">Patch</span>
                    </div>
                    <div class="mt-3 px-2 space-y-1">
                      <div
                        v-for="item in patchMenu"
                        :key="item.name"
                        @click="
                          () => {
                            close();
                            item.onClick();
                          }
                        "
                        class="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pb-2">
                  <div
                    class="flex items-center px-5 border-b border-gray-200 py-2 bg-gray-100"
                  >
                    <span class="font-semibold">Tools</span>
                  </div>
                  <div class="mt-3 px-2 space-y-1">
                    <div
                      v-for="item in toolsMenu"
                      :key="item.name"
                      @click="
                        () => {
                          close();
                          item.onClick();
                        }
                      "
                      class="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </TransitionChild>
        </div>
      </TransitionRoot>
    </Popover>
    <main class="-mt-24 pb-8">
      <div class="max-w-3xl mx-auto px-2 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 class="sr-only">Page title</h1>
        <!-- Main 3 column grid -->
        <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          <!-- Left column -->
          <div class="grid grid-cols-1 gap-4 lg:col-span-2">
            <section aria-labelledby="section-1-title">
              <h2 class="sr-only" id="section-1-title">Section title</h2>
              <div class="rounded-lg bg-white shadow">
                  <!-- Your content -->
                  <div
                    class="bg-gray-700 w-full h-10 sm:rounded-t-md flex-shrink-0 flex px-4 sm:px-6 items-center text-white"
                  >
                    <div
                      class="w-14 flex gap-2 items-center cursor-pointer"
                      @click="() => changeSort('index')"
                    >
                      <span>Idx</span>
                      <span v-if="sortBy == 'index'"
                        ><Component
                          :is="
                            sortDirection == 'asc'
                              ? ChevronUpIcon
                              : ChevronDownIcon
                          "
                          class="w-4"
                      /></span>
                    </div>
                    <div
                      class="flex-1 flex gap-2 items-center cursor-pointer"
                      @click="() => changeSort('path')"
                    >
                      <span>Path</span>
                      <span v-if="sortBy == 'path'"
                        ><Component
                          :is="
                            sortDirection == 'asc'
                              ? ChevronUpIcon
                              : ChevronDownIcon
                          "
                          class="w-4"
                      /></span>
                    </div>
                    <div
                      class="w-[4.5rem] flex gap-2 items-center cursor-pointer"
                      @click="() => changeSort('size')"
                    >
                      <span>Size</span>
                      <span v-if="sortBy == 'size'"
                        ><Component
                          :is="
                            sortDirection == 'asc'
                              ? ChevronUpIcon
                              : ChevronDownIcon
                          "
                          class="w-4"
                      /></span>
                    </div>
                  </div>

                  <div
                    class="sm:rounded-b-md h-[500px] overflow-scroll"
                    v-bind="containerProps"
                  >
                    <ul
                      role="list"
                      class="divide-y divide-gray-200"
                      v-bind="wrapperProps"
                    >
                      <li
                        v-for="item in list"
                        :key="item.index"
                        style="height: 60px"
                      >
                        <div
                          class="px-4 py-4 sm:px-6 h-full w-full"
                          :class="
                            item.data == selectedResourceEntry
                              ? 'bg-gray-200'
                              : ''
                          "
                          @click="() => (selectedResourceEntry = item.data)"
                        >
                          <ResourceCard :value="item.data" />
                        </div>
                      </li>
                    </ul>
                  </div>
              </div>
            </section>
            <div class="flex flex-wrap px-2 gap-2">
              <button
                @click="() => toggleShowImages()"
                class="flex gap-2 items-center"
                :class="showImages ? '!bg-green-400/40' : ''"
              >
                <span><PhotoIcon class="w-4" /></span><span>Images</span>
              </button>
              <button
                @click="() => toggleShowText()"
                class="flex gap-2 items-center"
                :class="showText ? '!bg-green-400/40' : ''"
              >
                <span><DocumentTextIcon class="w-4" /></span><span>Text</span>
              </button>
              <button
                @click="() => toggleShowAudio()"
                class="flex gap-2 items-center"
                :class="showAudio ? '!bg-green-400/40' : ''"
              >
                <span><SpeakerWaveIcon class="w-4" /></span><span>Audio</span>
              </button>
              <button
                @click="() => toggleShowData()"
                class="flex gap-2 items-center"
                :class="showData ? '!bg-green-400/40' : ''"
              >
                <span><CircleStackIcon class="w-4" /></span><span>Data</span>
              </button>
              <button
                @click="() => toggleShowFont()"
                class="flex gap-2 items-center"
                :class="showFont ? '!bg-green-400/40' : ''"
              >
                <span><LanguageIcon class="w-4" /></span><span>Font</span>
              </button>
              <button
                @click="() => extractAll()"
                class="flex gap-2 items-center"
              >
                <span><ArrowDownTrayIcon class="w-4" /></span
                ><span>Extract All</span>
              </button>
            </div>
          </div>

          <!-- Right column -->
          <div
            class="grid grid-cols-1 gap-4"
            v-if="selectedResourceEntry != null"
          >
            <section aria-labelledby="section-2-title">
              <h2 class="sr-only" id="section-2-title">Section title</h2>
              <div
                class="rounded-lg bg-gray-700 shadow max-w-xl min-h-[300px] max-h-[500px] overflow-scroll"
              >
                <ResourceEntryPreviewBase
                  :value="selectedResourceEntry"
                  :onGetData="
                    (entry) => readDecodeAndDecompress(entry.offset, entry.size)
                  "
                />
              </div>
              <div class="flex gap-2 w-full p-2">
                <button
                  @click="
                    () =>
                      selectedResourceEntry && extract(selectedResourceEntry)
                  "
                >
                  Extract...</button
                ><button>Replace...</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div
          class="border-t border-gray-200 py-8 text-sm text-gray-500 text-center sm:text-left"
        >
          <span class="block sm:inline">&copy; 2022 jimzrt</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  CircleStackIcon,
  LanguageIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import ResourceBinLoader from "./components/ResourceBinLoader.vue";
import ChronoExeLoader from "./components/ChronoExeLoader.vue";
import ResourceCard from "./components/ResourceCard.vue";
import ResourceEntryPreviewBase from "./components/ResourceEntryPreviewBase.vue";
import { useVirtualList, useToggle } from "@vueuse/core";
import { ResourceEntry, useChronoStore } from "./stores/ChronoStore";
import { computed, ref, watch } from "vue";
import { downloadWithBlob } from "./util/Download";
import { downloadZip, makeZip } from "client-zip";
import streamsaver from "streamsaver";

const chronoStore = useChronoStore();

const search = ref("");

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

const extract = async (entry: ResourceEntry) => {
  const data = await readDecodeAndDecompress(entry.offset, entry.size);
  const path = entry.path;
  const filename = path.split("/").pop() || "file";

  downloadWithBlob(filename, data);
};

const extractAll = async () => {
  const dataGenerator = async function* () {
    for (const entry of chronoStore.resourceEntries) {
      const data = await readDecodeAndDecompress(entry.offset, entry.size);
      yield { name: entry.path, input: data };
    }
  };

  streamsaver.mitm = "mitm.html";
  const fileStream = streamsaver.createWriteStream("resourcebin.zip");
  await makeZip(dataGenerator()).pipeTo(fileStream);

  // const zip = await downloadZip(dataGenerator()).blob();
  // const url = URL.createObjectURL(zip);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "resourcebin.zip";
  // a.click();
  // // cleanup
  // URL.revokeObjectURL(url);
};

const onLoadPatch = () => {
  console.log("onLoadPatch");
};

const onSavePatch = () => {
  console.log("onSavePatch");
};

const onReplaceFont = () => {
  console.log("Replace font");
};

const onApplyDefilter = () => {
  console.log("Apply defilter");
};

const patchMenu = [
  { name: "Load Patch...", onClick: onLoadPatch },
  { name: "Save Patch...", onClick: onSavePatch },
];
const toolsMenu = [
  { name: "Replace Font...", onClick: onReplaceFont },
  { name: "Apply Defilter...", onClick: onApplyDefilter },
];
</script>
