<template>
  <div class="wrapper">
    <assessment-results-header
      v-if="!loadingResult"
      :assessment="assessment"
      :backTo="backTo"
      :isOrphaned="isOrphaned"
      :student="result.student"
    />

    <transition :name="transitionName">
      <div>
        <assessment-results-summary
          v-if="!loadingResult"
          :backTo="backTo"
          :scrolled="scrolled"
          :student="result.student"
          :grades="grades"
          :next="next"
          :prev="prev"
          :result="result"
          :isMarked="isMarked"
          :isOrphaned="isOrphaned"
          @trigger-toast="triggerToast"
        />

        <section>
          <template v-if="!loadingResult">
            <ol class="no-list answers-list" v-if="result.questions.length > 0">
              <assessment-results-question
                v-for="(question, index) in result.questions"
                :answers="getQuestionAnswer(question.id)"
                :finished="result.finished ? true : false"
                :index="index"
                :question="question"
                :key="question.id"
                @update-score="updateScore"
                @init-score="initScore"
                @trigger-toast="triggerToast"
              />
            </ol>
            <div v-else class="empty">No questions answered.</div>
          </template>
          <div v-else class="skeleton">
            <ol class="no-list answers-list">
              <li class="row collapse">
                <div class="small-12 medium-6 large-4">
                  <h2></h2>
                  <p></p>
                </div>
                <div class="small-12 medium-6 large-4">
                  <p></p>
                  <p></p>
                </div>
                <div class="small-12 medium-6 large-4">
                  <p></p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </div>
    </transition>

    <toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />
    <a
      href="#assess"
      @click="scrollToTop"
      title="Back to top"
      :class="{ 'to-top': true, hidden: !scrolled }"
      ><svg role="img" height="24" width="24" viewBox="0 0 24 24">
        <title>Back to top</title>
        <path
          fill="currentColor"
          d="M5.041 11.416l6.504-6.504a.643.643 0 01.91 0l6.504 6.504a.643.643 0 010 .91l-1.05 1.05a.642.642 0 01-.921-.01L13.393 9.6v8.614c0 .354-.29.643-.643.643h-1.5a.645.645 0 01-.643-.643V9.6l-3.594 3.766a.642.642 0 01-.922.01l-1.05-1.05a.643.643 0 010-.91zM24 2.571V21.43A2.572 2.572 0 0121.429 24H2.57A2.572 2.572 0 010 21.429V2.57A2.572 2.572 0 012.571 0H21.43A2.572 2.572 0 0124 2.571zm-2.571 18.536V2.893a.322.322 0 00-.322-.322H2.893a.322.322 0 00-.322.322v18.214c0 .177.145.322.322.322h18.214a.322.322 0 00.322-.322z"
        />
      </svg>
    </a>
  </div>
</template>

<script>
/*
 * View a single result
 *
 * @parent: /
 * @requests: loadAssessment, loadResult
 * @events: updateResult, clearLocalAssessment
 * @props:
 * @components: AssessmentResultsHeader, AssessmentResultsSummary, AssessmentResultsQuestion, ToastMessage
 * @methods: loadResult, getQuestionAnswer, initScore, leaving, updateScore
 */

import AssessmentResultsHeader from './AssessmentResultsHeader';
import AssessmentResultsSummary from './AssessmentResultsSummary';
import AssessmentResultsQuestion from './AssessmentResultsQuestion';
import ToastMessage from '@/modules/common/ToastMessage';

import debounce from '@/shared/utils/debounce';

export default {
  name: 'AssessmentResultsView',
  components: {
    AssessmentResultsHeader,
    AssessmentResultsSummary,
    AssessmentResultsQuestion,
    ToastMessage,
  },
  data() {
    return {
      backTo: '/',
      next: null,
      isMarked: false,
      isOrphaned: false,
      prev: null,
      scrolled: false,
      toastMessage: '',
      transitionName: null,
    };
  },
  created() {
    document.addEventListener('scroll', this.checkScoll);

    // Save changes when leaving the page
    window.addEventListener('beforeunload', this.leaving);
  },
  destroyed() {
    document.removeEventListener('scroll', this.checkScoll);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // Transition between results
      vm.transitionName = null;
      vm.backTo = from.path;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.leaving();
    next();
  },
  watch: {
    '$route.params': {
      handler() {
        // Override default route change check to animate in next/prev result when slug changed
        this.transitionName = 'slide-left';
        this.loadResult();
      },
      immediate: true,
    },
    loadingResult() {
      if (this.result) {
        if (!this.result.student) {
          this.isOrphaned = true;
        }

        if (!this.transitionName && this.result.assessment) {
          this.loadAssessment();
        } else {
          this.isOrphaned = true;
        }

        this.prev = this.result.prev;
        this.next = this.result.next;

        this.sortQuestions();
      }
    },
    loadingAssessment() {
      if (this.backTo == '/' && this.assessment) {
        this.backTo = this.baseUrl + 'results/' + this.assessment.slug;
      }
    },
  },
  methods: {
    checkScoll: debounce(function() {
      // Show a back to top link if scrolled
      this.scrolled = window.scrollY >= 100 ? true : false;
    }, 300),
    async loadAssessment() {
      // Load the assessment for the header component
      try {
        await this.$store.dispatch('loadAssessment', {
          id: this.result.assessment,
          resultsCount: 1,
        });
      } catch (error) {
        this.toastMessage = error;
      }
    },
    async loadResult() {
      try {
        // isMarked used for updateResult analytics event and the toast message
        this.isMarked = await this.$store.dispatch('loadResult', {
          id: this.$route.params.resultSlug,
          includeStudent: 1,
        });
      } catch (error) {
        this.toastMessage = error.message;
      }
    },
    getQuestionAnswer(id) {
      if (this.assessment) {
        // Backup answer from the assessment question in case the result hasn't stored an answer
        const question = this.assessment.questions.find(question => question.id === id);

        if (question && question.answers) {
          return question.answers;
        }
      }
      return null;
    },
    initScore(questionId) {
      // Called when AssessmentResultsQuestion is initialised
      // Checks if question is correct and sets its score

      let question = this.result.questions.find(question => question.id === questionId);

      question.marking.score = question.points;
      question.marking.correct = true;
    },
    leaving(event = {}) {
      if (this.result && this.result.finished) {
        // Save data before leaving the page
        let params = {
          data: this.result,
          isMarked: this.isMarked,
          source: 'marking',
        };

        this.$store.dispatch('updateResult', params);
        this.$store.dispatch('clearLocalAssessment');

        event.returnValue = 'Saving changes';
      }

      window.removeEventListener('beforeunload', this.leaving);
    },
    scrollToTop(e) {
      e.preventDefault();
      this.$SmoothScroll(0, 250);
    },
    sortQuestions() {
      // Rearrange questions by sort order, instead of the order that the student completed them in
      this.result.questions.sort((a, b) => (a.sort > b.sort ? 1 : b.sort > a.sort ? -1 : 0));
    },
    triggerToast(message) {
      this.toastMessage = message;
    },
    updateScore(questionId) {
      // Called when AssessmentResultsQuestion checkbox is toggled
      // Set the score to full points for this question
      let question = this.result.questions.find(question => question.id === questionId);

      question.marking.score = question.marking.correct ? question.points : 0;
    },
  },
  computed: {
    assessment() {
      // Wait for state to be populated with data from API before displaying this assessment
      return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
    },
    grades() {
      return this.assessment ? this.assessment.grades : null;
    },
    loadingAssessment() {
      return this.$store.state.loadingAssessment;
    },
    loadingResult() {
      return this.$store.state.loadingResult;
    },
    result() {
      // Wait for state to be populated with data from API before displaying these results
      return !this.$store.state.loadingResult ? this.$store.getters.fetchResult : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.skeleton {
  li > div {
    padding: $base-padding * 2;
  }
}

.answers-list {
  padding-bottom: $base-padding * 2;
}

.to-top {
  bottom: 0;
  color: inherit;
  line-height: 0;
  opacity: 0.7;
  padding: $base-padding * 2;
  position: fixed;
  right: 0;

  &:hover,
  &:focus {
    opacity: 1;
  }
}
</style>
