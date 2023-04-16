<script setup lang="ts">
import { useCatalogStore } from "@/store";

const route = useRoute();
const store = useCatalogStore();
const anchors = shallowRef();
const translateY = ref("");
let intersectionObserver: IntersectionObserver;

store.$onAction(({ args }) => {
  anchors.value = args[0];
}, true);

onMounted(() => {
  intersectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(catalogItem => {
        // @ts-ignore
        const offseTop = window.innerHeight * 0.5 + catalogItem.target.offsetTop - catalogItem.target.clientHeight;
        if (window.scrollY >= offseTop && window.scrollY - 100 <= offseTop) {
          anchors.value.forEach((otherCatalogItem: any) => {
            document.querySelector(`#catalog-${otherCatalogItem.id}`).classList.remove("catalog-active");
          });
          const currCatalogItem = document.querySelector(`#catalog-${catalogItem.target.id}`);
          const step = currCatalogItem.getAttribute("data-step");
          translateY.value = step;
          currCatalogItem.classList.add("catalog-active");
        }
      });
    },
    {
      threshold: [0, 1]
    }
  );

  anchors.value.forEach((value: any) => {
    intersectionObserver.observe(value.item);
  });
});

onUnmounted(() => {
  intersectionObserver.disconnect();
});

watch(route, () => {
  if (route.name !== RouterName.Works) {
    anchors.value = [];
    intersectionObserver.disconnect();
  }
});
</script>

<template>
  <div id="l-catalog" class="fixed top-10vh">
    <div class="relative">
      <div class="l-six-size mb-4 catalog-item h-1.5rem f-c-s" v-for="item in anchors" v-html="item.content" v-catalog-event="item" />
      <div class="absolute slider-track"></div>
      <div class="absolute slider" :style="{ transform: 'translateY(' + translateY + 'rem)' }"></div>
    </div>
  </div>
</template>

<style lang="scss">
.catalog-active {
  color: white;
}
</style>

<style scoped lang="scss">
.slider {
  transition: var(---l-transition);
  width: 0.25rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: var(--el-color-primary);
  top: 0;
  left: -2rem;
}

.slider-track {
  width: 0.25rem;
  height: 100%;
  border-radius: 0.25rem;
  background-color: var(--l-pri-color);
  opacity: 0.1;
  top: 0;
  left: -2rem;
}

@include pc() {
  #l-catalog {
    left: calc(55vw * 1.5);
  }
}

@include mb() {
  #l-catalog {
    right: 0;
  }
}
</style>
