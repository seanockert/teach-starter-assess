<template>
  <li class="bounce">
    <time
      v-if="firstItem || (prevAssignedDate && !isSameDay(assessment.assigned, prevAssignedDate))"
      :datetime="assessment.assigned"
      class="divider"
    >
      {{ assessment.assigned | simpleDate('dddd, MMM D') }}
    </time>
    <router-link :to="'/student/view/' + assessment.slug" class="assessment-item shadow" title="">
      <header class="flex">
        <div>
          <div
            v-if="result.finished"
            :data-tooltip="result.finished | simpleDate('MMM D, YYYY [at] h:mma')"
          >
            Completed
            <time :datetime="result.finished | simpleDate">{{
              result.finished | relativeTime
            }}</time>
          </div>
          <div
            v-else-if="assessment.expires && assessment.state !== 'ended'"
            :data-tooltip="assessment.expires | simpleDate('MMM D, YYYY [at] h:mma')"
            :style="getExpiryColor"
          >
            Due
            <time :datetime="assessment.expires | simpleDate">{{
              assessment.expires | relativeTime
            }}</time>
          </div>

          <h2>{{ assessment.title || 'Untitled' }}</h2>
        </div>
        <div
          v-if="state === 'marked' && result.grading !== 'none'"
          class="pull-right"
          :data-tooltip="result.marked | simpleDate('MMM D, YYYY [at] h:mma')"
        >
          <span class="label label-marked" :style="getGradeColor">
            <template v-if="result.grading === 'grade' && result.grade">
              {{ result.grade.grade }}
            </template>
            <template v-else>{{ getPercentage }}%</template>
          </span>
        </div>
      </header>

      <footer>
        <div>
          {{ assessment.questions.length }}
          {{ 'question' | pluralise(assessment.questions.length) }}
        </div>

        <span
          v-if="state === 'finished' || result.grading === 'none'"
          class="label label-outlined label-primary"
        >
          Completed
        </span>
        <template v-if="state !== 'marked'">
          <span
            v-if="state === 'ended' && state !== 'finished'"
            class="label label-outlined label-warning"
          >
            Ended
          </span>
          <span v-else-if="state === 'started'" class="button button-secondary">
            Continue
          </span>
          <span v-else-if="state === 'assigned'" class="button button-primary">
            Start
          </span>
        </template>
      </footer>
    </router-link>
  </li>
</template>

<script>
/*
 *
 * @parent: /
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods:
 */

import '@/shared/utils/filters';
import dayjs from 'dayjs';

export default {
  name: 'AssessmentItem',
  props: {
    assessment: Object,
    firstItem: Boolean,
    prevAssignedDate: String,
    studentId: Number,
  },
  created() {
    this.getState();
  },
  data() {
    return {
      result: this.assessment.result,
      state: 'assigned',
    };
  },
  methods: {
    isSameDay(date, compare) {
      if (!date) return false;
      return dayjs(date).diff(dayjs(compare), 'day') == 0;
    },
    getState() {
      // Get the 'state' of the assessment, not the global state or a country state.
      // 'status' would be better but it's a reserved field
      if (this.assessment.state === 'ended') {
        this.state = 'ended';
        return;
      }

      if (this.result) {
        if (this.result.marked) {
          this.state = 'marked';
        } else if (this.result.finished) {
          this.state = 'finished';
        } else if (this.result.created) {
          this.state = 'started';
        }
      }
    },
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
      // Get an assessment percentage based on the total question score / total assessment points
      let percentage = 0;
      if (this.result.total > 0) {
        percentage = Math.round((this.result.score / this.result.total) * 100);
      }

      return percentage;
    },
    getExpiryColor() {
      // Change the colour of the label when getting close to due date
      let color = '';

      if (
        dayjs(this.assessment.expires)
          .add(1, 'day')
          .isBefore(dayjs())
      ) {
        return;
      }

      // Due in 3 days
      if (
        dayjs(this.assessment.expires)
          .subtract(3, 'day')
          .isBefore(dayjs())
      ) {
        color = '#efac1f';
      }

      // Due in 1 days
      if (
        dayjs(this.assessment.expires)
          .subtract(1, 'day')
          .isBefore(dayjs())
      ) {
        color = '#ef3e4c';
      }

      return 'color:' + color;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_student.scss';

.divider {
  color: $color-text-lightest;
  display: block;
  padding-bottom: $base-padding;
  text-align: center;
}

.assessment-item {
  border: 1px solid $grey-200;
  border-radius: $border-radius * 3;
  min-height: 0;
}

header {
  padding: 0 0 $base-padding 0;

  div {
    color: $color-text-lightest;
  }
}

h2 {
  color: black;
  font-size: $font-size-800;
}

footer {
  display: flex;

  .button,
  .label {
    margin-left: auto;
  }

  .button {
    padding: $base-padding $base-padding * 2;
  }
}

.label-outlined {
  background-color: transparent;
  border: 1px solid $grey-500;
  font-size: $font-size-400;
  padding: $base-padding/2;

  &.label-primary {
    border-color: $ts-green-500;
    color: $ts-green-500;
  }

  &.label-secondary {
    border-color: $cobalt-blue-500;
    color: $cobalt-blue-500;
  }

  &.label-notice {
    border-color: $vivid-amber-500;
    color: $vivid-amber-500;
  }

  &.label-warning {
    border-color: $brilliant-amaranth-500;
    color: $brilliant-amaranth-500;
  }

  svg {
    bottom: -1px;
    position: relative;
  }
}

.label.label-marked {
  margin: 0;
}
</style>
