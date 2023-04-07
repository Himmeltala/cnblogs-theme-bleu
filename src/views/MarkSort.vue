<script setup lang="ts">
import { getWritingMark } from "@/apis/remote-api";

EcyUtils.startLoading();

const route = useRoute();
const router = useRouter();
const listing = shallowRef(await getWritingMark(`${route.params.tag}`));
const setting = EcyUtils.getSetting();

document.querySelector("title").innerText = `${listing.value.hint} - ${EcyConfig.blogApp} - 博客园`;

watch(route, async () => {
  if (route.name === "MarkSort") {
    EcyUtils.startLoading();
    listing.value = await getWritingMark(`${route.params.tag}`);
    document.querySelector("title").innerText = `${listing.value.hint} - ${EcyConfig.blogApp} - 博客园`;
    EcyUtils.endLoading();
  }
});

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <ContextMenu>
    <div id="l-tagcoll" class="min-height">
      <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router })">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="l-sec-size mb-5 mt-4">{{ listing.hint }}</div>
        </template>
      </el-page-header>
      <Card line v-for="item of listing.data" :padding="setting.pages.markSort.padding" :margin="setting.pages.markSort.margin">
        <div class="l-sec-size">
          <router-link class="hover" :to="'/p/' + item.id">
            {{ item.text }}
          </router-link>
        </div>
        <div class="f-c-s l-fiv-size mt-4">
          <i-ep-caret-right />
          <router-link class="hover ml-0.5 b-b-1 b-b-dotted p-b-0.3" :to="'/p/' + item.id"> 阅读全文 </router-link>
        </div>
        <WritingSynopsis class="mt-4" :data="{ date: item.date, view: item.view, comm: item.comm, digg: item.digg }" />
      </Card>
    </div>
    <template #title>盒子模型设置</template>
    <template #content>
      <BoxSetting :padding="setting.pages.markSort.padding" :margin="setting.pages.markSort.margin" />
    </template>
  </ContextMenu>
</template>
