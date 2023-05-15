<script setup lang="ts">
import { getMarkList } from "@/apis";
import { useLoading } from "@/hooks/comp-hooks";

const markList = shallowRef();

async function fetchData() {
  markList.value = await getMarkList();
}

useLoading(fetchData);
</script>

<template>
  <div id="l-mark-list" class="page">
    <div class="content" v-if="markList">
      <el-page-header class="mt-4 mb-6" :icon="null" @back="EcyUtils.Router.go({ path: 'back', router: $router })">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="l-size-5">标签集合</div>
        </template>
      </el-page-header>
      <div class="tags">
        <hollowed-box round hover :padding="false" line="dotted" class="item mb-4" v-for="item of markList">
          <div class="f-c-c w-100% h-100%">
            <router-link :to="RouterPath.WORKS_BY_MARK(item.text)"> {{ item.text }} ({{ item.count }}) </router-link>
          </div>
        </hollowed-box>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#l-mark-list .tags {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  flex-wrap: wrap;
  flex-direction: row;

  .item {
    --uno: py-4;
  }

  @include pc() {
    .item {
      flex: 1 1 20%;

      &:not(:nth-child(4n)) {
        --uno: mr-3;
      }
    }
  }

  @include mb() {
    .item {
      flex: 1 1 40%;

      &:nth-child(odd) {
        --uno: mr-3;
      }
    }
  }
}
</style>
