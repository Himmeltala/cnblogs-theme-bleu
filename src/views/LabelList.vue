<script setup lang="ts">
import { DatumHttp } from "@/requests";

const labelList = ref<LabelModel[]>();
const filteredList = ref<LabelModel[]>();
const searchVal = ref("");
const sortVal = ref("乱序");
const loading = new Broswer.Loading();

function fetch() {
  loading.startLoading();
  DatumHttp.getMarkList().then(data => {
    labelList.value = data;
    filteredList.value = data;
    nextTick(() => {
      loading.endLoading();
    });
  });
}

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function onEnter() {
  const regex = new RegExp(searchVal.value, "g");
  filteredList.value = labelList.value.filter(item => regex.test(item.text));
}

function onSortChange() {
  if (sortVal.value == "乱序") {
    filteredList.value = shuffleArray(labelList.value);
  } else if (sortVal.value == "升序") {
    filteredList.value = labelList.value.sort((a, b) => a.count - b.count);
  } else if (sortVal.value == "降序") {
    filteredList.value = labelList.value.sort((a, b) => b.count - a.count);
  } else {
    filteredList.value = shuffleArray(labelList.value);
  }
}

fetch();
</script>

<template>
  <div class="page" v-if="labelList">
    <div class="utils">
      <div class="f-c-c">
        <div class="f-c-b w-50%">
          <el-input v-model="searchVal" placeholder="请输入关键字" @keyup.enter="onEnter">
            <template #suffix>
              <div class="i-tabler:search"></div>
            </template>
          </el-input>
        </div>
      </div>
      <div class="f-c-c mt-2 mb-10">
        <div class="f-c-c w-50%">
          <el-radio-group v-model="sortVal" @change="onSortChange">
            <el-radio label="乱序">乱序</el-radio>
            <el-radio label="升序">升序</el-radio>
            <el-radio label="降序">降序</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="f-c-b flex-wrap flex-gap-4">
      <router-link v-for="item of filteredList" :to="RoutePaths.PostsByLabel(item.text)">
        <el-tag round v-if="item.count >= 20" size="large" type="danger">
          <span> {{ item.text }} ({{ item.count }}) </span>
        </el-tag>
        <el-tag round v-else-if="item.count < 20 && item.count >= 10" size="large" type="warning">
          <span> {{ item.text }} ({{ item.count }}) </span>
        </el-tag>
        <el-tag round v-else-if="item.count < 10 && item.count >= 5" size="large" type="success">
          <span> {{ item.text }} ({{ item.count }}) </span>
        </el-tag>
        <el-tag round v-else size="large" type="info"> {{ item.text }} ({{ item.count }}) </el-tag>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  border-radius: 10rem;
}
</style>
