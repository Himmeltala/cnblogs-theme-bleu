<script setup lang="ts">
const { text, showIcon } = defineProps({
  text: {
    type: String,
    required: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});

const boxInst = ref();
const boxWrapInst = ref();
const isDownArrow = ref(true);
const boxWrapInstHeight = ref(0);
let lastBoxWrapInstHeight = 0;

const observer: ResizeObserver = new ResizeObserver(entries => {
  entries.forEach(entry => {
    boxWrapInstHeight.value = entry.target.offsetHeight;
  });
});

function toggle() {
  if (isDownArrow.value) {
    lastBoxWrapInstHeight = boxWrapInstHeight.value;
    boxWrapInstHeight.value = 0;
  } else {
    boxWrapInstHeight.value = lastBoxWrapInstHeight;
  }
  isDownArrow.value = !isDownArrow.value;
}

onMounted(() => {
  observer.observe(boxWrapInst.value);
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div class="l-expbox mb-6">
    <div class="title" select-none mb-4 f-c-b text-1.2rem text-color-a>
      <div f-c-s>
        <div f-c-c mr-1>
          <slot name="icon"></slot>
        </div>
        {{ text }}
      </div>
      <div v-if="showIcon" @click="toggle" class="hover effect f-c-c" :class="{ 'arrow-up': !isDownArrow, 'arrow-down': isDownArrow }">
        <div class="arrow effect f-c-c">
          <i-ep-arrow-down />
        </div>
      </div>
    </div>
    <div text-b flow-hidden class="effect" ref="boxInst" :style="{ height: boxWrapInstHeight + 'px' }">
      <div ref="boxWrapInst">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  padding-left: 0.4rem;
  border-radius: 0.25rem;
  border-left: 0.25rem solid var(--el-color-primary);
}

.title:hover .arrow {
  transform: scale(1, 1);
}

.arrow {
  transform: scale(0, 0);
}

.arrow-up {
  transform: rotate(180deg);
}

.arrow-down {
  transform: rotate(0deg);
}

.effect {
  transition: var(--l-animation-effect);
}
</style>
