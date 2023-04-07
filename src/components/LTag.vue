<script setup lang="ts">
defineProps({
  plain: {
    type: Boolean,
    default: false
  },
  hover: {
    type: Boolean,
    default: false
  },
  text: {
    type: Boolean,
    default: true
  },
  line: {
    type: String as PropType<"solid" | "dotted">,
    default: "solid"
  },
  round: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <span class="l-tag" :class="{ round: round, text: text, plain: plain, hover: hover }" :style="{ 'border-style': line }">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.l-tag {
  border-width: 1px;
  padding: {
    top: 0.3rem;
    bottom: 0.3rem;
    left: 0.6rem;
    right: 0.6rem;
  }
  font-size: var(--l-six-size);
}

.l-tag.hover {
  @include hover($border-color: all);
}

.l-tag.round {
  border-radius: 50px;
}

.l-tag.text {
  border-color: var(--l-pri-color);
  color: var(--l-pri-color);
}

.l-tag.plain {
  border-color: var(--l-theme-color);
  color: var(--l-theme-color);
}
</style>
