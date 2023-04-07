<script setup lang="ts">
const setting = EcyUtils.getSetting();
const router = useRouter();
const active = ref("1");
const dialog = ref(false);

function moveToTopNail() {
  document.querySelector("#l-top-nail").scrollIntoView();
}

function moveToBottomNail() {
  document.querySelector("#l-bottom-nail").scrollIntoView();
}

function changeDayTime() {
  const html = document.querySelector("html");
  if (setting.value.theme.mode === "dark") {
    html.className = "light";
    setting.value.theme.mode = "light";
  } else {
    html.className = "dark";
    setting.value.theme.mode = "dark";
  }
}
</script>

<template>
  <div id="l-toolkits" class="fixed right-15 top-65vh l-thr-size z-1">
    <div class="relative">
      <Card
        :class="{ 'l-box-bg': !setting.card.open, 'show-0': setting.toolkits.pin, 'close-0': !setting.toolkits.pin }"
        class="back-home absolute hover left-0 rd-2"
        @click="EcyUtils.Router.go({ path: '/home', router })">
        <div class="f-c-c w-8 h-8">
          <i-ep-house />
        </div>
      </Card>
      <Card
        :class="{ 'l-box-bg': !setting.card.open, 'show-1': setting.toolkits.pin, 'close-1': !setting.toolkits.pin }"
        class="back-top absolute hover left-0 rd-2"
        @click="moveToTopNail">
        <div class="f-c-c w-8 h-8">
          <i-ep-top />
        </div>
      </Card>
      <Card
        :class="{ 'l-box-bg': !setting.card.open, 'show-2': setting.toolkits.pin, 'close-2': !setting.toolkits.pin }"
        class="back-top absolute hover left-0 rd-2"
        @click="moveToBottomNail">
        <div class="f-c-c w-8 h-8">
          <i-ep-bottom />
        </div>
      </Card>
      <Card
        :class="{ 'l-box-bg': !setting.card.open, 'show-3': setting.toolkits.pin, 'close-3': !setting.toolkits.pin }"
        @click="changeDayTime"
        class="daytime absolute hover left-0 rd-2">
        <div class="f-c-c w-8 h-8">
          <template v-if="setting.theme.mode === 'light'">
            <i-ep-sunny />
          </template>
          <template v-else>
            <i-ep-moon />
          </template>
        </div>
      </Card>
      <Card
        :class="{ 'l-box-bg': !setting.card.open, 'show-4': setting.toolkits.pin, 'close-4': !setting.toolkits.pin }"
        @click="dialog = !dialog"
        class="setting absolute hover left-0 rd-2">
        <div class="f-c-c w-8 h-8">
          <i-ep-setting class="rotate-setting" />
        </div>
      </Card>
      <Card
        @click="setting.toolkits.pin = !setting.toolkits.pin"
        :class="{ 'l-box-bg': !setting.card.open, 'show-toolkits': setting.toolkits.pin, 'close-toolkits': !setting.toolkits.pin }"
        class="kits-box absolute hover top-50 left-0 rd-2">
        <div class="f-c-c w-8 h-8">
          <i-ep-arrow-right />
        </div>
      </Card>
    </div>
  </div>
  <el-dialog draggable v-model="dialog" title="自定义博客" align-center width="25rem">
    <el-collapse v-model="active" accordion>
      <el-collapse-item v-if="EcyConfig.pcDevice">
        <template #title>
          <span class="l-for-size">陈列柜设置</span>
        </template>
        <div class="ml-4">
          <CabinetSetting />
        </div>
      </el-collapse-item>
      <el-collapse-item>
        <template #title>
          <span class="l-for-size">主题设置</span>
        </template>
        <ThemeSetting />
      </el-collapse-item>
      <el-collapse-item v-if="EcyConfig.pcDevice">
        <template #title>
          <span class="l-for-size">其他设置</span>
        </template>
        <OtherSetting />
      </el-collapse-item>
      <el-collapse-item>
        <template #title>
          <span class="l-for-size">管理设置</span>
        </template>
        <ManageSetting />
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
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
