<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <div class="inner">
      <h3>
        Add curriculum codes to
        <template v-if="!params.questionId">all questions</template
        ><template v-else>this question</template>
      </h3>

      <ul class="tag-list">
        <li v-for="(tag, index) in curriculumTags" :key="'tag' + tag.id">
          <span class="label label-tag" title="">
            <span :title="tag.name">{{ tag.name }}</span>
            <button class="delete" @click="remove(index)">&times;</button>
          </span>
        </li>
      </ul>

      <div class="search">
        <label class="hidden" for="search">Search curriculum codes</label>
        <input
          type="search"
          id="search"
          v-model="search"
          placeholder="Search curriculum codes by keyword..."
          @input="onSearchInput"
          @keyup.enter="onSearchInput"
        />

        <svg height="16" width="16" role="img" aria-hidden="true" viewBox="0 0 24 24">
          <title>Search</title>
          <path
            fill="currentColor"
            fill-rule="nonzero"
            d="M23.809 21.646l-6.205-6.205a9.68 9.68 0 001.857-5.711C19.461 4.365 15.096 0 9.73 0 4.365 0 0 4.365 0 9.73c0 5.366 4.365 9.73 9.73 9.73a9.678 9.678 0 005.487-1.698L21.455 24l2.354-2.354zM2.854 9.73a6.885 6.885 0 016.877-6.877 6.885 6.885 0 016.877 6.877 6.885 6.885 0 01-6.877 6.877A6.884 6.884 0 012.854 9.73z"
          />
        </svg>
      </div>

      <div class="filters flex">
        <div v-if="curriculumList">
          <label class="hidden" for="curriculumList">Curriculum </label>
          <select
            id="curriculumList"
            v-model="curriculum"
            @change="
              onSearchInput;
              curriculumName = $event.target.options[$event.target.selectedIndex].text;
            "
          >
            <option value="" disabled>Curriculum</option>
            <option
              v-for="curriculum in curriculumList"
              :value="curriculum.id"
              :key="'curriculum' + curriculum.id"
              >{{ curriculum.name }}</option
            >
          </select>
        </div>
        <div v-if="yearLevelList">
          <label class="hidden" for="yearLevel">Year level</label>
          <select id="yearLevel" v-model="yearLevel" @change="onSearchInput">
            <option value="null" disabled>Year level</option>
            <option value="" selected>All years</option>
            <option v-for="year in yearLevelList" :value="year.id" :key="'year' + year.id">{{
              year.name
            }}</option>
          </select>
        </div>
        <div v-if="learningAreaList">
          <label class="hidden" for="learningArea">Learning area</label>
          <select id="learningArea" v-model="learningArea" @change="onSearchInput">
            <option value="null" disabled>Learning area</option>
            <option value="" selected>All areas</option>
            <option v-for="area in learningAreaList" :value="area.id" :key="'area' + area.id">{{
              area.name
            }}</option>
          </select>
        </div>
      </div>

      <div v-show="results.length > 0" class="results-count">
        <span>{{ resultsCount }} {{ 'result' | pluralise(resultsCount) }}</span>
        <button class="pull-right" v-show="search || learningArea || yearLevel" @click="clear">
          Clear search
        </button>
      </div>
    </div>

    <div class="results-list" ref="resultsList">
      <p v-if="loading && results.length == 0" class="empty">
        Loading...
      </p>

      <template v-else-if="results.length > 0">
        <ul class="no-list">
          <li v-for="(result, index) in results" :key="result.id">
            <button @click="add(index, $event)" :class="{ assigned: isAssigned(result.id) }">
              <h4 class="flex">
                <div v-html="highlight(result.name)"></div>

                <a
                  v-if="result.link && result.link != ''"
                  class="pull-right button-basic button-small"
                  :href="'https://www.teachstarter.com' + result.link"
                  @click.stop=""
                  title="View resources for this curriculum code"
                  target="_blank"
                  ><svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
                    <title>View resources</title>
                    <path
                      fill="currentColor"
                      d="M19.563 14.75h-1.375a.687.687 0 00-.688.688v4.812H3.75V6.5h6.188c.38 0 .687-.308.687-.688V4.438a.687.687 0 00-.688-.687H3.064C1.923 3.75 1 4.673 1 5.813v15.125C1 22.076 1.923 23 3.063 23h15.124c1.14 0 2.063-.923 2.063-2.063v-5.5a.687.687 0 00-.688-.687zM21.395 1h-6.818c-.664 0-1.203.539-1.203 1.203v.804a1.203 1.203 0 001.237 1.168l2.888-.081L6.803 14.71l-.002.002a1.031 1.031 0 000 1.459l1.028 1.025.003.002c.404.401 1.056.4 1.457-.004L19.906 6.5l-.08 2.888v.034c0 .664.538 1.203 1.203 1.203h.768c.664 0 1.203-.539 1.203-1.203V2.604C23 1.718 22.282 1 21.396 1z"
                    /></svg
                ></a>
              </h4>
              <small>
                <ol class="breadcrumbs">
                  <li
                    v-for="(crumb, index) in result.breadcrumb"
                    :key="'crumb' + result.id + crumb.id"
                  >
                    <span
                      v-if="
                        result.breadcrumb.length <= 4 ||
                          (result.breadcrumb.length > 4 &&
                            (index < 2 || index > result.breadcrumb.length - 2))
                      "
                      >{{ crumb.name }}</span
                    >
                    <span v-else-if="index == 2">
                      ...
                    </span>
                  </li>
                </ol>
              </small>
              <p>{{ result.description }}</p>
            </button>
          </li>
        </ul>
        <button
          v-show="resultsCount > results.length"
          class="button-more"
          @click="loadResults(currentPage + 1)"
          ref="moreResults"
        >
          <template v-if="!loading">Load {{ resultsCount - results.length }} more</template
          ><template v-else>Loading...</template>
        </button>
      </template>
      <p v-else class="empty">
        No results found.
      </p>
    </div>

    <transition name="fly-to">
      <div v-if="activeTag" class="copy-code" ref="copyCode">
        {{ activeTag }}
      </div>
    </transition>

    <button @click="close" class="button button-close top-right">
      <svg width="24" height="24" role="img" viewBox="0 0 24 24">
        <title>Close window</title>
        <path
          fill="currentColor"
          d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
/* Search and add curriculum codes to a question
 * @todo: split this into components, it's getting a bit too big
 *
 * @parent: /editor/index
 * @requests: get curriculum filters, get curriculum codes
 * @events: closeCurriculumSelector, updateCurriculumTags
 * @props: Boolean show
 * @components: Tags
 * @methods: add, close, clear, highlight, initCurriculum, initCurriculumTags, initYearLevels, initLearningAreas, isAssigned, loadResults, onSearchInput, remove, updateCurriculumTags
 */

import API from '@/router/api';
import axios from 'axios';
import debounce from '@/shared/utils/debounce';
import analytics from '@/shared/utils/analytics';

export default {
  name: 'CurriculumSelector',
  props: {
    assessmentId: Number,
    show: Boolean,
  },
  data() {
    return {
      activeTag: null,
      curriculum: '',
      curriculumName: '',
      curriculumTags: [],
      curriculumList: null,
      currentPage: 1,
      learningAreaList: null,
      learningArea: '',
      loading: false,
      perPage: 30,
      results: [],
      resultsCount: 0,
      search: '',
      source: null,
      yearLevel: '',
      yearLevelList: null,
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.clear();
  },
  watch: {
    curriculum() {
      this.initYearLevels();
    },
    yearLevel() {
      this.initLearningAreas();
    },
    learningArea() {
      this.loadResults();
    },
    show() {
      if (this.show) {
        this.init();
      }

      // Clear the form on cloase
      if (!this.show) {
        this.search = '';
        this.results = [];
        this.curriculumTags = [];
      }
    },
  },
  methods: {
    init() {
      if (!this.params.questionId) {
        // Assessment settings - load all the curriculumTags from all the questions in this assessment
        this.initCurriculumTags();
      } else {
        // Question settings - load this question's curriculum tags
        this.curriculumTags = this.params.curriculumTags;
      }

      this.initCurriculum();
    },
    add(index, event) {
      if (this.results.length > 0) {
        const result = this.results[index];

        if (this.isAssigned(result.id)) {
          // Autocomplete with no results
          if (confirm('Remove this code?')) {
            this.remove(this.curriculumTags.findIndex(tag => tag.id === result.id));
          }
        } else {
          const tag = {
            id: result.id,
            name: result.name,
            link: result.link,
          };

          this.curriculumTags.push(tag);
          this.updateCurriculumTags(tag, true);

          // Animate the tag being added
          this.activeTag = tag.name;

          window.setTimeout(() => {
            let copyCode = this.$refs.copyCode;
            if (copyCode) {
              copyCode.style.top = event.clientY - 100 + 'px';
            }

            this.activeTag = null;
          }, 1);

          analytics('Assess Curriculum Code Added', {
            assessmentId: this.assessmentId,
            curriculum: this.curriculumName,
            code: result.id,
          });
        }
      } else {
        alert('No results');
      }
    },
    clear() {
      this.search = '';
      this.yearLevel = '';
      this.learningArea = '';
      this.results = [];
    },
    close() {
      this.$store.dispatch('closeCurriculumSelector');
    },
    highlight(str) {
      // Yellow highlight the matching part of the code code
      return str.replace(new RegExp(this.search, 'gi'), match => '<mark>' + match + '</mark>');
    },
    async initCurriculum() {
      // Set the curriculum ID based on user's country and state
      const country = this.teacher.country;
      const state = this.teacher.state;

      // Refine by country
      switch (country) {
        case 'us':
          this.curriculum = 58623; // 'common-core-state-standards'
          break;
        case 'uk':
          //this.curriculum = 63287; // 'national-curriculum-in-england'
          this.curriculum = 1;
          break;
        default:
          this.curriculum = 1; // 'australian-curriculum'
          break;
      }

      // Refine by state
      switch (state) {
        case 'nsw':
          this.curriculum = 19195; // 'nsw-curriculum'
          break;
        case 'vic':
          this.curriculum = 21923; // 'victorian-curriculum'
          break;
        case 'tx':
          this.curriculum = 30091; // 'teks'
          break;
      }

      try {
        // Filter - get all the top level curriculums
        const response = await axios.get(API.curriculum + 'filters', {
          params: { parent: 0 },
        });

        const { data: { list = [] } = {} } = response;
        const activeCurriculum = list.find(c => c.id === this.curriculum);

        // Filter out CCSS and UK for now
        this.curriculumList = list.filter(c => c.id != 63287);
        //this.curriculumList = list;
        this.curriculumName = activeCurriculum ? activeCurriculum.name : 'Not set';
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    initCurriculumTags() {
      // For assessment settings
      let questions = this.assessment.questions;
      let i = 0;

      const questionsLen = this.assessment.questions.length;

      if (questionsLen > 0) {
        this.curriculumTags = questions[0].curriculumTags;

        // Loop through all questions and check values
        for (; i < questionsLen; i++) {
          if (questions[i].curriculumTags && questions[i].curriculumTags.length > 0) {
            this.curriculumTags = questions[i].curriculumTags.filter(tag => {
              if (this.curriculumTags.findIndex(t => t.id === tag.id) !== -1) {
                return { id: tag.id, name: tag.name };
              }
            });
          }
        }
      }
    },
    async initYearLevels() {
      try {
        // Get all the year levels for the current curriculum
        const response = await axios.get(API.curriculum + 'filters', {
          params: { parent: this.curriculum },
        });

        const { data: { list = [] } = {} } = response;
        this.yearLevelList = list;
        this.yearLevel = '';
        this.loadResults();
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    async initLearningAreas() {
      // Get all the year levels for the current curriculum
      if (this.yearLevel == '') {
        this.learningAreaList = null;
        this.learningArea = '';
        return;
      }

      try {
        const response = await axios.get(API.curriculum + 'filters', {
          params: { parent: this.yearLevel },
        });

        const { data: { list = [] } = {} } = response;
        this.learningAreaList = list;
        this.learningArea = '';

        this.loadResults();
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    isAssigned(id) {
      // Highlight already assigned curriculum items in search results
      return this.curriculumTags.findIndex(tag => tag.id === id) !== -1 ? true : false;
    },
    async loadResults(page = 1) {
      this.loading = true;

      // Restrict search to a parent category based on what's been selected
      // curriculum -> year level -> learning area
      let parent = this.curriculum;

      if (this.yearLevel != '') {
        parent = this.yearLevel;
      }

      if (this.learningArea != '') {
        parent = this.learningArea;
      }

      // Load 30 by default, or load the rest if the 'Load more' button is tapped
      let perPage = page > 1 ? this.resultsCount - this.perPage : this.perPage;
      let offset = page > 1 ? this.perPage : 0;

      let params = {
        search: this.search,
        offset: offset,
        page: page,
        parent: parent,
        perPage: perPage,
      };

      if (this.source) {
        this.source.cancel('More recent API request');
      }

      this.source = axios.CancelToken.source();

      try {
        const response = await axios.get(API.curriculum, {
          params: params,
          cancelToken: this.source.token,
        });

        this.loading = false;
        this.resultsCount = response.data.size;
        this.currentPage = response.data.page;

        const { data: { list = [] } = {} } = response;
        this.results = page > 1 ? this.results.concat(list) : list;

        if (page > 1) {
          this.$SmoothScroll(this.$refs.moreResults, 250, '', this.$refs.resultsList, 'y');
        }

        this.source = null;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);

        if (axios.isCancel(error)) {
          return Promise.reject();
        }

        this.results = [];
        this.loading = false;
        this.resultsCount = 0;
      }
    },
    onSearchInput: debounce(function() {
      // Query endpoint to find curriculum codes
      if (this.search.length > 1) {
        this.loadResults(1);
      } else {
        this.results = [];
      }
    }, 400),
    remove(index) {
      // Remove a curriculum code from the tag list
      this.updateCurriculumTags(this.curriculumTags[index], false);
    },
    updateCurriculumTags(tag, add) {
      // Apply to all questions if questionId is null
      this.$store
        .dispatch('updateCurriculumTags', {
          questionId: this.params.questionId,
          tag: tag,
          add: add,
        })
        .then(() => {
          if (!add) {
            this.curriculumTags = this.curriculumTags.filter(t => t.id !== tag.id);
          }
        });
    },
  },
  computed: {
    assessment() {
      return !this.params.questionId ? this.$store.getters.fetchAssessment : null;
    },
    params() {
      return this.$store.getters.curriculumSelector;
    },
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';
@import '~/components/_modal-search.scss';

.modal {
  h3 {
    margin-bottom: $base-padding;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  z-index: 3;

  li {
    margin: 0;
    padding-bottom: $base-padding/2;
  }
}

.filters {
  margin-top: $base-padding/2;

  > * {
    flex: 1 1 33.33%;
  }

  > * + * {
    margin-left: $base-padding/2;
  }

  select {
    border-color: $grey-200;
    padding: $base-padding/2 1.2rem $base-padding/2 $base-padding;

    &:hover {
      background-color: $grey-0;
      //background-color: #fff;
      //border-color: $grey-200;
    }
  }
}

// Show a tag with a close button
.label-tag {
  display: flex;
  font: inherit;
  font-size: $font-size-500;
  padding: 0;
  text-transform: none;

  > * {
    padding: $base-padding/2;
  }

  span {
    padding-right: 0;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    outline: none;
    margin-left: $base-padding/4;

    &:hover,
    &:focus {
      background-color: $brilliant-amaranth-500;
      color: #fff;
    }
  }
}

.results-list {
  button {
    display: block;
    padding: $base-padding;
    text-align: left;
    width: 100%;

    &:hover,
    &:focus,
    &.active {
      background-color: $grey-0;
    }

    &.assigned {
      background-color: $ts-green-100;
      outline: none;
    }
  }

  h4 {
    margin-top: 0;
    margin-bottom: $base-padding/2;
    text-transform: uppercase;
  }

  .flex {
    a {
      font-size: $font-size-300;
      margin-left: auto;
    }
  }

  p {
    margin: $base-padding/2 0 0 0;
  }
}

.breadcrumbs {
  > li {
    > * {
      padding: 0 !important;

      &::after {
        margin-right: $base-padding/2;
      }
    }
  }
}

.skeleton {
  background-color: $grey-0;
  border-radius: 0 0 $border-radius $border-radius;
  padding: $base-padding;
}

// For animating code being added
.copy-code {
  background-color: #fff;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  left: $base-padding;
  line-height: 1;
  padding: $base-padding;
  position: absolute;
  text-transform: uppercase;
}

.fly-to-enter-active,
.fly-to-leave-active {
  transition: transform 0.5s $base-transition 0.2s, opacity 0.3s 0.3s ease-in-out;
}

.fly-to-enter {
  opacity: 1;
}

.fly-to-leave-to {
  transform: translate3d(50px, -250px, 0);
  opacity: 0;
}
</style>
