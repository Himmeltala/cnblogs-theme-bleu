<script lang="ts" setup>
defineProps({
  data: {
    type: Object as PropType<any>,
    required: true
  }
});

function scrollIntoView(selector: string) {
  document.querySelector(selector).scrollIntoView();
}
</script>

<template>
  <div class="container">
    <div
      v-if="data.id === 'h1'"
      :id="'topic-' + data.title"
      :class="data.class"
      class="hover"
      @click="scrollIntoView(`#${data.title}`)">
      {{ data.content }}
    </div>
    <div
      v-else-if="data.id === 'h2'"
      :id="'topic-' + data.title"
      :class="data.class"
      class="hover ml-4"
      @click="scrollIntoView(`#${data.title}`)">
      {{ data.content }}
    </div>
    <div
      v-else-if="data.id === 'h3'"
      :id="'topic-' + data.title"
      :class="data.class"
      class="hover ml-6"
      @click="scrollIntoView(`#${data.title}`)">
      {{ data.content }}
    </div>
    <div v-if="data.children">
      <Topic v-for="child in data.children" :key="child.id" :data="child" />
    </div>
  </div>
</template>
