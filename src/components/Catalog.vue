<script setup lang="ts">
import { useWheelRollsUpAndDown } from "@/hooks/use-mouse";

defineProps({
  catalogList: {
    type: Array,
    required: false
  }
});

const emits = defineEmits(["update:catalogList"]);

const catalogList = shallowRef();

function highlightCurrentSection(
  titles: NodeListOf<Element>,
  inviewport: (title: Element) => void
) {
  const scrollPosition = window.scrollY || window.pageYOffset;
  for (let i = 0; i < titles.length; i++) {
    const foffset = titles[i]?.offsetTop;
    const loffset = titles[i + 1]?.offsetTop;

    if (scrollPosition < loffset && scrollPosition > foffset) {
      inviewport(titles[i]);
    } else if (scrollPosition > foffset && !loffset) {
      inviewport(titles[i]);
    }
  }
}

let lastToc: Element;

function generateList(content: HTMLDivElement) {
  const catalogList: { id: string; content: string; item: Element }[] = [];

  const titles = content.querySelectorAll("h1, h2, h3");

  for (let i = 0; i < titles.length; i++) {
    const id = titles[i].getAttribute("id");
    const type = titles[i].localName;
    let marginLeft = "";

    if (type === "h2") {
      marginLeft = "1rem";
    } else if (type === "h3") {
      marginLeft = "2rem";
    }

    const content = `
      <div id="catalog-${id}" class="hover"  style="margin-left: ${marginLeft}">
        ${titles[i].textContent}
      </div>
    `;

    catalogList.push({ id, content, item: titles[i] });
  }

  useWheelRollsUpAndDown(
    {
      on: () => {
        highlightCurrentSection(titles, title => {
          const target = document.querySelector("#catalog-" + title.id);

          if (lastToc) {
            lastToc.classList.remove("active-toc");
          }

          target.classList.add("active-toc");

          lastToc = target;
        });
      }
    },
    { throttle: 50 }
  );

  return catalogList;
}

function renderCatalogFnc(content: HTMLDivElement) {
  catalogList.value = generateList(content);
  emits("update:catalogList", catalogList.value);
}

function clickToc(toc: any) {
  Broswer.scrollIntoView(`#${toc.id}`);
}

defineExpose({
  renderCatalogFnc
});
</script>

<template>
  <div v-if="catalogList && catalogList.length" class="catalog flow-auto">
    <div class="content w-80% h-100%">
      <div class="mb-2">文章目录</div>
      <div
        class="item"
        @click="clickToc(item)"
        v-for="item in catalogList"
        v-html="item.content"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  .item {
    --uno: text-0.8rem text-text-regular mb-1;
  }
}
</style>

<style>
.active-toc {
  --uno: text-theme-primary transition-all-300 text-0.9rem;
}
</style>
