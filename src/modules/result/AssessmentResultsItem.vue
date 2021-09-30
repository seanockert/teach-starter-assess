<template>
  <tbody :class="{ active: isActive }">
    <tr
      v-for="(result, index) in results"
      :key="result.id"
      class="clickable-row"
      @click.meta.exact="selectResult(result.id, !result.isSelected)"
      @click.exact="linkTo(result.slug)"
    >
      <td
        v-if="index === 0"
        data-title="Name"
        :rowspan="results.length"
        :class="{ multiple: results.length > 1 }"
      >
        <template v-if="student">
          <router-link
            :to="baseUrl + 'monitor/view/' + student.id"
            title="View all results for this student"
            @click.native.stop=""
            >{{ student.name || 'Unknown student' }}
          </router-link>
        </template>
        <template v-else>
          Unknown student
        </template>
      </td>
      <td data-title="Activity Date">
        <time
          :data-tooltip="result.assigned | simpleDate('MMM D, YYYY [at] h:mma')"
          :datetime="result.assigned | simpleDate"
          >{{ result.assigned | simpleDate('MMM DD') }}</time
        >
      </td>
      <td data-title="Completed">
        <time
          v-if="result.finished"
          :data-tooltip="result.finished | simpleDate('MMM D, YYYY [at] h:mma')"
          :datetime="result.finished | simpleDate"
          >{{ result.finished | relativeTime }}</time
        >
        <span v-else class="text-mute">Incomplete</span>
      </td>
      <td data-title="Time Taken">
        <time v-if="result.finished">{{ result.finished | duration(result.created) }}</time>
      </td>
      <td data-title="Score">
        <template v-if="result.score || result.grade">
          <span class="percentage">{{ getPercentage(result) }}%</span>
          {{ result.score }} / {{ result.total }}
        </template>

        <router-link
          v-else
          :to="baseUrl + 'result/' + result.slug"
          title="Open this result to mark it"
          >Grade</router-link
        >
      </td>
      <td data-title="Grade">
        <span v-if="result.grade" :data-tooltip="result.grade.label">
          <span class="label label-grade" :style="{ backgroundColor: result.grade.color }">
            {{ result.grade.grade }}
          </span>
        </span>
      </td>
      <td data-title="Notes">
        <label class="hidden" :for="'notes-' + result.id">Notes</label>
        <input
          @click.stop=""
          @blur="updateNotes(result.id, $event.target.value, result.grading)"
          @keyup.enter="updateNotes(result.id, $event.target.value, result.grading)"
          :id="'notes-' + result.id"
          :value="result.notes"
          placeholder="Add notes..."
          :title="result.notes"
        />
      </td>
      <td data-title="Submitted">
        <span v-if="result.marked" class="submitted">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-13.388 6.354l8.903-8.903a.774.774 0 000-1.095L18.42 7.26a.774.774 0 00-1.095 0l-7.26 7.26-3.39-3.39a.774.774 0 00-1.095 0l-1.095 1.096a.774.774 0 000 1.095l5.032 5.032a.774.774 0 001.095 0z"
            />
          </svg>
        </span>
      </td>
      <td class="actions">
        <router-link :to="baseUrl + 'result/' + result.slug" class="button-basic button-small">
          <svg class="icon" role="img" height="24" width="24" viewBox="0 0 24 24">
            <title>Edit</title>
            <path
              fill="currentColor"
              d="M22.124 4.164L19.809 1.85a2.899 2.899 0 00-4.101 0L2.07 15.398l-1.056 6.403c-.115.696.489 1.3 1.186 1.185l6.402-1.056L22.15 8.292c1.131-1.131 1.142-2.96-.027-4.128zm-15.94 9.813L13.5 6.708l3.792 3.792-7.269 7.316v-1.777H7.961v-2.062H6.184zm-1.655 6.708l-1.214-1.214.521-3.162.79-.786h1.788v2.063h2.063v1.787l-.786.79-3.162.522zm16.285-13.73l-.003.003-.002.002-2.064 2.077-3.782-3.782L17.04 3.19l.002-.002.002-.003a1.008 1.008 0 011.429 0L20.787 5.5c.424.425.427 1.055.027 1.455z"
            /></svg
        ></router-link>
      </td>
      <td @click.stop="" class="select-row">
        <div class="form-choice small">
          <input
            :id="'select' + result.id"
            type="checkbox"
            class="checkbox"
            :checked="result.isSelected"
            @click.stop="selectResult(result.id, $event.target.checked)"
          />
          <label :for="'select' + result.id"></label>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
/*
 * A single result table item
 *
 * @parent: /result/index
 * @requests:
 * @events: updated-result, select-result
 * @props: String assessmentSlug, Boolean isActive, Array results, Object student
 * @components:
 * @methods: deletedResult, getPercentage, linkTo, selectResult, updateNotes
 */

import analytics from '@/shared/utils/analytics';
import '@/shared/utils/filters';

export default {
  name: 'AssessmentResultsItem',
  props: {
    assessmentSlug: String,
    isActive: Boolean,
    results: Array,
    student: Object,
  },
  methods: {
    getPercentage(result) {
      return Math.round((result.score / result.total) * 100);
    },
    linkTo(slug) {
      this.$router.push(this.baseUrl + 'result/' + slug);
    },
    selectResult(resultId, selected) {
      this.$emit('select-result', resultId, selected);
    },
    updateNotes(resultId, notes, grading) {
      notes = notes == '' ? null : notes;

      let result = this.results.find(result => result.id === resultId);

      // Don't update if unchanged
      if (notes === result.notes) return;

      let params = {
        data: {
          id: resultId,
          notes: notes,
        },
        source: 'marking',
      };

      this.$store.dispatch('updateResult', params).then(response => {
        if (response !== 'error') {
          analytics('Assess Teacher Note Added', {
            assessmentId: result.assessment,
            grading: grading,
          });

          this.$emit('updated-result');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  background-color: transparent;
  max-width: 220px;
  min-width: 100px;
  margin: -$base-padding 0;

  &:hover {
    &::placeholder {
      color: $cobalt-blue-500;
    }
  }

  &:focus {
    background-color: #fff;

    &::placeholder {
      color: $grey-500;
    }
  }
}

[data-title='Submitted'] {
  width: 1rem;
  text-align: center;
}

[data-title='Score'] {
  white-space: nowrap;
}

.grade {
  border-radius: $border-radius;
  flex: 0 0 1.5rem;
  font-weight: bold;
  line-height: 1;
  padding: $base-padding/2 0;
  text-align: center;
  text-transform: uppercase;
}

.submitted {
  color: $ts-green-500;
  display: inline-block;
  line-height: 1;

  svg {
    height: 1rem;
  }
}

@media #{$small-only} {
  .table {
    tbody {
      display: none;

      &.active {
        display: block;
      }
    }
  }
}
</style>
