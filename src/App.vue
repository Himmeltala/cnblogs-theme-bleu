<script setup lang="ts">
import zhCn from "element-plus/lib/locale/lang/zh-cn";

const disabled = ref(!BleuVars.isPcDevice());

provide(ProvideKey.Catalog, disabled);
</script>

<template>
  <div id="l-progress" class="z-9999 fixed-lt w-100vw">
    <div class="track absolute top-0">
      <div class="bar rd-2"></div>
    </div>
  </div>
  <div id="l-content" class="fade-in-out relative z-9">
    <div id="l-top-nail"></div>
    <el-config-provider :locale="zhCn">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <KeepAlive
            :include="[RouterName.BleuHome, RouterName.MarkList, RouterName.ArbeitenByCalendar]">
            <Suspense>
              <component :is="Component" />
            </Suspense>
          </KeepAlive>
        </template>
      </RouterView>
    </el-config-provider>
    <div id="l-bottom-nail"></div>
  </div>
  <ToolKits />
  <div
    class="fixed-lt w-100vw h-100vh"
    :style="{
      'background-image': 'url(' + BleuVars.config.images?.background?.src || '' + ')',
      'background-size': BleuVars.config.images?.background?.size || '50 auto',
      'background-repeat': BleuVars.config.images?.background?.repeat || 'repeat',
      'background-position': BleuVars.config.images?.background?.position || '100%',
      opacity: BleuVars.config.images?.background?.opacity || 0.03
    }"></div>
</template>

<style lang="scss">
#l-progress {
  height: 0.15rem;

  .bar,
  .track {
    height: 100%;
    background: var(--text-primary);
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
