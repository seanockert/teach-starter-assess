<template>
  <tr class="clickable-row" @click="linkTo">
    <td data-title="ID">{{ result.id }}</td>
    <td data-title="Created">
      <time :datetime="result.created | simpleDate">{{
        result.created | simpleDate('MMM D, YYYY [at] h:mma')
      }}</time>
    </td>
    <td data-title="Activity">
      <router-link
        v-if="result.assessment.id !== null"
        :to="baseUrl + 'results/' + result.assessment.slug"
        title="View activity results"
        >{{ result.assessment.title || 'Untitled' }}</router-link
      >
      <em v-else>Missing</em>
    </td>
    <td data-title="Student">
      <router-link
        v-if="result.student.id !== null"
        :to="baseUrl + 'monitor/view/' + result.student.id"
        title="View activity results"
        >{{ result.student.name || 'Untitled' }}</router-link
      >
      <em v-else>Missing</em>
    </td>
    <td data-title="Questions">{{ result.count }}</td>
    <td data-title="Score">
      <span class="percentage">{{ getPercentage(result) }}%</span>
      <span>{{ result.score }} / {{ result.total }}</span>
    </td>
    <td data-title="Grade">
      <span v-if="result.grade" :data-tooltip="result.grade.label">
        <span class="label label-grade" :style="{ backgroundColor: result.grade.color }">
          {{ result.grade.grade }}
        </span>
      </span>
    </td>
    <td data-title="Notes">{{ result.notes }}</td>
    <td class="actions">
      <router-link :to="baseUrl + 'result/' + result.slug" class="button-basic button-small">
        <svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
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
          @click.stop="selectResult($event.target.checked)"
        />
        <label :for="'select' + result.id"></label>
      </div>
    </td>
  </tr>
</template>

<script>
/* A single student assessment result
 *
 * @parent: /monitor/MonitorOrphanedResults
 * @requests:
 * @events: view result (link), view assessment (link)
 * @props: Object result
 * @components:
 * @methods: getPercentage, linkTo, selectResult
 */

import '@/shared/utils/filters';

export default {
  name: 'MonitorOrphanedResultsItem',
  props: {
    result: Object,
  },
  methods: {
    getPercentage(result) {
      return Math.round((result.score / result.total) * 100);
    },
    linkTo(slug) {
      this.$router.push(this.baseUrl + 'result/' + this.result.slug);
    },
    selectResult(selected) {
      this.$emit('select-result', this.result.id, selected);
    },
  },
};
</script>
