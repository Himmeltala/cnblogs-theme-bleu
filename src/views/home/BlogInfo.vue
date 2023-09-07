<script setup lang="ts">
import { useRadarChart } from "@/hooks/use-echarts";

defineProps({
  rankings: {
    type: Array as PropType<any>
  },
  news: {
    type: Array as PropType<any>
  },
  status: {
    type: Array as PropType<any>
  }
});

const radarInst = ref<HTMLElement>();
const searchVal = ref("");

onMounted(() => {
  useRadarChart(radarInst.value);
});
</script>

<template>
  <div>
    <div>
      <div class="caption mb-5">
        <div class="i-tabler-info-square-rounded mr-2"></div>
        博客信息
      </div>
      <div class="f-c-s h-30 mb-5 text-1rem text-thirdly">
        <div class="relative lt-lg:mr-8 lg:mr-10">
          <img class="w-25 h-25 rd-50% object-cover" :src="BleuVars.config.avatar" />
          <div
            class="absolute bottom-0 right-0 f-c-c w-8 h-8 dark:bg-#323232 light:bg-#f2f2f2 rd-50%">
            {{ BleuVars.config.status || "🐟" }}
          </div>
        </div>
        <div class="f-s-b flex-col py-4 h-100%">
          <div v-if="rankings?.length" class="f-c-s text-0.8rem text-thirdly">
            <div
              v-for="(item, index) in rankings"
              :class="{ 'mr-4': index != rankings.length - 1 }">
              {{ item.text }}
            </div>
          </div>
          <div class="text-0.8rem text-ellipsis line-clamp-1 shine-text">
            {{ BleuVars.config.signature || "这个人很懒，什么也没有留下" }}
          </div>
          <div class="w-60">
            <el-input
              v-model="searchVal"
              @keyup.enter="Native.searchArbeiten(searchVal)"
              placeholder="输入关键字"
              clearable>
              <template #prefix>
                <div class="i-tabler-search"></div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="f-c-b text-1rem">
        <div v-if="news?.length" class="text-0.9rem">
          <div class="f-c-s cursor-pointer shine-text" @click="Navigation.go(news[0].href)">
            <div class="i-tabler-user mr-2"></div>
            昵称：{{ news[0].text }}
          </div>
          <div class="f-c-s hover mt-5" @click="Navigation.go(news[1].href)">
            <div class="i-tabler-calendar mr-2"></div>
            园龄：{{ news[1].text }}
          </div>
          <div class="f-c-s hover mt-5" @click="Navigation.go(news[2].href)">
            <div class="i-tabler-brand-twitch mr-2"></div>
            粉丝：{{ news[2].text }}
          </div>
          <div class="f-c-s hover mt-5" @click="Navigation.go(news[3].href)">
            <div class="i-tabler-heart mr-2"></div>
            关注：{{ news[3].text }}
          </div>
        </div>
        <div v-if="status?.length" class="text-0.9rem">
          <div class="f-c-s">
            <div class="i-tabler-pencil-minus mr-2"></div>
            发表的随笔：{{ status[0].digg }}
          </div>
          <div class="f-c-s mt-5">
            <div class="i-tabler-books mr-2"></div>
            发表的文章：{{ status[1].digg }}
          </div>
          <div class="f-c-s mt-5">
            <div class="i-tabler-message-circle mr-2"></div>
            拥有的评论：{{ status[2].digg }}
          </div>
          <div class="f-c-s mt-5">
            <div class="i-tabler-chart-bar mr-2"></div>
            阅读的数量：{{ status[3].digg }}
          </div>
        </div>
      </div>
    </div>
    <div class="lt-sm:mt-15">
      <div class="caption mb-5">
        <div class="i-tabler-chart-radar mr-2"></div>
        我的技能
      </div>
      <div class="f-c-c w-100%">
        <div ref="radarInst" class="w-100% h-80"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
