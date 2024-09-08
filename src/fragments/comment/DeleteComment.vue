<script lang="ts" setup>
const props = defineProps({
  comment: {
    type: Object as PropType<any>,
    required: true
  },
  comments: {
    type: Array as PropType<CommentModel[]>,
    required: true
  },
  itemIndex: {
    type: Number,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});

async function confirmDeleteComment() {
  await Requests.Comment.del({
    commentId: parseInt(props.comment.commentId),
    parentId: parseInt(props.postId)
  });
}
</script>

<template>
  <div v-show="!comment.isEditing && !comment.isAnsling" class="text-thirdly text-0.8rem">
    <el-popconfirm
      cancel-button-text="取消"
      confirm-button-text="确定"
      title="确定删除该评论？"
      @confirm="confirmDeleteComment">
      <template #reference>
        <div class="hover f-c-e">
          <div class="i-tabler:trash mr-2"></div>
          <div>删除评论</div>
        </div>
      </template>
    </el-popconfirm>
  </div>
</template>
