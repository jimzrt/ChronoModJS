<template>
  <input v-if="!chronoExeLoaded" type="file" accept=".exe" @change="onChronoExeFileChange" />
  <span v-else>Chrono.exe loaded</span>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useChronoStore } from "../stores/ChronoStore";
import { generateKey } from "../util/Crypto";

const chronoStore = useChronoStore();
const chronoExeLoaded = computed(() => chronoStore.keyBuffer !== null);

const onChronoExeFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = async (event) => {
    const buffer = event.target?.result as ArrayBuffer;
    const chronoExeBufffer = new Uint8Array(buffer);
    const keybuffer = new Uint32Array(1043);
    generateKey(keybuffer, chronoExeBufffer);
    chronoStore.keyBuffer = keybuffer;
  };
  reader.readAsArrayBuffer(file);
};
</script>
