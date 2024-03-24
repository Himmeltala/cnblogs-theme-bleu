<script setup lang="ts"></script>

<template>
  <NavHeader></NavHeader>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
  </RouterView>
  <div
    class="fixed left-0 top-0 w-100vw h-100vh"
    :style="{
      'background-image': 'url(' + Consts.config.images.background.src + ')',
      'background-size': Consts.config.images.background.size,
      'background-repeat': Consts.config.images.background.repeat,
      'background-position': Consts.config.images.background.position,
      opacity: Consts.config.images.background.opacity
    }"></div>
</template>

<style lang="scss"></style>
