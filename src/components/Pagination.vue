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
const index = ref(1);

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

function currentChange(elIndex: number) {
  index.value = elIndex;
  emits("nexpr", index.value);
}
</script>

<template>
  <div class="pagination" relative>
    <div v-if="!disabled" class="button hover left" rd-l-4 f-c-c text-c @click="prevChange" v-show="index !== 1 && count">
      <i-ep-arrow-left-bold />
    </div>
    <div>
      <slot name="content" />
    </div>
    <div v-if="!disabled" class="button hover right" rd-l-4 f-c-c text-c @click="nextChange" v-show="index !== count && count">
      <i-ep-arrow-right-bold />
    </div>
    <div v-if="count && !disabled" f-c-e my-4>
      <el-pagination layout="pager, next" :page-count="count" v-model:current-page="index" @current-change="currentChange" />
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
    opacity: 0.35;
    width: 2.5rem;
    height: 2.5rem;
  }

  .button:hover {
    opacity: 1;
  }

  .button.left {
    left: calc(calc(45vw / 2) - 4rem);
  }

  .button.right {
    right: calc(calc(45vw / 2) - 4rem);
  }
}
</style>
