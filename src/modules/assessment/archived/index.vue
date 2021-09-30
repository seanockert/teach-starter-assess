<template>
  <div>
    <div class="listing-description">
      <template v-if="!loadingAssessmentsArchived"
        >{{ assessmentsArchived.length }}
        <template v-if="teacher && teacher.limits && teacher.plan != 'plus'"
          >/ {{ teacher.limits.archive }}</template
        >
        archived activities. </template
      >Here you can restore an archived activity, or permanently delete them.
    </div>

    <div class="container">
      <div v-if="error" class="callout"><span v-html="error"></span></div>
      <ul
        v-else-if="loadingAssessmentsArchived"
        class="row block-grid small-up-1 medium-up-2 large-up-4"
      >
        <li class="skeleton"><div></div></li>
        <li class="skeleton"><div></div></li>
      </ul>
      <template v-else>
        <transition-group
          tag="ul"
          name="list"
          class="listing-cards row block-grid small-up-1 medium-up-2 large-up-4"
        >
          <li v-for="assessment in assessmentsArchived" :key="assessment.id">
            <assessment-archived-item
              :assessment="assessment"
              @trigger-toast="triggerToast"
              @delete-assessment="triggerDeleteNotice"
              @trigger-upgrade-notice="triggerUpgradeNotice"
            />
          </li>
        </transition-group>
        <div v-if="assessmentsArchived.length === 0" class="empty">
          No archived assessments.
        </div>
      </template>

      <delete-notice
        :show="showDelete"
        :assessment="activeAssessment"
        @toggle-modal="triggerDeleteNotice"
        @trigger-toast="triggerToast"
      />

      <div class="overlay" :class="{ show: showDelete }" @click="triggerDeleteNotice(false)"></div>
    </div>
  </div>
</template>

<script>
/*
 * List teacher's archived assessments
 *
 * @parent: /assessment/index
 * @requests: loadAssessmentsArchived, trigger-toast
 * @events:
 * @props:
 * @components:
 * @methods: triggerDeleteNotice, triggerToast, triggerUpgradeNotice
 */

import AssessmentArchivedItem from './AssessmentArchivedItem';
import DeleteNotice from './DeleteNotice';

export default {
  name: 'AssessmentArchived',
  components: {
    AssessmentArchivedItem,
    DeleteNotice,
  },
  data() {
    return {
      activeAssessment: null,
      error: null,
      showDelete: false,
    };
  },
  async created() {
    try {
      // Load archived assessments
      await this.$store.dispatch('loadAssessmentsArchived');
    } catch (error) {
      this.error = this.serverError + '<br><br>' + error;
    }
  },
  methods: {
    triggerDeleteNotice(showDelete, assessmentId) {
      if (assessmentId) {
        this.activeAssessment = this.assessmentsArchived.find(
          assessment => assessment.id === assessmentId
        );
      }

      this.showDelete = showDelete;
    },
    triggerToast(message, toastDelay, isArchived = false) {
      this.$emit('trigger-toast', message, toastDelay, isArchived);
    },
    triggerUpgradeNotice(showUpgrade, message) {
      this.$emit('trigger-toast', showUpgrade, message);
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    assessmentsArchived() {
      return !this.loadingAssessmentsArchived ? this.$store.getters.assessmentsArchived : null;
    },
    loadingAssessmentsArchived() {
      return this.$store.state.loadingAssessmentsArchived;
    },
  },
};
</script>
