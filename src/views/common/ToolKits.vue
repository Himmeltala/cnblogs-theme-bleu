<script setup lang="ts">
const route = useRoute();
const setting = EcyUtils.getLocalSetting();
const isToTop = ref(false);
const isToBottom = ref(true);
const isShowGuide = ref(false);
let html: HTMLElement;
let topNail: HTMLElement;
let bottomNail: HTMLElement;
const catalogDisabled = inject<boolean>("catalogDisabled");

onMounted(() => {
  html = document.querySelector("html");
  topNail = document.querySelector("#l-top-nail");
  bottomNail = document.querySelector("#l-bottom-nail");

  window.addEventListener(
    "scroll",
    useThrottleFn(() => {
      const ratio = window.scrollY / Number(document.body.clientHeight);
      if (ratio <= 0.5) {
        isToBottom.value = true;
        isToTop.value = false;
      } else if (ratio > 0.5 && ratio <= 1) {
        isToTop.value = true;
        isToBottom.value = false;
      }
    }, 200)
  );
});

function moveScroll(dom: HTMLElement) {
  dom.scrollIntoView();
  isToTop.value = !isToTop.value;
  isToBottom.value = !isToBottom.value;
}

function toggleMode() {
  if (setting.value.theme.mode === "dark") {
    html.className = "light";
    setting.value.theme.mode = "light";
  } else {
    html.className = "dark";
    setting.value.theme.mode = "dark";
  }
}

watch(route, () => {
  if (route.name !== RouterName.Works) {
    isShowGuide.value = false;
  } else {
    isShowGuide.value = true;
  }
});
</script>

<template>
  <div id="l-toolkits" class="fixed z-99 right-20 top-55vh l-size-4">
    <div
      v-show="isShowGuide"
      :class="{ 'show-0': setting.toolkits.pin, 'close-0': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="catalogDisabled = !catalogDisabled">
      <div class="f-c-c w-8 h-8">
        <i-ep-guide />
      </div>
    </div>
    <div
      :class="{ 'show-1': setting.toolkits.pin, 'close-1': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="EcyUtils.Router.go({ path: RouterPath.index(), router: $router })">
      <div class="f-c-c w-8 h-8">
        <i-ep-house />
      </div>
    </div>
    <div
      :class="{ 'show-2': setting.toolkits.pin, 'close-2': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="EcyUtils.Router.go({ path: 'back', router: $router })">
      <div class="f-c-c w-8 h-8">
        <i-ep-location />
      </div>
    </div>
    <div
      :class="{ 'show-3': setting.toolkits.pin, 'close-3': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="isToTop ? moveScroll(topNail) : moveScroll(bottomNail)">
      <div class="f-c-c w-8 h-8">
        <i-ep-upload :class="{ 'top-nav': isToTop, 'bottom-nav': isToBottom }" />
      </div>
    </div>
    <div
      :class="{ 'show-4': setting.toolkits.pin, 'close-4': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="EcyUtils.Router.go({ path: RouterPath.profile(), router: $router })">
      <div class="f-c-c w-8 h-8">
        <i-ep-warning />
      </div>
    </div>
    <div
      :class="{ 'show-5': setting.toolkits.pin, 'close-5': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="toggleMode">
      <div class="f-c-c w-8 h-8">
        <i-ep-moon v-show="setting.theme.mode === 'dark'" />
        <i-ep-sunny v-show="setting.theme.mode === 'light'" />
      </div>
    </div>
    <div
      :class="{ 'show-6': setting.toolkits.pin, 'close-6': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 l-back-bg"
      @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com' })">
      <div class="f-c-c w-8 h-8">
        <i-ep-setting />
      </div>
    </div>
    <div
      @click="setting.toolkits.pin = !setting.toolkits.pin"
      :class="{ 'show-toolkits': setting.toolkits.pin, 'close-toolkits': !setting.toolkits.pin }"
      class="kits-box absolute hover top-70 left-0 rd-2 l-back-bg">
      <div class="f-c-c w-8 h-8">
        <i-ep-more />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$show-top: 0;
$show-anitime: 0.1s;
$close-top: 17.5rem;
$close-anitime: 0.7s;
$move-step: 2.5rem;

@for $index from 0 to 7 {
  @if $index != 0 {
    $show-top: $show-top + $move-step;
  }

  .show-#{$index} {
    $show-anitime: $show-anitime + math.div($index, 10);
    animation: show-#{$index}-animation $show-anitime ease-in;
    top: $show-top;
  }

  .close-#{$index} {
    $close-anitime: $close-anitime - math.div($index, 10);
    animation: close-#{$index}-animation $close-anitime ease-in;
    top: $close-top;
    z-index: -1;
  }

  @keyframes show-#{$index}-animation {
    $step: $close-top;

    @for $i from 0 to 11 {
      #{$i * 10%} {
        top: $step;
        $step: $step - math.div($close-top - $index * $move-step, 10);
      }
    }
  }

  @keyframes close-#{$index}-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        top: $show-top + $i * math.div($close-top - $show-top, 10);
      }
    }
  }
}

.show-toolkits {
  transition: var(--l-animation-effect);
  transform: rotate(0);
}

.close-toolkits {
  transition: var(--l-animation-effect);
  transform: rotate(180deg);
}

.top-nav {
  transition: var(--l-animation-effect);
  transform: rotate(0);
}

.bottom-nav {
  transition: var(--l-animation-effect);
  transform: rotate(180deg);
}
</style>
