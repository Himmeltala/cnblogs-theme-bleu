<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  defaultIndex: {
    type: Number,
    default: 1
  }
});

const emits = defineEmits(["next", "prev", "change"]);
const index = ref(props.defaultIndex);

function nextChange() {
  if (index.value < props.count) {
    index.value++;
    emits("next", index.value);
  }
}

function prevChange() {
  if (index.value > 1) {
    index.value--;
    emits("prev", index.value);
  }
}

function currentChange(ind: number) {
  index.value = ind;
  emits("change", index.value);
}
</script>

<template>
  <div class="pagination relative">
    <div
      v-if="!disabled"
      class="button hover left f-c-c text-c"
      @click="prevChange"
      v-show="index !== 1 && count">
      <i-ep-arrow-left-bold />
    </div>
    <div>
      <slot name="content"></slot>
    </div>
    <div
      v-if="!disabled"
      class="button hover right f-c-c text-c"
      @click="nextChange"
      v-show="index !== count && count">
      <i-ep-arrow-right-bold />
    </div>
    <div v-if="count && !disabled" class="f-c-e my-4">
      <el-pagination
        layout="pager, next"
        :page-count="count"
        v-model:current-page="index"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@include mb() {
  .button {
    display: none;
  }
}

@include pc() {
  .button {
    position: fixed;
    top: 50vh;
    opacity: 0.5;
    width: 1rem;
    height: 1rem;
  }

  .button:hover {
    opacity: 1;
  }

  .button.left {
    left: calc(math.div(50vw, 2) - 5rem);
  }

  .button.right {
    right: calc(math.div(50vw, 2) - 5rem);
  }
}
</style>
