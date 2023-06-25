<script setup lang="ts">
import { DatumApi } from "@/apis";

const route = useRoute();
const imgUrl = shallowRef<string>();
const loading = new Broswer.Loading();

async function fetchData() {
  loading.startLoading();
  imgUrl.value = await DatumApi.getAlbumnItem(`${route.params.id}`);
  loading.endLoading();
}

await fetchData();
</script>

<template>
  <div id="l-albumn-item" class="page">
    <div class="content">
      <el-page-header :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem mb-5 mt-4">相册图片</div>
        </template>
      </el-page-header>
      <div class="f-c-c">
        <el-image v-if="imgUrl" class="albumn-item" :src="imgUrl" :preview-src-list="[imgUrl]" />
        <el-result v-else icon="error" title="图片加载失败" sub-title="图片可能从相册移除">
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

<style lang="scss">
.albumn-item {
  img {
    max-height: 70vh !important;
  }
}
</style>
