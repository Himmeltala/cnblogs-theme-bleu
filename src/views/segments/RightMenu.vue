<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    default: true
  }
});

const block = computed(() => {
  return !props.disabled;
});

const hidden = computed(() => {
  return props.disabled;
});
</script>

<template>
  <div
    id="l-rmenu"
    class="noscroll z-9999 l-size-2 h-100vh flow-auto fixed top-0 right-0 l-back-bg p-3 w-17.5rem"
    :class="{ 'show-rmenu ': block, 'hidden-rmenu': hidden }">
    <ExpandableBox text="常用链接" v-if="EcyConfig.__ECY_CONFIG__.menu.links?.length">
      <template #icon>
        <i-ep-link />
      </template>
      <a class="hover block mb-3" v-for="item in EcyConfig.__ECY_CONFIG__.menu.links" :href="item.href" target="_blank">
        {{ item.text }}
      </a>
    </ExpandableBox>
    <ExpandableBox text="推荐书籍" v-if="EcyConfig.__ECY_CONFIG__.menu.books?.length">
      <template #icon>
        <i-ep-notebook />
      </template>
      <div class="mb-3 f-c-b" v-for="item in EcyConfig.__ECY_CONFIG__.menu.books">
        <img class="h-25 w-20" :src="item.img" alt="FAILED" />
        <div style="width: calc(100% - 6rem)">
          <div class="mb-1" v-if="!item.href">
            <span>{{ item.text }}</span>
          </div>
          <div class="mb-2" v-else>
            <a class="hover" target="_blank" :href="item.href">
              {{ item.text }}
            </a>
          </div>
          <div class="mb-1">{{ item.author }}</div>
          <el-rate style="width: 100%" v-model="item.rate" disabled size="small" />
        </div>
      </div>
    </ExpandableBox>
  </div>
</template>

<style scoped lang="scss">
$quota: 10;

#l-rmenu {
  transition: var(--l-animation-effect);
}

.show-rmenu {
  animation: showrmenu 0.3s linear;
  transform: translateX(0);
}

@keyframes showrmenu {
  @for $i from 0 to $quota {
    #{$i * 10%} {
      transform: translateX(calc(17.5rem + $i * -1.75rem));
    }
  }
}

.hidden-rmenu {
  animation: hiddenrmenu 0.3s linear;
  transform: translateX(17.5rem);
}

@keyframes hiddenrmenu {
  @for $i from 0 to $quota {
    #{$i * 10%} {
      transform: translateX($i * 1.75rem);
    }
  }
}
</style>
