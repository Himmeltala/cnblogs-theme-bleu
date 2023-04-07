<script setup lang="ts">
import { getCalendar } from "@/apis/remote-api";

EcyUtils.startLoading();

const router = useRouter();
const date = new Date();
const calendar = shallowRef(await getCalendar(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`));
const dateModel = ref(date);
let currMonth = dateModel.value.getMonth();

const findDate = (data: any) =>
  computed(() => {
    const date = data.day.replaceAll("-", "/");
    return !!calendar.value.find(el => el == date);
  });

watch(dateModel, async () => {
  if (dateModel.value.getMonth() != currMonth) {
    currMonth = dateModel.value.getMonth();
    calendar.value = await getCalendar(`${dateModel.value.getFullYear()}/${dateModel.value.getMonth() + 1}/${dateModel.value.getDate()}`);
  }
});

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div class="l-calendar min-height f-s-s flex-col">
    <el-page-header class="mt-4" :icon="null" @back="EcyUtils.Router.go({ path: 'back', router })">
      <template #title>
        <div class="f-c-c">
          <i-ep-back />
        </div>
      </template>
      <template #content>
        <div class="l-sec-size">博客日历</div>
      </template>
    </el-page-header>
    <el-calendar v-model="dateModel">
      <template #date-cell="{ data }">
        <div class="w-100% h-100%" @click="EcyUtils.Router.go({ path: '/archive/d/' + data.day, router })" v-if="findDate(data).value">
          <u>
            {{ data.day.split("-")[2] }}
          </u>
          <div class="mt-2 l-sec-color l-six-size">点击查看</div>
        </div>
        <span v-else>{{ data.day.split("-")[2] }}</span>
      </template>
    </el-calendar>
  </div>
</template>

<style scoped lang="scss"></style>
