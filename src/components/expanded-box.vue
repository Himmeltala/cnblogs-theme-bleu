<script setup lang="ts">
const localSetting = EcyUtils.getLocalSetting();
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false
  }
});

const title = `${props.text}`;
if (!localSetting.value.menu.toggles[title]) {
  localSetting.value.menu.toggles[title] = {
    open: true,
    show: true
  };
}

const content = ref();
const height = ref();

function toggle() {
  if (localSetting.value.menu.toggles[title]?.open) {
    content.value.style.height = `${0}px`;
    localSetting.value.menu.toggles[title].open = !localSetting.value.menu.toggles[title].open;
  } else {
    content.value.style.height = `${height.value}px`;
    localSetting.value.menu.toggles[title].open = !localSetting.value.menu.toggles[title].open;
  }
}

onMounted(() => {
  height.value = content.value.offsetHeight;

  if (!props.disabled) {
    if (!localSetting.value.menu.toggles[title]?.open) {
      content.value.style.height = `${0}px`;
    } else {
      content.value.style.height = `${height.value}px`;
    }
  }
});
</script>

<template>
  <div class="l-expbox mb-6" v-show="localSetting.menu.toggles[title]?.show">
    <div class="title headtip mb-4 f-c-b l-size-5 l-color-1">
      <div class="f-c-s">
        <div class="f-c-c mr-1">
          <slot name="icon"></slot>
        </div>
        {{ text }}
      </div>
      <div
        v-if="!disabled"
        @click="toggle"
        class="f-c-c opacity-70 hover"
        :class="{ 'arrow-up': !localSetting.menu.toggles[title]?.open, 'arrow-down': localSetting.menu.toggles[title]?.open }">
        <div class="arrow f-c-c">
          <i-ep-arrow-down />
        </div>
      </div>
    </div>
    <div ref="content" class="content l-color-2">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.headtip {
  padding-left: 0.4rem;
  border-radius: 0.25rem;
  border-left: 0.25rem solid var(--el-color-primary);
}

.arrow {
  transform: scale(0, 0);
}

.title:hover .arrow {
  transform: scale(1, 1);
}

.arrow-up {
  animation: arrow-up-animation 0.3s ease-in;
  transform: rotate(180deg);
}

.arrow-down {
  animation: arrow-down-animation 0.3s ease-in;
  transform: rotate(0deg);
}

@keyframes arrow-up-animation {
  @for $index from 0 to 10 {
    #{$index * 10%} {
      transform: rotate($index * 18deg);
    }
  }
}

@keyframes arrow-down-animation {
  @for $index from 0 to 10 {
    #{$index * 10%} {
      transform: rotate(180deg - $index * 18deg);
    }
  }
}

.content {
  overflow: hidden;
  transition: var(--l-animation-effect);
}
</style>
