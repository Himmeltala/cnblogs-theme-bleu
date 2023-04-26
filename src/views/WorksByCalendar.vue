<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.setTitle("日历");
EcyUtils.startLoading();

const date = new Date();
const calendar = shallowRef(await WorksApi.getCalendar(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`));
const dateModel = ref(date);

function findDate(data: any) {
  const date = data.day.replaceAll("-", "/");
  return calendar.value.includes(date);
}

watch(dateModel, async (newVal, oldVal) => {
  if (newVal.getMonth() !== oldVal.getMonth()) {
    calendar.value = await WorksApi.getCalendar(`${newVal.getFullYear()}/${newVal.getMonth() + 1}/${newVal.getDate()}`);
  }
});

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div class="l-works-by-calendar page">
    <div class="content">
      <el-page-header class="mt-4 mb-6" :icon="null" @back="EcyUtils.Router.go({ path: 'back', router: $router })">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="l-size-5">博客日历</div>
        </template>
      </el-page-header>
      <el-calendar v-model="dateModel">
        <template #date-cell="{ data }">
          <div
            class="w-100% h-100%"
            @click="
              EcyUtils.Router.go({
                path: RouterPath.WORKS_BY_ARCHIVE('d', data.day),
                router: $router
              })
            "
            v-if="findDate(data)">
            <u>
              {{ data.day.split("-")[2] }}
            </u>
            <div class="mt-2 l-color-2 l-size-1">点击查看</div>
          </div>
          <span v-else>{{ data.day.split("-")[2] }}</span>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
