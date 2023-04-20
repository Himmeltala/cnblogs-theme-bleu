<script setup lang="ts">
import { getMarkList } from "@/apis";

EcyUtils.setTitle("标签");
EcyUtils.startLoading();

const markList = await getMarkList();

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <div class="page mt-4">
    <div id="l-tags" class="content min-height">
      <HollowedBox round hover line="dotted" class="item mb-4" v-for="item of markList">
        <div class="f-c-c w-100% h-100%">
          <router-link :to="RouterPath.worksByMark(item.text)"> {{ item.text }} ({{ item.count }}) </router-link>
        </div>
      </HollowedBox>
    </div>
  </div>
</template>

<style scoped lang="scss">
#l-tags {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  flex-wrap: wrap;
  flex-direction: row;

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
