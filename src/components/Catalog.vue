<script lang="ts" setup>
const props = defineProps({
  html: {
    type: Object as PropType<any>
  }
});

const topics = ref<TopicType[]>([]);

function generate(content: HTMLDivElement) {
  const headings = content.querySelectorAll("h1, h2, h3");
  let structure: TopicType[] = [];
  let h1Index = -1;
  let h2Index = -1;

  headings.forEach(heading => {
    const tagName = heading.tagName.toLowerCase();
    const attributeId = heading.getAttribute("id");

    if (tagName === "h1") {
      structure.push({
        id: "h1",
        title: attributeId,
        class: "topic-h1 topic",
        content: heading.textContent,
        children: []
      });
      h1Index++;
      h2Index = -1;
    } else if (tagName === "h2") {
      if (!structure[h1Index].children[h2Index + 1]) {
        structure[h1Index].children.push({
          id: "h2",
          title: attributeId,
          class: "topic-h2 topic",
          content: heading.textContent,
          children: []
        });
        h2Index++;
      }
    } else if (tagName === "h3") {
      if (!structure[h1Index].children[h2Index].children) {
        structure[h1Index].children[h2Index].children = [];
      }
      structure[h1Index].children[h2Index].children.push({
        id: "h3",
        title: attributeId,
        class: "topic-h3 topic",
        content: heading.textContent
      });
    }
  });

  return structure;
}

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

let inViewdTopic: Element;

onMounted(() => {
  Hooks.Mouse.useWheelRollsUpAndDown(
    {
      on: () => {
        const headings = props.html.querySelectorAll("h1, h2, h3");

        highlightCurrentTopic(headings, title => {
          const inViewTopic = document.querySelector("#topic-" + title.id);
          if (inViewdTopic) {
            inViewdTopic.classList.remove("active-topic");
          }
          inViewTopic.classList.add("active-topic");
          inViewdTopic = inViewTopic;
        });
      }
    },
    { throttle: 50 }
  );
});

defineExpose({
  initialize: (content: HTMLDivElement) => {
    topics.value = generate(content);
  }
});
</script>

<template>
  <div v-if="topics?.length" class="catalog flow-auto h-87.5%">
    <div class="w-80%">
      <div class="mb-2">文章目录</div>
      <Topic v-for="item in topics" :key="item.id" :data="item" />
    </div>
  </div>
</template>

<style lang="scss">
.catalog {
  .topic {
    --uno: text-0.8rem text-text-regular mb-1;
  }

  .active-topic {
    --uno: text-0.9rem text-theme-primary transition-all-300;
  }
}
</style>
