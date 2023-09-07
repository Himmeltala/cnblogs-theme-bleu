<script setup lang="ts">
import { ArbeitenApi } from "@/apis";

const route = useRoute();
const router = useRouter();
const arbeitenList = shallowRef<BleuArbeitenList>();
const stochasticIndexs = shallowRef<number[]>();
const stochastic = BleuVars.config.images.stochastic;
const loading = new Broswer.Loading();

const defaultIndex = ref(1);

async function fetchData(index: any) {
  loading.startLoading();
  router.replace(RouterPath.ArbeitenList(index));
  arbeitenList.value = await ArbeitenApi.getList(index);
  stochasticIndexs.value = Random.get(stochastic, arbeitenList.value.data.length);
  loading.endLoading();
}

async function takeQueryToFetchData() {
  const page = route.query.page || 1;
  defaultIndex.value = Number(page);
  await fetchData(page);
}

await takeQueryToFetchData();
</script>

<template>
  <div id="l-arbeiten-list" class="page">
    <div class="content" v-if="arbeitenList?.data?.length">
      <Pagination
        @change="fetchData"
        @next="fetchData"
        @prev="fetchData"
        :default-index="defaultIndex"
        :count="arbeitenList?.page">
        <template #content>
          <el-page-header :icon="null" @back="$router.back()" class="mb-6">
            <template #title>
              <div class="f-c-c">
                <i-ep-back />
              </div>
            </template>
            <template #content>
              <div class="text-1.2rem mb-5 mt-4">
                <span class="shine-text">{{ BleuVars.getBlogApp() }}</span> 的随笔列表
              </div>
            </template>
          </el-page-header>
          <ArbeitenItem
            v-for="(item, index) in arbeitenList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :length="arbeitenList.data.length"
            :cover="stochastic[stochasticIndexs[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
