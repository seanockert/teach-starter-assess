<template>
  <tr class="clickable-row" @click="linkTo">
    <td>
      <h3>{{ assessment.title || 'Untitled' }}</h3>

      <small v-if="assessment.description !== ''" class="text-mute hidden-small">
        {{ assessment.description.substring(0, 30) }}...
      </small>
    </td>
    <td>
      <span
        v-if="assessment.is_assigned"
        :data-tooltip="
          assessment.state === 'ended' ? assessment.expires : assessment.assigned | simpleDate
        "
      >
        <span v-if="assessment.state === 'assigned'" class="label label-primary"
          ><b></b>Assigned
        </span>
        <span v-else-if="assessment.state === 'ended'" class="label label-notice"
          ><b></b>Ended</span
        >
        <span v-else-if="assessment.state === 'draft'" class="label label-notice"
          ><b></b>Pending</span
        >
      </span>
      <span v-else-if="assessment.state === 'draft'">
        <span class="label">
          Draft
        </span>
      </span>
    </td>
    <td>
      <template v-if="assessment.is_assigned"
        >{{ assessment.resultsCount }} of {{ assessment.assignedCount }}</template
      >
    </td>
    <td>
      <time
        v-if="assessment.assigned"
        :datetime="assessment.assigned | simpleDate"
        :data-tooltip="assessment.assigned | simpleDate('MMM D, YYYY [at] h:mma')"
        >{{ assessment.assigned | relativeTime }}</time
      >
    </td>
    <td>
      <time
        v-if="assessment.expires"
        :datetime="assessment.expires | simpleDate"
        :data-tooltip="assessment.expires | simpleDate('MMM D, YYYY [at] h:mma')"
        >{{ assessment.expires | relativeTime }}</time
      >
    </td>
    <td>
      <time
        :datetime="assessment.created | simpleDate"
        :data-tooltip="assessment.created | simpleDate('MMM D, YYYY [at] h:mma')"
        >{{ assessment.created | relativeTime }}</time
      >
    </td>
    <td>
      <dropdown-menu
        :position="isLast ? 'drop-left top' : 'drop-left'"
        type="button-basic button-small"
      >
        <template v-slot:label>
          <svg class="icon" role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Options</title>
            <path
              d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
            />
          </svg>
        </template>
        <ul class="link-list">
          <template v-if="assessment.questions.length > 0 && assessment.template === 'none'">
            <li v-if="!assessment.is_assigned">
              <router-link :to="baseUrl + 'assign/' + assessment.slug">Assign</router-link>
            </li>
            <li v-if="assessment.resultsCount">
              <router-link :to="baseUrl + 'results/' + assessment.slug" title="View results"
                >Results</router-link
              >
            </li>
          </template>

          <template v-if="assessment.template == 'none'">
            <li>
              <button @click.prevent="duplicateAssessment">
                Duplicate
              </button>
            </li>
            <li>
              <button @click.prevent="shareAssessment">
                Share
              </button>
            </li>
          </template>
          <li>
            <router-link :to="baseUrl + 'print/' + assessment.slug" title="Print activity"
              >Print</router-link
            >
          </li>
          <li class="line-above">
            <button @click.prevent="archiveAssessment" class="button-negative">
              Archive
            </button>
          </li>
        </ul>
      </dropdown-menu>
    </td>
  </tr></template
>

<script>
/*
 * Single assessment table row
 *
 * @parent: /assessment/index
 * @requests:
 * @events: duplicateAssessment, updateAssessmentState
 * @props: Object assessment, Boolean isLast
 * @components: Dropdown
 * @methods: archiveAssessment, duplicateAssessment, linkTo, shareAssessment, updateState
 */

import DropdownMenu from '@/modules/common/DropdownMenu';
import '@/shared/utils/filters';

export default {
  name: 'AssessmentItemRow',
  props: {
    assessment: Object,
    isLast: Boolean,
  },
  components: {
    DropdownMenu,
  },
  methods: {
    archiveAssessment() {
      let confirmMsg = 'Archive this activity?';
      if (this.assessment.is_assigned == 1) {
        confirmMsg += ' It will be un-assigned from all students.';
      }

      if (confirm(confirmMsg)) {
        const params = {
          id: this.assessment.id,
          state: 'archived',
          template: 'none',
          previousState: this.assessment.state,
        };

        try {
          this.$store.dispatch('updateAssessmentState', params);

          // Trigger after archiving
          this.$emit('trigger-toast', 'Archived "' + this.assessment.title + '"', 2000, true);
          this.$emit('update-assessments-count', 'remove');
        } catch (error) {
          if (error.name == 'Limit') {
            this.$emit('trigger-upgrade-notice', true, error.message, '');
          } else {
            this.$emit('trigger-toast', error.message);
          }
        }
      }
    },
    async duplicateAssessment() {
      // Copy this assessment
      let newAssessment = JSON.parse(JSON.stringify(this.assessment));

      // Reset the ID and key fields
      newAssessment.id = null;
      newAssessment.slug = this.$nanoid(this.idLength);
      newAssessment.created = this.$options.filters.newDate();
      newAssessment.assigned = null;
      newAssessment.expires = null;
      newAssessment.is_assigned = 0;
      newAssessment.state = 'draft';

      // Send questions with empty IDs so they get duplicated
      newAssessment.questions = newAssessment.questions.map(question => {
        question.id = null;
        return question;
      });

      try {
        await this.$store.dispatch('duplicateAssessment', newAssessment);
        const title = this.assessment.title ? this.assessment.title : 'Untitled';
        this.$emit('trigger-toast', 'Created a copy of "' + title + '"');
        this.$emit('update-assessments-count', 'add');
      } catch (error) {
        if (error.name == 'Limit') {
          this.$emit('trigger-upgrade-notice', true, error.message);
        } else {
          this.$emit('trigger-toast', error.message);
        }
      }
    },
    linkTo(e) {
      // Don't trigger link if clicking a button
      if (e.target.type == 'submit') return;

      let link = this.baseUrl;
      link += this.assessment.is_assigned ? 'assign/' : 'edit/';
      link += this.assessment.slug;

      this.$router.push(link);
    },
    shareAssessment() {
      // Trigger the modal
      this.$emit('share-assessment', true, this.assessment.id);
    },
    async updateState(state) {
      try {
        await this.$store.dispatch('updateAssessmentState', {
          id: this.assessment.id,
          state: state,
        });
        this.$emit('update-state', state);
      } catch (error) {
        this.$emit('trigger-toast', error.message);
      }
    },
  },
};
</script>
