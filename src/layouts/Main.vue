<script lang="ts" setup></script>

<template>
  <Navigation></Navigation>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
  </RouterView>
</template>

<style lang="scss"></style>
