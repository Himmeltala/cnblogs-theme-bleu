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

async function buryComment() {
  const data = await voteComment({
    isAbandoned: false,
    commentId: props.comment.commentId,
    postId: props.postId,
    voteType: "Bury"
  });
  if (data.isSuccess) {
    props.comment.bury = props.comment.bury! + 1;
  }
  ElMessage({ message: data.message, grouping: true, type: data.isSuccess ? "success" : "error" });
}
</script>

<template>
  <div v-show="!comment.isEditing && !comment.isAnsling" class="l-comment__bury hover l-six-size l-sec-color" @click="buryComment">
    <i-ep-caret-bottom class="mr-1" />
    <span>{{ comment.bury }}</span>
  </div>
</template>
