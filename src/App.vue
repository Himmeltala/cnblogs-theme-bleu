<script setup lang="ts">
import { useWheelRollsUpAndDown } from "@/hooks/use-mouse";

const isActiveMenu = ref(false);
const disabled = ref(!BleuVars.isPcDevice());
const isShowMenu = ref(false);

provide(ProvideKey.Katalog, disabled);

onMounted(() => {
  useWheelRollsUpAndDown(
    () => {
      isShowMenu.value = false;
    },
    () => {
      isShowMenu.value = true;
    },
    {
      throttle: 50
    }
  );
});
</script>

<template>
  <!-- 进度条 -->
  <div id="l-progress" class="z-9999 fixed-lt w-100vw">
    <div class="track absolute top-0">
      <div class="bar rd-2"></div>
    </div>
  </div>
  <!-- 主要内容 -->
  <div id="l-content" class="fade-in-out relative z-9" @click="isActiveMenu = false">
    <div id="l-top-nail"></div>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <KeepAlive
          :include="[
            RouterName.BleuHome,
            RouterName.MarkList,
            RouterName.ArbeitenByCalendar,
            RouterName.ArbeitenList
          ]">
          <Suspense>
            <component :is="Component" />
          </Suspense>
        </KeepAlive>
      </template>
    </RouterView>
    <div id="l-bottom-nail"></div>
  </div>
  <!-- 工具箱 -->
  <ToolKits />
  <!-- 背景 -->
  <div
    class="l-background fixed-lt w-100vw h-100vh"
    :style="{
      'background-image': 'url(' + BleuVars.config.images.bg.src + ')',
      opacity: BleuVars.config.images.bg.opacity
    }"></div>
  <!-- GitHub -->
  <div v-show="!isActiveMenu" class="l-github lt-sm:hidden fixed-lb z-9" m="l-2">
    <div
      class="f-c-c flex-col"
      @click="Navigation.go({ path: 'http://github.com/' + BleuVars.getBlogApp() })">
      <div class="write-vertical-left font-art bounce hover" m="b-4" text="4 b">
        {{ BleuVars.getBlogApp() }}'s Github
      </div>
      <div class="i-tabler-brand-github hover" text="b 7" m="b-4"></div>
    </div>
  </div>
  <!-- 导航栏 -->
  <div class="l-menu">
    <!-- 按钮 -->
    <div
      @click="isActiveMenu = !isActiveMenu"
      class="transition-all-300 select-none cursor-pointer f-c-c w-20 h-20 fixed-t top-0 z-99"
      :class="{
        'static-menu': !isActiveMenu,
        'active-menu': isActiveMenu,
        'left--20': !isShowMenu,
        'left-0': isShowMenu
      }"
      b="rd-rb-4">
      <div v-show="!isActiveMenu">
        <div class="i-tabler-menu2 text-2.2rem"></div>
        <div text="center 0.9rem" class="font-art">菜单</div>
      </div>
      <div v-show="isActiveMenu">
        <div text="15" class="i-tabler-x cursor-pointer" />
      </div>
    </div>
    <!-- 内容 -->
    <div
      class="transition-all-300 fixed-lt w-70 h-100vh z-90 bg-drop-primary"
      :class="{ 'close-menu-body': !isActiveMenu, 'open-menu-body': isActiveMenu }">
      <div class="flow-auto select-none scroll-none h-100% mt-30 text-1.2rem">
        <div class="menu-list ml-10">
          <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#l-top-nail')">
            回到顶部
          </div>
          <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#tags-nail')">
            我的标签
          </div>
          <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#essay-nail')">
            随笔分类
          </div>
          <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#article-nail')">
            文章分类
          </div>
          <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#essay-archive-nail')">
            随笔归档
          </div>
          <div
            class="hover mb-10 font-art"
            @click="Broswer.scrollIntoView('#article-archive-nail')">
            文章归档
          </div>
          <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#my-pohoto-nail')">
            我的相册
          </div>
          <div
            class="hover mb-10 font-art"
            @click="Navigation.go({ path: RouterPath.ArbeitenByCalendar(), router: $router })">
            我的日历
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#l-progress {
  height: 0.15rem;

  .bar,
  .track {
    height: 100%;
    background: var(--l-theme-color);
  }

  .bar.bar-active {
    width: 3rem;
  }

  .track.track-active {
    animation: track-active-animation 4s infinite ease-in;
  }

  @keyframes track-active-animation {
    @for $i from 0 to 25 {
      #{$i * 4%} {
        left: $i * 4vw;
      }
    }
  }

  .bar.static {
    width: 0;
  }

  .track.static {
    left: 0;
  }
}
</style>

<style scoped lang="scss">
.l-background {
  background-size: 40% auto;
  background-repeat: repeat;
}

.l-menu {
  .static-menu {
    background-color: var(--l-theme-color);
    color: white;
  }

  .active-menu {
    background-color: white;
    color: var(--l-theme-color);
  }

  .close-menu-body {
    left: -17.5rem;

    .menu-list > div {
      opacity: 0;
    }
  }

  .open-menu-body {
    left: 0;

    @for $i from 0 to 9 {
      .menu-list > div:nth-child(#{$i}) {
        opacity: 1;
        transition-delay: #{$i * 0.06}s !important;
      }
    }
  }
}
</style>
