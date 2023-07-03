<script setup lang="ts">
defineProps({
  line: {
    type: String as PropType<"solid" | "dotted">,
    default: "dotted"
  },
  round: {
    type: Boolean,
    default: true
  },
  padding: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div
    class="l-hollobox"
    :class="{
      round: round,
      padding: padding
    }"
    :style="{ 'border-style': line }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.l-hollobox {
  --uno: text-0.8rem;
  border-width: 1px;
}

.l-hollobox.padding {
  padding: {
    top: 0.1rem;
    bottom: 0.1rem;
    left: 0.6rem;
    right: 0.6rem;
  }
}

.l-hollobox.round {
  border-radius: 1rem;
}
</style>
