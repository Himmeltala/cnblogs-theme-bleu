<script setup lang="ts">
const loading = new Utils.Broswer.Loading();

loading.startLoading();

onMounted(() => {
  loading.endLoading();

  const texts = [
    "你好，很高兴认识你，接下来将自我介绍，",
    "我是一个 Web <Developer />，",
    "技术栈：Vue.js、React.js，",
    "喜欢日漫、游戏，",
    "座右铭：Time tick away, dream faded away!"
  ];

  const typewriter = new Utils.Typewriter({ texts, el: "typewriter", rem: 2 });
  typewriter.type();
});
</script>

<template>
  <div id="typewriter" class="typewriter text-2rem"></div>
</template>

<style scoped lang="scss">
.typewriter {
  overflow: hidden;
  border-right: 0.15rem solid orange;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  from {
    border-color: transparent;
  }
  to {
    border-color: orange;
  }
}
</style>
