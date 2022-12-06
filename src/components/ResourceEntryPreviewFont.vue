<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <ChronoExeLoader v-if="!keyLoaded" />
    <Spinner v-else-if="loading" />
    <h2 v-else id="fontPreview" class="p-2">
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    </h2>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { decryptFile, generateKey } from "../util/Crypto";
import { ResourceEntry, useChronoStore } from "../stores/ChronoStore";
import ChronoExeLoader from "./ChronoExeLoader.vue";
import Spinner from "./ui/Spinner.vue";

const props = defineProps<{
  value: ResourceEntry;
  onGetData: (resourceEntry: ResourceEntry) => Promise<Uint8Array>;
}>();

const chronoStore = useChronoStore();
const keyLoaded = computed(() => chronoStore.keyBuffer !== null);
const loading = ref(false);

let abortController = new AbortController();

onMounted(() => {
  setupData({ signal: abortController.signal });
});

const setupData = async ({ signal }: { signal: AbortSignal }) => {
  if (chronoStore.keyBuffer === null) {
    return;
  }
  try {
    loading.value = true;
    const encrypted = await props.onGetData(props.value);
    const data = decryptFile(chronoStore.keyBuffer, encrypted);

    const blob = new Blob([data], { type: "font/ttf" });
    const url = URL.createObjectURL(blob);

    if (signal.aborted) {
      return;
    }

    // // load the font
    const font = new FontFace("Chrono", `url(${url})`);
    await font.load();

    if (signal.aborted) {
      return;
    }
    (document.fonts as any).add(font);

    // use the font
    // const fontPreview = document.querySelector("#fontPreview");
    // if (fontPreview) {
    //   (fontPreview as HTMLElement).style.fontFamily = "Chrono";
    // }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

  console.log("font loaded");
};

watch(
  () => [props.value, chronoStore.keyBuffer],
  () => {
    abortController.abort();
    abortController = new AbortController();
    setupData({ signal: abortController.signal });
  }
);
</script>
<style scoped>
#fontPreview {
  font-family: "Chrono";
}
</style>