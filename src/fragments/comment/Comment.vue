<script setup lang="ts">
import { useAnchorStore } from "@/store";

const props = defineProps({
  postId: { type: String, required: true }
});

const toRefPostId = toRef(props, "postId");

const level = ref();
const { anchor } = storeToRefs(useAnchorStore());
const commentInst = ref();
const comments = ref<CommentModel[]>();
const pageCount = ref(0);
const currIndex = ref(1);
const markdown = shallowRef();

function fetch() {
  Requests.Comment.getList(props.postId, currIndex.value, anchor.value).then(list => {
    comments.value = list;
    Requests.Comment.getCount(props.postId).then(count => {
      pageCount.value = count;

      nextTick(() => {
        for (let index = 0; index < markdown.value.length; index++) {
          const el = markdown.value[index];
          el.initialize();
        }
      });
    });
  });
}

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

watch(toRefPostId, () => {
  fetch();
});

watch(level, () => {
  document.querySelector(`#level-${anchor.value}`).scrollIntoView();
  anchor.value = 0;
});

fetch();
</script>

<template>
  <div class="l-comment">
    <PostComment :post-id="postId" @on-post="onPost" />
    <div class="caption f-c-s">
      <div class="i-tabler:list mr-2"></div>
      评论列表
    </div>
    <div class="mt-10" v-if="isLogined && comments?.length">
      <div
        class="clearfix mb-10"
        v-for="(item, index) in comments"
        :key="item.commentId"
        ref="commentInst">
        <div class="f-c-s">
          <img class="mr-4 rd-50% w-14 h-14 object-cover" :src="item.avatar" />
          <div>
            <div class="hover cursor-pointer" @click="Utils.Navigation.go(item.space)">
              {{ item.author }}
            </div>
            <div
              class="text-0.9rem text-thirdly mt-2 f-c-c"
              :id="'level-' + item.commentId"
              v-if="anchor == item.commentId"
              ref="level">
              {{ item.layer }} {{ item.date }}
            </div>
            <div class="text-0.9rem text-thirdly mt-2 f-c-c" :id="'level-' + item.commentId" v-else>
              {{ item.layer }} {{ item.date }}
            </div>
          </div>
        </div>
        <div class="mt-4 position-relative" style="margin-left: 4.5rem">
          <textarea
            class="z--1 opacity-0 position-absolute top-0 left-0"
            :id="'upload-img-' + index"></textarea>
          <Markdown ref="markdown" :fancy-group="'comment-' + index" :content="item.content" />
        </div>
        <div class="more-action float-right f-c-e" v-show="!item.isEditing && !item.isAnsling">
          <el-dropdown>
            <div class="f-c-e text-0.9rem text-thirdly hover">
              <div class="i-tabler:dots-vertical mr-2"></div>
              <div>更多</div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <DiggComment :comment="item" :post-id="postId" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <BuryComment :comment="item" :post-id="postId" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <DeleteComment
                    :comment="item"
                    :comments="comments"
                    :post-id="postId"
                    :item-index="index" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <EditComment
          @on-finish="onEdFinish"
          :post-id="postId"
          :curr-page-index="currIndex"
          :comment="item" />
        <AnswerComment
          @on-finish="onReFinish"
          :post-id="postId"
          :curr-page-index="currIndex"
          :comment="item" />
      </div>
      <div class="mt-10 f-c-e" v-if="pageCount > 1">
        <el-pagination
          @current-change="fetch"
          :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
          v-model:current-page="currIndex"
          :page-count="pageCount" />
      </div>
    </div>
    <el-empty v-else-if="isLogined && !comments?.length" description="来一条友善的评论吧~" />
    <el-empty v-else description="你没有登录或没有申请博客权限~" />
  </div>
</template>

<style scoped lang="scss">
@include mixins.pc() {
  .more-action {
    --uno: w-8%;
  }
}

@include mixins.mb() {
  .more-action {
    --uno: w-10%;
  }
}
</style>
