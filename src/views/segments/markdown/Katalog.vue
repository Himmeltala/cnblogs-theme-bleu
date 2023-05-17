<script setup lang="ts">
import { createKatalog } from "./index";

const props = defineProps(["realHtml"]);
const toRefRealHtml = toRef(props, "realHtml");

const translate = shallowRef("");
const disabled = inject<boolean>(ProvideKey.Katalog);
const katalogList = shallowRef();
let observer: IntersectionObserver = null;

function moveSlider(entries: any) {
  for (let i = 0; i < katalogList.value.length; i++) {
    document
      .querySelector(`#katalog-${katalogList.value[i].id}`)
      ?.classList.remove("katalog-active");
  }
  const item = document.querySelector(`#katalog-${entries[0].target.id}`);
  const step = item?.getAttribute("data-step");
  translate.value = step;
  item?.classList.add("katalog-active");
}

function isTouchedTitle(offsetTop: number) {
  return window.scrollY >= offsetTop && window.scrollY <= offsetTop + offsetTop * 0.2;
}

watch(toRefRealHtml, newVal => {
  katalogList.value = createKatalog(newVal);

  observer = new IntersectionObserver(
    entries => {
      const offsetTop =
        window.innerHeight * 0.5 + entries[0].target.offsetTop - entries[0].target.clientHeight;

      if (isTouchedTitle(offsetTop)) {
        moveSlider(entries);
      } else {
        const offsetTop = entries[0].target.offsetTop;
        if (isTouchedTitle(offsetTop)) {
          moveSlider(entries);
        }
      }
    },
    {
      threshold: [0, 1]
    }
  );

  for (let i = 0; i < katalogList.value.length; i++) {
    observer.observe(katalogList.value[i].item);
  }
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div
    id="l-katalog"
    :class="{ 'katalog-disable': disabled, 'katalog-show': !disabled }"
    class="fixed top-4vh pl-4 py-6 w-16rem h-92vh l-back-bg rd-2 scroll-none flow-auto z-90"
    v-if="katalogList && katalogList.length">
    <div class="relative l-back-bg">
      <div class="ml-6 text-b">
        <div
          class="text-0.8rem mb-4 h-1.5rem f-c-s text-ellipsis line-clamp-1"
          v-for="item in katalogList"
          @click="Broswer.scrollIntoView('#' + item.id)">
          <div v-html="item.content"></div>
        </div>
      </div>
      <div class="absolute slider-track"></div>
      <div
        class="absolute slider"
        :style="{ transform: 'translate(0, ' + translate + 'rem)' }"></div>
    </div>
  </div>
</template>

<style lang="scss">
.katalog-active {
  color: var(--l-hight-color-1);
}
</style>

<style scoped lang="scss">
@mixin katalog($left) {
  .katalog-disable {
    animation: katalog-disable-animation 0.3s ease-in;
    left: 100vw;
  }

  @keyframes katalog-disable-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        // 100 -> 80
        left: $left + $i * math.div(100vw - $left, 10);
      }
    }
  }

  .katalog-show {
    animation: katalog-show-animation 0.3s ease-in;
    left: $left;
  }

  @keyframes katalog-show-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        left: 100vw - $i * math.div(100vw - $left, 10);
      }
    }
  }
}

@include pc() {
  $left: calc(55vw * 1.45);
  @include katalog($left);
}

@include mb() {
  $left: 50vw;
  @include katalog($left);
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
  background-color: var(--text-a);
  opacity: 0.15;
  top: 0;
  left: 0;
}
</style>
