<template>
  <div>
    <label class="hidden" :for="'input-' + question.id">Text</label>
    <textarea-autosize
      v-model="answers.text"
      placeholder="Write here..."
      :id="'input-' + question.id"
      ref="blanks"
      @keyup.native="formatText()"
    ></textarea-autosize>
    <span class="edit-option" data-tooltip="Insert a blank" data-position="right above">
      <button class="button-basic button-small" @click.prevent="insertBlank">[ ]</button>
    </span>
    <p>
      <small class="text-mute"
        >Add words for the student to complete inside [square brackets]. Answers not
        case-sensitive.</small
      >
    </p>
  </div>
</template>

<script>
/*
- Type text in the textarea and insert a word inside square brackets that you want the student to enter eg. [word]
- The string containing the original [word] will be stored in: answers.text
- Each [word] in the string will be replaced by an id and optional word length eg. [1] or [1,4]. That string will be stored in: data.text
- Each [word] will be stored with a reference in answers.options
*/

import debounce from '@/shared/utils/debounce';

export default {
  name: 'QuestionBlanks',
  props: {
    question: Object,
  },
  data() {
    return {
      data: this.question.data,
      answers: this.question.answers,
    };
  },
  created() {
    this.formatText();
  },
  methods: {
    formatText: debounce(function() {
      let text = this.answers.text;
      let wordMap = {};
      let options = [];
      let formattedText = text;

      // Match any [word] in the string enclosed by square brackets
      const blankWords = text.match(/(\[.*?\])+/gi);

      // If has at least 1 blank word
      if (blankWords !== null) {
        let len = blankWords.length,
          i = 0;

        for (; i < len; i++) {
          // Add an option in the answers for each blank word
          let word = blankWords[i].substring(1, blankWords[i].length - 1).trim(),
            id = i.toString();

          // Store ID as string
          options.push({ id: id, word: word });

          // Build map of [word] : [id] to replace in the string
          if (this.question.settings.wordLength) {
            // Include character count to resize the inputs
            wordMap[word + '~' + id] = '[' + i + ',' + word.length + ']';
          } else {
            wordMap[word + '~' + id] = '[' + i + ']';
          }
        }

        let index = 0;

        // Loop through the wordMap and replace all instances in the string
        formattedText = this.answers.text.replace(/\[([^\]]+)\]/g, function(_, group) {
          let replacement = wordMap[group + '~' + index];
          index++;
          return replacement;
        });
      }

      // Output text for the assessment
      this.data.text = formattedText;

      // References for the results
      this.answers.options = options;
    }, 200),
    insertBlank() {
      this.answers.text += ' [word]';
      this.formatText();

      this.$nextTick(() => {
        const input = this.$refs.blanks;
        const len = this.answers.text.length;

        if (input) {
          input.$el.focus();
          input.$el.selectionStart = len - 5;
          input.$el.selectionEnd = len - 1;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  position: relative;
}

textarea {
  border: none;
  min-height: 100px;
  width: 100%;

  &:hover + .edit-option,
  &:focus + .edit-option,
  .edit-option:hover {
    opacity: 1;
  }
}

.edit-option {
  opacity: 0;
  position: absolute;
  right: 2px;
  top: 2px;
  transition: opacity 0.15s ease-out;
}
</style>
