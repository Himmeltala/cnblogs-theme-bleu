<script setup lang="ts">
import { DatumApi } from "@/apis";

const date = new Date();
const dateModel = ref(date);
const calendar = shallowRef<string[]>();
const loading = new Broswer.Loading();

loading.startLoading();

function findDate(data: any) {
  const date = data.day.replaceAll("-", "/");
  return calendar.value.includes(date);
}

async function fetchData() {
  calendar.value = await DatumApi.getCalendar(
    `${dateModel.value.getFullYear()}/${
      dateModel.value.getMonth() + 1
    }/${dateModel.value.getDate()}`
  );
}

onMounted(() => {
  loading.endLoading();
});

watch(dateModel, async (newVal, oldVal) => {
  if (newVal.getMonth() !== oldVal.getMonth()) {
    await fetchData();
  }
});

await fetchData();
</script>

<template>
  <div class="l-arbeiten-by-calendar page">
    <div class="content" v-if="calendar">
      <el-page-header class="mt-4 mb-15" :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem">博客日历</div>
        </template>
      </el-page-header>
      <el-calendar v-model="dateModel">
        <template #date-cell="{ data }">
          <div
            v-if="findDate(data)"
            class="w-100% h-100%"
            @click="$router.push(RouterPath.ArbeitenByArchive('d', data.day))">
            <u class="font-bold">
              {{ data.day.split("-")[2] }}
            </u>
          </div>
          <span v-else>{{ data.day.split("-")[2] }}</span>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
