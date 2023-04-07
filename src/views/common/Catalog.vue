<script setup lang="ts">
import { useCatalogStore } from "@/store";

const setting = EcyUtils.getSetting();
const route = useRoute();
const store = useCatalogStore();
const anchors = shallowRef();
const movbox = ref();
const disabled = ref();

store.$onAction(({ args }) => {
  anchors.value = args[0];
}, true);

watch(route, async () => {
  if (route.name !== "Writing") {
    anchors.value = [];
  }
});
</script>

<template>
  <MovableBox
    id="l-catalog"
    v-show="anchors && anchors.length"
    ref="movbox"
    :disabled="disabled"
    :class="{ 'l-box-bg': !setting.card.open }">
    <template #head>
      <div class="headtip f-c-s">
        <div class="f-c-c">
          <i-ep-location />
          <div class="ml-2">随笔目录</div>
        </div>
        <div class="f-c-c ml-4 hover" @click="disabled = !disabled">
          <i-ep-close />
        </div>
      </div>
    </template>
    <div class="l-fiv-size mb-2" v-for="item in anchors" v-html="item.content" v-cateve="item" />
  </MovableBox>
</template>

<style scoped lang="scss">
@include pc() {
  #l-catalog {
    left: calc(var(--content-width) * 1.55);
  }
}

@include mb() {
  #l-catalog {
    right: 0;
  }
}
</style>
