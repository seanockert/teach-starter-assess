<template>
  <li class="row collapse">
    <div class="player-question small-12 medium-6 large-4">
      <header>
        <h4>{{ index + 1 }}</h4>
        <h2 v-if="question.title !== ''">{{ question.title }}</h2>
      </header>

      <span
        v-if="!question.marking || (question.results && question.results.length == 0)"
        class="label label-closed"
        title="Question not answered by student"
        >Teacher supported</span
      >

      <p v-if="question.description !== ''">
        {{ question.description }}
      </p>

      <figure v-if="question.data.image">
        <img :src="question.data.image.src" alt="" />
      </figure>
    </div>

    <section class="small-12 medium-6 large-5">
      <!-- Text question -->
      <div v-if="question.type === 'text'">
        <template v-if="output.text != ''">{{ output.text }}</template
        ><em v-else class="text-mute">Empty</em>
        <div v-if="output.hasAnswer && output.answer && showGrading" class="flex">
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

          <small v-if="!output.correct" class="text-mute"
            >(correct answer: {{ output.answer }})</small
          >
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
            {{ option.text || '(Empty)' }}
            <template v-if="output.hasAnswer && showGrading">
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
            <template v-if="output.hasAnswer && showGrading">
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
          <li v-for="group in filterGroups(output.groups)" :key="group.id">
            <img v-if="group.image" :src="group.image.src" alt="" />
            <strong>{{ group.text || '(Empty)' }}</strong>

            <ul v-if="group.options.length > 0" class="no-list inline-list">
              <li v-for="option in group.options" :key="option.id">
                <div class="option-static">
                  <img v-if="option.image" :src="option.image.src" alt="" />
                  {{ option.text || '(Empty)' }}
                  <small v-if="option.answer">{{ option.answer }}</small>
                </div>
                <template v-if="output.hasAnswer && showGrading">
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
            <div v-else class="text-mute">
              <small><em>Empty</em></small>
            </div>
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

          <img v-if="question.results.length" :src="question.results" alt="" />
          <img
            v-else-if="question.data.draw.src"
            :src="question.data.draw.src"
            alt=""
            style="z-index:-1"
          />
        </figure>
        <p class="text-center" v-if="question.answers">
          <span class="swatch swatch-red"></span> Student annotations&nbsp;&nbsp;
          <span class="swatch swatch-green"></span> Answer
        </p>
      </div>
    </section>

    <aside v-if="marked && question.marking && showGrading" class="small-12 medium-6 large-3">
      <div class="sticky-note">
        <div>
          <strong>{{ question.marking.score }}</strong> /
          <strong>{{ question.points }}</strong>
          {{ 'point' | pluralise(question.points) }}
        </div>
        <div v-if="question.marking.notes !== ''">
          <em>{{ question.marking.notes }}</em>
        </div>
      </div>
    </aside>
    <aside v-else-if="marked" class="small-12 medium-6 large-3">
      <template v-if="showGrading">
        <span v-if="question.marking.correct" class="label label-correct">
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

      <div v-if="question.marking.notes != ''" class="sticky-note">
        <em>{{ question.marking.notes }}</em>
      </div>
    </aside>
  </li>
</template>

<script>
/*
 *
 * @parent: /student/player/result/index
 * @requests:
 * @events:
 * @props: Number assessmentId, Number index, String marked, Object question,  Boolean showGrading
 * @components:
 * @methods: automark, filterGroups, getBackgroundImage
 */

import * as automarkResults from '@/shared/results/automarkResults';

export default {
  name: 'AssessmentPlayerQuestion',
  props: {
    assessmentId: Number,
    index: Number,
    marked: String,
    question: Object,
    showGrading: Boolean,
  },
  data() {
    return {
      largeImage: false,
      output: null,
    };
  },
  created() {
    this.automark();
  },
  methods: {
    automark() {
      // Create a new array with the markings for each result
      let question = JSON.parse(JSON.stringify(this.question)),
        answers = question.answers,
        result = null;

      // Fallback to the assessment question if answer not stored with result
      if (!answers) {
        answers = this.answers;
      }

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
            false
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

      this.output = result;
    },
    filterGroups(groups) {
      // Remove empty unassigned group
      return groups.filter(group => {
        if (!(group.id === 'unassigned' && group.options.length === 0)) {
          return group;
        }
      });
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

.player-question {
  display: block;
}

@media #{$small-only} {
  .row.collapse {
    padding-bottom: $base-padding;

    > * {
      padding-bottom: 0;
    }
  }
}
</style>
