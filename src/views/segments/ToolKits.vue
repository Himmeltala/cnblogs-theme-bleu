<script setup lang="ts">
import { useWheelRollsUpAndDown, useLineBetweenHighAndLow } from "@/hooks/use-mouse";

const route = useRoute();
const { toolkits, theme } = LocalStorage.getSetting().value;
const isInTop = ref(false);
const isInBottom = ref(true);
const isShowGuide = ref(false);
const isTake = ref(false);
let topNailInst: HTMLElement;
let bottomNailInst: HTMLElement;
const disabled = inject<boolean>(ProvideKey.Katalog);

onMounted(() => {
  topNailInst = document.querySelector("#l-top-nail");
  bottomNailInst = document.querySelector("#l-bottom-nail");

  useWheelRollsUpAndDown(
    () => {
      isTake.value = true;
    },
    () => {
      isTake.value = false;
    },
    {
      throttle: 50
    }
  );

  useLineBetweenHighAndLow(
    () => {
      isInTop.value = true;
      isInBottom.value = false;
    },
    () => {
      isInBottom.value = true;
      isInTop.value = false;
    },
    {
      throttle: 50
    }
  );
});

function scrollTo(dom: HTMLElement) {
  dom.scrollIntoView();
  isInTop.value = !isInTop.value;
  isInBottom.value = !isInBottom.value;
}

function toggleMode() {
  if (theme.mode === "dark") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    theme.mode = "light";
  } else {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    theme.mode = "dark";
  }
}

watch(route, () => {
  if (route.name !== RouterName.Arbeiten) {
    isShowGuide.value = false;
  } else {
    isShowGuide.value = true;
  }
});
</script>

<template>
  <div
    id="l-toolkits"
    :class="{ 'take-toolkits': isTake, 'intake-toolkits': !isTake }"
    class="fixed z-99 right-0 top-55vh text-1.1rem">
    <div
      v-show="isShowGuide"
      :class="{ 'show-0': toolkits.pin, 'close-0': !toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-drop-primary"
      @click="disabled = !disabled">
      <div class="f-c-c w-8 h-8">
        <div class="i-tabler-map text-1.2rem"></div>
      </div>
    </div>
    <div
      :class="{ 'show-1': toolkits.pin, 'close-1': !toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-drop-primary"
      @click="Navigation.go({ path: RouterPath.BleuHome(), router: $router })">
      <div class="f-c-c w-8 h-8">
        <div class="i-tabler-home text-1.2rem"></div>
      </div>
    </div>
    <div
      :class="{ 'show-2': toolkits.pin, 'close-2': !toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-drop-primary"
      @click="Navigation.go({ path: 'back', router: $router })">
      <div class="f-c-c w-8 h-8">
        <div class="i-tabler-arrow-back-up text-1.2rem"></div>
      </div>
    </div>
    <div
      :class="{ 'show-3': toolkits.pin, 'close-3': !toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-drop-primary"
      @click="isInTop ? scrollTo(topNailInst) : scrollTo(bottomNailInst)">
      <div class="f-c-c w-8 h-8">
        <div
          class="i-tabler-arrow-bar-up"
          :class="{ 'top-nav': isInTop, 'bottom-nav': isInBottom }"></div>
      </div>
    </div>
    <div
      :class="{ 'show-4': toolkits.pin, 'close-4': !toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-drop-primary"
      @click="toggleMode">
      <div class="f-c-c w-8 h-8">
        <i-ep-moon v-show="theme.mode === 'dark'" />
        <i-ep-sunny v-show="theme.mode === 'light'" />
      </div>
    </div>
    <div
      :class="{ 'show-5': toolkits.pin, 'close-5': !toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-drop-primary"
      @click="Navigation.go({ path: 'https://i.cnblogs.com' })">
      <div class="f-c-c w-8 h-8">
        <i-ep-setting />
      </div>
    </div>
    <div
      @click="toolkits.pin = !toolkits.pin"
      :class="{ 'take-items': toolkits.pin, 'intake-items': !toolkits.pin }"
      class="kits-box absolute hover top-60 left-0 rd-2 bg-drop-primary">
      <div class="f-c-c w-8 h-8">
        <i-ep-more />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$show-top: 0;
$show-anitime: 0.1s;
$close-top: 15rem;
$close-anitime: 0.7s;
$move-step: 2.5rem;

@for $index from 0 to 6 {
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

@include pc() {
  .take-toolkits {
    animation: take-toolkits-animation 0.3s linear;
    right: 5rem;
  }

  @keyframes take-toolkits-animation {
    @for $i from 0 to 11 {
      #{$i * 10%} {
        right: calc($i * 0.5rem);
      }
    }
  }
}

@include mb() {
  .take-toolkits {
    animation: take-toolkits-animation 0.3s linear;
    right: 3rem;
  }

  @keyframes take-toolkits-animation {
    @for $i from 0 to 11 {
      #{$i * 10%} {
        right: calc($i * 0.3rem);
      }
    }
  }
}

.intake-toolkits {
  animation: intake-toolkits-animation 0.3s linear;
}

@include pc() {
  @keyframes intake-toolkits-animation {
    @for $i from 0 to 11 {
      #{$i * 10%} {
        right: calc(5rem + $i * -0.5rem);
      }
    }
  }
}

@include mb() {
  @keyframes intake-toolkits-animation {
    @for $i from 0 to 11 {
      #{$i * 10%} {
        right: calc(3rem + $i * -0.3rem);
      }
    }
  }
}

.take-items {
  transition: var(--l-animation-effect);
  transform: rotate(0);
}

.intake-items {
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
