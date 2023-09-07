<script setup lang="ts">
import { useLineChart } from "@/hooks/use-echarts";

const props = defineProps({
  data: {
    type: Array as PropType<any>
  }
});

const lineInst = ref<HTMLElement>();
const isShowLineChart = ref(false);
const openLineChartCount = ref(0);

onMounted(() => {
  // 随笔归档
  useLineChart({
    dom: lineInst.value,
    xAxis: props.data.map((i: any) => i.id),
    data: props.data.map((i: any) => i.count),
    flag: openLineChartCount
  });
});
</script>

<template>
  <div class="relative" v-if="data?.length">
    <div>
      <div
        class="transition-all-500"
        :class="{ 'opacity-100': !isShowLineChart, 'opacity-10': isShowLineChart }">
        <div class="mb-10 f-c-b">
          <div id="essay-archive-nail" class="caption">
            <div class="i-tabler-archive-filled mr-2"></div>
            随笔归档
          </div>
          <div
            @click="
              () => {
                openLineChartCount++;
                isShowLineChart = !isShowLineChart;
              }
            "
            class="f-c-c cursor-pointer hover text-thirdly text-1rem mr-4">
            <div class="i-tabler-zoom-in mr-2"></div>
          </div>
        </div>
        <div class="f-c-b flex-wrap">
          <div class="mb-6 mr-4 hover" v-for="item in data">
            <router-link :to="RouterPath.ArbeitenByArchive('p', item.id)">
              {{ item.text }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{ 'scale-0': !isShowLineChart, 'scale-100': isShowLineChart }"
      class="transition-all-300 z-9 rd-2 bg-ba absolute left-0 top-0">
      <div text="c 1rem">
        <div p="r-4 t-4" class="f-c-e hover" @click="isShowLineChart = !isShowLineChart">
          <div class="i-tabler-arrows-minimize mr-2"></div>
          关闭
        </div>
      </div>
      <div class="f-c-c">
        <div ref="lineInst" class="sm:w-64vw lt-sm:w-93vw h-45vh"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
