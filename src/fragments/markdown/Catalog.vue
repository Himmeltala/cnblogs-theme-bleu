<script setup lang="ts">
import { createCatalog } from "./index";

const props = defineProps({
  strHtml: {
    type: String,
    required: true
  },
  realHtml: {
    type: Object as PropType<any>,
    required: false
  }
});

const toRefRealHtml = toRef(props, "realHtml");
const toRefStrHtml = toRef(props, "strHtml");

const disabled = inject<boolean>(ProvideKey.Catalog);

const translate = shallowRef("");
const catalogList = shallowRef();

function controlSlider(entries: any) {
  for (let i = 0; i < catalogList.value.length; i++) {
    document
      .querySelector(`#catalog-${catalogList.value[i].id}`)
      ?.classList.remove("catalog-active");
  }
  const item = document.querySelector(`#catalog-${entries[0].target.id}`);
  const step = item?.getAttribute("data-step");
  translate.value = step;
  item?.classList.add("catalog-active");
}

function isTouchedTitle(offsetTop: number) {
  return window.scrollY >= offsetTop && window.scrollY <= offsetTop + offsetTop * 0.2;
}

let observer: IntersectionObserver = null;

function renderCatalog() {
  catalogList.value = createCatalog(toRefRealHtml.value);

  observer = new IntersectionObserver(
    entries => {
      const offsetTop =
        window.innerHeight * 0.5 + entries[0].target.offsetTop - entries[0].target.clientHeight;

      if (isTouchedTitle(offsetTop)) {
        controlSlider(entries);
      } else {
        const offsetTop = entries[0].target.offsetTop;
        if (isTouchedTitle(offsetTop)) {
          controlSlider(entries);
        }
      }
    },
    {
      threshold: [0, 1]
    }
  );

  for (let i = 0; i < catalogList.value.length; i++) {
    observer.observe(catalogList.value[i].item);
  }
}

watch(toRefRealHtml, renderCatalog);
watch(toRefStrHtml, renderCatalog);

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div
    id="l-catalog"
    :class="{ 'catalog-disable': disabled, 'catalog-show': !disabled }"
    class="fixed top-4vh pl-4 py-6 w-16rem h-92vh rd-2 scroll-none flow-auto z-90"
    v-if="catalogList && catalogList.length">
    <div class="relative">
      <div class="ml-6 text-b">
        <div
          class="text-0.8rem mb-4 h-1.5rem f-c-s text-ellipsis line-clamp-1"
          v-for="item in catalogList"
          @click="Broswer.scrollIntoView('#' + item.id)">
          <div v-html="item.content"></div>
        </div>
      </div>
      <div class="absolute slider-track"></div>
      <div
        class="absolute slider transition-all-300"
        :style="{ transform: 'translate(0, ' + translate + 'rem)' }"></div>
    </div>
  </div>
</template>

<style lang="scss">
.catalog-active {
  color: var(--l-hight-color-1);
}
</style>

<style scoped lang="scss">
@mixin catalog-mixin($step) {
  .catalog-disable {
    animation: catalog-disable-animation 0.3s ease-in;
    left: 100vw;
  }

  @keyframes catalog-disable-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        // 100 -> 80
        left: $step + $i * math.div(100vw - $step, 10);
      }
    }
  }

  .catalog-show {
    animation: catalog-show-animation 0.3s ease-in;
    left: $step;
  }

  @keyframes catalog-show-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        left: 100vw - $i * math.div(100vw - $step, 10);
      }
    }
  }
}

@include pc() {
  $left: calc(55vw * 1.45);
  @include catalog-mixin($left);
}

@include mb() {
  $left: 50vw;
  @include catalog-mixin($left);
}

.slider {
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
