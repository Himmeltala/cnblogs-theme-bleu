<script setup lang="ts">
import { getAlbumnItem } from "@/apis";
import { useLoading } from "@/hooks/use-loading";

const route = useRoute();
const imgUrl = shallowRef();

async function fetchData() {
  imgUrl.value = await getAlbumnItem(`${route.params.id}`);
}

useLoading(fetchData);
</script>

<template>
  <div id="l-albumn-item" class="page">
    <div class="content">
      <el-page-header :icon="null" @back="Navigation.go({ path: 'back', router: $router })">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem mb-5 mt-4">我的照片</div>
        </template>
      </el-page-header>
      <div class="f-c-c">
        <el-image v-if="imgUrl" class="albumn-item" :src="imgUrl" :preview-src-list="[imgUrl]" />
        <el-result v-else icon="error" title="图片加载失败" sub-title="图片可能从相册移除">
          <template #extra>
            <el-button @click="$router.push('/')" type="primary">返回首页</el-button>
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
