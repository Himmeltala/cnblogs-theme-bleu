<script setup lang="ts">
import { usePieChart } from "@/hooks/use-echarts";

const props = defineProps({
  data: {
    type: Array as PropType<any>
  }
});

const pie1Inst = ref<HTMLElement>();
const isShowPieChart1 = ref(false);
const openPieChartCount1 = ref(0);

onMounted(() => {
  // 我的标签
  usePieChart({
    dom: pie1Inst.value,
    data: props.data.map((i: any, index: number) => {
      if (index <= 10) {
        return { value: i.count, name: i.text };
      }
    }),
    flag: openPieChartCount1,
    radius: "90%"
  });
});
</script>

<template>
  <div class="relative" v-if="data?.length">
    <div
      class="transition-all-500"
      :class="{ 'opacity-100': !isShowPieChart1, 'opacity-30': isShowPieChart1 }">
      <div class="f-c-b mb-10">
        <div id="tags-nail" class="caption">
          <div class="i-tabler-bookmarks mr-2"></div>
          我的标签
        </div>
        <div
          @click="
            () => {
              openPieChartCount1++;
              isShowPieChart1 = !isShowPieChart1;
            }
          "
          class="f-c-c cursor-pointer hover text-thirdly text-1rem">
          <div class="i-tabler-zoom-in mr-2"></div>
        </div>
      </div>
      <div class="f-s-b flex-wrap overflow-auto scroll-none">
        <router-link v-for="item in data" :to="RouterPath.ArbeitenByMark(item.text)">
          <HollowedBox hover class="mr-4 mb-6">
            {{ item.text }}
          </HollowedBox>
        </router-link>
      </div>
    </div>
    <div
      :class="{ 'scale-0': !isShowPieChart1, 'scale-100': isShowPieChart1 }"
      class="transition-all-300 z-9 rd-2 bg-ba absolute left-0 top-0">
      <div text="c 1rem">
        <div p="r-4 t-4" class="f-c-e hover" @click="isShowPieChart1 = !isShowPieChart1">
          <div class="i-tabler-arrows-minimize mr-2"></div>
          关闭
        </div>
      </div>
      <div class="f-c-c">
        <div ref="pie1Inst" class="sm:w-64vw lt-sm:w-93vw h-50vh"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
