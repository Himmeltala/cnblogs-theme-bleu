<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["next", "prev", "nexpr"]);

const setting = EcyUtils.getSetting();
const index = ref(1);

function nextChange() {
  if (index.value < props.count) {
    index.value++;
    emits("next", { elIndex: index.value, pageCount: props.count, currentIndex: index.value });
  }
}

function prevChange() {
  if (index.value > 1) {
    index.value--;
    emits("prev", { elIndex: index.value, pageCount: props.count, currentIndex: index.value });
  }
}

function nexprChange(elIndex: number) {
  index.value = elIndex;
  emits("nexpr", { elIndex: index.value, pageCount: props.count, currentIndex: index.value });
}
</script>

<template>
  <div class="l-pagination relative">
    <div v-if="count" class="sorter hover left z-1 f-c-c rd-l-4" @click="prevChange" v-show="disabled && index !== 1">
      <i-ep-arrow-left-bold />
    </div>
    <div class="l-pagination__content">
      <slot name="content" />
    </div>
    <div v-if="count" class="sorter hover right z-1 f-c-c rd-l-4" @click="nextChange" v-show="disabled && index !== count">
      <i-ep-arrow-right-bold />
    </div>
    <div class="l-pagination__bottom f-c-e my-4" :class="{ 'l-box-bg': !setting.card.open }">
      <Card v-if="count">
        <el-pagination layout="pager, next" :page-count="count" v-model:current-page="index" @current-change="nexprChange" />
      </Card>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include mb() {
  .sorter {
    display: none;
  }
}

@include pc() {
  .sorter {
    position: fixed;
    top: 50vh;
    opacity: 0.7;
    color: var(--l-thr-color);
    width: 2.5rem;
    height: 2.5rem;
  }

  .sorter.left {
    left: calc(calc(calc(100vw - var(--content-width)) / 2) - 2.6rem);
  }

  .sorter.right {
    right: calc(calc(calc(100vw - var(--content-width)) / 2) - 2.6rem);
  }
}
</style>
