<template>
  <div class="question-mcq">
    <ol class="alpha-list">
      <li v-for="option in localOptions" :key="option.id">
        <!--@click.stop="updateResult"-->
        <div :class="{ 'form-choice': true, 'form-choice-image': option.image }">
          <input
            type="radio"
            :name="question.id"
            :id="'option-' + question.id + option.id"
            :value="option.id"
            v-if="question.data.multiple == false"
            :checked="savedResult && savedResult.indexOf(option.id) !== -1"
            @change.stop="updateResult"
          />
          <input
            v-else
            type="checkbox"
            :name="question.id"
            :id="'option-' + question.id + option.id"
            :value="option.id"
            :checked="savedResult && savedResult.indexOf(option.id) !== -1"
            @change.stop="updateResult"
          />
          <label :for="'option-' + question.id + option.id">
            <img v-if="option.image" :src="option.image.src" :alt="option.text" />
            {{ option.text }}
          </label>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import { resultsMcq } from '@/shared/results/updateResults';

export default {
  name: 'QuestionMcq',
  props: {
    question: Object,
    savedResult: Array,
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(this.question.data.options)),
      localOptions: JSON.parse(JSON.stringify(this.question.data.options)),
      result: this.savedResult || [],
    };
  },
  created() {
    if (this.question.settings.randomise) {
      this.localOptions = this.shuffle(this.options);
    }

    this.speechText();
  },
  methods: {
    updateResult(e) {
      // Capture mouse clicks on the list element
      if (e.type != 'change' && e.target.children[0] && e.target.children[0].children[0]) {
        e.target.children[0].children[0].checked = true;
      }

      // Record checked options
      this.result = resultsMcq(this.result, e, this.question.data.multiple);

      // Send the result back to parent
      this.$emit('updateResult', {
        id: this.question.id,
        type: 'mcq',
        result: this.result,
      });
    },
    shuffle(options) {
      if (this.question.settings.randomise) {
        // Randomise the option order
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
      }
      return options;
    },
    speechText() {
      let text = 'Select from. ';
      const optionsLen = this.localOptions.length;

      for (var i = 0; i < optionsLen; i++) {
        text += 'Option ' + (i + 1) + ': ' + this.localOptions[i].text + '. ';
      }

      this.$emit('speech', text);
    },
  },
};
</script>

<style lang="scss" scoped>
em {
  color: $color-text-lightest;
  font-weight: normal;
}

small {
  color: $ts-green-500;
}

img {
  float: left;
  height: auto;
  max-height: 6rem;
  max-width: 6rem;
  padding: $base-padding/2;
}
</style>
