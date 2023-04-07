<script setup lang="ts">
const router = useRouter();

defineProps({
  data: {
    type: Array as PropType<CustType.IWriting[]>,
    required: true
  },
  margin: {
    type: Object as PropType<any>,
    default: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  padding: {
    type: Object as PropType<any>,
    default: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
});
</script>

<template>
  <Card v-for="(item, index) in data" line :padding="padding" :margin="margin">
    <div class="l-article-item__head f-c-b" :class="{ 'mb-5': item.surface }">
      <el-image v-if="index % 2 !== 0 && item.surface" class="cover h-35 rd-2" :src="item.surface" fit="cover" />
      <div :class="{ 'w-100%': !item.surface, 'has-cover w-60%': item.surface }">
        <div class="l-article-item__title hover f-c-s mb-5 l-pri-size" @click="EcyUtils.Router.go({ path: '/p/' + item.id, router })">
          {{ item.text }}
        </div>
        <div class="l-article-item__desc l-thr-color" :class="{ 'mb-5': !item.surface, 'f-c-s': item.isLocked }">
          {{ item.desc }}
        </div>
      </div>
      <el-image v-if="index % 2 === 0 && item.surface" class="cover h-35 rd-2" :src="item.surface" fit="cover" />
    </div>
    <div class="l-article-item__read hover f-c-s mb-4 l-fiv-size">
      <i-ep-caret-right />
      <router-link class="ml-0.5 b-b-1 b-b-dotted p-b-0.3" :to="'/p/' + item.id"> 阅读全文 </router-link>
    </div>
    <WritingSynopsis :align="'flex-end'" :data="{ date: item.date, comm: item.comm, digg: item.digg, view: item.view }" />
    <div class="l-article-item__bottom" :class="{ 'mt-4': item.isTop || item.isOnlyMe || item.isLocked }">
      <LTag round plain v-if="item.isTop" class="mr-2">置顶随笔</LTag>
      <LTag round plain v-else-if="item.isOnlyMe" class="mr-2">自己可见</LTag>
      <LTag round plain v-else-if="item.isLocked" class="mr-2">密码锁定</LTag>
    </div>
  </Card>
</template>

<style scoped lang="scss">
@include pc() {
  .cover {
    --uno: w-26%;
  }

  .has-cover {
    --uno: w-72%;
  }
}

@include mb() {
  .cover {
    --uno: w-38%;
  }

  .has-cover {
    --uno: w-60%;
  }
}
</style>
