<template>
  <OverlayPanel :show="show" :closable="false" :transparent="true" @close="$emit('close')">
    <div class="w-full h-full flex items-center justify-center align-middle">
      <!-- show progress -->
      <div class="flex flex-col gap-2 p-8">
        <span class="text-white pb-4 text-lg">Zipping...</span>
        <div class="flex gap-2">
          <span class="font-bold text-white"
            >{{
              ((zipStatus.current * 100) / zipStatus.total).toFixed(2)
            }}%</span
          >
          <span class="text-white"
            >{{ zipStatus.current }}/{{ zipStatus.total }}</span
          >
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>
<script setup lang="ts">
import OverlayPanel from "./ui/OverlayPanel.vue";
defineProps<{
  show: boolean;
  zipStatus: { current: number; total: number };
}>();
defineEmits<{ close: () => void }>();
</script>
