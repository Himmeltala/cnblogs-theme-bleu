<script setup lang="ts">
import { useCatalogStore } from "@/store";

const route = useRoute();
const translate = shallowRef("");
const anchors = shallowRef([]);
const store = useCatalogStore();
const catalogDisabled = inject<boolean>(ProvideKey.CATALOG_DISABLED);
let observer: IntersectionObserver;

function moveSlider(entries: any) {
  for (let i = 0; i < anchors.value.length; i++) {
    document.querySelector(`#catalog-${anchors.value[i].id}`)?.classList.remove("catalog-active");
  }
  const item = document.querySelector(`#catalog-${entries[0].target.id}`);
  const step = item?.getAttribute("data-step");
  translate.value = step;
  item?.classList.add("catalog-active");
}

function isTouchedItem(offsetTop: number) {
  return window.scrollY >= offsetTop && window.scrollY <= offsetTop + offsetTop * 0.2;
}

function useObserver(entries: any) {
  // @ts-ignore
  const offsetTop = window.innerHeight * 0.5 + entries[0].target.offsetTop - entries[0].target.clientHeight;

  if (isTouchedItem(offsetTop)) {
    moveSlider(entries);
  } else {
    const offsetTop = entries[0].target.offsetTop;
    if (isTouchedItem(offsetTop)) {
      moveSlider(entries);
    }
  }
}

observer = new IntersectionObserver(useObserver, {
  threshold: [0, 1]
});

onUnmounted(() => {
  observer.disconnect();
});

watch(route, () => {
  if (route.name !== RouterName.WORKS) {
    anchors.value = [];
    observer.disconnect();
  }
});

store.$onAction(({ args }) => {
  observer.disconnect();
  anchors.value = args[0];
  for (let i = 0; i < anchors.value.length; i++) {
    observer.observe(anchors.value[i].item);
  }
}, true);
</script>

<template>
  <div
    id="l-catalog"
    :class="{ 'catalog-disable': catalogDisabled, 'catalog-show': !catalogDisabled }"
    class="fixed top-4vh pl-4 py-6 w-16rem h-92vh l-back-bg rd-2 noscroll flow-auto z-90"
    v-show="anchors && anchors.length">
    <div class="relative l-back-bg">
      <div class="ml-6 l-color-2">
        <div
          class="l-size-1 mb-4 h-1.5rem f-c-s text-ellipsis line-clamp-1"
          v-for="item in anchors"
          v-html="item.content"
          v-catalog-event="item" />
      </div>
      <div class="absolute slider-track"></div>
      <div class="absolute slider" :style="{ transform: 'translate(0, ' + translate + 'rem)' }"></div>
    </div>
  </div>
</template>

<style lang="scss">
.catalog-active {
  color: var(--l-hight-color-1);
}
</style>

<style scoped lang="scss">
@mixin catalog($left) {
  .catalog-disable {
    animation: catalog-disable-animation 0.3s ease-in;
    left: 100vw;
  }

  @keyframes catalog-disable-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        // 100 -> 80
        left: $left + $i * math.div(100vw - $left, 10);
      }
    }
  }

  .catalog-show {
    animation: catalog-show-animation 0.3s ease-in;
    left: $left;
  }

  @keyframes catalog-show-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        left: 100vw - $i * math.div(100vw - $left, 10);
      }
    }
  }
}

@include pc() {
  $left: calc(55vw * 1.45);
  @include catalog($left);
}

@include mb() {
  $left: 50vw;
  @include catalog($left);
}

.slider {
  transition: var(--l-animation-effect);
  width: 0.25rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: var(--el-color-primary);
  top: 0;
  left: 0;
}

.slider-track {
  width: 0.25rem;
  height: 100%;
  border-radius: 0.25rem;
  background-color: var(--l-color-1);
  opacity: 0.15;
  top: 0;
  left: 0;
}
</style>
