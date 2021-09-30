<template>
  <div data-v-step="15">
    <div class="listing-description flex flex-wrap">
      <template v-if="teacher && teacher.templates">
        Viewing templates in the
        <strong style="text-transform: uppercase;padding:0 0.1875rem">{{ teacher.country }}</strong>
        region. Looking for templates in other regions? Change your country on teachstarter.com.
      </template>
      <template v-else>
        <template v-if="loadingTemplateAssessements">Pre-built templates</template
        ><template v-else
          >{{ templatesCount }} pre-built
          {{ 'template' | pluralise(templateAssessements.length) }}</template
        >
        for you to copy and make your own.
      </template>

      <div class="listing-search pull-right flex">
        <div class="listing-search-input">
          <label class="hidden" for="templates-search">Filter templates</label>
          <input
            type="search"
            id="templates-search"
            placeholder="Filter templates..."
            v-model="searchTemplatesQuery"
            @input="searchTemplates()"
          />
          <button>
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
        <label class="hidden" for="templates-grades">Filter grades</label>
        <select id="templates-grades" v-model="yearLevel" @change="searchTemplates()">
          <option value="" selected>All grades</option>
          <option v-for="year in yearLevels" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>

    <div class="container">
      <div v-if="error" class="callout"><span v-html="error"></span></div>
      <ul
        v-else-if="loadingTemplateAssessements"
        class="row block-grid small-up-1 medium-up-2 large-up-4"
      >
        <li class="skeleton"><div></div></li>
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
            v-for="assessment in templateAssessements"
            :key="assessment.id"
            :ref="'template' + assessment.id"
          >
            <assessment-templates-item
              :assessment="assessment"
              :country="teacher ? teacher.country : ''"
              @trigger-toast="triggerToast"
            />
          </li>
        </transition-group>
        <div v-if="templateAssessements.length === 0" class="empty">
          No templates found.
          <button
            v-if="searchTemplatesQuery !== ''"
            @click="
              searchTemplatesQuery = '';
              searchTemplates();
            "
            class="button-link"
          >
            Clear
          </button>
        </div>
      </template>
      <template v-if="templateAssessements">
        <button
          v-show="templatesCount > templateAssessements.length"
          class="button-more"
          @click="loadTemplates(templatesPage + 1)"
          ref="moreTemplates"
        >
          <template v-if="!loadingMoreAssessmentTemplates"
            >Load
            {{ getAssessmentCount(templatesCount, templateAssessements.length) }}
            more</template
          ><template v-else>Loading...</template>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
/*
 * List public assessment templates
 *
 * @parent: /assessment/index
 * @requests: loadAssessmentsArchived, trigger-toast
 * @events:
 * @props:
 * @components: AssessmentTemplatesItem
 * @methods: getAssessmentCount, loadTemplates, searchTemplates, triggerToast
 */

import AssessmentTemplatesItem from './AssessmentTemplatesItem';
import debounce from '@/shared/utils/debounce';

export default {
  name: 'AssessmentTemplates',
  components: {
    AssessmentTemplatesItem,
  },
  props: {
    perPage: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      error: null,
      searchTemplatesQuery: '',
      templatesCount: 0,
      templatesPage: 1,
      yearLevel: '',
      yearLevels: ['Pre-K', 'K', '1', '2', '3', '4', '5', '6'],
    };
  },
  created() {
    // Load public templates
    this.loadTemplates();
  },
  methods: {
    getAssessmentCount(total, count) {
      return total - count < this.perPage ? total - count : this.perPage;
    },
    async loadTemplates(page = 1) {
      if (page == 1 && this.templatesCount > 0) return;

      let params = { page: page, perPage: this.perPage, country: this.teacher.country };

      try {
        const response = await this.$store.dispatch('loadAssessmentsTemplate', params);

        this.templatesCount = response.size;
        this.templatesPage = response.page;

        if (page > 1) {
          // Smooth scroll to the new results
          let ref = response.firstId
            ? this.$refs['template' + response.firstId][0]
            : this.$refs.moreTemplates;
          this.$SmoothScroll(ref, 250);
        }
      } catch (error) {
        this.error = this.serverError + '<br><br>' + error;
      }
    },
    searchTemplates: debounce(async function() {
      let params = {
        search: this.searchTemplatesQuery,
        years: this.yearLevel,
        country: this.teacher.country,
      };

      // Turn on page limit
      if (this.searchTemplatesQuery == '') {
        params.perPage = this.perPage;
      }

      try {
        const response = await this.$store.dispatch('loadAssessmentsTemplate', params);
        this.templatesCount = response.size;
        this.templatesPage = response.page;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    }, 400),
    triggerToast(message, toastDelay, isArchived = false) {
      this.$emit('trigger-toast', message, toastDelay, isArchived);
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    templateAssessements() {
      return !this.loadingTemplateAssessements ? this.$store.getters.assessmentsTemplate : null;
    },
    loadingTemplateAssessements() {
      // First page load
      return this.templatesCount == 0 && this.searchTemplatesQuery == ''
        ? true
        : this.$store.state.loadingTemplateAssessements;
    },
    loadingMoreAssessmentTemplates() {
      // For pagination
      return this.$store.state.loadingTemplateAssessements;
    },
  },
};
</script>
