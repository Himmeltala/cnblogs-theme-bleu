<script setup lang="ts">
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const head = ref();
const { x, y } = useDraggable(head);

defineExpose({
  x,
  y
});
</script>

<template>
  <div :style="{ left: x ? x + 'px' : '', top: y + 'px' }" :class="{ hidden: disabled }" class="l-movbox z-99 fixed">
    <Card>
      <div ref="head" class="mb-2 p-2 cursor-move">
        <slot name="head" />
      </div>
      <div class="pb-2 px-2">
        <slot />
      </div>
    </Card>
  </div>
</template>
