<template>
  <section :class="{ summary: true, row: true, collapse: true, scrolled: scrolled }">
    <header class="small-12 medium-6 large-8">
      <template v-if="result">
        <div class="flex">
          <router-link
            v-if="backTo.includes('monitor')"
            :to="backTo"
            title="Go back to student results"
            class="link-back"
          >
            <svg role="img" height="24" width="24" viewBox="0 0 24 24">
              <title>Go back</title>
              <path
                fill="currentColor"
                d="M24 12c0-6.629-5.371-12-12-12S0 5.371 0 12s5.371 12 12 12 12-5.371 12-12zM2.323 12A9.675 9.675 0 0112 2.323 9.675 9.675 0 0121.677 12 9.675 9.675 0 0112 21.677 9.675 9.675 0 012.323 12zm9.15 6.285l-5.875-5.874a.581.581 0 010-.822l5.875-5.874a.581.581 0 01.822 0l.949.948a.58.58 0 01-.01.832l-3.402 3.247h7.78c.32 0 .582.261.582.58v1.355c0 .32-.262.581-.581.581h-7.78l3.4 3.247a.58.58 0 01.01.832l-.948.948a.581.581 0 01-.822 0z"
              />
            </svg>
          </router-link>
          <h2 v-if="student">
            {{ student.name || 'Unknown student' }}
          </h2>
          <h2 v-else>
            ...
          </h2>

          <nav class="pull-right">
            <ul v-if="!backTo.includes('monitor')" class="no-list inline-list">
              <li>
                <router-link
                  v-if="prev"
                  :to="baseUrl + 'result/' + prev.slug"
                  title="Grade the previous result"
                  class="button button-outlined"
                  ><svg aria-hidden="true" class="icon" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"
                    /></svg
                  >&nbsp; {{ prev.name }}</router-link
                >
              </li>
              <li>
                <router-link
                  v-if="next"
                  :to="baseUrl + 'result/' + next.slug"
                  title="Grade the next result"
                  class="button button-outlined"
                  >{{ next.name }} &nbsp;<svg
                    aria-hidden="true"
                    class="icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
                    /></svg
                ></router-link>
              </li>
            </ul>
          </nav>

          <div class="marking-score-scrolled pull-right">
            <strong>{{ getTotalScore }}</strong> /
            {{ result.total }}
          </div>
        </div>

        <p>
          <span :data-tooltip="getAssessmentTime">
            <time v-if="result.finished" :datetime="result.created | simpleDate">{{
              result.finished | simpleDate('dddd, MMM DD [at] h:mma')
            }}</time>
            <time v-else :datetime="result.created | simpleDate">{{
              result.created | simpleDate('D MMM YYYY [at] h:mma')
            }}</time>

            <span v-if="result.finished"
              >&nbsp;&middot;&nbsp;<time>{{
                result.finished | duration(result.created)
              }}</time></span
            >
          </span>

          <span v-if="result.marked" class="label label-secondary">&#x2713; Marked</span
          ><span v-else class="label label-notice">Not marked</span>
        </p>

        <div class="notes">
          <label class="hidden" for="notes">Notes</label>
          <textarea-autosize
            type="text"
            v-model="result.notes"
            id="notes"
            rows="1"
            placeholder="Add notes (private for you)..."
            @blur.native="updateNotes"
          ></textarea-autosize>
        </div>
      </template>

      <div v-else class="skeleton">
        <h2></h2>
        <p></p>
      </div>
    </header>

    <aside class="marking small-12 medium-6 large-4">
      <template v-if="result">
        <div class="flex">
          <h3>Overall Grade</h3>

          <div class="pull-right"></div>
        </div>

        <div class="flex">
          <div class="marking-score">
            <div>
              <strong>{{ getTotalScore }}</strong> /
              {{ result.total }}
            </div>
            <small> {{ getCorrectQuestionCount }} of {{ result.count }} correct </small>
          </div>

          <div class="marking-percentage">{{ getPercentage }}%</div>

          <div class="grades" v-if="result.finished && grades">
            <div v-for="grade in grades" :key="grade.grade" :data-tooltip="grade.label">
              <button
                @click="updateGrade(grade)"
                :style="{ backgroundColor: grade.color }"
                :class="{ active: result.grade && result.grade.grade == grade.grade }"
              >
                {{ grade.grade }}
              </button>
            </div>
          </div>
        </div>

        <div class="marking-actions">
          <template v-if="!result.finished">
            Student has not submitted their results yet.
            <button class="button-link" @click="markComplete()">Mark as complete?</button>
          </template>
          <template v-else>
            <template v-if="!result.marked">
              <button @click="updateResult(true, false)" class="button button-primary">
                Submit grade
              </button>

              <button @click="updateResult(false, true)" class="button button-outlined">
                Save &amp; close
              </button>
            </template>
            <template v-else>
              <button @click="updateResult(true, false)" class="button button-primary">
                Update
              </button>

              <button @click="updateResult(true, true)" class="button button-outlined">
                Save &amp; close
              </button>
            </template>

            <label>
              <select @change="updateGrading($event.target.value)">
                <option
                  v-for="grading in gradingTypes"
                  :key="grading"
                  :value="grading"
                  :selected="grading.toLowerCase() == result.grading"
                  >{{ grading }} shown
                </option></select
              >
            </label>
          </template>
        </div>
      </template>

      <div v-else class="skeleton">
        <h2></h2>
        <p></p>
        <p></p>
      </div>
    </aside>
  </section>
</template>

<script>
/*
 * Summary and marking actions for a result
 *
 * @parent: /result/AssessmentResultsView
 * @requests:
 * @events: updateResult
 * @props: String backTo, Array grades, String next, String prev, Object result, Object student
 * @components:
 * @methods: updateGrade, updateResults
 */

import analytics from '@/shared/utils/analytics';
import '@/shared/utils/filters';

export default {
  name: 'AssessmentResultsSummary',
  props: {
    backTo: String,
    grades: Array,
    isMarked: Boolean,
    isOrphaned: Boolean,
    next: Object,
    prev: Object,
    result: Object,
    scrolled: Boolean,
    student: Object,
  },
  data() {
    return {
      gradingTypes: ['Points', 'Grade', 'None'],
    };
  },
  methods: {
    markComplete() {
      if (
        confirm(
          'Student has not submitted their results yet. Are you sure you want to mark this as complete?'
        )
      ) {
        this.result.finished = this.$options.filters.newDate();

        let params = {
          data: this.result,
          isMarked: this.isMarked,
          source: 'submit',
        };

        this.$store.dispatch('updateResult', params);
        this.$emit('trigger-toast', 'Activity complete');
      }
    },
    updateGrade(grade) {
      this.result.grade = grade === this.result.grade ? null : grade;
    },
    updateResult(isMarked, close) {
      // Commit the results and send them to the student
      this.result.score = this.getTotalScore;

      // Set the marked field to finalise the assessment and give the student feedback
      if (isMarked) {
        this.result.marked = this.$options.filters.newDate();
      }

      let params = {
        data: this.result,
        isMarked: this.isMarked,
        source: 'marking',
      };

      this.$store.dispatch('updateResult', params);

      if (this.result.marked && !this.isMarked) {
        this.$emit('trigger-toast', 'Result marked. Student can now see their result.');
      } else {
        this.$emit('trigger-toast', 'Result updated');
      }

      if (close) {
        this.$router.push(this.backTo);
      }
    },
    updateComment() {
      analytics('Assess Teacher Note Added', {
        assessmentId: this.result.assessment,
        grading: this.result.grading,
      });
    },
    updateGrading(type) {
      let message =
        type == 'None'
          ? 'This student will not see any results.'
          : 'This student will see ' + type + ' results.';
      if (confirm(message)) {
        this.result.grading = type.toLowerCase();
      }
    },
    updateNotes() {
      analytics('Assess Teacher Note Added', {
        assessmentId: this.result.assessment,
        grading: this.result.grading,
      });
    },
  },
  computed: {
    getAssessmentTime() {
      let str = this.$options.filters.simpleDate(this.result.created, 'h:mma, D MMM YYYY');
      if (this.result.finished) {
        str += ' - ' + this.$options.filters.simpleDate(this.result.finished, 'h:mma, D MMM YYYY');
      }
      return str;
    },
    getCorrectQuestionCount() {
      // Number of questions answered correctly
      const correct = this.result.questions.filter(
        question => question.marking && question.marking.correct === true
      );
      return correct.length;
    },
    getPercentage() {
      // Get an assessment percentage based on the total question score / total assessment points
      let percentage = 0;
      if (this.result.total > 0) {
        percentage = Math.round((this.getTotalScore / this.result.total) * 100);
      }

      return percentage;
    },
    getTotalScore() {
      if (!this.result.questions) return 0;

      // Sum up all question scores
      let total = 0,
        len = this.result.questions.length,
        i = 0;

      for (; i < len; i++) {
        if (this.result.questions[i].marking) {
          let score = this.result.questions[i].marking.score;

          if (score != '') {
            total += Math.round(parseInt(score));
          }
        }
      }
      return total;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  background-color: $grey-0;
  border-bottom: 2px solid $grey-100;
  margin-bottom: $base-padding * 2;
  z-index: 3;

  > * {
    padding: $base-padding * 2;
  }

  h2 {
    margin-right: $base-padding;
  }

  p {
    font-size: $font-size-300;
    margin: $base-padding 0;
  }

  li {
    padding-bottom: 0;
  }
}

.summary {
  position: sticky;
  top: 0;
}

.label {
  margin-left: $base-padding;
  top: 4px;
}

.notes {
  align-items: flex-start;
  display: flex;

  textarea {
    border: 1px solid $grey-200;
    display: block;

    &:hover,
    &:focus {
      background-color: #fff;
    }
  }
}

.marking {
  .flex {
    margin-bottom: $base-padding;
  }

  h3 {
    margin: 0;
  }

  strong {
    color: $ts-green-500;
    font-weight: normal;
  }

  select {
    background-color: transparent;
    border: none;
    font-size: $font-size-300;
    padding: $base-padding $base-padding * 1.4 $base-padding $base-padding/2;
    width: auto;

    &:hover,
    &:focus {
      color: $color-link;
    }
  }
}

.marking-score,
.marking-percentage {
  font-size: $font-size-600;
  padding-right: $base-padding;
}

.marking-score {
  border-right: 1px solid $grey-200;
  margin-right: $base-padding;
}

.marking-actions {
  margin-top: $base-padding;
}

// Assign a colour to the student result to indicate progress
.grades {
  align-items: center;
  display: flex;
  margin-left: $base-padding/2;

  > :first-child {
    button {
      border-radius: $border-radius 0 0 $border-radius;
    }
  }

  > :last-child {
    button {
      border-radius: 0 $border-radius $border-radius 0;
    }
  }

  button {
    font-weight: bold;
    font-size: $font-size-300;
    line-height: 1;
    opacity: 0.8;
    padding: $base-padding/2 $base-padding;
    position: relative;
    text-transform: uppercase;

    &.cancel {
      color: $color-text;
      margin: 0;
      padding-top: 0;
      text-indent: 0;
    }

    &:hover,
    &:focus {
      transform: scale(1.1);
    }

    &:hover,
    &:focus,
    &.active {
      opacity: 1;
      outline: none;
      z-index: 2;
    }

    &.active {
      border-radius: $border-radius;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
      transform: scale(1.3);
      z-index: 3;
    }
  }
}

.marking-score-scrolled {
  display: none;

  strong {
    color: $ts-green-500;
    font-weight: normal;
  }
}

@media #{$small-only} {
  .scrolled {
    header p,
    header #notes,
    .marking {
      display: none;
    }

    header {
      padding: $base-padding $base-padding * 2;
    }

    .marking-score-scrolled {
      display: block;
    }
  }
}

@media #{$medium-up} {
}
</style>
