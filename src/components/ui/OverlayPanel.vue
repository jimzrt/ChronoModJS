<template>
  <div id="overlayPanel" class="flex flex-col" :class="[show ? 'show' : '', transparent ? 'bg-slate-500 bg-opacity-90' : 'bg-slate-400']">
    <!-- add close button on top right -->
    <div v-if="closable" class="w-full flex justify-end" @click="$emit('close')">
      <span class="p-2">
      <XMarkIcon class="w-8 h-8 text-white" />
      </span>
    </div>
    <div id="overlayPanel__content" class="w-full h-full" v-if="show">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, watch } from "vue";
const props = defineProps<{ show: boolean, closable: boolean, transparent: boolean }>();
defineEmits<{ close: () => void }>();

watch(() => props.show, (val) => {
  if (val) {
    document.body.scrollTop = 0;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});

onMounted(() => {
  if (props.show) {
    document.body.scrollTop = 0;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});

onUnmounted(() => {
  document.body.style.overflow = "auto";
});

</script>
<style scoped>
/* Panels Style*/
/* •••••••••••••••••••••••••••••••• */

/* Common panel style */
#overlayPanel {
  display: flex;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  z-index: 999;
  color: #000;
  box-sizing: border-box;

  opacity: 0;
  transition: all 400ms;
  pointer-events: none;
}

/* panel content (only for animation delay after open) */
#overlayPanel__content {
  will-change: margin-top;
  /* transition: all 200ms;
  transition-delay: 300ms; */
  /* animation-duration: 200ms;
  animation-name: fadeIn;
  animation-delay: 1000ms; */

  animation-name: wait, fadeIn;
  animation-duration: 300ms, 200ms;
  animation-delay: 0s, 300ms;
}

@keyframes wait {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    margin-top: -5%;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
}

/* Panel content animation after open */
/* #overlayPanel.show #overlayPanel__content {
  opacity: 1;
  margin-top: 0;
} */

#overlayPanel.show {
  opacity: 1;
  pointer-events: auto;
}
</style>
