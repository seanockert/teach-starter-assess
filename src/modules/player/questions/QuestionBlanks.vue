<template>
  <div class="question-blanks">
    <div v-for="(line, i) in lines" :key="'line' + i">
      <template v-for="word in line">
        <template v-if="replaceWords && replaceWords.includes(word)">
          <label :key="getId(word)" class="hidden" :for="getId(word)">Blank</label>
          <input
            :id="getId(word)"
            type="text"
            :value="getSavedWord(word)"
            :style="getWidth(word)"
            @keyup="updateResult($event.target)"
        /></template>
        <template v-else> {{ word }}</template>
      </template>
    </div>
  </div>
</template>

<script>
import { resultsBlanks } from '@/shared/results/updateResults';

export default {
  name: 'QuestionBlanks',
  props: {
    question: Object,
    savedResult: Array,
  },
  data() {
    return {
      words: [],
      replaceWords: [],
      data: this.question.data,
      result: this.savedResult || [],
    };
  },
  created() {
    // Format the string
    this.formatText();
    this.speechText();

    if (this.savedResult) {
      this.$emit('updateResult', {
        id: this.question.id,
        type: 'blanks',
        result: this.result,
      });
    }
  },
  methods: {
    formatText() {
      // Split the string into words and blank spaces
      const text = this.data.text;

      // Convert the string into an array based on line breaks
      this.lines = [];

      let lineBreaks = text.match(/^(.*?)$/gim);

      for (var i = 0; i < lineBreaks.length; i++) {
        // Convert the string into an array based on [blank] words
        let newLine = lineBreaks[i].match(/(\[.*?\]|[^\]]([a-zA-Z0-9+-/'"?!#*=\s]+)|[^[])/gi);
        this.lines.push(newLine);
      }

      // Get the [blank] words to compare and replace with <input>
      this.replaceWords = text.match(/(\[.*?\])+/gi);
    },
    getId(word) {
      return JSON.parse(word)[0];
    },
    getSavedWord(word) {
      // Pre-fill the inputs with saved result
      if (this.savedResult) {
        const id = JSON.parse(word)[0];
        const index = this.savedResult.findIndex(result => result.id == id);
        return this.savedResult[index] ? this.savedResult[index].word : '';
      }
    },
    getWidth(word) {
      const width = JSON.parse(word)[1];
      if (width && width > 0) {
        return 'width:' + parseInt(width) * 1.5 + 'em';
      }
    },
    speechText() {
      const text = this.question.data.text.replace(/(\[.*?\])+/gi, '[blank]');
      this.$emit('speech', text);
    },
    updateResult(el) {
      this.result = resultsBlanks(this.result, el.id, el.value.trim());

      // Send the result back to parent
      this.$emit('updateResult', {
        id: this.question.id,
        type: 'blanks',
        result: this.result,
      });
    },
  },
  filters: {
    stripBrackets(string) {
      return parseInt(JSON.parse(string)[0]);
    },
  },
};
</script>
