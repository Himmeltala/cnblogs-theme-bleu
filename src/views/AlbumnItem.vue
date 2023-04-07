<script setup lang="ts">
import { getAlbumnItem } from "@/apis/remote-api";

EcyUtils.startLoading();

const route = useRoute();
const router = useRouter();
const imgUrl = shallowRef(await getAlbumnItem(`${route.params.id}`));

document.querySelector("title").innerText = `相册照片 - ${EcyConfig.blogApp} - 博客园`;

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div id="l-albumn-item" class="min-height">
    <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router })">
      <template #title>
        <div class="f-c-c">
          <i-ep-back />
        </div>
      </template>
      <template #content>
        <div class="l-sec-size mb-5 mt-4">我的照片</div>
      </template>
    </el-page-header>
    <div class="f-c-c">
      <el-image class="albumn-item" :src="imgUrl" :preview-src-list="[imgUrl]" />
      <el-result v-if="!imgUrl" icon="error" title="图片加载失败" sub-title="图片可能从相册移除">
        <template #extra>
          <el-button @click="router.push('/')" type="primary">返回首页</el-button>
        </template>
      </el-result>
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
