<template>
  <main>
    <main-header />
    <main-nav />
    <div class="content">
      <header>
        <h2>Publishing</h2>

        <div class="listing-description flex flex-wrap">
          <template v-if="loadingAssessmentsPublished">Your</template
          ><template v-else>{{ assessmentsCount }}</template> public templates.
          <div v-if="teacher" class="listing-search pull-right flex">
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
      </header>
      <div
        v-if="teacher && teacher.layout === 'list' && !isMobile"
        class="scroll-container listing-container"
      >
        <div v-if="loadingAssessmentsPublished" class="skeleton">
          <table class="table ">
            <thead>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>

        <template v-else>
          <table class="table">
            <thead>
              <th
                v-for="header in headers"
                :key="header.title"
                :class="{ active: orderBy == header.type }"
              >
                <button
                  v-if="header.type"
                  @click="loadAssessmentsPublished(1, header.type, header.sort)"
                  :class="['button-basic', 'button-sort', 'button-sort-' + header.sort]"
                >
                  {{ header.title }}</button
                ><template v-else>{{ header.title }}</template>
              </th>
              <th>&nbsp;</th>
            </thead>

            <assessment-publishing-item-row
              v-for="(assessment, index) in publishedAssessments"
              :key="assessment.id"
              :ref="'assessment' + assessment.id"
              :assessment="assessment"
              :isLast="index == publishedAssessments.length - 1"
              @trigger-toast="triggerToast"
            />
          </table>
        </template>
      </div>
      <div v-else class="container">
        <ul
          v-if="loadingAssessmentsPublished"
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
            <li
              v-for="assessment in publishedAssessments"
              :key="assessment.id"
              :ref="'assessment' + assessment.id"
            >
              <assessment-publishing-item-card
                :assessment="assessment"
                @trigger-toast="triggerToast"
              />
            </li>
          </transition-group>
        </template>
      </div>

      <template v-if="publishedAssessments">
        <button
          v-show="publishedAssessments.length > 0 && assessmentsCount > publishedAssessments.length"
          class="button-more"
          @click="loadAssessmentsPublished(assessmentsPage + 1)"
          ref="moreAssessments"
        >
          <template v-if="!loadingMoreAssessmentsPublished"
            >Load
            {{ getAssessmentCount(assessmentsCount, publishedAssessments.length) }}
            more</template
          ><template v-else>Loading...</template>
        </button>
      </template>
      <div v-if="publishedAssessments.length === 0" class="empty">
        No published activities found.
        <button
          v-show="searchAssessmentsQuery !== ''"
          @click="
            searchAssessmentsQuery = '';
            searchAssessments();
          "
          class="button-link"
        >
          Clear
        </button>
      </div>
    </div>

    <toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />
  </main>
</template>

<script>
/*
 * List teacher's published assessments
 *
 * @parent: /assessment/index
 * @requests: loadAssessments, trigger-toast
 * @events:
 * @props:
 * @components: AssessmentItemCard, AssessmentItemRow
 * @methods: getAssessmentCount, loadTemplates, searchTemplates, toggleLayout, triggerToast
 */

import MainHeader from '@/modules/common/MainHeader';
import MainNav from '@/modules/common/MainNav';

import AssessmentPublishingItemCard from '../assessment/active/AssessmentItemCard';
import AssessmentPublishingItemRow from './AssessmentPublishingItemRow';
import ToastMessage from '@/modules/common/ToastMessage';

import debounce from '@/shared/utils/debounce';

export default {
  name: 'AssessmentPublishing',
  components: {
    MainHeader,
    MainNav,
    AssessmentPublishingItemCard,
    AssessmentPublishingItemRow,
    ToastMessage,
  },
  data() {
    return {
      activeAssessment: null,
      assessmentsCount: 0,
      assessmentsPage: 1,
      cardView: true,
      headers: [
        { title: 'Activity', type: 'title', sort: 'DESC' },
        { title: 'Type', type: 'template', sort: 'DESC' },
        { title: 'Region', type: 'country', sort: 'DESC' },
        { title: 'Grades', type: 'grades', sort: 'DESC' },
        { title: 'Created', type: 'created', sort: 'DESC' },
      ],
      isMobile: false,
      orderBy: 'created',
      perPage: 40,
      searchAssessmentsQuery: '',
      sort: 'DESC',
      toastMessage: '',
    };
  },
  created() {
    // Load public templates
    this.loadAssessmentsPublished();

    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (width < 640) {
      this.isMobile = true;
    }
  },
  methods: {
    getAssessmentCount(total, count) {
      return total - count < this.perPage ? total - count : this.perPage;
    },
    async loadAssessmentsPublished(page = 1, orderBy = 'created', sort = 'DESC') {
      // Load all assessments
      let params = {
        page: page,
        perPage: this.perPage,
        isPublishing: 1,
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
        this.toastMessage = error;
      }
    },
    searchAssessments: debounce(async function() {
      let params = {
        search: this.searchAssessmentsQuery,
        isTemplate: 1,
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
    triggerToast(message, toastDelay, isArchived = false) {
      this.toastMessage = message;

      if (isArchived) {
        this.assessmentsCount--;
      }
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    publishedAssessments() {
      return !this.loadingAssessmentsPublished ? this.$store.getters.assessments : null;
    },
    loadingAssessmentsPublished() {
      // First page load
      return this.assessmentsCount ? false : this.$store.state.loadingAssessmentsPublished;
    },
    loadingMoreAssessmentsPublished() {
      // For pagination
      return this.$store.state.loadingAssessmentsPublished;
    },
  },
};
</script>
