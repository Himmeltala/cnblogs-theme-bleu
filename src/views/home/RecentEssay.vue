<script setup lang="ts">
defineProps({
  data: {
    type: Array as PropType<any>
  }
});
</script>

<template>
  <div v-if="data">
    <div class="h-100%" :class="{ 'f-c-b flex-col': data.length >= 4 }">
      <template v-for="item in data">
        <div v-if="!item.isTop" class="lt-lg:mb-15 w-100%" :class="{ 'mb-10': data.length < 4 }">
          <div class="f-c-s text-thirdly text-0.9rem mb-2">
            <div class="i-tabler-clock-hour3 mr-2"></div>
            {{ item.date }}
          </div>
          <div class="text-ellipsis lg:line-clamp-2 mb-2">
            <router-link class="hover" :to="RouterPath.Arbeiten(item.id)">
              {{ item.text }}
            </router-link>
          </div>
          <div
            class="text-ellipsis lg:line-clamp-1 lt-lg:line-clamp-3 text-0.9rem text-thirdly ml-10">
            {{ item.desc }}
          </div>
          <div class="f-c-e text-0.8rem mt-5">
            <div class="mr-2 text-thirdly">
              <router-link class="hover" :to="RouterPath.Arbeiten(item.id)"> 阅读全文 </router-link>
            </div>
            <div class="f-c-e">
              <div class="f-c-c mr-2">
                <div class="i-tabler-message2 mr-1"></div>
                {{ item.comm }}
              </div>
              <div class="f-c-c mr-2">
                <div class="i-tabler-brand-tinder mr-1"></div>
                {{ item.digg }}
              </div>
              <div class="f-c-c">
                <div class="i-tabler-eye mr-1"></div>
                {{ item.view }}
              </div>
            </div>
          </div>
          <div class="f-c-s">
            <el-tag type="danger" v-if="item.isOnlyMe" class="mr-2">自己可见</el-tag>
            <el-tag type="warning" v-if="item.isLocked" class="mr-2">密码锁定</el-tag>
          </div>
        </div>
      </template>
      <div class="f-c-e w-100%">
        <el-button bg text type="primary" @click="$router.push(RouterPath.ArbeitenList('1'))">
          More
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
