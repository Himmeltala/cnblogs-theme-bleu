<script setup lang="ts">
const route = useRoute();
const ldisabled = ref(true);
const rdisabled = ref(true);
const indexImgs = EcyConfig.__ECY_CONFIG__.covers.index || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];

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
});

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
    <div id="l-progress" class="z-99999 fixed left-0 top-0 w-100vw">
      <div class="track absolute top-0">
        <div class="bar rd-2"></div>
      </div>
    </div>
    <div id="l-backmask" class="fixed left-0 top-0 w-100vw h-100vh">
      <div class="relative w-100% h-100%">
        <img class="cover w-100% h-100%" :src="indexImgs[Math.floor(Math.random() * indexImgs.length)]" />
      </div>
    </div>
    <div id="l-matte" class="fixed top-0 left-0 l-matee-bg z-99" :class="{ 'w-100% h-100vh': !rdisabled || !ldisabled }"></div>
    <div id="l-lstrip" class="z-9 fixed left-0 top-47.5vh w-5px h-5vh rd-2 cursor-pointer opacity-70 l-strip-bg"></div>
    <LeftMenu :disabled="ldisabled" />
    <div id="l-rstrip" class="z-9 fixed right-0 top-47.5vh w-5px h-5vh rd-2 cursor-pointer opacity-70 l-strip-bg"></div>
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
    animation: active-animation 3s infinite ease-in-out;
    width: 3rem;
  }

  .track.track-active {
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

  .bar.static {
    width: 0vw;
  }

  .track.static {
    left: 0;
  }
}

#l-backmask {
  img {
    opacity: 0.05;
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
