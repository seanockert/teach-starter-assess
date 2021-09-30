<template>
  <div>
    <div class="flex">
      <div>
        <h3>Orphaned results</h3>
        <p>All results with missing activities or students. Export or delete them</p>
      </div>
      <div class="pull-right">
        <vue-json-to-csv
          v-if="results && exportData"
          :json-data="exportData"
          :labels="exportDataLabels"
          :csv-title="exportDataFilename"
          data-tooltip="Export CSV"
          data-position="right above"
          class="inline-block"
        >
          <button class="button-basic button-small">
            <svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
              <title>Download CSV</title>
              <g fill="currentColor">
                <path
                  d="M20.75 24H3.25C2.557 24 2 23.45 2 22.768v-1.232c0-.683.557-1.232 1.25-1.232h17.5c.693 0 1.25.549 1.25 1.232v1.232C22 23.45 21.443 24 20.75 24z"
                  opacity=".6"
                />
                <path
                  d="M8.667 2.232v6.982H4.099c-.927 0-1.39 1.104-.734 1.751l7.927 7.814a1.02 1.02 0 001.422 0l7.927-7.814c.656-.647.192-1.75-.735-1.75h-4.573V2.231c0-.683-.557-1.232-1.25-1.232H9.917c-.693 0-1.25.55-1.25 1.232z"
                />
              </g>
            </svg>
          </button>
        </vue-json-to-csv>
      </div>
    </div>

    <div v-if="error" class="callout"><span v-html="error"></span></div>
    <div v-else-if="loadingResult" class="skeleton">
      <table class="table">
        <thead>
          <tr>
            <td><span></span></td>
            <td><span></span></td>
            <td><span></span></td>
            <td><span></span></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span></span></td>
            <td><span></span></td>
            <td><span></span></td>
            <td><span></span></td>
            <td><span></span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <table v-else-if="results.length > 0" class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Created</th>
          <th>Activity</th>
          <th>Student</th>
          <th>Questions</th>
          <th>Score</th>
          <th>Grade</th>
          <th>Notes</th>
          <th colspan="2"><span class="hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody v-for="result in results" :key="result.id">
        <monitor-orphaned-results-item :result="result" @select-result="selectResult" />
      </tbody>
      <tfoot v-show="selectedResults.length > 0">
        <tr>
          <td colspan="10">
            <button
              @click="deleteResults"
              class="button button-negative right"
              title="Delete results"
            >
              <svg role="img" class="icon" height="24" width="24" viewBox="0 0 24 24">
                <title>Delete</title>
                <path
                  fill="currentColor"
                  d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
                />
              </svg>
              {{ selectedResults.length }}
            </button>
          </td>
        </tr>
      </tfoot>
    </table>

    <div v-else class="empty">
      No results found.
    </div>
  </div>
</template>

<script>
/* A single student assessment result
 *
 * @parent: /monitor/index
 * @requests: loadOrphanedResults
 * @events:
 * @props:
 * @components: MonitorOrphanedResultsItem
 * @methods:
 */

import MonitorOrphanedResultsItem from './MonitorOrphanedResultsItem';
import '@/shared/utils/filters';

export default {
  name: 'MonitorOrphanedResults',
  components: {
    MonitorOrphanedResultsItem,
  },
  data() {
    return {
      activeTab: 1,
      error: null,
      localResults: [],
      exportDataLabels: {
        id: { title: 'Result ID' },
        created: { title: 'Date created' },
        assessment: { title: 'Activity' },
        student: { title: 'Student' },
        questions: { title: 'Questions' },
        score: { title: 'Score' },
        percentage: { title: 'Percentage' },
        grade: { title: 'Grade' },
        notes: { title: 'Notes' },
        link: { title: 'Link' },
      },
      selectedResults: [],
      showAll: false,
    };
  },
  async created() {
    try {
      await this.$store.dispatch('loadOrphanedResults');
    } catch (error) {
      this.error = this.serverError + '<br><br>' + error;
    }
  },
  methods: {
    async deleteResults() {
      // Bulk delete results
      if (this.selectedResults.length > 0) {
        if (confirm('Delete ' + this.selectedResults.length + ' results?')) {
          try {
            const count = await this.$store.dispatch('deleteResults', this.selectedResults);
            this.selectedResults = [];
          } catch (error) {
            //
          }
        }
      }
    },
    selectResult(resultId, selected) {
      // Bulk select results
      if (selected) {
        // add
        this.selectedResults.push(resultId);
      } else {
        // remove
        let index = this.selectedResults.indexOf(resultId);

        if (index > -1) {
          this.selectedResults.splice(index, 1);
        }
      }
    },
  },
  computed: {
    exportData() {
      if (!this.results) return null;

      // Export as CSV results (convert to CSV from JSON)
      let i = 0;
      let exportData = [];
      const len = this.results.length;
      const format = 'DD/MM/YYYY h:mma'; // custom date format

      // Each student
      for (; i < len; i++) {
        let result = this.results[i];

        exportData.push({
          id: result.id,
          created: this.$options.filters.simpleDate(result.created, format),
          assessment: result.assessment.title
            ? result.assessment.title.replace(/=/g, "'=") + ' (' + result.assessment.slug + ')'
            : '',
          student: result.student.name ? result.student.name : '',
          questions: result.questions.length,
          score: result.score + '/' + result.total,
          percentage: Math.round((result.score / result.total) * 100) + '%',
          grade: result.grade
            ? result.grade.grade.toUpperCase() + ' (' + result.grade.label + ')'
            : '',
          notes: result.notes ? result.notes.replace(/=/g, "'=") : '',
          link: 'https://app.teachstarter.com/assess/result/' + result.slug,
        });
      }

      return exportData;
    },
    exportDataFilename() {
      // Export as CSV filename
      return (
        'assess_orphaned_results_' + this.$options.filters.simpleDate(new Date(), 'YYYY-MM-DD')
      );
    },
    results() {
      return !this.$store.state.loadingResult ? this.$store.getters.fetchResults : null;
    },
    loadingResult() {
      return this.$store.state.loadingResult;
    },
  },
};
</script>
