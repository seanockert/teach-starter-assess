<template>
  <div class="assessment-item">
    <header>
      <h2>{{ assessment.title || 'Untitled' }}</h2>
      <span :data-tooltip="assessment.modified | simpleDate('MMM D, YYYY [at] h:mma')">
        <span class="label">
          Archived
          <time :datetime="assessment.modified | simpleDate">{{
            assessment.modified | relativeTime
          }}</time>
        </span>
      </span>
    </header>
    <footer>
      {{ assessment.questions.length }}
      {{ 'question' | pluralise(assessment.questions.length) }}

      <div class="pull-right">
        <dropdown-menu position="drop-left top">
          <template v-slot:label>
            <svg class="icon" role="img" width="24" height="24" viewBox="0 0 24 24">
              <title>Options</title>
              <path
                d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
              />
            </svg>
          </template>
          <ul class="link-list">
            <li>
              <button @click.prevent="deleteAssessment" class="button-negative">
                Delete
              </button>
            </li>
            <li>
              <button @click.prevent="unarchiveAssessment">
                Unarchive
              </button>
            </li>
          </ul>
        </dropdown-menu>
      </div>
    </footer>
  </div>
</template>

<script>
/*
 * Single assessment item (archived state)
 *
 * @parent: /assessment/AssessmentsArchived
 * @requests:
 * @events: deleteAssessment, deleteAllImages, imageForDeletion, updateAssessmentState
 * @props: Object assessment
 * @components: DropdownMenu, filters
 * @methods: unarchiveAssessment, deleteAssessment, deleteQuestionImages
 */

import DropdownMenu from '@/modules/common/DropdownMenu';
import '@/shared/utils/filters';

export default {
  name: 'AssessmentItem',
  props: {
    assessment: Object,
  },
  components: {
    DropdownMenu,
  },
  methods: {
    async unarchiveAssessment() {
      const params = {
        id: this.assessment.id,
        state: 'draft',
        previousState: this.assessment.state,
      };

      try {
        await this.$store.dispatch('updateAssessmentState', params);
        const title = this.assessment.title !== '' ? this.assessment.title : 'Untitled activity';
        // Being removed from list, so send a message to parent
        this.$emit('trigger-toast', 'Removed "' + title + '" from archive');
      } catch (error) {
        if (error.name == 'Limit') {
          this.$emit('trigger-upgrade-notice', true, error.message, '');
        } else {
          this.$emit('trigger-toast', error.message);
        }
      }
    },
    deleteAssessment() {
      // Only delete if already archived
      if (this.assessment.state !== 'archived') return;

      // Trigger the modal
      this.$emit('delete-assessment', true, this.assessment.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.assessment-item {
  min-height: 8rem;
}
</style>
