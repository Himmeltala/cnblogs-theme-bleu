<script setup lang="ts">
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
      :class="data.class"
      class="hover"
      :id="'topic-' + data.title"
      @click="scrollIntoView(`#${data.title}`)">
      {{ data.content }}
    </div>
    <div
      v-else-if="data.id === 'h2'"
      :class="data.class"
      class="hover ml-4"
      :id="'topic-' + data.title"
      @click="scrollIntoView(`#${data.title}`)">
      {{ data.content }}
    </div>
    <div
      v-else-if="data.id === 'h3'"
      :class="data.class"
      class="hover ml-6"
      :id="'topic-' + data.title"
      @click="scrollIntoView(`#${data.title}`)">
      {{ data.content }}
    </div>
    <div v-if="data.children">
      <Topic v-for="child in data.children" :key="child.id" :data="child" />
    </div>
  </div>
</template>
