<script setup lang="ts">
import { ArbeitenApi } from "@/apis";

const arbeitenList = shallowRef<BleuArbeitenList>();
const couvertureIndexs = shallowRef<number[]>([]);
const couverture = BleuVars.config.images.arbeiten;

async function fetchData(index: any) {
  Broswer.startLoading();
  arbeitenList.value = await ArbeitenApi.getList(index || 1);
  couvertureIndexs.value = Random.get(couverture, arbeitenList.value.data.length);
  Broswer.endLoading();
}

await fetchData(0);
</script>

<template>
  <div id="l-arbeiten-list" class="page">
    <div class="content">
      <Pagination
        @nexpr="fetchData"
        @next="fetchData"
        @prev="fetchData"
        :count="arbeitenList?.page">
        <template #content>
          <el-page-header :icon="null" @back="$router.back()">
            <template #title>
              <div class="f-c-c">
                <i-ep-back />
              </div>
            </template>
            <template #content>
              <div class="text-1.2rem mb-5 mt-4">随笔列表</div>
            </template>
          </el-page-header>
          <ArbeitenItem
            v-if="arbeitenList?.data?.length"
            v-for="(item, index) in arbeitenList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :length="arbeitenList.data.length"
            :cover="couverture[couvertureIndexs[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
