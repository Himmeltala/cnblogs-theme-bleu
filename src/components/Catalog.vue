<script setup lang="ts">
const catalogList = ref();

function highlightCurrentTopic(
  topics: NodeListOf<Element>,
  inviewportFnc: (topic: Element) => void
) {
  const windowScrollY = window.scrollY;
  for (let i = 0; i < topics.length; i++) {
    const headTopicOffset = topics[i]?.offsetTop;
    const tailTopicOffset = topics[i + 1]?.offsetTop;

    if (windowScrollY < tailTopicOffset && windowScrollY > headTopicOffset) {
      inviewportFnc(topics[i]);
    } else if (windowScrollY > headTopicOffset && !tailTopicOffset) {
      inviewportFnc(topics[i]);
    }
  }
}

let lastTopic: Element;

function generateTopicList(content: HTMLDivElement) {
  const topicList: { id: string; content: string; item: Element }[] = [];
  const topicEles = content.querySelectorAll("h1, h2, h3");

  for (let i = 0; i < topicEles.length; i++) {
    const attributeId = topicEles[i].getAttribute("id");
    const localName = topicEles[i].localName;
    let marginLeft = "";

    if (localName === "h2") {
      marginLeft = "1rem";
    } else if (localName === "h3") {
      marginLeft = "2rem";
    }

    const content = `
      <div id="topic-${attributeId}" class="hover"  style="margin-left: ${marginLeft}">
        ${topicEles[i].textContent}
      </div>
    `;

    topicList.push({ id: attributeId, content, item: topicEles[i] });
  }

  Hooks.Mouse.wheelRollsUpAndDown(
    {
      on: () => {
        highlightCurrentTopic(topicEles, title => {
          const inviewportTopic = document.querySelector("#topic-" + title.id);

          if (lastTopic) {
            lastTopic.classList.remove("active-topic");
          }

          inviewportTopic.classList.add("active-topic");

          lastTopic = inviewportTopic;
        });
      }
    },
    { throttle: 50 }
  );

  return topicList;
}

function catalogRender(content: HTMLDivElement) {
  catalogList.value = generateTopicList(content);
}

function clickToc(toc: any) {
  Utils.Browser.scrollIntoView(`#${toc.id}`);
}

defineExpose({
  catalogRender
});
</script>

<template>
  <div v-if="catalogList && catalogList.length" class="catalog flow-auto h-87.5%">
    <div class="w-80%">
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
    --uno: text-0.8rem text-text-regular mb-2;
  }
}
</style>

<style>
.active-topic {
  --uno: text-theme-primary transition-all-300 text-0.9rem;
}
</style>
