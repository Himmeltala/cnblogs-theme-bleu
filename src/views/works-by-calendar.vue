<script setup lang="ts">
import { WorksApi } from "@/apis";
import { useLoading } from "@/hooks/comp-hooks";

const date = new Date();
const calendar = shallowRef();
const dateModel = ref(date);

function findDate(data: any) {
  const date = data.day.replaceAll("-", "/");
  return calendar.value.includes(date);
}

async function fetchData() {
  calendar.value = await WorksApi.getCalendar(
    `${dateModel.value.getFullYear()}/${dateModel.value.getMonth() + 1}/${dateModel.value.getDate()}`
  );
}

useLoading(fetchData);

watch(dateModel, (newVal, oldVal) => {
  if (newVal.getMonth() !== oldVal.getMonth()) {
    useLoading(fetchData);
  }
});
</script>

<template>
  <div class="l-works-by-calendar page">
    <div class="content" v-if="calendar">
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
