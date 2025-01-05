<script lang="ts" setup></script>

<template>
  <div id="l-progress" class="z-999999 fixed left-0 top-0 w-100vw">
    <div class="track absolute top-0">
      <div class="bar rd-2"></div>
    </div>
  </div>
  <div id="l-content" class="fade-in-out relative z-99 mt-20">
    <div id="l-top-nail"></div>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </template>
    </RouterView>
    <div id="l-bottom-nail"></div>
  </div>
  <div
    :style="{
      'background-image': 'url(' + Consts.config.images.background.src + ')',
      'background-size': Consts.config.images.background.size,
      'background-repeat': Consts.config.images.background.repeat,
      'background-position': Consts.config.images.background.position,
      opacity: Consts.config.images.background.opacity
    }"
    class="fixed left-0 top-0 w-100vw h-100vh"></div>
</template>

<style lang="scss">
#l-progress {
  height: 0.15rem;

  .bar,
  .track {
    height: 100%;
    background: var(--bleu-theme-color-primary);
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
