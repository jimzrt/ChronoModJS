<template>
  <OverlayPanel
    :show="show"
    :closable="false"
    :transparent="false"
    @close="$emit('close')"
  >
    <div class="w-full h-full flex items-center justify-center align-middle">
      <div class="flex flex-col gap-2 p-8">
        <span class="text-white pb-4 text-lg"
          >Open Chrono Trigger.exe and resources.bin (steamapps\common\Chrono Trigger)</span
        >
        <ChronoExeLoader />
        <ResourceBinLoader />
      </div>
    </div>
  </OverlayPanel>
</template>
<script setup lang="ts">
import OverlayPanel from "./ui/OverlayPanel.vue";
import ResourceBinLoader from "./ResourceBinLoader.vue";
import ChronoExeLoader from "./ChronoExeLoader.vue";
defineProps<{
  show: boolean;
}>();
defineEmits<{ close: () => void }>();
</script>
