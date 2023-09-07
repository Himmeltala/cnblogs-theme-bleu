<script setup lang="ts">
const carouselList = shallowRef(BleuVars.config.images.home.carousel);
const carouselIndex = ref(0);
const carouseLength = BleuVars.config.images.home.carousel.length;

let interval = 0;

onMounted(() => {
  interval = setInterval(() => {
    carouselIndex.value++;
    if (carouselIndex.value > carouseLength - 1) {
      carouselIndex.value = 0;
    }
  }, BleuVars.config.images.home.interval);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div v-if="carouseLength" class="h-100vh f-c-b relative">
    <img
      v-for="(item, index) in carouselList"
      :style="
        carouselIndex == index
          ? { zIndex: 9, opacity: BleuVars.config.images.home.opacity }
          : { zIndex: 0, opacity: 0 }
      "
      :src="item"
      class="w-100% h-100% transition-all-800 absolute top-0 left-0 object-cover" />
  </div>
</template>

<style scoped lang="scss"></style>
