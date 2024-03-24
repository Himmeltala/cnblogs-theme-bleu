<script setup lang="ts">
const loading = new Utils.Broswer.Loading();

loading.startLoading();
let tw: any = null;
const offsetHeight = ref(0);

onMounted(() => {
  loading.endLoading();

  const texts = [
    "很高兴认识你，我是一位 Web <Developer />",
    "很喜欢日漫、游戏",
    "技术栈 Vue.js、React.js、Python、Java",
    "座右铭 “时光飞逝，梦想消逝！”"
  ];

  tw = new Utils.TypeWriter({ texts, el: "tw", rem: 1.2 });
  tw.type();
  offsetHeight.value = tw.offsetHeight;
});

onUnmounted(() => {
  tw.clearTimers();
});
</script>

<template>
  <div class="page f-c-c">
    <div class="lg-sm:w-55vw lt-sm:w-90vw">
      <div class="text-1.5rem">Hi~👋, I'm {{ Consts.getBlogApp() }}.</div>
      <div :style="{ height: offsetHeight + 'px' }">
        <div id="tw" class="text-1.2rem mt-2"></div>
      </div>
      <div class="f-c-c mt-10">
        <div
          class="hover ml-4"
          @click="Utils.Navigation.go(item.value)"
          v-if="Consts.config.header.links?.length"
          v-for="item in Consts.config.header.links">
          <div v-if="item.icon" v-html="item.icon" class="f-c-c"></div>
          <div v-else class="f-c-c">
            <img class="w-8 h-8 object-cover rd-50%" :src="item.src" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#tw {
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
