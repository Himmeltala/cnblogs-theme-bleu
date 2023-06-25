<script setup lang="ts">
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

function controlLump(entries: any) {
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

function generateList() {
  const catalogList: { id: string; content: string; item: Element }[] = [];
  let step = 0;

  const titles = toRefRealHtml.value.querySelectorAll("h1, h2, h3");

  for (let i = 0; i < titles.length; i++) {
    const id = titles[i].getAttribute("id");
    const type = titles[i].localName;
    let marginLeft = "";

    if (type === "h2") {
      marginLeft = "10px";
    } else if (type === "h3") {
      marginLeft = "20px";
    }

    const content = `
      <div id="catalog-${id}" class="hover" data-step="${step}" style="margin-left: ${marginLeft}">
        ${titles[i].textContent}
      </div>
    `;

    catalogList.push({ id, content, item: titles[i] });
    step += 2.5;
  }

  return catalogList;
}

let observer: IntersectionObserver = null;

function renderCatalog() {
  catalogList.value = generateList();

  observer = new IntersectionObserver(
    entries => {
      const offsetTop =
        window.innerHeight * 0.5 + entries[0].target.offsetTop - entries[0].target.clientHeight;

      if (isTouchedTitle(offsetTop)) {
        controlLump(entries);
      } else {
        const offsetTop = entries[0].target.offsetTop;
        if (isTouchedTitle(offsetTop)) {
          controlLump(entries);
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
onUnmounted(() => observer.disconnect());
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
      <div class="absolute lump-track"></div>
      <div
        class="absolute lump transition-all-300"
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

.lump {
  width: 0.25rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: var(--el-color-primary);
  top: 0;
  left: 0;
}

.lump-track {
  width: 0.25rem;
  height: 100%;
  border-radius: 0.25rem;
  background-color: var(--text-a);
  opacity: 0.15;
  top: 0;
  left: 0;
}
</style>
