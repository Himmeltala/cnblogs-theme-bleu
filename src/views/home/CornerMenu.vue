<script setup lang="ts">
import { useWheelRollsUpAndDown } from "@/hooks/use-mouse";

const isWinUp = ref(false);
const isActiveMenu = ref(false);

onMounted(() => {
  useWheelRollsUpAndDown(
    () => {
      isWinUp.value = false;
    },
    () => {
      isWinUp.value = true;
    },
    {
      throttle: 50
    }
  );
});
</script>

<template>
  <div class="l-menu">
    <div
      @click="isActiveMenu = !isActiveMenu"
      class="transition-all-300 select-none cursor-pointer f-c-c w-20 h-20 fixed-t top-0 z-99"
      :class="{
        'static-menu': !isActiveMenu,
        'active-menu': isActiveMenu,
        'left--20': !isWinUp,
        'left-0': isWinUp || isActiveMenu
      }"
      b="rd-rb-4">
      <div v-show="!isActiveMenu">
        <div class="i-tabler-menu2 text-2.5rem"></div>
      </div>
      <div v-show="isActiveMenu">
        <div class="i-tabler-x cursor-pointer text-2.5rem"></div>
      </div>
    </div>
    <div
      class="transition-all-300 fixed-lt w-70 h-100vh z-90 bg-ba"
      :class="{ 'close-menu-body': !isActiveMenu, 'open-menu-body': isActiveMenu }">
      <div class="flow-auto select-none scroll-none h-100% mt-30">
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
          <div class="hover mb-10 font-art" @click="$router.push(RouterPath.ArbeitenByCalendar())">
            我的日历
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="!isActiveMenu" class="font-art lt-sm:hidden fixed-lb z-9 ml-2">
    <div
      class="f-c-c flex-col"
      @click="Navigation.go('http://github.com/' + BleuVars.getBlogApp())">
      <div class="write-vertical-left text-0.9rem text-secondary bounce hover mb-4">
        {{ BleuVars.getBlogApp() }}'s github
      </div>
      <div class="i-tabler-brand-github hover mb-4 text-1.2rem text-secondary"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.l-menu {
  .static-menu {
    background-color: var(--l-text-primary);
    color: white;
  }

  .active-menu {
    background-color: white;
    color: var(--l-text-primary);
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
