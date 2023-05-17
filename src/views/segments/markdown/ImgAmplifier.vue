<script setup lang="ts">
import { createHigslide } from "./index";

const props = defineProps(["realHtml"]);
const toRefRealHtml = toRef(props, "realHtml");

const eleHighslide = ref<HTMLElement>();
const eleImage = ref<HTMLImageElement>();
const positionX = ref(0);
const positionY = ref(0);
const imgDegree = ref(0);
const imgWidth = ref(0);
const imgHeight = ref(0);
const animationOpened = ref(false);

useDraggable(eleImage, {
  onMove(position) {
    positionX.value = position.x;
    positionY.value = position.y;
  },
  onStart() {
    imgWidth.value = parseInt(eleImage.value.style.width);
    imgHeight.value = parseInt(eleImage.value.style.height);
    animationOpened.value = false;
  }
});

function close() {
  eleHighslide.value.classList.toggle("active");
  eleHighslide.value.classList.toggle("noactive");
  document.documentElement.style.overflow = "auto";
  imgDegree.value = 0;
  positionX.value = 0;
  positionY.value = 0;
}

function zoomIn() {
  imgWidth.value = parseInt(eleImage.value.style.width);
  imgHeight.value = parseInt(eleImage.value.style.height);
  animationOpened.value = true;
  imgHeight.value += imgHeight.value * 0.15;
  imgWidth.value += imgWidth.value * 0.15;
}

function zoomOut() {
  imgWidth.value = parseInt(eleImage.value.style.width);
  imgHeight.value = parseInt(eleImage.value.style.height);
  animationOpened.value = true;
  imgHeight.value -= imgHeight.value * 0.15;
  imgWidth.value -= imgWidth.value * 0.15;
}

onMounted(() => {
  eleImage.value.addEventListener("mousewheel", e => {
    animationOpened.value = false;
    imgWidth.value = parseInt(eleImage.value.style.width);
    imgHeight.value = parseInt(eleImage.value.style.height);
    // @ts-ignore
    if (e.deltaY < 0) {
      imgHeight.value += imgHeight.value * 0.15;
      imgWidth.value += imgWidth.value * 0.15;
    } else {
      imgHeight.value -= imgHeight.value * 0.15;
      imgWidth.value -= imgWidth.value * 0.15;
    }
  });
});

watch(toRefRealHtml, newVal => {
  createHigslide(newVal, eleHighslide.value, eleImage.value);
});
</script>

<template>
  <Teleport to="body">
    <div class="l-highslide noactive" ref="eleHighslide">
      <div class="relative w-100% h-100%">
        <div class="w-100% h-100% f-c-c">
          <img
            ref="eleImage"
            draggable="false"
            select-none
            cursor-move
            class="l-highslide__img"
            :class="{
              fixed: positionX && positionY && !!BleuVars.isPcDevice(),
              transition: animationOpened
            }"
            :style="{
              left: positionX + 'px',
              top: positionY + 'px',
              width: imgWidth + 'px',
              height: imgHeight + 'px'
            }" />
        </div>
        <div class="l-highslide__close f-c-c z-99 hover absolute top-2 right-2" @click="close">
          <i-ep-close />
        </div>
        <div class="z-99 f-c-c absolute bottom-4 left-0 w-100%">
          <div class="l-highslide__tool f-c-c">
            <div class="mr-6 f-c-c hover" @click="zoomIn">
              <i-ep-zoom-in />
            </div>
            <div class="f-c-c hover" @click="zoomOut">
              <i-ep-zoom-out />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.l-highslide {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: all 0.2s ease-in-out;
  background-color: #222222b4;
}

.active {
  transform: scale(1, 1);
}

.noactive {
  transform: scale(0, 0);
}

.transition {
  transition: all 0.3s ease-in-out;
}

.l-highslide__img {
  max-width: initial !important;
  max-height: initial !important;
}

.l-highslide__close {
  padding: 0.5rem 0.5rem;
}

.l-highslide__tool {
  padding: 0.5rem 1rem;
}

.l-highslide__tool,
.l-highslide__close {
  border-radius: 2rem;
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.7;
  background-color: var(--text-a);
}
</style>
