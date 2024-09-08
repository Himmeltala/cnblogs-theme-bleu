<script lang="ts" setup>
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
    <div v-if="isLogined && comments?.length" class="mt-10">
      <div
        v-for="(item, index) in comments"
        :key="item.commentId"
        ref="commentInst"
        class="clearfix mb-10">
        <div class="f-c-s">
          <img :src="item.avatar" class="mr-4 rd-50% w-14 h-14 object-cover" />
          <div>
            <div class="hover cursor-pointer" @click="Utils.Navigation.go(item.space)">
              {{ item.author }}
            </div>
            <div
              v-if="anchor == item.commentId"
              :id="'level-' + item.commentId"
              ref="level"
              class="text-0.9rem text-thirdly mt-2 f-c-c">
              {{ item.layer }} {{ item.date }}
            </div>
            <div v-else :id="'level-' + item.commentId" class="text-0.9rem text-thirdly mt-2 f-c-c">
              {{ item.layer }} {{ item.date }}
            </div>
          </div>
        </div>
        <div class="mt-4 position-relative" style="margin-left: 4.5rem">
          <textarea
            :id="'upload-img-' + index"
            class="z--1 opacity-0 position-absolute top-0 left-0"></textarea>
          <Markdown ref="markdown" :content="item.content" :fancy-group="'comment-' + index" />
        </div>
        <div v-show="!item.isEditing && !item.isAnsling" class="more-action float-right f-c-e">
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
                    :item-index="index"
                    :post-id="postId" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <EditComment
          :comment="item"
          :curr-page-index="currIndex"
          :post-id="postId"
          @on-finish="onEdFinish" />
        <AnswerComment
          :comment="item"
          :curr-page-index="currIndex"
          :post-id="postId"
          @on-finish="onReFinish" />
      </div>
      <div v-if="pageCount > 1" class="mt-10 f-c-e">
        <el-pagination
          v-model:current-page="currIndex"
          :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
          :page-count="pageCount"
          @current-change="fetch" />
      </div>
    </div>
    <el-empty v-else-if="isLogined && !comments?.length" description="来一条友善的评论吧~" />
    <el-empty v-else description="你没有登录或没有申请博客权限~" />
  </div>
</template>

<style lang="scss" scoped>
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
