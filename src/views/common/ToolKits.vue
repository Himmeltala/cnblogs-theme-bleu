<script setup lang="ts">
const setting = EcyUtils.getLocalSetting();
const isTop = ref(false);

function moveToNavil() {
  if (isTop.value) {
    document.querySelector("#l-top-nail").scrollIntoView();
  } else {
    document.querySelector("#l-bottom-nail").scrollIntoView();
  }
  isTop.value = !isTop.value;
}
</script>

<template>
  <div id="l-toolkits" class="fixed z-99 right-18 top-65vh l-thr-size">
    <div
      :class="{ 'show-0': setting.toolkits.pin, 'close-0': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-#191919"
      @click="EcyUtils.Router.go({ path: RouterPath.index(), router: $router })">
      <div class="f-c-c w-8 h-8">
        <i-ep-reading />
      </div>
    </div>
    <div
      :class="{ 'show-1': setting.toolkits.pin, 'close-1': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-#191919"
      @click="EcyUtils.Router.go({ path: 'back', router: $router })">
      <div class="f-c-c w-8 h-8">
        <i-ep-guide />
      </div>
    </div>
    <div
      :class="{ 'show-2': setting.toolkits.pin, 'close-2': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-#191919"
      @click="moveToNavil">
      <div class="f-c-c w-8 h-8">
        <i-ep-add-location v-show="isTop" />
        <i-ep-delete-location v-show="!isTop" />
      </div>
    </div>
    <div
      :class="{ 'show-3': setting.toolkits.pin, 'close-3': !setting.toolkits.pin }"
      class="absolute hover left-0 rd-2 bg-#191919"
      @click="EcyUtils.Router.go({ path: RouterPath.profile(), router: $router })">
      <div class="f-c-c w-8 h-8">
        <i-ep-warning />
      </div>
    </div>
    <div
      :class="{ 'show-4': setting.toolkits.pin, 'close-4': !setting.toolkits.pin }"
      class="setting absolute hover left-0 rd-2 bg-#191919"
      @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts' })">
      <div class="f-c-c w-8 h-8">
        <i-ep-setting class="rotate-setting" />
      </div>
    </div>
    <div
      @click="setting.toolkits.pin = !setting.toolkits.pin"
      :class="{ 'show-toolkits': setting.toolkits.pin, 'close-toolkits': !setting.toolkits.pin }"
      class="kits-box absolute hover top-50 left-0 rd-2 bg-#191919">
      <div class="f-c-c w-8 h-8">
        <i-ep-more />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$show-top: 0;
$close-end: 12.5rem;

@for $index from 0 to 5 {
  @if $index != 0 {
    $show-top: $show-top + 2.5rem;
  }

  .show-#{$index} {
    animation: show-#{$index}-animation math.div($index, 10) + 0.2s ease-in;
    top: $show-top;
  }

  .close-#{$index} {
    animation: close-#{$index}-animation math.div($index, 10) + 0.2s ease-in;
    top: $close-end;
    z-index: -1;
  }

  @keyframes show-#{$index}-animation {
    $show-anime-top: 0;

    @for $i from 0 to 11 {
      @if $index == 0 {
        $show-anime-top: $close-end - $i * 1rem;
      } @else {
        $show-anime-top: $i * math.div($show-top, 10);
      }

      #{$i * 10%} {
        top: $show-anime-top;
      }
    }
  }

  @keyframes close-#{$index}-animation {
    @for $i from 0 to 11 {
      #{ $i * 10%} {
        top: $show-top + $i * math.div(($close-end - $show-top), 10);
      }
    }
  }
}

.show-toolkits {
  animation: show-toolkits-animation 0.3s ease-in;
  transform: rotate(0);
}

.close-toolkits {
  animation: close-toolkits-animation 0.3s ease-in;
  transform: rotate(180deg);
}

@keyframes show-toolkits-animation {
  @for $index from 0 to 10 {
    #{$index * 10%} {
      transform: rotate(180deg - $index * 18deg);
    }
  }
}

@keyframes close-toolkits-animation {
  @for $index from 0 to 10 {
    #{$index * 10%} {
      transform: rotate($index * 18deg);
    }
  }
}

.rotate-setting:hover {
  animation: 1.5s infinite rotate-setting-animation;
}

@keyframes rotate-setting-animation {
  @for $index from 0 to 10 {
    #{$index * 10%} {
      transform: rotate($index * 36deg);
    }
  }

  @for $index from 10 to 0 {
    #{$index * 10%} {
      transform: rotate($index * 36deg);
    }
  }
}
</style>
