<template>
  <transition name="slide-settings">
    <div class="settings" v-if="question">
      <header>
        <h3>Question settings</h3>
        <button
          class="button button-close"
          @click="closeSettings()"
          v-shortkey="['esc']"
          @shortkey="closeSettings"
        >
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Close settings</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
      </header>
      <ul class="no-list">
        <li class="points">
          <label
            ><span :data-tooltip="helpText.points">Points</span>
            <input
              type="text"
              id="quesiton-points"
              inputmode="numeric"
              pattern="[0-9]*"
              v-model.number="question.points"
              placeholder="0"
              min="0"
              max="99"
              step="1"
              @change="validatePoints"
          /></label>
          <div v-if="validationError" class="error">{{ validationError }}</div>
          <div v-else class="note">Enter a whole number between 1 and 99</div>
        </li>
        <li v-for="(value, name) in question.settings" :key="name">
          <label :class="{ active: value }"
            ><span :data-tooltip="helpText[name] ? helpText[name] : ''" data-type="long">{{
              answerLabel(name)
            }}</span>
            <input type="checkbox" :id="name" class="ui-switch" v-model="question.settings[name]" />
          </label>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
/*
 * Update a question's settings. Opens when 'state.activeQuestion' has an ID value set
 *
 * @parent: /editor/index
 * @requests:
 * @events: updateActiveQuestion
 * @props:
 * @components: Tags
 * @methods: closeSettings
 */

export default {
  name: 'QuestionItemSettings',
  data() {
    return {
      helpText: {
        paragraphs: 'Allow students to answer in multiple lines',
        points: 'Assign a point value to this question',
        showAnswer: 'Allow student to check their answer while taking the activity',
        randomise: 'Shuffle up the order that the options appear in',
        required: 'An answer to this question is required to progress',
        wordLength:
          'The blank words are displayed with the correct number of characters for the answer, instead of equal length',
      },
      maxPoints: 99,
      question: null,
      validationError: '',
    };
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      // Watch for changes to state.activeQuestion
      if (mutation.type === 'updateActiveQuestion') {
        // Get the question data
        this.question = state.assessment.questions.find(
          question => question.id === state.activeQuestion
        );

        if (this.question) {
          this.$emit('close-assessment-settings');
        }
      }
    });
  },
  methods: {
    closeSettings() {
      this.$store.dispatch('updateActiveQuestion', null);
    },
    answerLabel(name) {
      if (name === 'showAnswer') {
        return 'Check if answer correct';
      }

      // Spell with a Z in the US
      if (name === 'randomise' && this.teacher.country === 'us') {
        return 'Randomize';
      }

      return this.$options.filters.splitCamelCase(name);
    },
    validatePoints() {
      let points = this.question.points;
      let error = '';

      if (isNaN(points)) {
        // Invalid if not a number
        points = 1;
        error = 'Must be a number';
      } else if (points % 1 !== 0) {
        // Invalid if a fraction eg. 0.5
        points = Math.ceil(points);
        error = 'Must be a whole number';
      } else if (points < 1) {
        // Invalid if less than 1
        points = 1;
        error = "Can't be less than 1 point";
      } else if (points > this.maxPoints) {
        // Invalid if value higher than 99
        points = this.maxPoints;
        error = "Can't be higher than " + this.maxPoints + ' points';
      }

      // Update the score
      if (error) {
        this.question.points = points;
      }

      this.validationError = error;

      window.setTimeout(() => {
        this.validationError = '';
      }, 2000);
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
  filters: {
    splitCamelCase(str) {
      // Split the string by uppercase letters
      return str.replace(/([A-Z])/g, ' $1');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_editor-settings.scss';

.points {
  label {
    border: none;
  }
}

.error,
.note {
  color: $color-text-lightest;
  font-size: $font-size-300;
  margin-top: -$base-padding/2;
  padding: 0 $base-padding;
}

.error {
  color: $brilliant-amaranth-500;
}
</style>
