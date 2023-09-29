<script setup lang="ts">
import { DatumHttp } from "@/requests";

const mainList = shallowRef<MarkModel[]>();
const loading = new Broswer.Loading();

function fetchData() {
  loading.startLoading();
  DatumHttp.getMarkList().then(data => {
    mainList.value = data;

    nextTick(() => {
      loading.endLoading();
    });
  });
}

fetchData();
</script>

<template>
  <div class="mark-list lg-sm:px-90 lt-sm:px-5" v-if="mainList">
    <div class="f-c-s flex-wrap flex-gap-4">
      <router-link v-for="item of mainList" :to="RouterPath.PostsByMark(item.text)">
        <el-tag v-if="item.count > 20" size="large" type="danger">
          <span class="text-0.9rem"> {{ item.text }} ({{ item.count }}) </span>
        </el-tag>
        <el-tag v-else-if="item.count < 20 && item.count > 10" size="large" type="warning">
          <span class="text-0.8rem"> {{ item.text }} ({{ item.count }}) </span>
        </el-tag>
        <el-tag v-else-if="item.count < 10 && item.count > 5" size="large" type="success">
          <span class="text-0.7rem"> {{ item.text }} ({{ item.count }}) </span>
        </el-tag>
        <el-tag v-else size="large" type="info"> {{ item.text }} ({{ item.count }}) </el-tag>
      </router-link>
    </div>
  </div>
</template>
