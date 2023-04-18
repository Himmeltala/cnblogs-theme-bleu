<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.startLoading();

const route = useRoute();
const markWorks = shallowRef(await WorksApi.getListByMark(`${route.params.tag}`));
EcyUtils.setTitle(markWorks.value.hint);

async function fetchData(index?: any) {
  EcyUtils.startLoading();
  markWorks.value = await WorksApi.getListByMark(`${route.params.tag}`, index);
  EcyUtils.setTitle(markWorks.value.hint);
  EcyUtils.endLoading();
}

watch(route, async () => {
  if (route.name === RouterName.WorksByMark) await fetchData();
});

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div id="l-tagcoll" class="min-height page">
    <div class="content">
      <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router: $router })">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="l-size-5 mb-5 mt-4">{{ markWorks.hint }}</div>
        </template>
      </el-page-header>
      <Pagination @nexpr="fetchData" @next="fetchData" @prev="fetchData" :count="markWorks.page">
        <template #content>
          <div class="relative mb-15" v-for="item of markWorks.data">
            <div class="l-size-5">
              <router-link class="hover" :to="'/p/' + item.id">
                {{ item.text }}
              </router-link>
            </div>
            <div class="f-c-s l-size-2 mt-6">
              <i-ep-caret-right />
              <router-link class="hover ml-0.5 b-b-1 b-b-dotted p-b-0.3" :to="'/p/' + item.id"> 阅读全文 </router-link>
            </div>
            <div class="works-synopsis mt-6 f-c-s l-size-2 l-color-2">
              <div class="mr-3 f-c-c">
                <i-ep-clock class="mr-1" />
                {{ item.date }}
              </div>
              <div class="mr-3 f-c-c">
                <i-ep-view class="mr-1" />
                {{ item.view }}
              </div>
              <div class="mr-3 f-c-c">
                <i-ep-chat-line-square class="mr-1" />
                {{ item.comm }}
              </div>
              <div class="f-c-c">
                <i-ep-star class="mr-1" />
                {{ item.digg }}
              </div>
            </div>
          </div>
        </template>
      </Pagination>
    </div>
  </div>
</template>
