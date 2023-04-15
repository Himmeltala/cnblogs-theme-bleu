<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.startLoading();

const worksList = shallowRef(await WorksApi.getList(1));
const indexImgs = EcyConfig.__ECY_CONFIG__.covers.index || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
const imgsRanNum = shallowRef(EcyUtils.Random.get(worksImgs, worksList.value.data.length));

async function fetchData(index: any) {
  EcyUtils.startLoading();

  WorksApi.getList(index).then(newVal => {
    worksList.value = newVal;
    imgsRanNum.value = EcyUtils.Random.get(worksImgs, worksList.value.data.length);
    EcyUtils.endLoading();
  });
}

function moveToStartNail() {
  document.querySelector("#l-start-nail").scrollIntoView();
}

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div class="welcome relative h-100vh w-100vw">
    <div class="z-999 absolute bottom-15vh left-0 f-c-c w-100vw">
      <div class="w-10 h-10 hover" @click="moveToStartNail">
        <i-ep-arrow-down-bold class="arrow color-#ededed size-1.5rem hover" />
      </div>
    </div>
    <div class="z-999 absolute bottom-0 left-0 h-75px w-100% ofw-hidden">
      <div class="wave-1 absolute h-100% w-200%"></div>
      <div class="wave-2 absolute h-100% w-200%"></div>
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
            :cover="worksImgs[imgsRanNum[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome {
  .cover::after {
    backdrop-filter: blur(5px);
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
