<template>
  <div>
    <header class="padded row collapse">
      <div class="small-12 medium-9">
        <h1>
          <span class="bounce">
            <router-link to="/student" title="Go back home" class="link-back">
              <svg role="img" height="24" width="24" viewBox="0 0 24 24">
                <title>Go back home</title>
                <path
                  fill="currentColor"
                  d="M24 12c0-6.629-5.371-12-12-12S0 5.371 0 12s5.371 12 12 12 12-5.371 12-12zM2.323 12A9.675 9.675 0 0112 2.323 9.675 9.675 0 0121.677 12 9.675 9.675 0 0112 21.677 9.675 9.675 0 012.323 12zm9.15 6.285l-5.875-5.874a.581.581 0 010-.822l5.875-5.874a.581.581 0 01.822 0l.949.948a.58.58 0 01-.01.832l-3.402 3.247h7.78c.32 0 .582.261.582.58v1.355c0 .32-.262.581-.581.581h-7.78l3.4 3.247a.58.58 0 01.01.832l-.948.948a.581.581 0 01-.822 0z"
                />
              </svg>
            </router-link>
          </span>
          {{ assessment.title || 'Untitled' }}
        </h1>
      </div>

      <div class="small-12 medium-3">
        <template v-if="result && result.marked">
          <div
            v-if="result.grading === 'grade' && result.grade"
            class="label label-marked"
            :style="getGradeColor"
          >
            {{ result.grade.grade }}
          </div>
          <div
            v-else-if="result.grading === 'points'"
            class="label label-marked"
            :style="getGradeColor"
          >
            {{ getPercentage }}%
          </div>
          <div v-else class="sticky-note">
            Completed
          </div>
        </template>
        <div v-else class="sticky-note">
          Completed
        </div>
      </div>
    </header>

    <section>
      <ol class="no-list" v-if="result && result.questions.length">
        <AssessmentPlayerQuestion
          v-for="(question, index) in result.questions"
          :assessmentId="assessment.id"
          :index="index"
          :marked="result.marked"
          :question="question"
          :showGrading="result.grading !== 'none'"
          :key="question.id"
        />
      </ol>
      <div v-else class="empty">No questions answered.</div>
    </section>

    <section v-if="result && result.marked && result.grading !== 'none'" class="row padded">
      <div class="small-12 medium-9"></div>
      <div class="small-12 medium-3">
        <div class="sticky-note">
          Total: <strong>{{ result.score }}</strong> / <strong>{{ result.total }}</strong> points
        </div>
      </div>
    </section>
    <section class="row end">
      End of activity
    </section>
  </div>
</template>

<script>
/* Outputs a static version of the assessment after it is completed
 *
 * - If 'result.marked' is null, don't show answers
 * - If 'result.marked' is set, show answers
 * @todo only send answers from the server if marked is set
 *
 * @parent: /
 * @requests:
 * @events:
 * @props: Object assessment, Object result
 * @components:
 * @methods:
 */

import AssessmentPlayerQuestion from './AssessmentPlayerQuestion';

export default {
  name: 'AssessmentPlayerResult',
  components: {
    AssessmentPlayerQuestion,
  },
  props: {
    assessment: Object,
    result: Object,
  },
  computed: {
    getGradeColor() {
      if (this.result.grading == 'points') {
        let percentage = this.getPercentage;
        let color = this.gradeScale[this.gradeScale.length - 1].color;
        let i = 1;
        const len = this.gradeScale.length;

        // Loop through all grades and get the closest color
        for (; i < len; i++) {
          if (percentage >= this.gradeScale[i].score) {
            color = this.gradeScale[i - 1].color;
            break;
          }
        }

        return 'background-color: ' + color;
      } else if (this.result.grading == 'grade' && this.result.grade) {
        return 'background-color: ' + this.result.grade.color;
      }

      return '';
    },
    getPercentage() {
      if (this.result.total === 0) {
        return 0;
      }

      // Get an assessment percentage based on the total question score / total assessment points
      return Math.round((this.result.score / this.result.total) * 100);
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
@import '~/sections/_player.scss';

header {
  align-items: center;
  background-color: $grey-0;
  border-bottom: 1px solid $grey-100;
  padding: 0;

  h1 {
    font-size: $font-size-800;
    margin: 0;
  }

  h2 {
    font-size: $font-size-600;
  }

  a.link-back {
    bottom: -2px;
    display: inline-block;
    margin-right: 0;
    position: relative;
  }
}

.padded {
  > * {
    padding: $base-padding * 2;
  }
}

h4 {
  color: $ts-green-500;
  flex: 0 0 auto;
  font-family: $typeface-base;
  font-size: $font-size-500;
  margin: $base-padding/4 0 0 0;
  width: $base-padding * 2;
}

small {
  font-size: $font-size-200;

  svg {
    bottom: -1px;
    position: relative;
  }
}

.container {
  > :last-child {
    padding-right: 0;
  }
}

.player-question {
  margin-bottom: $base-padding * 2;
  margin-top: $base-padding * 3;

  .flex {
    align-items: flex-start;
  }
}

.label-marked {
  margin: 0;
}

// Allow space for fixed summary at bottom
.end {
  color: $grey-300;
  display: block;
  padding: $base-padding * 6 $base-padding * 2;
  text-align: center;
  text-transform: uppercase;
}
</style>
