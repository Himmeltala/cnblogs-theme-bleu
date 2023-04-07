<script setup lang="ts">
import { voteComment } from "@/apis/remote-api";

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
  const data = await voteComment({
    isAbandoned: false,
    commentId: props.comment.commentId,
    postId: props.postId,
    voteType: "Digg"
  });
  if (data.isSuccess) {
    props.comment.digg = props.comment.digg! + 1;
  }
  ElMessage({ message: data.message, grouping: true, type: data.isSuccess ? "success" : "error" });
}
</script>

<template>
  <div v-show="!comment.isEditing && !comment.isAnsling" class="l-comment__digg hover l-fiv-size l-sec-color" @click="diggComment">
    <i-ep-caret-top class="mr-1" />
    <span>{{ comment.digg }}</span>
  </div>
</template>
