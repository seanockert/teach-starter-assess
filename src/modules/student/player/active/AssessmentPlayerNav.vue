<template>
  <footer class="player-nav">
    <div>
      <nav>
        <span
          v-if="currentIndex > 0"
          class="bounce"
          data-tooltip="Previous question"
          data-position="above"
        >
          <button class="button" @click="previous" v-shortkey="['arrowleft']" @shortkey="previous">
            <svg aria-hidden="true" class="icon" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"
              /></svg
            >&nbsp; Prev
          </button>
        </span>
        <span
          v-if="currentIndex < questionCount && canAdvance"
          class="bounce"
          data-tooltip="Next question"
          data-position="above"
        >
          <button
            class="button button-primary"
            @click="next"
            v-shortkey="['arrowright']"
            @shortkey="next"
          >
            <template v-if="currentIndex === 0 && firstQuestion.type === 'statement'"
              >Start
            </template>
            <template v-else>Next </template>

            &nbsp;<svg aria-hidden="true" class="icon" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
            </svg>
          </button>
        </span>
        <span
          v-else-if="currentIndex < questionCount && !canAdvance"
          data-tooltip="Answer question to progress"
          data-position="above"
        >
          <button class="button button-primary" disabled>
            Answer question first
          </button>
        </span>
        <span
          v-if="currentIndex === questionCount"
          class="bounce"
          data-tooltip="Submit results"
          data-position="above"
        >
          <button class="button button-primary" @click="next()">
            Finish
          </button>
        </span>
      </nav>

      <div v-if="currentIndex < questionCount" class="question-count">
        {{ currentIndex + 1 }} /
        {{ questionCount }}
      </div>

      <div
        class="toggle-font hidden-small bounce"
        data-tooltip="Toggle font size"
        data-position="right above"
      >
        <button @click="toggleFontSize()" class="button button-icon" title="Toggle font size">
          <svg role="img" width="24" height="24" viewBox="0 0 24 24" class="icon">
            <title>Change font size</title>
            <path
              fill="currentColor"
              d="M23.4 4H10.2a.6.6 0 00-.6.6v3.6a.6.6 0 00.6.6h1.2a.6.6 0 00.6-.6V7h3.3v11.4h-1.5a.6.6 0 00-.6.6v1.2a.6.6 0 00.6.6h6a.6.6 0 00.6-.6V19a.6.6 0 00-.6-.6h-1.5V7h3.3v1.2a.6.6 0 00.6.6h1.2a.6.6 0 00.6-.6V4.6a.6.6 0 00-.6-.6zm-12 7.2H.6a.6.6 0 00-.6.6v2.4a.6.6 0 00.6.6h1.2a.6.6 0 00.6-.6v-.6h2.1v4.8h-.9a.6.6 0 00-.6.6v1.2a.6.6 0 00.6.6h4.8a.6.6 0 00.6-.6V19a.6.6 0 00-.6-.6h-.9v-4.8h2.1v.6a.6.6 0 00.6.6h1.2a.6.6 0 00.6-.6v-2.4a.6.6 0 00-.6-.6z"
            />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
/*
 * Navigation for the assessment
 * Duplicate of /player/AssessmentPlayerNav
 *
 * - Use arrow keys to view next and previous questions
 * - Advancing to the next question is blocked if canAdvance = true
 * - If the first question is an 'statement', the next button label is 'Start'
 * - Next button label is 'Finished' on the last question
 *
 * @parent: /student/player/active/index
 * @requests:
 * @events: next, previous
 * @props: Array questions, Number questionCount, Number currentIndex, Boolean canAdvance
 * @components:
 * @methods: next, previous
 */

export default {
  name: 'AssessmentPlayerNav',
  props: {
    questions: Array,
    questionCount: Number,
    currentIndex: Number,
    canAdvance: Boolean,
  },
  data() {
    return {
      firstQuestion: this.questions[0],
      lastQuestion: this.questions[this.questions.length - 1],
    };
  },
  methods: {
    next() {
      // Go to next question if allowed
      if (this.canAdvance) {
        this.$emit('next');
      }
    },
    previous() {
      // Go back to previous question
      this.$emit('previous');
    },
    toggleFontSize() {
      this.$emit('toggle-font-size');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_student.scss';

.toggle-font {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
