<script setup lang="ts">
import { CommentApi } from "@/apis";

const props = defineProps({
  comment: {
    type: Object as PropType<any>,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});

async function diggComment() {
  const data = await CommentApi.vote({
    isAbandoned: false,
    commentId: props.comment.commentId,
    postId: parseInt(props.postId),
    voteType: "Digg"
  });
  if (data.isSuccess) {
    props.comment.digg = props.comment.digg! + 1;
  }
  ElMessage({ message: data.message, grouping: true, type: data.isSuccess ? "success" : "error" });
}
</script>

<template>
  <div v-show="!comment.isEditing && !comment.isAnsling" class="l-comment__digg hover l-size-2 l-color-2" @click="diggComment">
    <i-ep-caret-top class="mr-1" />
    <span>{{ comment.digg }}</span>
  </div>
</template>
