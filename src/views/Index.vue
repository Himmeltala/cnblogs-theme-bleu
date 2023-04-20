<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.startLoading();

const ldisabled = inject<Ref>("ldisabled");
const rdisabled = inject<Ref>("rdisabled");
const worksList = shallowRef(await WorksApi.getList(1));
const indexImgs = EcyConfig.__ECY_CONFIG__.covers.index || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
const imgsIndex = shallowRef(EcyUtils.Random.get(worksImgs, worksList.value.data.length));
const coverFilter = EcyConfig.__ECY_CONFIG__.covers.filter.index;
const coverMatte = EcyConfig.__ECY_CONFIG__.covers.matte.index;

async function fetchData(index: any) {
  EcyUtils.startLoading();

  WorksApi.getList(index).then(newVal => {
    worksList.value = newVal;
    imgsIndex.value = EcyUtils.Random.get(worksImgs, worksList.value.data.length);
    EcyUtils.endLoading();
  });
}

function toStartNail() {
  document.querySelector("#l-start-nail").scrollIntoView();
}

function openLMenu() {
  ldisabled.value = !ldisabled.value;
}

function openRMenu() {
  rdisabled.value = !rdisabled.value;
}

onMounted(() => {
  EcyUtils.endLoading();

  document.getElementById("l-matte").onclick = () => {
    if (!ldisabled.value) ldisabled.value = true;
    else if (!rdisabled.value) rdisabled.value = true;
  };
});
</script>

<template>
  <div class="welcome relative h-100vh w-100vw">
    <div class="z-999 absolute bottom-15vh left-0 f-c-c w-100vw">
      <div class="w-10 h-10 hover" @click="toStartNail">
        <i-ep-arrow-down-bold class="arrow size-1.5rem hover" />
      </div>
    </div>
    <div class="z-999 absolute bottom-0 left-0 h-75px w-100% flow-hidden">
      <div class="wave-1 absolute h-100% w-200%"></div>
      <div class="wave-2 absolute h-100% w-200%"></div>
    </div>
    <div class="z-999 absolute top-2 left-2">
      <HollowedBox hover class="f-c-c rd-2 l-size-1 cursor-pointer" @click="openLMenu">
        <i-ep-menu class="mr-2" />
        <div>左菜单</div>
      </HollowedBox>
    </div>
    <div class="z-999 absolute top-2 right-2">
      <HollowedBox plain hover class="f-c-c rd-2 l-size-1 cursor-pointer" @click="openRMenu">
        <i-ep-menu class="mr-2" />
        <div>右菜单</div>
      </HollowedBox>
    </div>
    <div class="z-990 cover absolute left-0 top-0 h-100% w-100%">
      <img class="relative h-100% w-100% rd-0" :src="indexImgs[Math.floor(Math.random() * indexImgs.length)]" />
    </div>
  </div>
  <div id="l-start-nail"></div>
  <div id="l-index" class="page">
    <div class="content">
      <Pagination @prev="fetchData" @next="fetchData" @nexpr="fetchData" :count="worksList.page">
        <template #content>
          <WorksItem
            v-if="worksList.data.length > 0"
            v-for="(item, index) in worksList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="worksImgs[imgsIndex[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome {
  .cover::before {
    backdrop-filter: blur(v-bind(coverFilter));
    z-index: 1;
  }

  .cover::after {
    background-color: black;
    opacity: v-bind(coverMatte);
  }

  .arrow {
    animation: move-arrow 1s infinite linear alternate;
  }

  @keyframes move-arrow {
    0% {
      transform: translateY(0%) scaleY(1);
    }
    50% {
      transform: translateY(10%) scaleY(0.85);
    }
    100% {
      transform: translateY(20%) scaleY(1);
    }
  }
}
</style>
