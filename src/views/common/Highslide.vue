<script setup lang="ts">
import $ from "jquery";

const highslideRef = ref<HTMLElement>();
const imgRef = ref<HTMLElement>();
const positionX = ref(0);
const positionY = ref(0);
const imgDegree = ref(0);
const imgWidth = ref(0);
const imgHeight = ref(0);
const animationOpened = ref(false);

useDraggable(imgRef, {
  onMove(position) {
    positionX.value = position.x;
    positionY.value = position.y;
  },
  onStart() {
    animationOpened.value = false;
    imgWidth.value = $(imgRef.value).width();
    imgHeight.value = $(imgRef.value).height();
  }
});

function close() {
  $(highslideRef.value).removeClass("active").addClass("noactive");
  $("body").css({ overflow: "auto" });
  imgDegree.value = 0;
  positionX.value = 0;
  positionY.value = 0;
}

function zoom() {
  animationOpened.value = true;
  imgWidth.value = $(imgRef.value).width();
  imgHeight.value = $(imgRef.value).height();
}

function zoomIn() {
  zoom();
  imgHeight.value += imgHeight.value * 0.15;
  imgWidth.value += imgWidth.value * 0.15;
}

function zoomOut() {
  zoom();
  imgHeight.value -= imgHeight.value * 0.15;
  imgWidth.value -= imgWidth.value * 0.15;
}

function rotate(direction: "right" | "left") {
  animationOpened.value = true;
  if (direction === "left") {
    imgDegree.value += 90;
  } else {
    imgDegree.value -= 90;
  }
}

onMounted(() => {
  imgRef.value.addEventListener("mousewheel", e => {
    animationOpened.value = false;
    imgWidth.value = $(imgRef.value).width();
    imgHeight.value = $(imgRef.value).height();
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
</script>

<template>
  <Teleport to="body">
    <div class="l-highslide l-matee-bg noactive" ref="highslideRef">
      <div class="relative w-100% h-100%">
        <div class="l-highslide__box w-100% h-100% f-c-c">
          <img
            ref="imgRef"
            draggable="false"
            style="max-width: initial"
            class="l-highslide__img noselect cursor-move"
            :class="{
              fixed: positionX && positionY && EcyConfig.pcDevice ? true : false,
              transition: animationOpened
            }"
            :style="{
              transform: 'rotate(' + imgDegree + 'deg)',
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
            <div class="mr-4 f-c-c hover" @click="zoomIn">
              <i-ep-zoom-in />
            </div>
            <div class="mr-4 f-c-c hover" @click="zoomOut">
              <i-ep-zoom-out />
            </div>
            <div class="mr-4 f-c-c hover" @click="rotate('right')">
              <i-ep-refresh-left />
            </div>
            <div class="f-c-c hover" @click="rotate('left')">
              <i-ep-refresh-right />
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

.highslide__img {
  max-height: 100%;
  max-width: 100%;
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
  background-color: var(--l-pri-color);
}
</style>
