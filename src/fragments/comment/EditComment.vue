<script setup lang="ts">
import { CommentApi } from "@/apis";

const props = defineProps({
  comment: {
    type: Object as PropType<any>,
    required: true
  },
  currPageIndex: {
    type: Number,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});

const emits = defineEmits(["onBefore", "onFinish", "onCancel"]);

let htmlContent = "";
const content = ref("");

function uploadImage(el: string) {
  Native.openImageUploadWindow(el, (imgUrl: any) => {
    content.value += `\n${imgUrl}\n`;
  });
}

async function before() {
  htmlContent = props.comment.content;
  content.value = await CommentApi.get({ commentId: props.comment.commentId });
  props.comment.isEditing = !props.comment.isEditing;
}

async function finish() {
  const response = await CommentApi.update({
    body: content.value,
    commentId: props.comment.commentId
  });

  if (response.isSuccess) {
    content.value = "";
    props.comment.isEditing = !props.comment.isEditing;
    emits("onFinish", {
      count: await CommentApi.getCount(props.postId),
      comments: await CommentApi.getList(props.postId, props.currPageIndex)
    });
  }
}

function cancel() {
  props.comment.content = htmlContent;
  props.comment.isEditing = !props.comment.isEditing;
}
</script>

<template>
  <!-- 编辑评论 -->
  <div>
    <div class="float-right w-100%" v-show="comment.isEditing">
      <div class="mb-2 f-c-e">
        <el-tooltip effect="dark" content="插入图片" placement="top-start">
          <span class="hover" @click="uploadImage('upload-img-' + currPageIndex)">
            <i-ep-picture-rounded />
          </span>
        </el-tooltip>
      </div>
      <div class="textarea">
        <textarea v-model="content" placeholder="请编辑一条友善的评论，支持 Markdown 语法" />
      </div>
    </div>
    <div
      class="float-right f-c-e text-0.9rem text-b"
      :class="{ 'edit-item': !comment.isEditing, 'w-100%': comment.isEditing }">
      <div v-show="!comment.isEditing && !comment.isAnsling" class="hover f-c-e" @click="before">
        <div class="i-tabler-pencil-minus mr-1"></div>
        <span>编辑</span>
      </div>
      <div v-show="comment.isEditing" class="hover f-c-e mr-4" @click="finish">
        <i-ep-circle-check class="mr-1" />
        <span>完成编辑</span>
      </div>
      <div v-show="comment.isEditing" class="hover f-c-e" @click="cancel">
        <i-ep-circle-close class="mr-1" />
        <span>取消编辑</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include pc() {
  .edit-item {
    --uno: w-8%;
  }
}

@include mb() {
  .edit-item {
    --uno: w-18%;
  }
}
</style>
