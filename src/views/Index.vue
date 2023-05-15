<script setup lang="ts">
import { WorksApi } from "@/apis";
import { useLoading } from "@/hooks/comp-hooks";

const worksList = shallowRef();
const coversIndex = shallowRef();
const indexCovers = EcyConfig.__ECY_CONFIG__.covers.index;
const allCovers = EcyConfig.__ECY_CONFIG__.covers.works;
const coverFilter = EcyConfig.__ECY_CONFIG__.covers.filter.index;
const coverMatte = EcyConfig.__ECY_CONFIG__.covers.matte.index;

async function fetchData(index: any) {
  worksList.value = await WorksApi.getList(index || 1);
  coversIndex.value = EcyUtils.Random.get(allCovers, worksList.value.data.length);
}

useLoading(fetchData);
</script>

<template>
  <div class="reception relative h-100vh w-100vw">
    <div class="z-999 absolute bottom-15vh left-0 f-c-c w-100vw">
      <div class="w-10 h-10 hover" @click="EcyUtils.scrollIntoView('#l-start-nail')">
        <i-ep-arrow-down-bold class="arrow hover" />
      </div>
    </div>
    <div class="z-999 absolute bottom-0 left-0 h-75px w-100% flow-hidden">
      <div class="wave-1 absolute h-100% w-200%"></div>
      <div class="wave-2 absolute h-100% w-200%"></div>
    </div>
    <div class="z-990 cover absolute left-0 top-0 h-100% w-100%">
      <img class="relative h-100% w-100% rd-0" :src="indexCovers[Math.floor(Math.random() * indexCovers.length)]" />
    </div>
  </div>
  <div id="l-start-nail"></div>
  <div id="l-index" class="page">
    <div class="content" v-if="worksList">
      <pagination @prev="fetchData" @next="fetchData" @nexpr="fetchData" :count="worksList.page">
        <template #content>
          <works-item
            v-if="worksList.data.length > 0"
            v-for="(item, index) in worksList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="allCovers[coversIndex[index]]" />
        </template>
      </pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reception {
  .cover::before {
    backdrop-filter: blur(v-bind(coverFilter));
    z-index: 1;
  }

  .cover::after {
    background-color: black;
    opacity: v-bind(coverMatte);
  }

  .arrow {
    font-size: 1.5rem;
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
