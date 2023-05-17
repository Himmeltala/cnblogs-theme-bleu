<script setup lang="ts">
import { WorksApi } from "@/apis";

const arbeitenList = shallowRef<BleuArbeitenList>();
const couvertureIndexs = shallowRef<number[]>([]);
const couverture = BleuVars.config.images.arbeiten;

async function fetchData(index: any) {
  Broswer.startLoading();
  arbeitenList.value = await WorksApi.getList(index || 1);
  couvertureIndexs.value = Random.get(couverture, arbeitenList.value.data.length);
  Broswer.endLoading();
}

await fetchData(0);
</script>

<template>
  <div id="l-works-by-sort" class="page">
    <div class="content">
      <Pagination
        @nexpr="fetchData"
        @next="fetchData"
        @prev="fetchData"
        :count="arbeitenList?.page">
        <template #content>
          <ArbeitenItem
            v-if="arbeitenList?.data.length > 0"
            v-for="(item, index) in arbeitenList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="couverture[couvertureIndexs[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
