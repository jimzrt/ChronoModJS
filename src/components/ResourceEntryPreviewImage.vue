<template>
  <div class="w-full h-full">
    <!-- full width and height, but keep aspect ratio -->
  <img v-if="!loading" :src="selectedDataUrl" class="w-full h-full object-contain" />
</div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ResourceEntry } from "../stores/ChronoStore";

const props = defineProps<{
  value: ResourceEntry;
  onGetData: (resourceEntry: ResourceEntry) => Promise<Uint8Array>;
}>();

const selectedDataUrl = ref("");
const loading = ref(false);

const getDataUrl = async () => {
  const uncompressedBuffer = await props.onGetData(props.value);

  const blob = new Blob([uncompressedBuffer], { type: "image" });
  return URL.createObjectURL(blob);
};

const setupData = async () => {
  loading.value = true;
  selectedDataUrl.value = await getDataUrl();
  loading.value = false;
};

onMounted(() => {
  setupData();
});
watch(
  () => props.value,
  () => {
    setupData();
  }
);
</script>
