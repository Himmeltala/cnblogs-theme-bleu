<script setup lang="ts">
import { CommentHttp } from "@/requests";

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
  Utils.Native.openImageUploadWindow(el, (imgUrl: any) => {
    content.value += `\n${imgUrl}\n`;
  });
}

async function before() {
  htmlContent = props.comment.content;
  content.value = await CommentHttp.get({ commentId: props.comment.commentId });
  props.comment.isEditing = !props.comment.isEditing;
}

async function finish() {
  const response = await CommentHttp.update({
    body: content.value,
    commentId: props.comment.commentId
  });

  if (response.isSuccess) {
    content.value = "";
    props.comment.isEditing = !props.comment.isEditing;
    emits("onFinish", {
      count: await CommentHttp.getCount(props.postId),
      comments: await CommentHttp.getList(props.postId, props.currPageIndex)
    });
  }
}

function cancel() {
  props.comment.content = htmlContent;
  props.comment.isEditing = !props.comment.isEditing;
}
</script>

<template>
  <div>
    <div class="float-right w-100%" v-show="comment.isEditing">
      <div class="mb-2 f-c-e">
        <el-tooltip effect="dark" content="插入图片" placement="top-start">
          <span class="hover" @click="uploadImage('upload-img-' + currPageIndex)">
            <div class="i-tabler-photo-circle"></div>
          </span>
        </el-tooltip>
      </div>
      <div class="textarea">
        <textarea v-model="content" placeholder="请编辑一条友善的评论，支持 Markdown 语法" />
      </div>
    </div>
    <div
      class="float-right f-c-e text-0.9rem text-thirdly"
      :class="{ 'edit-item': !comment.isEditing, 'w-100%': comment.isEditing }">
      <div v-show="!comment.isEditing && !comment.isAnsling" class="hover f-c-e" @click="before">
        <div class="i-tabler:pencil-minus mr-1"></div>
        <span>编辑</span>
      </div>
      <div v-show="comment.isEditing" class="hover f-c-e mr-4" @click="finish">
        <div class="i-tabler-check mr-1"></div>
        <span>完成编辑</span>
      </div>
      <div v-show="comment.isEditing" class="hover f-c-e" @click="cancel">
        <div class="i-tabler-x mr-1"></div>
        <span>取消编辑</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include mixins.pc() {
  .edit-item {
    --uno: w-8%;
  }
}

@include mixins.mb() {
  .edit-item {
    --uno: w-18%;
  }
}
</style>
