<script setup lang="ts">
import { useBaseAuthorData } from "@/store";
import { getMasterData, getAuthorData } from "@/apis/remote-api";

const route = useRoute();
const setting = EcyUtils.getSetting();
const ldisabled = ref(true);
const rdisabled = ref(true);
const { setBaseAuthorData } = useBaseAuthorData();

getAuthorData().then(author => {
  getMasterData().then(master => {
    setBaseAuthorData({ author, master });
  });
});

onMounted(() => {
  document.getElementById("l-lstrip").onclick = () => {
    ldisabled.value = !ldisabled.value;
  };

  document.getElementById("l-rstrip").onclick = () => {
    rdisabled.value = !rdisabled.value;
  };

  document.getElementById("l-matte").onclick = () => {
    if (!ldisabled.value) ldisabled.value = true;
    else if (!rdisabled.value) rdisabled.value = true;
  };

  document.getElementById("l-background__img").setAttribute("src", setting.value.background.src);
  document.getElementById("l-background__img").setAttribute("src", setting.value.background.src);
});

watch(route, async () => {
  if (route.name === "Index" || route.name === "EssayList") {
    document.querySelector("title").innerText = `${EcyConfig.blogApp} - 博客园`;
  }
});
</script>

<template>
  <div id="l-left">
    <GitHub />
    <ContextMenu>
      <div id="l-background" class="fixed left-0 top-0 w-100vw h-100vw">
        <img v-show="setting.background.src && setting.background.open" id="l-background__img" class="w-100% h-100%" />
      </div>
      <template #title> 主题设置 </template>
      <template #content>
        <ThemeSetting />
      </template>
    </ContextMenu>
    <div
      id="l-lstrip"
      v-show="!setting.cabinet.left.pin"
      class="fixed z-2 left-0 top-47.5vh w-5px h-5vh rd-2 cursor-pointer opacity-70 l-strip-bg"></div>
    <Suspense>
      <LeftCabinet :disabled="ldisabled" />
    </Suspense>
    <div id="l-progress" class="z-99 fixed left-0 top-0 w-100vw">
      <div class="l-pro__track absolute top-0">
        <div class="l-pro__bar rd-2"></div>
      </div>
    </div>
  </div>
  <div id="l-content" class="z-1 l-transition">
    <div id="l-top-nail"></div>
    <div :class="{ 'l-box-bg': !setting.card.open, 'py-2 px-4': !EcyConfig.pcDevice }">
      <div id="l-main">
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <KeepAlive :include="['Home', 'MarkList', 'Index', 'Calendar']">
              <Suspense>
                <component :is="Component" />
              </Suspense>
            </KeepAlive>
          </template>
        </RouterView>
      </div>
    </div>
    <div id="l-bottom-nail"></div>
    <div class="l-copyright f-c-c my-2 l-six-size l-sec-color h-8">
      <div class="l-copyright__content">
        <div class="f-c-c">
          <div>
            Powered by <a class="hover" href="https://www.cnblogs.com" target="__blank">博客园</a> Copyright © {{ EcyConfig.blogApp }}
          </div>
        </div>
        <div class="f-c-c mt-1">
          <div>
            Powered by
            <a class="hover" href="https://github.com/Himmelbleu/cnblogs-theme-ecy" target="__blank"> Himmelbleu </a>
            <a class="hover" href="https://v3.cn.vuejs.org/" target="__blank"> Vue3 </a>
            on
            <a class="hover" href="https://vitejs.cn/vite3-cn/" target="__blank"> Vite.</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="l-right">
    <div id="l-matte" class="fixed top-0 left-0 z-3 l-matee-bg" :class="{ 'w-100% h-100vh': !rdisabled || !ldisabled }"></div>
    <div
      id="l-rstrip"
      v-show="!setting.cabinet.right.pin"
      class="fixed z-2 right-0 top-47.5vh w-5px h-5vh rd-2 cursor-pointer opacity-70 l-strip-bg"></div>
    <RightCabinet :disabled="rdisabled" />
    <ToolKits />
  </div>
</template>

<style lang="scss">
#l-progress {
  height: 0.15rem;

  .l-pro__bar,
  .l-pro__track {
    height: 100%;
    background: var(--l-theme-color);
  }

  .l-pro__bar.bar-active {
    animation: active-animation 3s infinite ease-in-out;
    width: 3rem;
  }

  .l-pro__track.track-active {
    animation: track-active-animation 4s infinite ease-in;
  }

  @keyframes active-animation {
    @for $index from 0 to 10 {
      #{$index * 10%} {
        width: 3rem + $index * 0.2rem;
      }
    }
  }

  @keyframes track-active-animation {
    @for $index from 0 to 25 {
      #{$index * 4%} {
        left: $index * 4vw;
      }
    }
  }

  .l-pro__bar.static {
    width: 0vw;
  }

  .l-pro__track.static {
    left: 0;
  }
}
</style>

<style scoped lang="scss">
@include pc() {
  #l-content {
    width: var(--content-width);
  }
}

@include mb() {
  #l-content {
    width: 100%;
  }
}

#l-background::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  backdrop-filter: blur(var(--l-bg-filter));
}

.l-transition {
  animation: transition-animation 0.5s ease-in;

  @keyframes transition-animation {
    @for $index from 0 to 10 {
      #{$index * 10%} {
        opacity: math.div($index, 10);
      }
    }
  }
}
</style>
