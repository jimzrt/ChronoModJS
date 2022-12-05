<template>
  <div class="overflow-scroll whitespace-pre">
    {{ selectedText }}
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ResourceEntry } from "../stores/ChronoStore";

const props = defineProps<{
  value: ResourceEntry;
  onGetData: (resourceEntry: ResourceEntry) => Promise<Uint8Array>;
}>();

const selectedText = ref("");

const getText = async () => {
  const uncompressedBuffer = await props.onGetData(props.value);
  return new TextDecoder().decode(uncompressedBuffer);
};

const setupData = async () => {
  selectedText.value = await getText();
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
