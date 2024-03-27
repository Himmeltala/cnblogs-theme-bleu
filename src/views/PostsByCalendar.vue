<script setup lang="ts">
const date = new Date();
const dateModel = ref(date);
const calendar = shallowRef<string[]>();
const loading = new Utils.Browser.Loading();

function findDate(data: any) {
  const date = data.day.replaceAll("-", "/");
  return calendar.value.includes(date);
}

function fetch() {
  loading.startLoading();
  Requests.Datum.getCalendar(
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
    fetch();
  }
});

fetch();
</script>

<template>
  <div class="page" v-if="calendar">
    <el-calendar v-model="dateModel">
      <template #date-cell="{ data }">
        <div
          v-if="findDate(data)"
          class="w-100% h-100%"
          @click="$router.push(Consts.Paths.archive('d', data.day))">
          <el-tag type="danger">
            {{ data.day.split("-")[2] }}
          </el-tag>
        </div>
        <span v-else>{{ data.day.split("-")[2] }}</span>
      </template>
    </el-calendar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-button--small) {
  border-radius: 10rem;
}
</style>
