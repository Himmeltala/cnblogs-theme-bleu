<script setup lang="ts">
const loading = new Utils.Browser.Loading();

loading.startLoading();
let tw: any = null;
const offsetHeight = ref(0);

onMounted(() => {
  loading.endLoading();
  tw = new Utils.TypeWriter({
    texts: Consts.config.welcome.texts,
    el: "tw",
    rem: 1.3,
    blinkSpace: 0
  });
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
      <div class="f-c-c">
        <div>
          <div class="f-c-c">
            <div class="position-relative w-50 h-50">
              <img :src="Consts.config.avatar" class="w-50 h-50 object-cover rd-50%" />
              <div
                class="position-absolute bottom-0 right-0 f-c-c w-10 h-10 rd-50% dark:bg-#323232 light:bg-#f2f2f2">
                {{ Consts.config.status || "🐟" }}
              </div>
            </div>
          </div>
          <div class="text-2rem mt-4 font-bold">
            <div>Hi~👋,</div>
            <div>
              I'm <span class="shine-text">{{ Consts.getBlogApp() }}.</span>
            </div>
          </div>
          <div class="text-1.2rem font-bold mt-2" :style="{ height: offsetHeight + 'px' }">
            <div id="tw"></div>
          </div>
          <div class="f-c-c mt-10">
            <div
              class="hover ml-4"
              @click="Utils.Navigation.go(item.value)"
              v-if="Consts.config.header.paths?.length"
              v-for="item in Consts.config.header.paths">
              <div v-if="item.icon" v-html="item.icon" class="f-c-c"></div>
              <div v-else class="f-c-c">
                <img class="w-8 h-8 object-cover rd-50%" :src="item.src" />
              </div>
            </div>
          </div>
          <div class="f-c-c mt-30">
            <div class="circle" @click="$router.push(Consts.Paths.posts(1))"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#tw {
  overflow: hidden;
  border-right: 0.15rem solid var(--bleu-theme-color-primary);
  animation: blink 0.8s infinite;
}

@keyframes blink {
  from {
    border-color: transparent;
  }
  to {
    border-color: var(--bleu-theme-color-primary);
  }
}

@keyframes wave {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.circle {
  position: relative;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5); /* 设置光圈的颜色和透明度 */
  animation: wave 2s ease-out infinite; /* 添加波浪动画 */
}
</style>
