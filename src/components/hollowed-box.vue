<script setup lang="ts">
defineProps({
  hover: {
    type: Boolean,
    default: false
  },
  line: {
    type: String as PropType<"solid" | "dotted">,
    default: "solid"
  },
  fontSize: {
    type: String,
    default: "l-size-1"
  },
  textColor: {
    type: String,
    default: "l-color-1"
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
    :class="{ round: round, hover: hover, [translate(textColor)]: textColor, [translate(fontSize)]: fontSize, padding: padding }"
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

.l-hollobox.hover {
  @include hover($border-color: all);
}

.l-hollobox.round {
  border-radius: 50px;
}
</style>
