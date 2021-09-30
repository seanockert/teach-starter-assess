<template>
  <div>
    <ol class="alpha-list">
      <li v-for="option in optionsSorted" :key="option.id">
        <div :class="{ 'form-choice': true, 'form-choice-image': option.image }">
          <input
            type="radio"
            :name="question.id"
            :id="'mcq-' + question.id + option.id"
            disabled
            v-if="question.data.multiple == false"
          />
          <input
            type="checkbox"
            :name="question.id"
            :id="'mcq-' + question.id + option.id"
            disabled
            v-else
          />
          <label :for="'mcq-' + question.id + option.id" :data-text="option.text || '(Empty)'">
            <img v-if="option.image" :src="option.image.src" :alt="option.text" />
            {{ option.text }}
            <template v-if="option.text == '' && option.image == null">(Empty)</template>
            <small v-if="correctOption(option.id)" class="text-mute">&nbsp;&nbsp;(correct)</small>
          </label>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'QuestionMcq',
  props: {
    question: Object,
  },
  data() {
    return {
      options: this.question.data.options,
    };
  },
  methods: {
    correctOption(id) {
      // Check answers for the correct option
      if (this.question.answers.options.includes(id)) {
        return true;
      }
    },
  },
  computed: {
    optionsSorted() {
      // Randomise the option order
      if (this.question.settings.randomise) {
        let sortedOptions = JSON.parse(JSON.stringify(this.options));
        return sortedOptions.sort(function() {
          return 0.5 - Math.random();
        });
      } else {
        return this.options;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  float: left;
  height: auto;
  max-height: 6rem;
  max-width: 6rem;
  padding: $base-padding/2;
}
</style>
