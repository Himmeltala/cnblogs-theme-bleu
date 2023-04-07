<script setup lang="ts">
import { getWritingArchive, getDayArchive } from "@/apis/remote-api";

EcyUtils.startLoading();

const route = useRoute();
const router = useRouter();
let date = route.params.date;
let mode = route.params.mode;
const setting = EcyUtils.getSetting();
const archive = shallowRef();

async function fetchData() {
  EcyUtils.startLoading();
  if (mode === "a") {
    archive.value = await getWritingArchive(`${date}`, "article");
  } else if (mode === "p") {
    archive.value = await getWritingArchive(`${date}`, "essay");
  } else if (mode === "d") {
    archive.value = await getDayArchive(`${String(date).replaceAll("-", "/")}`);
  }
  document.querySelector("title").innerText = `${archive.value.hint} - ${EcyConfig.blogApp} - 博客园`;
  EcyUtils.endLoading();
}

await fetchData();

async function nexpr(e: any) {
  // await fetchData();
}

async function next(e: any) {
  // await fetchData();
}

async function prev(e: any) {
  // await fetchData();
}

watch(route, async () => {
  if (route.name === "Archive") {
    mode = route.params.mode;
    date = route.params.date;
    await fetchData();
  }
});
</script>

<template>
  <ContextMenu>
    <div id="l-archive" class="min-height">
      <Pagination @nexpr="nexpr" @next="next" @prev="prev" :count="archive.page" :disabled="setting.other.pagation.pin">
        <template #content>
          <Card>
            <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router })">
              <template #title>
                <div class="f-c-c">
                  <i-ep-back />
                </div>
              </template>
              <template #content>
                <div class="l-sec-size mb-5 mt-4">{{ archive.hint }}</div>
              </template>
            </el-page-header>
          </Card>
          <WritingItem
            v-if="archive.data.length > 0"
            :padding="setting.pages.sort.padding"
            :margin="setting.pages.sort.margin"
            :data="archive.data" />
        </template>
      </Pagination>
    </div>
    <template #title>盒子模型设置</template>
    <template #content>
      <BoxSetting :padding="setting.pages.sort.padding" :margin="setting.pages.sort.margin" />
    </template>
  </ContextMenu>
</template>
