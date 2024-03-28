<script setup lang="ts">
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
  const { isSuccess } = await Requests.Comment.vote({
    isAbandoned: false,
    commentId: parseInt(props.comment.commentId),
    postId: parseInt(props.postId),
    voteType: "Digg"
  });
  isSuccess && props.comment.digg++;
}
</script>

<template>
  <div
    v-show="!comment.isEditing && !comment.isAnsling"
    class="hover f-c-c text-0.8rem text-thirdly"
    @click="diggComment">
    <div class="i-tabler:thumb-up mr-2"></div>
    <div>支持 {{ comment.digg }}</div>
  </div>
</template>
