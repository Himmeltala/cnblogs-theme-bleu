<script setup lang="ts">
import { DatumApi } from "@/apis";

const markList = shallowRef();

async function fetchData() {
  Broswer.startLoading();
  markList.value = await DatumApi.getMarkList();
  Broswer.endLoading();
}

await fetchData();
</script>

<template>
  <div id="l-mark-list" class="page">
    <div class="content" v-if="markList">
      <el-page-header class="mt-4 mb-6" :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem">标签集合</div>
        </template>
      </el-page-header>
      <div class="tags">
        <HollowedBox
          round
          hover
          :padding="false"
          line="dotted"
          class="item mb-4"
          v-for="item of markList">
          <div class="f-c-c w-100% h-100%">
            <router-link :to="RouterPath.ArbeitenByMark(item.text)">
              {{ item.text }} ({{ item.count }})
            </router-link>
          </div>
        </HollowedBox>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#l-mark-list .tags {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  flex-wrap: wrap;
  flex-direction: row;

  .item {
    --uno: py-4;
  }

  @include pc() {
    .item {
      flex: 1 1 20%;

      &:not(:nth-child(4n)) {
        --uno: mr-3;
      }
    }
  }

  @include mb() {
    .item {
      flex: 1 1 40%;

      &:nth-child(odd) {
        --uno: mr-3;
      }
    }
  }
}
</style>
