<script setup lang="ts">
import $ from "jquery";

const highslide = ref<HTMLElement>();
const image = ref<HTMLElement>();
const angle = ref(0);
const x = ref(0);
const y = ref(0);
const width = ref(0);
const height = ref(0);
const transition = ref(false);

useDraggable(image, {
  onMove(position) {
    x.value = position.x;
    y.value = position.y;
  },
  onStart() {
    transition.value = false;
    width.value = $(image.value).width();
    height.value = $(image.value).height();
  }
});

function close() {
  $(highslide.value).removeClass("active").addClass("noactive");
  $("body").css({ overflow: "auto" });
  angle.value = 0;
  x.value = 0;
  y.value = 0;
}

function zoom() {
  transition.value = true;
  width.value = $(image.value).width();
  height.value = $(image.value).height();
}

function zoomIn() {
  zoom();
  height.value += height.value * 0.15;
  width.value += width.value * 0.15;
}

function zoomOut() {
  zoom();
  height.value -= height.value * 0.15;
  width.value -= width.value * 0.15;
}

function rotate(direction: "right" | "left") {
  transition.value = true;
  if (direction === "left") {
    angle.value += 90;
  } else {
    angle.value -= 90;
  }
}

onMounted(() => {
  image.value.addEventListener("mousewheel", e => {
    transition.value = false;
    width.value = $(image.value).width();
    height.value = $(image.value).height();
    // @ts-ignore
    if (e.deltaY < 0) {
      height.value += height.value * 0.15;
      width.value += width.value * 0.15;
    } else {
      height.value -= height.value * 0.15;
      width.value -= width.value * 0.15;
    }
  });
});
</script>

<template>
  <Teleport to="body">
    <div class="l-highslide l-matee-bg noactive" ref="highslide">
      <div class="relative w-100% h-100%">
        <div class="l-highslide__box w-100% h-100% f-c-c">
          <img
            ref="image"
            draggable="false"
            style="max-width: initial"
            class="l-highslide__img noselect cursor-move"
            :class="{
              fixed: x && y && EcyConfig.pcDevice ? true : false,
              transition: transition
            }"
            :style="{
              transform: 'rotate(' + angle + 'deg)',
              left: x + 'px',
              top: y + 'px',
              width: width + 'px',
              height: height + 'px'
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
  z-index: 9;
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
