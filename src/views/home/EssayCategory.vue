<script setup lang="ts">
import { usePieChart } from "@/hooks/use-echarts";

const props = defineProps({
  data: {
    type: Array as PropType<any>
  }
});

const pie2Inst = ref<HTMLElement>();
const isShowPieChart2 = ref(false);
const openPieChartCount2 = ref(0);

onMounted(() => {
  // 随笔分类
  usePieChart({
    dom: pie2Inst.value,
    data: props.data.map((i: any, index: number) => {
      if (index <= 10) {
        return { value: i.count, name: i.text };
      }
    }),
    flag: openPieChartCount2,
    radius: ["40%", "70%"]
  });
});
</script>

<template>
  <div v-if="data?.length">
    <div
      class="transition-all-500"
      :class="{ 'opacity-100': !isShowPieChart2, 'opacity-30': isShowPieChart2 }">
      <div class="f-c-b mb-10">
        <div id="essay-nail" class="caption">
          <div class="i-tabler-category-2 mr-2"></div>
          随笔分类
        </div>
        <div
          @click="
            () => {
              openPieChartCount2++;
              isShowPieChart2 = !isShowPieChart2;
            }
          "
          class="f-c-c cursor-pointer hover text-thirdly text-1rem mr-4">
          <div class="i-tabler-zoom-in mr-2"></div>
        </div>
      </div>
      <div class="f-c-b flex-wrap">
        <div class="mb-6 mr-4 hover" v-for="item in data">
          <router-link :to="RouterPath.ArbeitenBySort(item.id, '1', true)">
            {{ item.text }}
          </router-link>
        </div>
      </div>
    </div>
    <div
      :class="{ 'scale-0': !isShowPieChart2, 'scale-100': isShowPieChart2 }"
      class="transition-all-300 z-9 rd-2 bg-ba absolute left-0 top-0">
      <div text="c 1rem">
        <div p="r-4 t-4" class="f-c-e hover" @click="isShowPieChart2 = !isShowPieChart2">
          <div class="i-tabler-arrows-minimize mr-2"></div>
          关闭
        </div>
      </div>
      <div class="f-c-c sm:w-32vw lt-sm:w-93vw">
        <div ref="pie2Inst" class="w-100% h-30vh"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
