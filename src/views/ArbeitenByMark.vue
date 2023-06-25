<script setup lang="ts">
import { ArbeitenApi } from "@/apis";

const route = useRoute();
const markWorks = shallowRef<BleuArbeitenList2>();
const loading = new Broswer.Loading();

async function fetchData(index?: any) {
  loading.startLoading();
  const name = route.query.name;
  markWorks.value = await ArbeitenApi.getListByMark(`${name}`, index);
  Broswer.setTitle(markWorks.value.hint);
  loading.endLoading();
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.ArbeitenByMark) {
    await fetchData();
  }
});
</script>

<template>
  <div id="l-arbeiten-by-mark" class="page">
    <div class="content" v-if="markWorks">
      <el-page-header :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem mb-5 mt-4">{{ markWorks.hint }}</div>
        </template>
      </el-page-header>
      <Pagination @change="fetchData" @next="fetchData" @prev="fetchData" :count="markWorks.page">
        <template #content>
          <div class="relative mb-15" v-for="item of markWorks.data">
            <div class="text-1.2rem">
              <router-link class="hover" :to="'/p/' + item.id">
                {{ item.text }}
              </router-link>
            </div>
            <div class="f-c-s text-0.9rem mt-6">
              <i-ep-caret-right />
              <router-link class="hover ml-0.5 b-b-1 b-b-dotted p-b-0.3" :to="'/p/' + item.id">
                阅读全文
              </router-link>
            </div>
            <div class="works-synopsis mt-6 f-c-s text-0.9rem text-b">
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
