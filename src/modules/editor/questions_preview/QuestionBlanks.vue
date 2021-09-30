<template>
  <div>
    <div v-for="(line, i) in lines" :key="'line' + i">
      <template v-for="word in line">
        <template v-if="keywords && keywords.includes(word)">
          <label :key="getId(word)" class="hidden" :for="'word' + id + getId(word)">Blank</label>
          <input
            :id="'word' + id + getId(word)"
            type="text"
            :style="getWidth(word)"
            title="Filled in by student"
            disabled
          />
        </template>
        <template v-else>{{ word }}</template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionBlanks',
  props: {
    id: [String, Number],
    question: Object,
  },
  data() {
    return {
      keywords: [],
      lines: [],
      data: this.question.data,
    };
  },
  created() {
    this.formatText();
  },
  watch: {
    data: {
      handler() {
        this.formatText();
      },
      deep: true,
    },
  },
  methods: {
    formatText() {
      const text = this.data.text;

      let lineBreaks = text.match(/^(.*?)$/gim);

      // Convert the string into an array based on line breaks
      this.lines = [];

      for (var i = 0; i < lineBreaks.length; i++) {
        // Convert the string into an array based on [blank] words
        let newLine = lineBreaks[i].match(/(\[.*?\]|[^\]]([a-zA-Z0-9+-/'"?!#*=\s]+)|[^[])/gi);
        this.lines.push(newLine);
      }

      // Get the [blank] keywords to compare and replace with <input>
      this.keywords = text.match(/(\[.*?\])+/gi);
    },
    getId(word) {
      return 'word' + JSON.parse(word)[0];
    },
    getWidth(word) {
      if (!this.question.settings.wordLength) return;

      const width = JSON.parse(word)[1];

      if (width && width > 0) {
        return 'width:' + parseInt(width) + 'em';
      }
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
input[type='text'] {
  background-color: $ts-green-100;
  border: none;
  display: inline-block;
  font-weight: bold;
  margin-top: $base-padding/2;
  padding-bottom: $base-padding/2;
  position: relative;
  text-overflow: ellipsis;
  width: 8rem;
  min-width: 2.5rem;
  max-width: 20rem;

  &:hover {
    background-color: $ts-green-200;
  }

  &:focus {
    background-color: #fff;
  }
}
</style>
