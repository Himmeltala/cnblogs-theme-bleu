<script setup lang="ts">
const setting = EcyUtils.getSetting();
const menu = ref<HTMLElement>();
const movbox = ref();
const disabled = ref(true);

onMounted(() => {
  menu.value.onmouseup = e => {
    if (e.button == 2) {
      disabled.value = !disabled.value;
      movbox.value.x = e.clientX;
      movbox.value.y = e.clientY;
    }
  };
});
</script>

<template>
  <div ref="menu" class="l-menu">
    <slot />
    <Teleport to="#l-menu-container">
      <MovableBox ref="movbox" :disabled="disabled" :class="{ 'l-box-bg': !setting.card.open }">
        <template #head>
          <div class="f-c-b">
            <div class="headtip mr-4">
              <slot name="title" />
            </div>
            <div class="hover f-c-c" @click="disabled = !disabled">
              <i-ep-close />
            </div>
          </div>
        </template>
        <slot name="content" />
      </MovableBox>
    </Teleport>
  </div>
</template>
