<script setup lang="ts">
const props = defineProps({
  strHtml: {
    required: true
  },
  realHtml: {
    type: Object as PropType<HTMLElement | HTMLElement[]>,
    required: false
  },
  styleCss: {
    type: String,
    required: false
  }
});

const toRefStrHtml = toRef(props, "strHtml");
const toRefRealHtml = toRef(props, "realHtml");

const amplifierInst = ref<HTMLElement>();
const imageInst = ref<HTMLImageElement>();
const positionX = ref(0);
const positionY = ref(0);
const degree = ref(0);
const width = ref(0);
const height = ref(0);
const isOpenAnima = ref(false);

useDraggable(imageInst, {
  onMove(position) {
    positionX.value = position.x;
    positionY.value = position.y;
  },
  onStart() {
    width.value = Number(imageInst.value.style.width);
    height.value = Number(imageInst.value.style.height);
    isOpenAnima.value = false;
  }
});

function close() {
  amplifierInst.value.classList.toggle("active");
  amplifierInst.value.classList.toggle("noactive");
  document.documentElement.style.overflow = "auto";
  degree.value = 0;
  positionX.value = 0;
  positionY.value = 0;
}

function zoomIn() {
  width.value = Number(imageInst.value.style.width);
  height.value = Number(imageInst.value.style.height);
  isOpenAnima.value = true;
  height.value += height.value * 0.15;
  width.value += width.value * 0.15;
}

function zoomOut() {
  width.value = Number(imageInst.value.style.width);
  height.value = Number(imageInst.value.style.height);
  isOpenAnima.value = true;
  height.value -= height.value * 0.15;
  width.value -= width.value * 0.15;
}

function registerAmplifier(imgEl: HTMLImageElement) {
  const captionEl = document.createElement("div");
  captionEl.setAttribute("class", "text-b text-0.9rem mt-2");
  captionEl.innerText = imgEl.alt;

  if (imgEl.parentElement.tagName === "P") {
    imgEl.parentElement.setAttribute("class", `${props.styleCss}`);
    imgEl.parentElement.insertAdjacentElement("beforeend", captionEl);
  }

  imgEl.addEventListener("click", () => {
    amplifierInst.value.classList.toggle("noactive");
    amplifierInst.value.classList.toggle("active");
    imageInst.value.src = imgEl.getAttribute("src");
    imageInst.value.style.width = `${imgEl.width}px`;
    imageInst.value.style.height = `${imgEl.height}px`;
    document.documentElement.style.overflow = "hidden";
  });
}

function renderAmplifier() {
  if (Array.isArray(toRefRealHtml.value)) {
    toRefRealHtml.value.forEach(mkEl => {
      const imgElArr = mkEl.querySelectorAll("img");
      imgElArr.forEach((imgEl: any) => {
        registerAmplifier(imgEl);
      });
    });
  } else {
    const imgElArr = toRefRealHtml.value.querySelectorAll("img");
    imgElArr.forEach((imgEl: any) => {
      registerAmplifier(imgEl);
    });
  }
}

function registerMouseWheel() {
  imageInst.value.addEventListener("mousewheel", e => {
    isOpenAnima.value = false;
    width.value = parseInt(imageInst.value.style.width);
    height.value = parseInt(imageInst.value.style.height);
    // @ts-ignore
    if (e.deltaY < 0) {
      height.value += height.value * 0.15;
      width.value += width.value * 0.15;
    } else {
      height.value -= height.value * 0.15;
      width.value -= width.value * 0.15;
    }
  });
}

onMounted(registerMouseWheel);
watch(toRefRealHtml, renderAmplifier);
watch(toRefStrHtml, renderAmplifier);
</script>

<template>
  <Teleport to="body">
    <div class="l-amplifier noactive transition-all-300" ref="amplifierInst">
      <div class="relative w-100% h-100%">
        <div class="w-100% h-100% f-c-c">
          <img
            ref="imageInst"
            draggable="false"
            select-none
            cursor-move
            class="l-amplifier__img"
            :class="{
              fixed: positionX && positionY && !!BleuVars.isPcDevice(),
              'transition-all-300': isOpenAnima
            }"
            :style="{
              left: positionX + 'px',
              top: positionY + 'px',
              width: width + 'px',
              height: height + 'px'
            }" />
        </div>
        <div class="l-amplifier__close f-c-c z-99 hover absolute top-2 right-2" @click="close">
          <i-ep-close />
        </div>
        <div class="z-99 f-c-c absolute bottom-4 left-0 w-100%">
          <div class="l-amplifier__tool f-c-c">
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
.l-amplifier {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #222222b4;
}

.active {
  transform: scale(1, 1);
}

.noactive {
  transform: scale(0, 0);
}

.l-amplifier__img {
  max-width: initial !important;
  max-height: initial !important;
}

.l-amplifier__close {
  padding: 0.5rem 0.5rem;
}

.l-amplifier__tool {
  padding: 0.5rem 1rem;
}

.l-amplifier__tool,
.l-amplifier__close {
  border-radius: 2rem;
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.7;
  background-color: var(--text-a);
}
</style>
