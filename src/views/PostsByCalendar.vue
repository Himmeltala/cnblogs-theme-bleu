<script setup lang="ts">
import { DatumHttp } from "@/requests";

const date = new Date();
const dateModel = ref(date);
const calendar = shallowRef<string[]>();
const loading = new Broswer.Loading();

function findDate(data: any) {
  const date = data.day.replaceAll("-", "/");
  return calendar.value.includes(date);
}

function fetchData() {
  loading.startLoading();
  DatumHttp.getCalendar(
    `${dateModel.value.getFullYear()}/${
      dateModel.value.getMonth() + 1
    }/${dateModel.value.getDate()}`
  ).then(data => {
    calendar.value = data;

    nextTick(() => {
      loading.endLoading();
    });
  });
}

watch(dateModel, (newVal, oldVal) => {
  if (newVal.getMonth() !== oldVal.getMonth()) {
    fetchData();
  }
});

fetchData();
</script>

<template>
  <div class="posts-by-calendar lg-sm:px-90" v-if="calendar">
    <el-calendar v-model="dateModel">
      <template #date-cell="{ data }">
        <div
          v-if="findDate(data)"
          class="w-100% h-100%"
          @click="$router.push(RouterPath.PostsByArchive('d', data.day))">
          <el-tag type="danger">
            {{ data.day.split("-")[2] }}
          </el-tag>
        </div>
        <span v-else>{{ data.day.split("-")[2] }}</span>
      </template>
    </el-calendar>
  </div>
</template>

<style scoped lang="scss"></style>
