<template>
  <div>
    <label class="hidden" :for="'input-preview-' + question.id">Answer</label>
    <textarea-autosize
      v-if="question.settings.paragraphs"
      :id="'input-preview-' + question.id"
      placeholder="Write response..."
      disabled
    ></textarea-autosize>
    <input
      v-else
      type="text"
      :id="'input-preview-' + question.id"
      placeholder="Write response..."
      disabled
    />
  </div>
</template>

<script>
export default {
  name: 'QuestionText',
  props: {
    question: Object,
  },
};
</script>

<style lang="scss" scoped>
input[type='text'],
textarea {
  border: 1px solid $grey-200;
  width: 100%;

  &:hover {
    background-color: #fff;
  }
}
</style>
