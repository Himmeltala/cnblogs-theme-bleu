<script setup lang="ts">
const route = useRoute();
const ldisabled = ref(true);
const rdisabled = ref(true);
const catalogDisabled = ref(!EcyConfig.pcDevice);

provide("ldisabled", ldisabled);
provide("rdisabled", rdisabled);
provide("catalogDisabled", catalogDisabled);

watch(route, async () => {
  if (route.name === RouterName.Index) {
    EcyUtils.setTitle();
  }
});
</script>

<template>
  <div id="l-content" class="fade-in-out relative">
    <div id="l-top-nail"></div>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <KeepAlive :include="[RouterName.Index, RouterName.MarkList, RouterName.Profile, RouterName.WorksByCalendar]">
          <Suspense>
            <component :is="Component" />
          </Suspense>
        </KeepAlive>
      </template>
    </RouterView>
    <div id="l-bottom-nail"></div>
  </div>
  <div class="l-tools">
    <div id="l-progress" class="z-9999 fixed left-0 top-0 w-100vw">
      <div class="track absolute top-0">
        <div class="bar rd-2"></div>
      </div>
    </div>
    <div id="l-matte" class="fixed top-0 left-0 l-matee-bg z-9999" :class="{ 'w-100% h-100vh': !rdisabled || !ldisabled }"></div>
    <LeftMenu :disabled="ldisabled" />
    <RightMenu :disabled="rdisabled" />
    <ToolKits />
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
    @for $index from 0 to 25 {
      #{$index * 4%} {
        left: $index * 4vw;
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
@include mb() {
  #l-github {
    display: none;
  }
}

.fade-in-out {
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
