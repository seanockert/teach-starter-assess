<template>
  <tr class="clickable-row" @click="linkTo">
    <td>
      <h3>{{ assessment.title || 'Untitled' }}</h3>

      <small v-if="assessment.description !== ''" class="text-mute hidden-small">
        {{ assessment.description.substring(0, 30) }}...
      </small>
    </td>
    <td>
      <span :class="['label', 'label-' + assessment.template]">{{ assessment.template }}</span>
    </td>
    <td>
      {{ assessment.country }}
    </td>
    <td>
      <template v-if="assessment.year_level">{{ assessment.year_level.join(', ') }}</template>
    </td>
    <td>
      <time
        :datetime="assessment.created | simpleDate"
        :data-tooltip="assessment.created | simpleDate"
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
            <li v-if="assessment.state === 'assigned'">
              <button @click.prevent="updateState('ended')">End</button>
            </li>
            <li v-if="assessment.state === 'ended'">
              <button @click.prevent="updateState('assigned')">Re-open</button>
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
          <li>
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
 * Single published assessment table row
 *
 * @parent: /publishing/index
 * @requests:
 * @events: updateAssessmentState
 * @props: Object assessment, Boolean isLast
 * @components: Dropdown
 * @methods: archiveAssessment, linkTo
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
        this.$store
          .dispatch('updateAssessmentState', {
            id: this.assessment.id,
            state: 'archived',
            template: 'none',
            previousState: this.assessment.state,
          })
          .then(response => {
            if (response.status == 200) {
              const title =
                this.assessment.title !== '' ? this.assessment.title : 'Untitled activitiy';
              this.$emit('trigger-toast', 'Archived "' + title + '"', 2000, true);
            } else if (response.status == 403) {
              this.$emit('trigger-upgrade-notice', true, response.message);
            } else {
              this.$emit('trigger-toast', response.message);
            }
          });
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
  },
};
</script>
