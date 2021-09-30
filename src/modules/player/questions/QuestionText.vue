<template>
  <div class="question-text">
    <label class="hidden" :for="'input-' + question.id">Answer</label>
    <textarea-autosize
      v-if="question.settings.paragraphs"
      v-model="result"
      :id="'input-' + question.id"
      @keyup.native="updateResult"
      placeholder="Write response..."
    ></textarea-autosize>
    <input
      v-else
      type="text"
      :id="'input-' + question.id"
      v-model="result"
      @keyup="updateResult"
      placeholder="Write response..."
    />
  </div>
</template>

<script>
import debounce from '@/shared/utils/debounce';

export default {
  name: 'QuestionText',
  props: {
    question: Object,
    savedResult: String,
  },
  data() {
    return {
      result: this.savedResult,
    };
  },
  methods: {
    updateResult: debounce(function() {
      // Send the result back to parent
      this.$emit('updateResult', {
        id: this.question.id,
        type: 'text',
        result: this.result.trim(),
      });
    }, 200),
  },
};
</script>
