<script setup lang="ts">
import { getAlbumn } from "@/apis";

EcyUtils.setTitle("相册");
EcyUtils.startLoading();

const route = useRoute();
const albumn = shallowRef(await getAlbumn(`${route.params.id}`));
const srcList = shallowRef(albumn.value.data.map(i => i.src));

watch(route, async () => {
  if (route.name === RouterName.Albumn) {
    EcyUtils.startLoading();
    albumn.value = await getAlbumn(`${route.params.id}`);
    srcList.value = albumn.value.data.map(i => i.src);
    EcyUtils.endLoading();
  }
});

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div id="l-albumn" class="min-height page">
    <div class="content">
      <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router: $router })">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="l-sec-size mb-5 mt-4">相册 - {{ albumn.title }}</div>
        </template>
      </el-page-header>
      <div class="mb-4 l-fiv-size l-sec-color">{{ albumn.desc }}</div>
      <div class="f-c-b flex-wrap">
        <el-image class="w-50 h-50 mb-4" v-for="(item, index) in srcList" :initial-index="index" :src="item" :preview-src-list="srcList" />
        <el-result v-if="!albumn.data.length" icon="error" title="相册加载失败" sub-title="相册可能被移除">
          <template #extra>
            <el-button @click="$router.push('/')" type="primary">返回首页</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>
