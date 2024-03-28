<script setup lang="ts"></script>

<template>
  <NavHeader></NavHeader>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
  </RouterView>
</template>

<style lang="scss"></style>
