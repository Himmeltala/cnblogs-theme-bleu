<script setup lang="ts">
import { useAnchorStore } from "@/store";
import { CommentApi } from "@/apis";

const props = defineProps({
  postId: { type: String, required: true }
});

const level = ref();
const { anchor } = storeToRefs(useAnchorStore());
const comments = ref();
const pageCount = ref(await CommentApi.getCount(props.postId));
const currIndex = ref(1);

async function fetchData() {
  comments.value = await CommentApi.getList(props.postId, currIndex.value, anchor.value);
}

await fetchData();

function onPost(response: any) {
  comments.value = response.comments;
  pageCount.value = response.count;
}

function onReFinish(response: any) {
  comments.value = response.comments;
  pageCount.value = response.count;
}

function onEdFinish(response: any) {
  comments.value = response.comments;
  pageCount.value = response.count;
}

watch(level, () => {
  document.querySelector(`#level-${anchor.value}`).scrollIntoView();
});

defineExpose({
  fetchData
});
</script>

<template>
  <div class="l-comment">
    <post-comment :post-id="postId" @on-post="onPost" />
    <h3>评论列表</h3>
    <div class="l-comment__list mt-10" v-if="EcyConfig.isLogin && comments?.length">
      <div class="l-comment__main clearfix mb-12" v-for="(item, index) in comments" :key="item.commentId">
        <div class="l-comment__head f-c-s">
          <el-image class="l-comment__avatar mr-4 rd-50 w-14 h-14" :src="item.avatar" fit="fill" />
          <div>
            <div class="l-comment__author hover cursor-pointer" @click="EcyUtils.Router.go({ path: item.space })">
              {{ item.author }}
            </div>
            <div class="l-comment__data l-size-2 l-color-2 mt-2 f-c-c">
              <span :id="'level-' + item.commentId" class="mr-2 ref" v-if="anchor == item.commentId" ref="level">{{ item.layer }} </span>
              <span :id="'level-' + item.commentId" class="mr-2" v-else>{{ item.layer }}</span>
              {{ item.date }}
            </div>
          </div>
        </div>
        <div class="l-comment__middle mt-4 relative" style="margin-left: 4.5rem">
          <textarea class="z--1 opacity-0 absolute top-0 left-0" :id="'upload-img-' + index" />
          <div class="l-comment__content" v-html="item.content" v-hljs="item.layer" v-highslide="item.layer" v-mathjax="item.layer"></div>
        </div>
        <div class="l-comment__more float-right f-c-e" v-show="!item.isEditing && !item.isAnsling">
          <el-dropdown>
            <div class="f-c-c">
              <i-ep-more class="hover l-size-2 l-color-2" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <digg-comment :comment="item" :post-id="postId" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <bury-comment :comment="item" :post-id="postId" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <delete-comment :comment="item" :comments="comments" :post-id="postId" :item-index="index" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <edit-comment @on-finish="onEdFinish" :post-id="postId" :curr-page-index="currIndex" :comment="item" />
        <answer-comment @on-finish="onReFinish" :post-id="postId" :curr-page-index="currIndex" :comment="item" />
      </div>
      <div class="mt-10 f-c-e" v-if="pageCount > 1">
        <el-pagination @current-change="fetchData" layout="prev, pager, next" v-model:current-page="currIndex" :page-count="pageCount" />
      </div>
    </div>
    <el-empty v-else-if="EcyConfig.isLogin && !comments?.length" description="来一条友善的评论吧~" />
    <el-empty v-else description="你没有登录或没有申请博客权限~" />
  </div>
</template>

<style lang="scss">
.l-comment .l-comment__middle .l-comment__content {
  line-height: 1.7;

  a {
    padding-bottom: 1px;
    border-bottom: 1px dotted var(--pri-text-color);
    @include hover($border-color: bottom);
  }

  img {
    cursor: zoom-in;
  }
}
</style>

<style scoped lang="scss">
@include pc() {
  .l-comment__more {
    --uno: w-5%;
  }
}

@include mb() {
  .l-comment__more {
    --uno: w-10%;
  }
}
</style>
