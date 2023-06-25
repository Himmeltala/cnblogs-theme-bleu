<script setup lang="ts">
defineProps({
  line: {
    type: String as PropType<"solid" | "dotted">,
    default: "solid"
  },
  fontSize: {
    type: String,
    default: "text-0.8rem"
  },
  textColor: {
    type: String,
    default: "text-a"
  },
  round: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: true
  }
});

function translate(prop: string): string {
  return prop;
}
</script>

<template>
  <div
    class="l-hollobox"
    :class="{
      round: round,
      [translate(textColor)]: textColor,
      [translate(fontSize)]: fontSize,
      padding: padding
    }"
    :style="{ 'border-style': line }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.l-hollobox {
  border-width: 1px;
}

.l-hollobox.padding {
  padding: {
    top: 0.3rem;
    bottom: 0.3rem;
    left: 0.6rem;
    right: 0.6rem;
  }
}

.l-hollobox.round {
  border-radius: 50px;
}
</style>
