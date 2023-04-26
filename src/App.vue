<script setup lang="ts">
const route = useRoute();
const ldisabled = ref(true);
const rdisabled = ref(true);
const catalogDisabled = ref(!EcyConfig.pcDevice);

provide(ProvideKey.CATALOG_DISABLED, catalogDisabled);

onMounted(() => {
  const eleL = document.getElementById("l-ldisabled");
  const eleR = document.getElementById("l-rdisabled");
  const eleMatte = document.getElementById("l-matte");

  eleL.addEventListener("mouseover", () => {
    ldisabled.value = !ldisabled.value;
  });

  eleR.addEventListener("mouseover", () => {
    rdisabled.value = !rdisabled.value;
  });

  eleMatte.addEventListener("click", () => {
    if (!ldisabled.value) {
      ldisabled.value = true;
    } else if (!rdisabled.value) {
      rdisabled.value = true;
    }
  });
});

watch(route, async () => {
  if (route.name === RouterName.INDEX) {
    EcyUtils.setTitle();
  }
});
</script>

<template>
  <div id="l-progress" class="z-9999 fixed left-0 top-0 w-100vw">
    <div class="track absolute top-0">
      <div class="bar rd-2"></div>
    </div>
  </div>
  <div id="l-matte" class="fixed top-0 left-0 l-matee-bg z-9999" :class="{ 'w-100% h-100vh': !rdisabled || !ldisabled }"></div>
  <div id="l-content" class="fade-in-out relative">
    <div id="l-top-nail"></div>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <KeepAlive :include="[RouterName.INDEX, RouterName.MARK_LIST, RouterName.PROFILE, RouterName.WORKS_BY_CALENDAR]">
          <Suspense>
            <component :is="Component" />
          </Suspense>
        </KeepAlive>
      </template>
    </RouterView>
    <div id="l-bottom-nail"></div>
  </div>
  <ToolKits />
  <div id="l-ldisabled" class="z-99 h-30vh w-4 fixed left-0 top-30vh"></div>
  <LeftMenu :disabled="ldisabled" />
  <div id="l-rdisabled" class="z-99 h-30vh w-4 fixed right-0 top-30vh"></div>
  <RightMenu :disabled="rdisabled" />
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
