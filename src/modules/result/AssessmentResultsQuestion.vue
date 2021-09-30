<template>
  <li :class="{ 'row collapse': true, 'not-answered': !question.marking }">
    <div class="player-question small-12 medium-6 large-4">
      <div>
        <h4>{{ index + 1 }}</h4>
        <div class="player-question-content">
          <header :data-tooltip="'Question type: ' + question.label">
            <h2 v-if="question.title !== ''">
              {{ question.title }}
            </h2>

            <span
              v-if="question.type !== 'statement' && question.settings.required"
              class="required"
              >*</span
            >
          </header>

          <span
            v-if="!question.marking || (question.results && question.results.length == 0)"
            class="label label-closed"
            >Not answered</span
          >

          <p v-if="question.description !== ''">
            {{ question.description }}
          </p>

          <!--<ul v-if="question.tags && question.tags.length > 0" class="no-list inline-list tag-list">
            <li v-for="tag in question.tags" :key="tag.name">
              <span class="label" :title="tag.name">{{ tag.name }}</span>
            </li>
          </ul>-->
          <ul
            v-if="question.curriculumTags && question.curriculumTags.length > 0"
            class="no-list inline-list tag-list"
          >
            <li v-for="tag in question.curriculumTags" :key="tag.id">
              <a
                v-if="tag.link && tag.link != ''"
                :href="'https://www.teachstarter.com' + tag.link"
                class="label"
                :title="'View resources for ' + tag.name"
                target="_blank"
                >{{ tag.name }}</a
              >
              <span v-else class="label" :title="tag.name">{{ tag.name }}</span>
            </li>
          </ul>

          <figure
            v-if="question.data.image"
            @click="largeImage = !largeImage"
            :class="{ 'player-image': true, large: largeImage }"
          >
            <img
              v-if="question.data.image.type !== 'video'"
              :src="question.data.image.src"
              :alt="'Click to zoom. Image for question ' + (index + 1)"
              :height="question.data.image.height"
              :width="question.data.image.width"
            />

            <div v-else class="flex-video">
              <iframe
                width="560"
                height="315"
                :src="'https://www.youtube.com/embed/' + question.data.image.src"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </figure>
        </div>
      </div>
    </div>

    <section class="small-12 medium-6 large-4">
      <!-- Text question -->
      <div v-if="question.type === 'text'">
        <template v-if="output.text && output.text.length">{{ output.text }}</template
        ><template v-else>...</template>
        <div v-if="output.hasAnswer && output.answer" class="flex">
          <span v-if="output.correct" class="label label-correct">
            <svg role="img" height="18" width="18" viewBox="0 0 24 24">
              <title>Correct</title>
              <path
                fill="currentColor"
                d="M0 12.617l2.051-1.922c2.403 1.176 3.924 2.071 6.622 4.02C13.748 8.886 17.101 5.928 23.331 2L24 3.557c-5.138 4.54-8.903 9.6-14.321 19.443C6.337 19.013 4.105 16.472 0 12.617z"
              />
            </svg>
          </span>
          <span v-else class="label label-wrong"
            ><svg role="img" height="18" width="18" viewBox="0 0 24 24">
              <title>Wrong</title>
              <path
                fill="currentColor"
                d="M23 4.44L18.946 1l-7.124 8.286-7.01-8.258L1 4.95c2.095 2.645 4.844 5.411 7.665 7.983l-7.484 8.66 1.23 1.363c1.814-1.224 5.483-4.009 9.355-7.295 3.946 3.364 7.614 6.108 9.377 7.339l1.328-1.172-7.566-8.914C17.918 10.19 20.94 7.09 23 4.44z"
              /></svg
          ></span>

          &nbsp;<small v-if="!output.correct" class="text-mute">Answer: {{ output.answer }}</small>
        </div>
      </div>

      <!-- Multiple choice question -->
      <div v-if="question.type === 'mcq'" class="question-mcq">
        <ol class="alpha-list">
          <li
            v-for="option in output.options"
            :key="option.id"
            :class="{ active: option.selected }"
          >
            <img v-if="option.image" :src="option.image.src" alt="" />
            {{ option.text }}
            <template v-if="output.hasAnswer">
              <template v-if="option.selected">
                <span v-if="option.correct" class="label label-correct">
                  <svg role="img" height="18" width="18" viewBox="0 0 24 24">
                    <title>Correct</title>
                    <path
                      fill="currentColor"
                      d="M0 12.617l2.051-1.922c2.403 1.176 3.924 2.071 6.622 4.02C13.748 8.886 17.101 5.928 23.331 2L24 3.557c-5.138 4.54-8.903 9.6-14.321 19.443C6.337 19.013 4.105 16.472 0 12.617z"
                    />
                  </svg>
                </span>
                <span v-else class="label label-wrong"
                  ><svg role="img" height="18" width="18" viewBox="0 0 24 24">
                    <title>Wrong</title>
                    <path
                      fill="currentColor"
                      d="M23 4.44L18.946 1l-7.124 8.286-7.01-8.258L1 4.95c2.095 2.645 4.844 5.411 7.665 7.983l-7.484 8.66 1.23 1.363c1.814-1.224 5.483-4.009 9.355-7.295 3.946 3.364 7.614 6.108 9.377 7.339l1.328-1.172-7.566-8.914C17.918 10.19 20.94 7.09 23 4.44z"
                    /></svg
                ></span>
              </template>
              <small v-else-if="option.correct">(correct, not selected)</small>
            </template>
          </li>
        </ol>
      </div>

      <!-- Blanks question -->
      <div v-if="question.type === 'blanks'" class="question-blanks">
        <pre v-html="output.text"></pre>
        <br />
        <ul class="alpha-list">
          <li v-for="word in output.options" :key="word.id">
            {{ word.text }}
            <template v-if="output.hasAnswer">
              <span v-if="word.correct" class="label label-correct">
                <svg role="img" height="18" width="18" viewBox="0 0 24 24">
                  <title>Correct</title>
                  <path
                    fill="currentColor"
                    d="M0 12.617l2.051-1.922c2.403 1.176 3.924 2.071 6.622 4.02C13.748 8.886 17.101 5.928 23.331 2L24 3.557c-5.138 4.54-8.903 9.6-14.321 19.443C6.337 19.013 4.105 16.472 0 12.617z"
                  />
                </svg>
              </span>
              <span v-else class="label label-wrong"
                ><svg role="img" height="18" width="18" viewBox="0 0 24 24">
                  <title>Wrong</title>
                  <path
                    fill="currentColor"
                    d="M23 4.44L18.946 1l-7.124 8.286-7.01-8.258L1 4.95c2.095 2.645 4.844 5.411 7.665 7.983l-7.484 8.66 1.23 1.363c1.814-1.224 5.483-4.009 9.355-7.295 3.946 3.364 7.614 6.108 9.377 7.339l1.328-1.172-7.566-8.914C17.918 10.19 20.94 7.09 23 4.44z"
                  /></svg
              ></span>
              <small v-if="word.answer" class="text-mute">(correct: {{ word.answer }})</small>
            </template>
          </li>
        </ul>
      </div>

      <!-- Match and Sort question -->
      <div v-if="question.type === 'match' || question.type === 'sort'" class="question-match">
        <ol class="no-list match-list">
          <li v-if="question.type === 'match' && output.options">
            <strong>Unassigned</strong>
            <ul v-if="question.type === 'match' && output.options" class="no-list">
              <li v-for="option in output.options" :key="option.id">
                <div class="option-static">
                  <img v-if="option.image" :src="option.image.src" alt="" />
                  <span>{{ option.text || '(Empty)' }}</span>
                  <small v-if="option.answer">{{ option.answer }}</small>
                </div>
              </li>
            </ul>
          </li>

          <li v-for="group in output.groups" :key="group.id">
            <strong>{{ group.text || '(Empty)' }}</strong>
            <img v-if="group.image" :src="group.image.src" alt="" />

            <ul
              v-if="
                group.options &&
                  group.options.length > 0 &&
                  !(question.type === 'match' && output.options)
              "
              class="no-list"
            >
              <li v-for="option in group.options" :key="option.id">
                <div class="option-static">
                  <img v-if="option.image" :src="option.image.src" alt="" />
                  <span>{{ option.text || '(Empty)' }}</span>
                  <small v-if="option.answer">{{ option.answer }}</small>
                </div>
                <template v-if="output.hasAnswer">
                  <span v-if="option.correct" class="label label-correct">
                    <svg role="img" height="18" width="18" viewBox="0 0 24 24">
                      <title>Correct</title>
                      <path
                        fill="currentColor"
                        d="M0 12.617l2.051-1.922c2.403 1.176 3.924 2.071 6.622 4.02C13.748 8.886 17.101 5.928 23.331 2L24 3.557c-5.138 4.54-8.903 9.6-14.321 19.443C6.337 19.013 4.105 16.472 0 12.617z"
                      />
                    </svg>
                  </span>
                  <span v-else class="label label-wrong"
                    ><svg role="img" height="18" width="18" viewBox="0 0 24 24">
                      <title>Wrong</title>
                      <path
                        fill="currentColor"
                        d="M23 4.44L18.946 1l-7.124 8.286-7.01-8.258L1 4.95c2.095 2.645 4.844 5.411 7.665 7.983l-7.484 8.66 1.23 1.363c1.814-1.224 5.483-4.009 9.355-7.295 3.946 3.364 7.614 6.108 9.377 7.339l1.328-1.172-7.566-8.914C17.918 10.19 20.94 7.09 23 4.44z"
                      /></svg
                  ></span>
                </template>
              </li>
            </ul>
            <div v-else class="text-mute"><em>Empty</em></div>
          </li>
        </ol>
      </div>

      <!-- Draw question -->
      <div v-if="question.type === 'draw'" class="question-draw">
        <figure
          :style="getBackgroundImage(question.data.draw)"
          @click="largeImage = !largeImage"
          :class="{ large: largeImage }"
        >
          <img
            v-if="question.answers"
            :src="question.answers.dataUrl"
            alt=""
            class="question-draw-overlay"
          />
          <img v-if="question.results && question.results.length" :src="question.results" alt="" />
          <img
            v-else-if="question.data.draw.src"
            :src="question.data.draw.src"
            alt=""
            style="z-index:-1"
          />
        </figure>
        <p v-if="question.results" class="text-center">
          <span class="swatch swatch-red"></span> Student annotations&nbsp;&nbsp;
          <span class="swatch swatch-green"></span> Teacher
        </p>
      </div>
    </section>

    <aside class="small-12 large-4">
      <div v-if="finished && question.marking">
        <div class="form-choice">
          <input
            type="checkbox"
            :id="'correct-' + question.id"
            @change="updateScore"
            v-model="question.marking.correct"
          /><label :for="'correct-' + question.id">{{
            question.marking.correct ? 'Correct' : 'Mark as correct'
          }}</label>
          <span v-if="automarkQuestions.includes(question.type)" class="label label-secondary"
            >Automarked</span
          >
        </div>

        <div class="points">
          <label class="hidden" :for="'points-' + question.id">Question</label>
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            :id="'points-' + question.id"
            v-model.number="question.marking.score"
            placeholder="0"
            min="0"
            :max="question.points"
            step="1"
            @change="validateScore"
          />
          / {{ question.points }} {{ 'point' | pluralise(question.points) }}
        </div>

        <div class="student-notes">
          <label class="hidden" :for="'notes-' + question.id">Notes</label>
          <input
            type="text"
            :id="'notes-' + question.id"
            v-model="question.marking.notes"
            placeholder="Comment for student..."
          />
        </div>
      </div>
      <div v-else>
        {{ question.score || 0 }}
        / {{ question.points }} {{ 'point' | pluralise(question.points) }}
      </div>
    </aside>
  </li>
</template>

<script>
/*
 * Single question with results for marking
 *
 * @parent: /result/AssessmentResultsView
 * @requests:
 * @events: init-score, update-score
 * @props: Object question, Object/Array answers
 * @components:
 * @methods: automark, getBackgroundImage, checkIsCorrect, updateScore
 */

import * as automarkResults from '@/shared/results/automarkResults';
import * as checkCorrect from '@/shared/results/checkCorrect';

export default {
  name: 'AssessmentResultsQuestion',
  props: {
    answers: [Object, Array],
    finished: Boolean,
    index: Number,
    question: Object,
  },
  data() {
    return {
      isCorrect: true,
      largeImage: false,
      output: null,
    };
  },
  created() {
    // Automark this question as correct
    this.automark();
  },
  methods: {
    automark() {
      // Create a new array with the markings for each result
      let question = JSON.parse(JSON.stringify(this.question)),
        answers = question.answers,
        result = null;

      // Fallback to the assessment question if answer not stored with result
      if (!answers || (question.type == 'draw' && !answers.dataUrl)) {
        answers = this.answers;
      }

      // Force results to be null if not set
      /*if (question.results.length == 0) {
        question.results = null;
      }*/

      switch (question.type) {
        case 'text':
          result = automarkResults.automarkText(question.results, answers);
          break;
        case 'mcq':
          result = automarkResults.automarkMcq(question.results, question.data.options, answers);
          break;
        case 'blanks':
          result = automarkResults.automarkBlanks(
            question.results,
            question.data.text,
            answers,
            true
          );
          break;
        case 'match':
        case 'sort':
          result = automarkResults.automarkSort(
            question.results,
            question.data.groups,
            question.data.options,
            answers
          );
          break;
      }

      this.initScore();

      this.output = result;
    },
    checkIsCorrect() {
      // Skip if no answer or no results
      if (!this.question.answers || this.question.results.length == 0) return false;

      // Check each question if is correct or not
      let isCorrect = false;

      switch (this.question.type) {
        case 'mcq':
          isCorrect = checkCorrect.correctMcq(
            this.question.results,
            this.question.answers.options,
            this.question.data.multiple
          );
          break;
        case 'blanks':
          isCorrect = checkCorrect.correctBlanks(
            this.question.results,
            this.question.answers.options
          );
          break;
        case 'sort':
          isCorrect = checkCorrect.correctSort(
            this.question.results,
            this.question.answers.options
          );
          break;
        case 'match':
          isCorrect = checkCorrect.correctSort(
            this.question.results,
            this.question.answers.options
          );
          break;
        case 'text':
          isCorrect = checkCorrect.correctText(this.question.results, this.question.answers);
          break;
      }

      return isCorrect;
    },
    getBackgroundImage(image) {
      let style = '';

      if (image !== null) {
        style = 'background-image: url(' + image.src + ');';

        // Wide image
        if (image.height > this.drawMaxHeight) {
          style += 'background-size: auto 100%;';
        }
      }

      return style;
    },
    updateScore() {
      this.$emit('update-score', this.question.id);
    },
    initScore() {
      if (this.question.marking && this.question.marking.correct === null) {
        if (this.checkIsCorrect()) {
          // Update the score for this result after automark
          this.$emit('init-score', this.question.id);
        }
      }
    },
    validateScore() {
      let mark = this.question.marking.score;
      let error = '';

      if (isNaN(mark)) {
        // Invalid if not a number
        mark = 0;
        error = 'Must be a number';
      } else if (mark % 1 !== 0) {
        // Invalid if a fraction eg. 0.5
        mark = Math.round(mark);
        error = 'Must be a whole number';
      } else if (mark > this.question.points) {
        // Invalid if value higher than the number of points
        mark = this.question.points;
        error =
          "Can't be marked higher than " +
          this.question.points +
          this.$options.filters.pluralise(' point', mark);
      }

      if (error) {
        // Update score and show error message
        this.question.marking.score = mark;
        this.$emit('trigger-toast', error);
      }
    },
  },
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_results.scss';

li.row {
  border-bottom: 2px solid $grey-0;
  padding: $base-padding 0;
}

.player-question {
  header {
    margin-bottom: $base-padding;
  }

  h4 {
    margin-top: -3px;
  }
}

.player-question-content {
  flex: 1 1 auto;
}

aside {
  > div {
    align-items: center;
    display: flex;
    line-height: 1;

    > * {
      flex: 1;

      &:not(:last-child) {
        margin-right: $base-padding;
      }
    }
  }

  input {
    border: 1px solid $grey-200;

    &[type='number'] {
      padding: $base-padding/2;
    }

    &:hover,
    &:focus {
      background-color: #fff;
      border-color: $grey-300;
    }
  }

  label {
    width: auto;
  }

  .label {
    top: 3px;
  }
}

.tag-list {
  li {
    padding-bottom: 0;
  }

  .label {
    top: 0;
  }

  a.label {
    &:hover,
    &:focus {
      background-color: $grey-100;
      color: $color-text;
    }
  }
}

/* For marking */
.points {
  input {
    display: inline-block;
    padding: $base-padding/2 $base-padding/2;
    text-align: center;
    width: 2.6rem;
  }
}

.flex > .label {
  flex: 0 0 auto;
}

@media #{$large-up} {
  aside {
    > div {
      display: block;

      > * {
        margin: 0;
      }

      > * + * {
        margin-top: $base-padding;
      }
    }
  }
}
</style>
