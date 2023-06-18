<script setup lang="ts">
import { DatumApi } from "@/apis";

const route = useRoute();
const albumn = shallowRef();
const srcList = shallowRef();

async function fetchData() {
  Broswer.startLoading();
  albumn.value = await DatumApi.getAlbumn(route.params.id as string);
  srcList.value = albumn.value.data.map((i: any) => i.src);
  Broswer.endLoading();
}

watch(route, async () => {
  if (route.name === RouterName.Albumn) {
    await fetchData();
  }
});

await fetchData();
</script>

<template>
  <div id="l-albumn" class="page">
    <div class="content" v-if="albumn">
      <el-page-header :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem mb-5 mt-4">相册 - {{ albumn.title }}</div>
        </template>
      </el-page-header>
      <div class="mb-4 text-0.9rem text-b">{{ albumn.desc }}</div>
      <div class="f-c-b flex-wrap">
        <el-image
          v-for="(item, index) in srcList"
          :initial-index="index"
          :src="item"
          :preview-src-list="srcList" />
        <el-result
          v-if="!albumn.data.length"
          icon="error"
          title="相册加载失败"
          sub-title="相册可能被移除">
          <template #extra>
            <el-button @click="$router.push(RouterPath.BleuHome())" type="primary">
              返回首页
            </el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>
