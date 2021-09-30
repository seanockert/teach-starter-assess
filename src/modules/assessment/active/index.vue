<template>
  <div>
    <div v-if="teacher" class="listing-description flex flex-wrap">
      Hi {{ teacher.name
      }}<template v-if="!loadingAssessments"
        >, you have {{ assessmentsCount }}
        <template v-if="teacher.limits && teacher.plan != 'plus'"
          >/ {{ teacher.limits.assessments }}</template
        >
        activit<template v-if="assessmentsCount == 1">y</template
        ><template v-else>ies</template>.</template
      >
      <div class="listing-search pull-right flex">
        <span class="hidden-small">
          <span data-tooltip="View as cards">
            <button
              :class="{
                'button-basic': true,
                'button-small': true,
                active: teacher.layout === 'cards',
              }"
              @click="toggleLayout('cards')"
            >
              <svg class="icon" height="16" width="16" role="img" viewBox="0 0 24 24">
                <title>View cards</title>
                <g fill="currentColor">
                  <path
                    d="M13.875 1.5h9c.621 0 1.125.504 1.125 1.125v7.5c0 .621-.504 1.125-1.125 1.125h-9a1.125 1.125 0 01-1.125-1.125v-7.5c0-.621.504-1.125 1.125-1.125zM0 13.875v7.5c0 .621.504 1.125 1.125 1.125h9c.621 0 1.125-.504 1.125-1.125v-7.5c0-.621-.504-1.125-1.125-1.125h-9C.504 12.75 0 13.254 0 13.875zM13.875 22.5h9c.621 0 1.125-.504 1.125-1.125v-7.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v7.5c0 .621.504 1.125 1.125 1.125z"
                  />
                  <path
                    d="M10.125 1.5h-9C.504 1.5 0 2.004 0 2.625v7.5c0 .621.504 1.125 1.125 1.125h9c.621 0 1.125-.504 1.125-1.125v-7.5c0-.621-.504-1.125-1.125-1.125z"
                    opacity=".6"
                  />
                </g>
              </svg>
            </button>
          </span>

          <span data-tooltip="View as list">
            <button
              :class="{
                'button-basic': true,
                'button-small': true,
                active: teacher.layout === 'list',
              }"
              @click="toggleLayout('list')"
            >
              <svg class="icon" height="16" width="16" role="img" viewBox="0 0 24 24">
                <title>View list</title>
                <g fill="currentColor">
                  <path
                    d="M22.875 16.5H9.625c-.621 0-1.125.504-1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125h13.25c.621 0 1.125-.504 1.125-1.125v-3.75c0-.621-.504-1.125-1.125-1.125zM22.875 1.5H9.625c-.621 0-1.125.504-1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125h13.25C23.496 7.5 24 6.996 24 6.375v-3.75c0-.621-.504-1.125-1.125-1.125zM22.875 9H9.625C9.004 9 8.5 9.504 8.5 10.125v3.75c0 .621.504 1.125 1.125 1.125h13.25c.621 0 1.125-.504 1.125-1.125v-3.75C24 9.504 23.496 9 22.875 9z"
                  />
                  <path
                    d="M5.875 9h-4.75C.504 9 0 9.504 0 10.125v3.75C0 14.496.504 15 1.125 15h4.75C6.496 15 7 14.496 7 13.875v-3.75C7 9.504 6.496 9 5.875 9zM5.875 1.5h-4.75C.504 1.5 0 2.004 0 2.625v3.75C0 6.996.504 7.5 1.125 7.5h4.75C6.496 7.5 7 6.996 7 6.375v-3.75C7 2.004 6.496 1.5 5.875 1.5zM5.875 16.5h-4.75C.504 16.5 0 17.004 0 17.625v3.75c0 .621.504 1.125 1.125 1.125h4.75C6.496 22.5 7 21.996 7 21.375v-3.75c0-.621-.504-1.125-1.125-1.125z"
                    opacity=".6"
                  />
                </g>
              </svg>
            </button>
          </span>
        </span>

        <div class="listing-search-input">
          <label class="hidden" for="assessments-search">Filter activities</label>
          <input
            type="search"
            id="assessments-search"
            placeholder="Filter activities..."
            v-model="searchAssessmentsQuery"
            @input="searchAssessments"
          />
          <button @click="searchAssessments">
            <svg height="16" width="16" role="img" viewBox="0 0 24 24">
              <title>Search</title>
              <path
                fill="currentColor"
                fill-rule="nonzero"
                d="M23.809 21.646l-6.205-6.205a9.68 9.68 0 001.857-5.711C19.461 4.365 15.096 0 9.73 0 4.365 0 0 4.365 0 9.73c0 5.366 4.365 9.73 9.73 9.73a9.678 9.678 0 005.487-1.698L21.455 24l2.354-2.354zM2.854 9.73a6.885 6.885 0 016.877-6.877 6.885 6.885 0 016.877 6.877 6.885 6.885 0 01-6.877 6.877A6.884 6.884 0 012.854 9.73z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="teacher && teacher.layout === 'list' && !isMobile"
      class="scroll-container listing-container"
    >
      <div v-if="loadingAssessments" class="skeleton">
        <table class="table">
          <thead>
            <tr>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
              <td><span></span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <template v-else>
        <table class="table">
          <thead>
            <th v-for="header in headers" :key="header.title">
              <button
                v-if="header.type"
                @click="loadAssessments(1, header.type, header.sort)"
                :class="['button-basic', 'button-sort', 'button-sort-' + header.sort]"
              >
                {{ header.title }}</button
              ><template v-else>{{ header.title }}</template>
            </th>
            <th>&nbsp;</th>
          </thead>

          <assessment-item-row
            v-for="(assessment, index) in assessments"
            :key="assessment.id"
            :ref="'assessment' + assessment.id"
            :assessment="assessment"
            :isLast="assessments.length > 3 && index == assessments.length - 1"
            @share-assessment="toggleShareModal"
            @trigger-toast="triggerToast"
            @trigger-upgrade-notice="triggerUpgradeNotice"
            @update-assessments-count="updateAssessmentsCount"
          />
        </table>
      </template>
    </div>
    <div v-else class="container">
      <div v-if="error" class="callout"><span v-html="error"></span></div>
      <ul v-else-if="loadingAssessments" class="row block-grid small-up-1 medium-up-2 large-up-4">
        <li class="skeleton"><div></div></li>
        <li class="skeleton"><div></div></li>
      </ul>
      <template v-else>
        <transition-group
          tag="ul"
          name="list"
          class="listing-cards row block-grid small-up-1 medium-up-2 large-up-4"
        >
          <li
            v-for="assessment in assessments"
            :key="assessment.id"
            :ref="'assessment' + assessment.id"
          >
            <assessment-item-card
              :assessment="assessment"
              @share-assessment="toggleShareModal"
              @trigger-toast="triggerToast"
              @trigger-upgrade-notice="triggerUpgradeNotice"
              @update-assessments-count="updateAssessmentsCount"
            />
          </li>
        </transition-group>
      </template>
    </div>

    <template v-if="assessments">
      <button
        v-show="assessments.length > 0 && assessmentsCount > assessments.length"
        class="button-more"
        @click="loadAssessments(assessmentsPage + 1)"
        ref="moreAssessments"
      >
        <template v-if="!loadingMoreAssessments"
          >Load
          {{ getAssessmentCount(assessmentsCount, assessments.length) }}
          more</template
        ><template v-else>Loading...</template>
      </button>
    </template>
    <div
      v-if="searchAssessmentsQuery !== '' && assessments && assessments.length === 0"
      class="empty"
    >
      No activities found.
      <button
        @click="
          searchAssessmentsQuery = '';
          searchAssessments();
        "
        class="button-link"
      >
        Clear
      </button>
    </div>

    <share-assessment
      :show="showShareModal"
      :assessmentId="activeAssessment.id"
      :assessmentTitle="activeAssessment.title"
      :token="activeAssessment.shareToken"
      @toggle-modal="toggleShareModal"
      @trigger-toast="triggerToast"
    />

    <div class="overlay" :class="{ show: showShareModal }" @click="toggleShareModal(false)"></div>
  </div>
</template>

<script>
/*
 * List teacher's active assessments
 *
 * @parent: /assessment/index
 * @requests: loadAssessments, trigger-toast
 * @events:
 * @props:
 * @components: AssessmentItemCard, AssessmentItemRow, ShareAssessment
 * @methods: getAssessmentCount, loadTemplates, searchTemplates, triggerToast
 */

import AssessmentItemCard from './AssessmentItemCard';
import AssessmentItemRow from './AssessmentItemRow';
import ShareAssessment from '@/modules/common/ShareAssessment';

import debounce from '@/shared/utils/debounce';

export default {
  name: 'AssessmentTemplate',
  components: {
    AssessmentItemCard,
    AssessmentItemRow,
    ShareAssessment,
  },
  props: {
    perPage: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      activeAssessment: {},
      assessmentsCount: 0,
      assessmentsPage: 1,
      cardView: true,
      error: null,
      headers: [
        { title: 'Activity', type: 'title', sort: 'DESC' },
        { title: 'Status', type: 'state', sort: 'DESC' },
        { title: 'Results', type: '', sort: '' },
        { title: 'Start', type: 'assigned', sort: 'DESC' },
        { title: 'End', type: 'expires', sort: 'DESC' },
        { title: 'Created', type: 'created', sort: 'DESC' },
      ],
      isMobile: false,
      searchAssessmentsQuery: '',
      showShareModal: false,
    };
  },
  created() {
    // Load public templates
    this.loadAssessments();

    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (width < 640) {
      this.isMobile = true;
    }
  },
  watch: {
    /*loadingAssessments() {
      if (this.assessments) {
        if (this.tourStep == -1) {
          this.initTour();
        } else {
          this.$tours['assessTour'].nextStep();
        }
      }
    },*/
  },
  methods: {
    getAssessmentCount(total, count) {
      return total - count < this.perPage ? total - count : this.perPage;
    },
    async loadAssessments(page = 1, orderBy = 'created', sort = 'DESC') {
      // Load all active assessments
      let params = {
        page: page,
        perPage: this.perPage,
        orderBy: orderBy,
        sort: sort,
      };

      try {
        const response = await this.$store.dispatch('loadAssessments', params);

        this.assessmentsCount = response.size;
        this.assessmentsPage = response.page;

        if (page > 1) {
          // Smooth scroll to the new results
          let ref = response.firstId
            ? this.$refs['assessment' + response.firstId][0]
            : this.$refs.moreAssessments;
          this.$SmoothScroll(ref, 250);
        }

        // Switch the direction of the sort header after click
        this.headers = this.headers.map(header => {
          if (header.type == orderBy) {
            header.sort = header.sort == 'DESC' ? 'ASC' : 'DESC';
          }
          return header;
        });
      } catch (error) {
        this.error = this.serverError + '<br><br>' + error;
      }
    },
    searchAssessments: debounce(async function() {
      let params = {
        search: this.searchAssessmentsQuery,
      };

      // Turn on page limit
      if (this.searchAssessmentsQuery == '') {
        params.perPage = this.perPage;
      }

      try {
        const response = await this.$store.dispatch('loadAssessments', params);
        this.assessmentsCount = response.size;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    }, 400),
    async toggleLayout(layout) {
      try {
        await this.$store.dispatch('updateTeacherAssessmentLayout', layout);
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    toggleShareModal(showShareModal, assessmentId) {
      if (assessmentId) {
        this.activeAssessment = this.assessments.find(assessment => assessment.id === assessmentId);
      }
      this.showShareModal = showShareModal;
    },
    triggerToast(message, toastDelay, isArchived = false) {
      this.$emit('trigger-toast', message, toastDelay, isArchived);
    },
    triggerUpgradeNotice(showUpgrade, message) {
      this.$emit('trigger-upgrade-notice', showUpgrade, message);
    },
    updateAssessmentsCount(type) {
      console.log('update', type);
      if (type === 'add') {
        // When duplicating an assessment
        this.assessmentsCount++;
      } else {
        // When archiving an assessment
        this.assessmentsCount--;
      }
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    assessments() {
      return !this.loadingAssessments ? this.$store.getters.assessments : null;
    },
    loadingAssessments() {
      // First page load
      return this.assessmentsCount ? false : this.$store.state.loadingAssessments;
    },
    loadingMoreAssessments() {
      // For pagination
      return this.$store.state.loadingAssessments;
    },
  },
};
</script>
